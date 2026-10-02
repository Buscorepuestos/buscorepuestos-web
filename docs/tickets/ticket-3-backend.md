# Ticket 3 — Requisitos de backend para normalización y errores de búsqueda

## Objetivo

Variantes equivalentes de una misma referencia o término deben producir resultados equivalentes sin modificar el valor original almacenado ni el texto mostrado al cliente.

## Principio de datos

- Conservar `mainReference`, `references`, títulos y demás campos originales.
- Crear campos normalizados separados para búsqueda.
- Aplicar exactamente la misma función de normalización durante indexación y consulta.
- La normalización debe ser determinista, idempotente y estar cubierta por pruebas unitarias.

## Referencias

Para la comparación interna:

1. Aplicar `trim` y normalización Unicode NFKC.
2. Convertir a una caja consistente.
3. Eliminar espacios, guiones, puntos, barras y guiones bajos usados como separadores.
4. Conservar únicamente letras y números en el campo compacto.

Grupos que deben considerarse equivalentes:

```text
8200667606
8200 667 606
8200-667-606
8200.667.606

DG3004433
dg3004433
DG 3004 433
DG-3004-433
DG.3004.433
```

Campos sugeridos:

- `normalizedMainReference`
- `normalizedReferences[]`
- `normalizedDistributorReference`

Si las alternativas tienen formato `FABRICANTE|REFERENCIA`, indexar fabricante y referencia compacta por separado.

## Texto libre

- Caja uniforme y normalización Unicode.
- Eliminación de diacríticos para búsqueda: `válvula` = `valvula`.
- Espacios consecutivos reducidos a uno.
- Separadores convertidos en límites de token cuando corresponda.
- Singular/plural en español mediante stemming, diccionario o sinónimos controlados.
- Sinónimos de dominio configurables, no codificados en el controlador.

Casos mínimos:

- `faro` / `faros`
- `alternador` / `alternadores`
- `motor` / `motores`
- `válvula` / `valvula`
- Opcional según producto: `izq` / `izquierdo`, `dcha` / `derecho`.

## Errores tipográficos

- Texto de piezas, marcas y modelos: permitir tolerancia conservadora.
- Referencias: intentar primero coincidencia compacta exacta.
- Solo sin coincidencia exacta, permitir sugerencias con distancia muy limitada.
- Una sugerencia aproximada nunca debe superar una coincidencia exacta.
- No tratar automáticamente dos referencias parecidas como equivalentes confirmadas.

Metadatos recomendados cuando se aplique corrección:

```json
{
  "normalizedQuery": "alternador",
  "correctedQuery": null,
  "correctionApplied": false
}
```

El backend no debe reemplazar silenciosamente el texto visible del frontend.

## Clasificación

Detectar el tipo después de compactar separadores:

- `BMW E87`: texto/vehículo.
- `Audi A4 2.0 TDI`: texto/vehículo.
- `DG 3004 433`: referencia.
- `8200 299 173`: referencia.

## Migración e indexación

1. Añadir campos normalizados al modelo de búsqueda.
2. Ejecutar backfill de productos existentes.
3. Generarlos también en altas y actualizaciones.
4. Reindexar en un índice nuevo/versionado.
5. Validar conteos y consultas antes de cambiar el alias activo.
6. Mantener rollback al índice anterior.

## Pruebas de aceptación

- Cada variante numérica devuelve el mismo producto primero.
- Cada variante alfanumérica devuelve el mismo producto primero.
- Singular y plural devuelven resultados relevantes y comparten resultados principales.
- Los valores originales permanecen intactos en la respuesta.
- Normalizar dos veces produce el mismo valor.
- Agregar una referencia con un carácter diferente no desplaza la coincidencia exacta.
- Las pruebas de integración usan un índice aislado y fixtures deterministas.

## Resultado observado en el entorno local

Ya funcionan referencias numéricas con espacios, guiones y puntos, y referencias compactas sin importar mayúsculas. Faltan estos casos:

- `DG 3004 433` devuelve cero, mientras `DG3004433` encuentra el producto.
- `alternadores` devuelve cero, mientras `alternador` devuelve decenas.
- Una referencia con un dígito cambiado devuelve cero. Es un comportamiento base seguro; si se añaden sugerencias, deben presentarse como aproximadas.
