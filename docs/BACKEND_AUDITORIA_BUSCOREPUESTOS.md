# Requerimientos para backend: auditoría BuscoRepuestos.com

Fecha de preparación: 24 de noviembre de 2026  
Fuente: Auditoría BuscoRepuestos.com, revisión pasiva de portada y una ficha del 28 de octubre de 2026. Este documento traduce sus hallazgos a contratos y tareas backend; no implica que se hayan verificado sistemas internos.

## Prioridad 0: integridad del catálogo

La auditoría encontró una ficha de radiador VW Passat CC 2.0 TDI con compatibilidad “VW Golf III 1.9 D”, metadatos con “1.9 D - 1Y”, años `0` y productos en “Ubicación por confirmar”. La interfaz ya oculta valores vacíos y dejó de presentar los campos marca/modelo como compatibilidad confirmada.

### Datos y contrato

- Definir la fuente de verdad de la ficha y no mezclar versión/motor del vehículo donante con compatibilidad de aplicación.
- Exponer relaciones de compatibilidad verificadas por producto, con marca, modelo, generación/versión, años desde/hasta, motorización, código de motor y fuente/estado de verificación. Un dato ausente debe ser `null`/omitido; nunca `0`, cadena vacía o una relación de otro producto.
- Exponer estado de stock normalizado (`in_stock`, `out_of_stock`, `unknown`), última verificación y disponibilidad de compra. No inferir disponibilidad solo de que el registro exista.
- Exponer ubicación pública solo si es válida y el negocio autoriza mostrarla; distinguir `unknown` de almacén/tienda real. No sustituir desconocido por una ubicación inventada.
- Normalizar referencias y eliminar duplicados en origen, conservando referencias alternativas como lista distinta de la referencia principal.
- Exponer estado real del artículo (nuevo/usado/reparado), condición y, cuando aplique, kilometraje/vehículo donante. No completar atributos desconocidos con valores ficticios.
- Acordar campos de entrega estimada (zona, fecha o rango calculado, corte horario y última actualización). El frontend no debe convertir “ubicación por confirmar” en una promesa de fecha.

### Criterios de aceptación

- El endpoint de detalle y los endpoints de portada/listado entregan el mismo producto y los mismos datos de vehículo.
- Ningún año desconocido sale como `0`; ningún producto recibe por error compatibilidad de otra pieza.
- Fechas/estados de stock incluyen vigencia o timestamp comprobable y el frontend puede distinguir desconocido de disponible.
- Las pruebas de datos incluyen el caso Passat/Golf reportado por auditoría y registros sin año, ubicación, referencia o motor.

## Prioridad 1: catálogo indexable y sitemap

El sitio tiene un catálogo referido en la auditoría de 585.001 piezas. El frontend actual solo cuenta con IDs Mongo, sin contrato para slug/canonical ni inventario indexable.

- Añadir un slug legible, estable y único por producto. Mantener el ID como clave interna y aceptar `/producto/{slug}-{id}`; redirigir URL antigua a la canónica con 301/308.
- Definir `canonicalUrl`, `indexable` y `lastModified` por producto. Productos agotados, duplicados, incompletos o no autorizados deben seguir una regla SEO expresa (`noindex`, redirección o baja).
- Publicar sitemap index y sitemaps de producto particionados en lotes de hasta 50.000 URLs, con `lastmod` real, filtros de indexabilidad y generación incremental/cacheada.
- Proveer una API o mecanismo server-side seguro para enumerar sitemap sin cargar el catálogo completo en memoria. Proponer rutas estables, por ejemplo `/sitemap-index.xml` y `/sitemaps/products-{n}.xml`; coordinar con frontend/infra antes de fijar dominio.
- Exponer `category`, `subcategory`, compatibilidad y facetas limpias para páginas indexables por categoría/modelo; evitar crear páginas finas sin inventario válido.
- Entregar precio, moneda, estado de disponibilidad, condición del producto y URL de imagen canonicalizados y coherentes con checkout, para JSON-LD `Product`/`Offer`.

## Prioridad 1: búsqueda por matrícula/vehículo

- Definir endpoint autenticado/protegido contra abuso para consultar matrícula y devolver vehículo normalizado (marca, modelo, variante, año, combustible/motor) y nivel de confianza/fuente.
- Definir endpoint o parámetros de búsqueda que filtren por vehículo guardado, con reglas explícitas para coincidencia exacta/parcial y sin asegurar compatibilidad cuando falten atributos.
- No registrar matrículas en logs de texto ni analítica; establecer minimización, retención y control de acceso para este dato personal.
- Documentar errores de matrícula inválida, vehículo desconocido, proveedor caído y tasa limitada.

