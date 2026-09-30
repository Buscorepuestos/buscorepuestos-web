# Ticket 5 — Corregir timeout y lentitud del buscador en backend

## Problema

Después de navegar por varias páginas del catálogo, una búsqueda textual como `faro`
termina devolviendo HTTP 500.

Registros observados:

```text
GET /api/products/autocomplete?q=faro 200 - 2782.862 ms
MongoServerError: operation exceeded time limit
code: 50
codeName: MaxTimeMSExpired
GET /api/products/search?q=faro&page=1 500 - 10253.977 ms
```

La búsqueda principal tiene configurado `maxTimeMS: 10000` y MongoDB agota ese límite.
No debe solucionarse aumentando el timeout.

## Diagnóstico confirmado

La validación de normalización sobre la base utilizada por la API devolvió:

```json
{
  "total": 584769,
  "normalized": 0,
  "missingIndexes": [],
  "valid": false
}
```

Los índices de referencias normalizadas existen, pero los 584.769 productos carecen de
campos normalizados. La búsqueda cae en expresiones calculadas en tiempo de consulta.

Además, la búsqueda textual actual:

1. Filtra inicialmente casi solo por `stock: true`.
2. Normaliza múltiples campos mediante `$addFields` para cada documento.
3. Ejecuta `$regexMatch` sobre numerosos campos de cada producto.
4. Calcula la relevancia antes de reducir el conjunto de candidatos.
5. Usa un `$facet` que cuenta todos los resultados y ordena la rama de datos.

El `$limit: 10000` actual está dentro de la rama de resultados del `$facet`. Para ese
momento MongoDB ya normalizó, comparó y puntuó los documentos, por lo que no evita el
trabajo costoso.

El autocompletado ejecuta otra consulta independiente con regex sin anclar y agrupaciones
para piezas, categorías, marcas y referencias. Esa consulta tarda aproximadamente 2,8 s.

## Cambios requeridos

### 1. Ejecutar el backfill de normalización

Ejecutar en un entorno controlado:

```bash
npm run migrate:search-normalization
```

Después validar:

```bash
npm run validate:search-normalization
```

El resultado debe indicar:

```json
{
  "total": 584769,
  "normalized": 584769,
  "missingIndexes": [],
  "valid": true
}
```

El número total puede cambiar si se incorporan productos durante la migración, pero
`total` y `normalized` deben coincidir.

La migración debe ejecutarse por lotes y sin bloquear la sincronización habitual de
productos. Antes de producción, verificar duración, uso de CPU y carga sobre MongoDB.

### 2. Añadir una selección indexada de candidatos

Modificar `src/services/product-search.service.ts` para que la búsqueda textual reduzca
el conjunto de documentos antes de ejecutar `$addFields`, `$regexMatch`, el cálculo de
relevancia o `$facet`.

Orden recomendado:

```text
$match de stock/filtros
→ búsqueda indexada de candidatos
→ cálculo de relevancia sobre candidatos
→ ordenación estable
→ paginación/proyección
```

Utilizar una de estas alternativas:

1. MongoDB Atlas Search con analizadores en español y campos ponderados.
2. Índice de texto de MongoDB para generar candidatos y ranking propio posterior.
3. Campos de tokens/prefijos materializados e indexados si las anteriores no están disponibles.

No utilizar regex sin anclar sobre los 584.769 documentos como mecanismo principal.

### 3. Mantener la prioridad de relevancia

Después de obtener un conjunto limitado de candidatos, conservar estas prioridades:

1. Referencia OEM exacta.
2. Referencia equivalente o alternativa exacta.
3. Referencia por prefijo.
4. Nombre exacto de pieza.
5. Pieza, marca y modelo.
6. Vehículo, generación, motor y año.
7. Coincidencias parciales.

La ordenación debe incluir `_id` como último criterio para que la paginación sea estable.

### 4. Optimizar las referencias

Para consultas clasificadas como referencia:

- Buscar primero por igualdad en `normalizedMainReference`.
- Buscar después por igualdad en `normalizedReferences`.
- Buscar después por igualdad en `normalizedDistributorReference`.
- Ejecutar prefijos o coincidencias parciales únicamente como estrategia secundaria.
- Aprovechar los índices `ProductNormalizedMainReferenceV2`,
  `ProductNormalizedReferencesV2` y `ProductNormalizedDistributorReferenceV2`.

