# Ticket 1 — Requisitos de backend para velocidad y comportamiento del buscador

## Objetivo

Reducir la latencia de `GET /api/products/search` y garantizar un contrato inequívoco para distinguir resultados, cero resultados y errores.

## Situación medida

- `faro BMW E87`: aproximadamente 3,5 s.
- `motor Peugeot 308 1.6 HDI`: aproximadamente 3,6 s.
- Referencia exacta real: aproximadamente 3,0 s.
- El frontend añade 500 ms de debounce antes de ejecutar la petición.

### Incidente reproducido durante la validación del paginado

- `GET /api/products/autocomplete?q=faro`: HTTP 200 en aproximadamente 2.783 ms.
- `GET /api/products/search?q=faro&page=1`: HTTP 500 en aproximadamente 10.254 ms.
- MongoDB termina la agregación con `code: 50`, `MaxTimeMSExpired`.
- El servicio fija `maxTimeMS` en 10.000 ms; aumentar ese valor no corrige la causa.

La agregación actual solo filtra inicialmente por `stock: true`. Después calcula campos
normalizados y ejecuta expresiones regulares sobre numerosos campos para cada producto,
y únicamente entonces descarta los que no coinciden. Esto fuerza un escaneo y cálculo
sobre prácticamente todo el catálogo. El autocompletado realiza además otra consulta
independiente con regex sin anclar y cuatro agrupaciones.

La validación del entorno afectado devolvió:

```json
{"total":584769,"normalized":0,"missingIndexes":[],"valid":false}
```

Los índices versionados existen, pero ninguno de los 584.769 productos tiene los campos
normalizados rellenados. Por ello la agregación cae siempre en las expresiones de normalización
calculadas en tiempo de consulta. Debe ejecutarse y verificarse el backfill antes de medir de
nuevo, aunque el backfill por sí solo no elimina el escaneo regex de la búsqueda textual.

## Corrección requerida para el incidente de rendimiento

### Búsqueda textual

1. Añadir una etapa selectiva e indexable antes de cualquier `$addFields`, `$regexMatch`,
   cálculo de relevancia o `$facet`.
2. No usar regex sin anclar como motor principal sobre todo el catálogo. Usar una de estas
   estrategias, por orden de preferencia:
   - MongoDB Atlas Search con campos normalizados y puntuación ponderada.
   - Un índice de texto dedicado y una fase posterior de ranking sobre los candidatos.
   - Tokens/prefijos materializados e indexados si Atlas Search no está disponible.
3. Limitar primero el conjunto de candidatos; calcular el ranking avanzado solamente sobre
   esos candidatos. El límite de 10.000 ubicado dentro del facet de datos es demasiado tarde:
   para entonces Mongo ya procesó y puntuó todos los documentos y la rama `metadata` todavía
   cuenta el conjunto completo.
4. Separar, si es necesario, la consulta de resultados y el conteo. El conteo no debe repetir
   las transformaciones de relevancia ni bloquear la entrega de los primeros 16 resultados.
5. Conservar una ordenación estable (`relevanceScore`, criterios secundarios e `_id`) y aplicar
   `$skip/$limit` en MongoDB, nunca en memoria.

### Referencias

- Consultar primero por igualdad sobre `normalizedMainReference`,
  `normalizedDistributorReference` y `normalizedReferences`, aprovechando sus índices.
- Los prefijos o coincidencias parciales deben ejecutarse como una segunda estrategia y no
  impedir que la coincidencia exacta responda rápidamente.
- Confirmar que el backfill de campos normalizados se ejecutó en la base usada por la API y
  que los índices `ProductNormalizedMainReferenceV2`, `ProductNormalizedReferencesV2` y
  `ProductNormalizedDistributorReferenceV2` existen realmente en esa base.

### Autocompletado

- No agrupar el catálogo completo en cada pulsación.
- Consultar campos normalizados con prefijo indexable o usar un índice de autocompletado de
  Atlas Search.
- Considerar una colección de sugerencias materializada para piezas, categorías, marcas y
  referencias, actualizada al sincronizar productos.
- Limitar candidatos antes de `$group` y devolver como máximo los elementos requeridos por la UI.
- Añadir caché breve por consulta normalizada; el caché es complementario y no sustituye índices.

