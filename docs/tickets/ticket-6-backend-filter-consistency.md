# Ticket 6 — Consistencia y rendimiento de filtros en backend

## Contexto

La regresión principal estaba en el frontend: al filtrar el catálogo sin texto de búsqueda,
la petición omitía `subcategory`, `brand`, `model` y `year`. Esa omisión ya fue corregida.

El endpoint de búsqueda del backend sí aplica correctamente una subcategoría exacta. Prueba
realizada:

```text
GET /api/products/search?page=1&subcategory=FARO%20DERECHO
HTTP 200
totalResults: 100
data.length: 16
```

No obstante, el endpoint de opciones necesita los siguientes ajustes para evitar filtros
vacíos o inconsistentes.

## Cambios requeridos

### `GET /api/products/filter-options`

1. Añadir siempre `stock: true` al `$match` inicial.
2. Aceptar y conservar los filtros actuales:
   - `subcategory`
   - `brand`
   - `model`
3. Excluir valores `null`, vacíos y `"-"` en marcas, modelos y años.
4. Normalizar tipos: `brands` y `models` como `string[]`; `years` como `number[]`.
5. Eliminar duplicados y conservar una ordenación estable.
6. Limitar el trabajo de cada faceta al conjunto con stock y filtros activos.
7. Aprovechar el índice compuesto de búsqueda o crear uno específico si
   `explain("executionStats")` muestra un escaneo completo.

Actualmente el endpoint tarda aproximadamente 1.081 ms para:

```text
/api/products/filter-options?subcategory=FARO%20DERECHO
```

Objetivo: p95 menor de 500 ms con el volumen real del catálogo.

## Contrato esperado

```json
{
  "brands": ["AUDI", "BMW"],
  "models": ["A4", "E87"],
  "years": [2010, 2009, 2008]
}
```

Una respuesta sin opciones debe mantener HTTP 200:

```json
{
  "brands": [],
  "models": [],
  "years": []
}
```

## Pruebas de aceptación

1. Todas las opciones devueltas corresponden a productos con `stock: true`.
2. Seleccionar subcategoría reduce correctamente marcas, modelos y años.
3. Seleccionar marca reduce modelos y años.
4. Seleccionar modelo reduce años.
5. Una combinación sin resultados devuelve arrays vacíos y HTTP 200.
6. `GET /api/products/search` recibe los mismos filtros y todos los productos devueltos
   cumplen la combinación seleccionada.
7. Las páginas siguientes mantienen los filtros y no repiten la primera página.
8. Las consultas de opciones repetidas no degradan progresivamente su latencia.

