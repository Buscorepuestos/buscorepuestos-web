# Ticket 1 — Requisitos de backend para velocidad y comportamiento del buscador

## Objetivo

Reducir la latencia de `GET /api/products/search` y garantizar un contrato inequívoco para distinguir resultados, cero resultados y errores.

## Situación medida

- `faro BMW E87`: aproximadamente 3,5 s.
- `motor Peugeot 308 1.6 HDI`: aproximadamente 3,6 s.
- Referencia exacta real: aproximadamente 3,0 s.
- El frontend añade 500 ms de debounce antes de ejecutar la petición.

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