## Prioridad 1: seguridad de API y pagos

- Poner la API tras dominio propio y WAF/CDN cuando sea viable; limitar solicitudes por IP/usuario y por endpoint, con límites reforzados en búsqueda, autocomplete, matrícula, login, checkout y formularios.
- Restringir CORS a los orígenes reales por entorno. No devolver `Access-Control-Allow-Origin: *` con credenciales.
- Validar autorización y propiedad de carrito/pedido en servidor; calcular precio, descuentos, stock y envío de nuevo en backend al crear el intento de pago. No confiar en valores enviados por el cliente.
- Confirmar idempotencia, firma y reintentos de webhooks de Stripe/SumUp/Scalapay y que la UI solo marque pedido pagado tras confirmación server-side.
- Revisar Firebase Security Rules, claves públicas/privadas y restricciones de claves Google por dominio; activar App Check donde aplique. Una clave pública no debe tener permisos administrativos.
- Definir CSP en la capa de hosting/proxy junto con frontend, incluyendo Stripe, Google Tag Manager/Ads, Meta, Firebase, Sentry y Scalapay estrictamente necesarios. Probar checkout y report-only antes de bloquear recursos.
- Validar `frame-ancestors 'none'`/`X-Frame-Options: DENY`, HSTS, `nosniff`, Referrer-Policy y Permissions-Policy en los dominios de aplicación/API. La aplicación frontend ya agrega cabeceras base en Next; verificar valores efectivos tras Vercel/Cloudflare.
- Programar pentest autorizado de backend y checkout; la auditoría fuente fue pasiva y no demuestra vulnerabilidades ni ausencia de ellas.

## Prioridad 1: consentimiento, privacidad y registros

- Proveer mecanismo server-side para registrar versión de aviso, categorías elegidas, fecha/hora y un identificador minimizado; permitir consulta/auditoría y revocación. El `localStorage` del frontend por sí solo no es registro auditable.
- Coordinar consentimiento con Google Consent Mode v2 y estados por categoría (necesarias, analítica, publicidad). Los tags frontend se están gateando por aceptación general; backend/marketing deben validar taxonomía y configuración real.
- Establecer política de logs y retención para PII, matrículas, dirección, teléfono, correo, carrito y pagos; excluir secretos y datos completos de tarjeta.
- Revisar scripts de email/recuperación de carrito: consentimiento/base jurídica, caducidad, opt-out, acceso restringido y no incluir datos sensibles en enlaces.
- Alinear contenido de política de privacidad con Sentry Replay y terceros realmente activos. La configuración cliente actual indica `maskAllText: true` y `blockAllMedia: true`; validar también inputs, atributos sensibles, formularios de pago y dashboard/retención de Sentry.

## Prioridad 2: negocio y trazabilidad que habilitan UX confiable

- Confirmar por escrito política de desistimiento y quién paga el envío de devolución; garantía legal/comercial aplicable a usados/nuevos y alcance de la promesa de dos años; entregar campos/copy aprobados al frontend.
- Si aplica, exponer identificador/número de gestor autorizado CAT/desguace y trazabilidad documental que se pueda mostrar públicamente.
- Entregar reseñas verificadas con fuente, promedio, conteo y URLs de perfil; no presentar estrellas fijas como valoraciones reales.
- Añadir eventos/atribución de consulta por WhatsApp y estado de horario/tiempo esperado de respuesta sin enviar datos personales innecesarios a analytics.
- Definir flujo de recuperación de carrito en backend: expiración, estado, consentimiento, enlace seguro revocable e idempotencia.

## Entregables backend solicitados

1. Esquema/versionado de producto, compatibilidad, stock, ubicación y entrega, más ejemplos de respuesta válida y desconocida.
2. Informe de reconciliación de catálogo para compatibilidades imposibles, años `0`, referencias duplicadas, registros sin stock/ubicación confiable y fichas duplicadas.
3. Contrato de URL canónica, redirecciones e índice sitemap escalable.
4. Contrato OpenAPI para búsqueda por vehículo/matrícula y filtros de catálogo.
5. Matriz de límites/CORS/WAF, inventario de claves y dominios de CSP, reglas de Firebase/App Check y pruebas del checkout/webhooks.
6. Política aprobada de privacidad/consentimiento/retención y textos comerciales de garantía, devolución y entrega.

## Dependencias y límites

Los hallazgos originales vienen de una visita a la portada y una ficha; no son un escaneo completo. Los porcentajes de catálogo, compatibilidad, stock, plazos, garantías, base legal y controles de terceros requieren evidencia del backend, proveedor y responsables de negocio/legal. No publicar esos valores como hechos hasta recibir datos aprobados.
