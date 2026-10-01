# Ticket 2 — Requisitos de backend para relevancia y orden

## Objetivo

`GET /api/products/search` debe devolver primero el producto más compatible con la intención del usuario. El frontend no reordena los resultados: el orden recibido es el orden mostrado.

## Orden de prioridad requerido

1. Referencia OEM principal exacta.
2. Referencia equivalente o alternativa exacta.
3. Nombre exacto de la pieza.
4. Pieza + marca + modelo.
5. Pieza + vehículo + generación.
6. Motor o código de motor.
7. Año o versión.
8. Coincidencias parciales.

La coincidencia exacta de una referencia debe dominar cualquier coincidencia parcial en títulos, observaciones u otros campos.

## Campos que debe considerar el índice

- `mainReference`
- `references`
- `distributorReference`
- `title`
- `productName`
- `subcategory`
- `category`
- `brand`
- `articleModel`
- `version`
- `engine`
- `engineCode`
- `year`, `startYear` y `endYear`

No usar `observations` con el mismo peso que los campos estructurados. Puede servir como último fallback, porque suele contener texto ruidoso y referencias incidentales.

## Estrategia recomendada

### Detección de intención

Clasificar cada búsqueda como mínimo en:

- `reference`: cadena con forma de referencia técnica.
- `text`: búsqueda por pieza/vehículo.
- `mixed`: pieza acompañada de referencia o código.

La detección debe ejecutarse después de normalizar el término. Una referencia con espacios o guiones sigue siendo una búsqueda de referencia.

### Ranking de referencias

Para una consulta de referencia:

1. Igualdad con `normalizedMainReference`.
2. Igualdad con un elemento de `normalizedReferences`.
3. Igualdad con `normalizedDistributorReference`.
4. Prefijo de referencia.
5. Coincidencia parcial, solo como último recurso.

Las referencias exactas no deben depender de typo tolerance. Una corrección demasiado permisiva puede mostrar una pieza incompatible.

### Ranking de texto

- Tokenizar pieza, marca, modelo, generación, motor y año.
- Premiar que todos los tokens estén presentes en campos estructurados.
- Una coincidencia en `subcategory`/nombre de pieza debe pesar más que la misma palabra en observaciones.
- Marca + modelo debe pesar más que marca sola.
- Modelo + generación debe distinguir, por ejemplo, `E87` de otros modelos BMW.
- Código de motor exacto debe recibir mayor peso que una coincidencia parcial en la descripción.
- Aplicar desempates estables para que la paginación no cambie entre peticiones idénticas.

Si se utiliza Algolia, configurar `searchableAttributes` ordenados o `unordered(...)` deliberadamente, atributos normalizados dedicados y reglas/optional filters para boosts. No confiar solo en `customRanking`, ya que este actúa después de la relevancia textual.

## Ordenaciones solicitadas por el usuario

- Sin `sortOrder`, utilizar relevancia.
- `sortOrder=asc`: precio ascendente.
- `sortOrder=desc`: precio descendente.
- `sortOrder=proximity`: proximidad.

Las ordenaciones explícitas pueden cambiar el orden principal, pero deben mantener relevancia como desempate. Volver a “Relevancia” desde el frontend omite `sortOrder`.

## Contrato de respuesta

Conservar el contrato del Ticket 1 y añadir opcionalmente información de diagnóstico solo en desarrollo:

```json
{
  "data": [],
  "totalPages": 0,
  "totalResults": 0,
  "queryTimeMs": 125,
  "searchType": "reference"
}
```

No es necesario enviar puntuaciones internas al frontend en producción.

## Matriz mínima de aceptación

Construir fixtures controlados que contengan productos competidores y comprobar:

1. `8200667606`: el producto cuyo `mainReference` es exactamente esa referencia ocupa la posición 1.
2. `8200 667 606`: devuelve el mismo producto en posición 1.
3. `8200-667-606`: devuelve el mismo producto en posición 1.
4. Una referencia equivalente exacta queda debajo de una OEM principal exacta y encima de coincidencias parciales.
5. `faro BMW E87`: primero aparecen faros compatibles con BMW E87, no soportes, centralitas ni productos BMW genéricos.
6. `alternador Audi A4 2.0 TDI`: prioriza alternadores del modelo y motor indicados.
7. `motor Peugeot 308 1.6 HDI`: prioriza motores completos; una centralita de motor no debe superar a un motor completo compatible.
8. Una consulta de nombre exacto supera coincidencias parciales.
9. Resultados con el mismo score conservan un orden estable entre ejecuciones y páginas.
10. Precio/proximidad solo sustituyen el orden principal cuando se envía explícitamente `sortOrder`.

## Pruebas requeridas

- Unitarias del clasificador de intención y cálculo/boost de relevancia.
- Integración contra un índice de pruebas con fixtures deterministas.
- Contrato del endpoint y paginación.
- Snapshot de los primeros identificadores para el corpus de consultas de aceptación.
- Regresión que pruebe que agregar cientos de coincidencias parciales no desplaza una referencia exacta del primer puesto.

## Observaciones del entorno local

Tras el Ticket 1, el endpoint local responde alrededor de 245–280 ms. Se verificó que una referencia real (`8200299173`) y sus variantes con espacios/guiones devuelven el producto exacto primero. Persisten casos semánticos que deben cubrirse con ranking:

- `faro BMW E87` devuelve primero un **soporte de faro**, no necesariamente un faro.
- `motor Peugeot 308` devuelve primero una **centralita motor**, no un motor completo.

Estos dos casos son buenos fixtures de regresión para comprobar que el tipo de pieza exacto domina términos secundarios contenidos en el título.
