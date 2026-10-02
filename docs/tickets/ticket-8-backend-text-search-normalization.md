# Ticket 8 — Normalización lingüística y tolerancia a errores

## Objetivo

La API debe devolver resultados equivalentes aunque el cliente use mayúsculas,
acentos, espacios irregulares, separadores, singular/plural o errores tipográficos
habituales. La normalización se usa exclusivamente para buscar; nunca debe alterar
los valores originales mostrados al cliente.

## Endpoints afectados

- `GET /api/products/search?q=...`
- `GET /api/products/autocomplete?q=...`

Ambos endpoints deben compartir exactamente el mismo normalizador y analizador de
texto para evitar que el autocompletado sugiera una consulta que la búsqueda no
pueda resolver.

## Normalización requerida

Crear una función común y testeada que genere un campo normalizado para la consulta
y para los campos indexados del producto:

1. Aplicar normalización Unicode y eliminar diacríticos: `válvula` → `valvula`.
2. Convertir a minúsculas de forma consistente.
3. Recortar y colapsar espacios repetidos.
4. Eliminar puntuación accidental dentro de palabras: `mo.tor` → `motor`.
5. Tratar guiones, barras y guiones bajos como separadores de palabras.
6. Mantener valores mecánicos significativos como `2.0`, `1.6` o `16v`.
7. Detectar referencias y compactar sus separadores: `SLV77 00110 484` →
   `SLV7700110484`.

La normalización debe aplicarse durante la indexación a nombre, categoría,
subcategoría, marca, modelo, vehículo, generación, motor, código de motor y
referencias OEM/equivalentes. No ejecutar una transformación completa de todos los
documentos en cada petición.

## Singular y plural

Usar stemming o lematización compatible con español para campos textuales. Deben
considerarse equivalentes, cuando semánticamente corresponda:

- `motor` / `motores`
- `faro` / `faros`
- `alternador` / `alternadores`

No aplicar stemming a referencias, códigos de motor, marcas ni modelos.

## Errores tipográficos

Incorporar búsqueda difusa solo para tokens textuales, después de intentar las
coincidencias exactas. Recomendación inicial:

- Tokens de 1 a 4 caracteres: sin tolerancia o máximo una edición bajo reglas muy
  restrictivas.
- Tokens de 5 a 8 caracteres: distancia máxima de una edición.
- Tokens de 9 o más caracteres: distancia máxima de dos ediciones.
- No aplicar búsqueda difusa a referencias OEM ni códigos técnicos.

Las coincidencias difusas deben tener menor puntuación que nombre, referencia,
marca o modelo exactos para no degradar la relevancia.

## Orden de relevancia

Conservar el orden establecido:

1. Referencia OEM exacta normalizada.
2. Referencia equivalente exacta normalizada.
3. Nombre exacto normalizado.
4. Pieza + marca + modelo.
5. Pieza + vehículo + generación.
6. Motor o código de motor.
7. Año o versión.
8. Singular/plural y coincidencias parciales.
9. Coincidencias difusas.

## Casos de aceptación

Las siguientes consultas deben encontrar el mismo conjunto base de productos:

- `motor BMW`, `MOTOR bmw`, `mo.tor BMW`, `motor---BMW`.
- `válvula presión`, `valvula presion`.
- `faro`, `faros`.
- `alternador`, `alternadores`.
- `SLV7700110484`, `SLV77 00110 484`, `SLV77-00110-484`.

También se debe comprobar que:

- `Audi A4 2.0 TDI` conserva `2.0` como dato significativo.
- Una coincidencia difusa nunca desplaza una referencia exacta.
- La respuesta mantiene los textos y referencias originales.
- El tiempo de respuesta no supera el límite actual del endpoint.

## Contrato con frontend

El frontend enviará una consulta básica normalizada para mejorar compatibilidad,
pero el backend debe repetir la normalización. No se puede depender del cliente:
otros consumidores pueden enviar la consulta original o una variante distinta.
