# Ticket 4 — Contrato de backend para información de resultados

## Objetivo

Cada elemento de `GET /api/products/search` debe incluir información suficiente para que el usuario determine compatibilidad sin abrir múltiples productos.

## Campos requeridos por resultado

```json
{
  "_id": "string",
  "title": "Alternador",
  "brand": "Audi",
  "articleModel": "A4 (B9)",
  "year": 2018,
  "startYear": 2016,
  "endYear": 2020,
  "version": "2.0 TDI",
  "engine": "2.0 TDI 150 CV",
  "engineCode": "DEUA",
  "mainReference": "06H903017",
  "buscorepuestosPrice": 500,
  "condition": "Segunda mano",
  "stock": true,
  "availability": "Disponible",
  "distributorProvince": "Madrid",
  "images": ["https://.../image.jpg"]
}
```

## Reglas del contrato

- `_id`, `title`, `mainReference`, `buscorepuestosPrice` y `stock` deben tener tipos estables.
- `images` siempre debe ser un array; puede estar vacío.
- Los campos ausentes deben ser `null` o no aparecer, nunca strings literales como `"undefined"`.
- El frontend construye el vehículo con marca, modelo y año, omitiendo valores ausentes.
- `condition` debe ser un valor de negocio normalizado. Valores recomendados: `Nuevo`, `Segunda mano`, `Revisado`, `Reparado`.
- `availability` puede derivarse en backend de stock/reservas, pero no debe contradecir `stock`.
- La referencia mostrada conserva su formato original; los campos normalizados del Ticket 3 no se exponen como referencia principal.
- El enlace se construye con `_id`; no es necesario devolver una URL si la ruta interna sigue siendo `/producto/:id`.

## Proyección y rendimiento

La consulta de listado debe proyectar únicamente los campos anteriores. No debe enviar observaciones extensas, presupuestos, bastidor completo u otros datos propios del detalle.

Para imágenes, es suficiente devolver la imagen principal o mantener `images` limitado al primer elemento en el endpoint de búsqueda. No realizar consultas adicionales por tarjeta.

## Compatibilidad

El frontend actual puede derivar temporalmente:

- `condition` desde `isNewProduct`.
- `availability` desde `stock`.

Sin embargo, para distinguir revisado, reparado, reservado o disponibilidad por almacén, backend debe proporcionar campos explícitos y homogéneos.

## Pruebas de aceptación

1. Todos los resultados tienen identificador, nombre, referencia, precio y stock con tipos correctos.
2. Un producto sin fotografía devuelve `images: []` y no rompe el listado.
3. Un producto sin año/modelo no contiene `undefined` en ningún campo.
4. Condición y disponibilidad utilizan valores permitidos.
5. `stock: false` no puede acompañarse de `availability: "Disponible"`.
6. La respuesta no contiene campos pesados ajenos al listado.
7. El endpoint conserva paginación, relevancia y rendimiento de los tickets anteriores.
8. Fixture con pieza, vehículo, OEM, precio, estado, ubicación e imagen valida el contrato completo.
