# Backend requerido: administración de precios

## Objetivo

El frontend incorpora la ruta privada `/admin/precios`. Un usuario inicia sesión con Firebase Email/Password, consulta un producto por su `_id` de MongoDB y modifica `buscorepuestosPrice`.

La seguridad **no puede depender del frontend ni de que la URL no aparezca en el menú**. Los tres endpoints descritos abajo deben validar el Firebase ID token y el rol administrativo antes de acceder a MongoDB.

## Autenticación y autorización

1. Crear en Firebase Authentication las dos cuentas autorizadas (jefe y propietario).
2. Asignar a sus UID un custom claim con Firebase Admin SDK:

    ```ts
    await getAuth().setCustomUserClaims(uid, { admin: true })
    ```

3. El frontend enviará en cada request:

    ```http
    Authorization: Bearer <firebase-id-token>
    ```

4. Un middleware debe ejecutar `verifyIdToken(token, true)` y exigir `decodedToken.admin === true`.
5. Responder `401` si el token falta, expiró o no es válido; `403` si el usuario está autenticado pero no tiene el claim `admin`.

No se debe aceptar una lista de correos enviada por el cliente, una clave fija en JavaScript ni confiar en el rol guardado en Redux/Airtable. El backend es la autoridad.

## Contrato HTTP

Todos los endpoints usan el prefijo actual `/api`.

### `GET /api/admin/session`

Comprueba el token y el rol. No consulta ni modifica productos.

Respuesta `200`:

```json
{ "data": { "uid": "firebase-uid", "email": "admin@empresa.com" } }
```

### `GET /api/admin/products/:id`

- Validar que `id` sea un `ObjectId` válido; si no, responder `400`.
- Buscar por `_id` con una proyección limitada a los campos de respuesta.
- Si no existe, responder `404`.

Respuesta `200`:

```json
{
	"data": {
		"_id": "665f1c000000000000000000",
		"title": "Alternador",
		"productName": "Alternador Audi A3",
		"buscorepuestosReference": "BR-123",
		"distributorReference": "DIST-456",
		"buscorepuestosPrice": 129.9,
		"images": ["https://..."],
		"updatedAt": "2026-10-21T12:00:00.000Z"
	}
}
```

### `PATCH /api/admin/products/:id/price`

Body:

```json
{ "buscorepuestosPrice": 139.9 }
```

Validaciones obligatorias:

- `id` debe ser un `ObjectId` válido.
- `buscorepuestosPrice` debe ser un número JSON finito, mayor o igual a `0`, con máximo dos decimales.
- No aceptar otros campos (whitelist estricta).
- Actualizar con `$set` y activar timestamps para renovar `updatedAt`.
- Devolver `404` si no existe el producto.
- Devolver el producto actualizado con el mismo formato que el `GET`.

Respuesta `200`:

```json
{
	"data": {
		"_id": "665f1c000000000000000000",
		"title": "Alternador",
		"buscorepuestosPrice": 139.9,
		"images": [],
		"updatedAt": "2026-10-21T12:05:00.000Z"
	}
}
```

## Sincronización del catálogo

La tienda ya lee `buscorepuestosPrice` desde Mongo mediante `GET /api/products/product-mongo/:id` y usa `cache: no-store` en la página de producto. Por eso el detalle reflejará el cambio en la siguiente carga.

Los listados y búsquedas parecen servirse desde un índice de búsqueda. Después de guardar en Mongo, el backend debe actualizar también el registro correspondiente del índice (campo `buscorepuestosPrice`) o disparar el proceso de sincronización existente. La operación debe considerarse exitosa únicamente cuando se haya encolado o completado esa sincronización. Si es asíncrona, documentar el retraso esperado.

MongoDB debe seguir siendo la fuente de verdad; no se debe actualizar el índice desde el navegador porque expondría credenciales y permitiría saltarse la autorización.

## Auditoría y operación

Guardar por cada cambio: `productId`, precio anterior, precio nuevo, `uid`/email del administrador, fecha, IP y user-agent. Nunca registrar el ID token ni la contraseña. Se recomienda rate limiting para los endpoints admin y alertas sobre cambios masivos o anómalos.

Después de asignar o retirar custom claims, el usuario debe cerrar sesión y volver a entrar para obtener un token actualizado. Al retirar acceso, revocar también los refresh tokens del UID.

## Criterios de aceptación backend

- Una cuenta sin claim recibe `403` y Mongo no cambia.
- Una petición sin token o con token inválido recibe `401`.
- ID inválido recibe `400`; producto inexistente recibe `404`.
- Precio negativo, texto, `NaN`, infinito o más de dos decimales recibe `400`.
- Un cambio válido actualiza Mongo, `updatedAt`, el índice de catálogo y el registro de auditoría.
- Dos administradores autorizados pueden consultar y actualizar; ningún otro usuario puede hacerlo.