Una referencia exacta no debe recorrer todo el catálogo ni competir con coincidencias
parciales antes de aparecer.

### 5. Separar resultados y conteo cuando sea necesario

El conteo total no debe obligar a repetir todas las transformaciones de relevancia antes
de devolver los primeros 16 productos.

Opciones válidas:

- Consultas separadas para resultados y conteo.
- Conteo limitado o aproximado para consultas demasiado grandes.
- Ejecutar ambas consultas en paralelo si usan la misma selección indexada de candidatos.

La respuesta debe conservar el contrato actual:

```json
{
  "data": [],
  "totalPages": 0,
  "totalResults": 0,
  "currentPage": 1
}
```

### 6. Optimizar el autocompletado

Modificar `GET /api/products/autocomplete` para que no agrupe todo el catálogo en cada
pulsación.

Requisitos:

- Buscar sobre campos normalizados.
- Usar prefijos indexados o Atlas Search autocomplete.
- Limitar candidatos antes de ejecutar `$group`.
- Devolver solamente las sugerencias necesarias para la interfaz.
- Añadir una caché corta por consulta normalizada.
- Cancelar trabajo si el cliente abandona la petición cuando el driver lo permita.

Si se utiliza una colección materializada de sugerencias, debe actualizarse durante la
sincronización de productos y contener piezas, categorías, marcas y referencias.

### 7. Optimizar el catálogo sin término de búsqueda

La paginación devuelve productos diferentes, pero cada página todavía tarda en cargar.

- Crear o confirmar un índice que cubra `stock` y el orden predeterminado real.
- Evitar ordenar todo el catálogo antes de aplicar la página.
- Mantener un orden determinista usando `_id` como desempate.
- Para páginas profundas, evaluar paginación por cursor en lugar de `$skip`.
- Si se introduce cursor, mantener temporalmente el contrato de páginas o versionar el endpoint.

### 8. Manejo de errores y métricas

- `MaxTimeMSExpired` debe seguir devolviendo un error real, nunca `data: []`.
- Registrar por separado tiempo de selección de candidatos, ranking, conteo y serialización.
- Registrar `docsExamined`, `keysExamined` y plan ganador durante las pruebas, no en cada petición productiva.
- Mantener métricas p50, p95 y p99 para búsqueda y autocompletado por separado.
- No registrar el texto original si puede contener información sensible; usar consulta normalizada o hash.

## Pruebas requeridas

### Funcionales

1. `q=faro&page=1` responde HTTP 200 y devuelve resultados.
2. Las páginas 1, 2 y 3 devuelven productos diferentes con orden estable.
3. Cambiar de página conserva término, orden y filtros.
4. Una búsqueda sin coincidencias responde HTTP 200 con `data: []`.
5. Una referencia exacta aparece antes que referencias parciales.
6. `8200667606`, `8200 667 606` y `8200-667-606` producen el mismo resultado principal.
7. Autocompletado y búsqueda pueden ejecutarse simultáneamente sin provocar timeout.

### Rendimiento

- Autocompletado: p95 menor de 300 ms.
- Búsqueda: p50 menor de 500 ms y p95 menor de 1.000 ms.
- Ninguna consulta común debe terminar en `MaxTimeMSExpired`.
- Ejecutar `explain("executionStats")` para `faro`, una consulta compuesta y una referencia exacta.
- `docsExamined` debe corresponder al conjunto de candidatos, no a todos los productos con stock.
- Probar concurrencia y búsquedas repetidas para comprobar que la latencia no aumenta progresivamente.

## Definición de terminado

El ticket se considera terminado cuando:

- El backfill está completo y validado.
- La búsqueda textual tiene una fase indexada previa al ranking.
- El autocompletado deja de escanear y agrupar el catálogo completo.
- El paginado devuelve conjuntos distintos con orden estable.
- `faro` responde sin HTTP 500 ni `MaxTimeMSExpired`.
- Se cumplen los objetivos de rendimiento con una copia representativa de los datos reales.
- Existen pruebas automatizadas del pipeline, integración, paginación y timeout.