### Paginado del catálogo sin texto

- El endpoint ya devuelve páginas distintas, pero debe usar un índice que cubra el filtro y el
  orden estable del listado por defecto.
- Para páginas profundas, sustituir progresivamente `$skip` por paginación por cursor; `$skip`
  se vuelve más costoso cuanto mayor es la página.
- Mantener `page/currentPage/totalPages` mientras el frontend dependa de ese contrato, o versionar
  el endpoint si se introduce cursor.

### Criterios de aceptación adicionales

1. `q=faro&page=1` responde HTTP 200 de manera repetible, sin `MaxTimeMSExpired`.
2. Las páginas 1, 2 y 3 contienen identificadores distintos y mantienen un orden estable.
3. `explain("executionStats")` no muestra un escaneo completo del catálogo para una consulta textual común.
4. El número de documentos examinados debe estar próximo al conjunto candidato, no al total con stock.
5. Autocompletado p95 menor de 300 ms; búsqueda p95 menor de 1.000 ms con datos reales.
6. Una prueba de concurrencia debe cubrir búsqueda y autocompletado ejecutándose a la vez.
7. El timeout continúa siendo una protección y los errores del motor siguen devolviéndose como error,
   nunca como un falso resultado vacío.

## Contrato requerido

### Endpoint

`GET /api/products/search`

Parámetros actuales que deben conservarse:

- `q`
- `page`
- `sortOrder`
- `userProvince`
- `subcategory`
- `brand`
- `model`
- `year`

Respuesta exitosa, incluso cuando no hay coincidencias:

```json
{
  "data": [],
  "totalPages": 0,
  "totalResults": 0,
  "queryTimeMs": 125
}
```

- Un resultado vacío debe responder HTTP 200, nunca 404.
- Un fallo real debe responder con el código 4xx/5xx correspondiente y un cuerpo de error consistente.
- `data` siempre debe ser un array.
- Añadir `totalResults` y `queryTimeMs`.
- Es recomendable exponer `Server-Timing: search;dur=<ms>`.

## Rendimiento

- Medir por separado normalización, consulta al motor, hidratación de productos y serialización.
- Objetivo inicial: p95 menor de 1.000 ms y p50 menor de 500 ms.
- Revisar índices de todos los campos usados en búsqueda, filtros y ordenación.
- No recuperar campos que no se muestran en el listado. El listado necesita como máximo `_id`, `title`, `mainReference`, `brand`, `articleModel`, `year`, `buscorepuestosPrice`, primera imagen, `distributorProvince`, `stock` e `isNewProduct`.
- Evitar consultas N+1 para distribuidor, provincia, stock o imágenes.
- Mantener paginación en el motor de búsqueda/base de datos, no después de cargar todos los productos.
- Verificar si existen llamadas externas o transformaciones secuenciales que puedan paralelizarse o eliminarse.

## Cancelación y concurrencia

- El endpoint debe tolerar que el cliente cierre la conexión al escribir otra consulta.
- Si el framework lo permite, propagar la señal de cancelación a la consulta subyacente.
- No mantener trabajo costoso activo después de que la petición haya sido cancelada.

## Observabilidad

Registrar, sin datos personales:

- Consulta normalizada o hash de consulta.
- Duración total.
- Duración del motor de búsqueda.
- Número de resultados.
- Página y filtros.
- Estado HTTP y errores.

Crear métricas p50, p95 y p99. No registrar matrículas, teléfonos ni otros datos introducidos en formularios de contacto.

## Pruebas de aceptación

1. Una búsqueda con resultados devuelve HTTP 200, `data.length > 0` y totales coherentes.
2. Una búsqueda sin resultados devuelve HTTP 200 y `data: []`.
3. Un fallo del motor devuelve error; nunca se transforma en cero resultados.
4. Las búsquedas repetidas no degradan progresivamente la latencia.
5. Paginación y filtros conservan el mismo contrato.
6. Prueba de carga con consultas por nombre, vehículo y referencia.
7. Validar p95 menor de 1.000 ms con el volumen real del catálogo.

## Fuera de alcance de este ticket

El ranking avanzado y la normalización de referencias pertenecen a los tickets 2 y 3. En este ticket solo deben aplicarse optimizaciones que no cambien intencionalmente el orden funcional de los resultados.
