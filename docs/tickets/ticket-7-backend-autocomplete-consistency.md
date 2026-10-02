# Ticket 7 — Alinear sugerencias de autocompletado con resultados reales

## Problema

El endpoint de autocompletado ofrece sugerencias y cantidades que no corresponden con
los resultados que devuelve el buscador al seleccionar esas sugerencias.

Caso reproducido el 1 de octubre de 2026:

```text
GET /api/products/autocomplete?q=aleron%20trasero
```

El autocompletado devuelve, entre otras opciones:

```text
ALERON TRASERO CITROEN C4 BERLINA                 count: 5
ALERON TRASERO                                    count: 3
ALERON TRASERO FORD FIESTA (CB1)                  count: 3
ALERON TRASERO RENAULT CLIO II FASE I (...)       count: 3
Aleron Trasero                                    count: 27
aleron trasero                                    count: 9
ALERON TRASERO                                    count: 2
```

Sin embargo:

```text
GET /api/products/search?q=aleron%20trasero&page=1
totalResults: 2

GET /api/products/search?q=ALERON%20TRASERO%20CITROEN%20C4%20BERLINA&page=1
totalResults: 0

GET /api/products/search?q=ALERON%20TRASERO%20FORD%20FIESTA%20(CB1)&page=1
totalResults: 0
```

Esto provoca que el usuario seleccione una sugerencia aparentemente disponible y llegue
a una búsqueda sin artículos, donde finalmente se muestra el contacto por WhatsApp.

## Causa técnica identificada

Los endpoints no generan candidatos con la misma lógica:

- Autocompletado exige todos los tokens mediante `searchPrefixes: { $all: prefixes }`.
- Búsqueda selecciona solamente un token con `selectCandidateToken(textTokens)`.
- Búsqueda aplica `$limit: candidateLimitFor(params)` antes de validar el resto de tokens
  y antes de calcular la relevancia.

Para `aleron trasero`, el token elegido puede ser `trasero`, que es muy frecuente. El
pipeline limita ese conjunto antes de comprobar `aleron`, dejando fuera productos válidos.
El autocompletado, en cambio, sí encuentra documentos que contienen ambos prefijos.

También se agrupan categorías según su valor original, por lo que diferencias de
mayúsculas/minúsculas producen entradas separadas (`Aleron Trasero`, `aleron trasero` y
`ALERON TRASERO`) con conteos diferentes.

## Cambios requeridos

### 1. Compartir la selección de candidatos

Extraer una función común utilizada por `/products/search` y `/products/autocomplete`.

Para búsquedas textuales debe aplicar todos los tokens significativos:

```javascript
{
  stock: true,
  searchPrefixes: { $all: ["aleron", "trasero"] }
}
```

No aplicar el límite de candidatos después de filtrar por un único token frecuente. El
límite solo puede aplicarse cuando ya se hayan incluido todos los tokens obligatorios.

### 2. Garantizar que toda sugerencia sea navegable

Cada sugerencia debe incluir una consulta canónica que el endpoint de búsqueda pueda
consumir directamente:

```json
{
  "label": "ALERON TRASERO FORD FIESTA (CB1)",
  "query": "ALERON TRASERO FORD FIESTA (CB1)",
  "type": "part",
  "resultCount": 3
}
```

Requisito obligatorio:

```text
autocomplete suggestion.query
→ GET /products/search?q=suggestion.query&page=1
→ totalResults >= 1
```

No devolver sugerencias cuyo `query` produzca cero resultados.

### 3. Calcular conteos con las mismas reglas

- `resultCount` debe contar el mismo universo que `/products/search`.
- Aplicar `stock: true` y las mismas reglas de disponibilidad en ambos endpoints.
- No contar productos eliminados, no publicados, desautorizados o inaccesibles desde tienda.
- Si el conteo es aproximado, indicarlo en el contrato y no presentarlo como disponibilidad exacta.

### 4. Normalizar categorías y marcas antes de agrupar

Agrupar por un valor canónico normalizado para evitar duplicados por casing, acentos o
espacios finales.

Ejemplo esperado:

```json
{
  "name": "ALERON TRASERO",
  "query": "aleron trasero",
  "type": "category",
  "resultCount": 38
}
```

No deben coexistir tres entradas para la misma categoría por diferencias de formato.

### 5. Diferenciar tipos de sugerencia

El contrato debe indicar cómo ejecutar cada sugerencia:

- `part`: búsqueda textual mediante `q`.
- `category`: filtro mediante `subcategory`, no texto libre, si representa una subcategoría exacta.
- `brand`: conservar la consulta actual y añadir el filtro `brand`.
- `reference`: búsqueda mediante la referencia normalizada.

Contrato recomendado:

```json
{
  "label": "ALERON TRASERO",
  "type": "category",
  "query": "aleron trasero",
  "filters": {
    "subcategory": "ALERON TRASERO"
  },
  "resultCount": 38
}
```

### 6. Mantener identificadores cuando la sugerencia representa un artículo

Si una sugerencia apunta a un producto concreto, devolver `productId` y validar que el
producto sea visible y tenga stock. Si agrupa varios productos, no navegar a una ficha:
debe navegar a la búsqueda canónica o a los filtros indicados por el backend.

## Pruebas requeridas

1. Toda sugerencia devuelta para `aleron trasero` produce al menos un resultado.
2. El conteo de cada sugerencia coincide con `totalResults` usando su `query` y filtros.
3. `Aleron Trasero`, `aleron trasero` y `ALERON TRASERO` se agrupan en una única categoría.
4. Los productos sin stock o no visibles no participan en sugerencias ni conteos.
5. Consultas con tokens frecuentes no pierden resultados por aplicar `$limit` prematuramente.
6. Probar piezas, categorías, marcas y referencias.
7. Añadir una prueba contractual que recorra todas las sugerencias de una respuesta y ejecute
   sus consultas de destino, verificando `totalResults > 0`.
8. Mantener p95 de autocompletado menor de 300 ms y p95 de búsqueda menor de 1.000 ms.

## Criterio de terminado

El ticket se considera terminado cuando ninguna sugerencia lleva a cero resultados, los
conteos coinciden con el buscador y las categorías equivalentes aparecen una sola vez.

