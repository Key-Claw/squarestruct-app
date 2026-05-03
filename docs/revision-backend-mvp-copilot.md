# Revisión del Backend MVP de SquareStruct

## Alcance

Este documento resume una revisión técnica del backend del proyecto SquareStruct, con foco exclusivo en la parte de servidor, API, base de datos, validaciones, autenticación, controladores, rutas, pruebas y scripts de arranque.

La revisión **no incluye el frontend** porque todavía está pendiente de terminar.

## Objetivo

Comprobar si el backend sigue los criterios esperables de un MVP funcional:

- arranque reproducible en una máquina nueva,
- API REST coherente,
- validaciones mínimas de entrada,
- autenticación por JWT,
- persistencia consistente en MySQL,
- estructura suficiente para soportar el flujo principal del producto.

## Metodología

La revisión se realizó con apoyo de **GitHub Copilot como asistente de IA de código**, analizando el contenido del repositorio y cruzando la información entre:

- `backend/server.js`
- `backend/src/app.js`
- `backend/src/routes/`
- `backend/src/controllers/`
- `backend/src/middlewares/`
- `backend/src/services/`
- `backend/db/schema.sql`
- `backend/db/migrations/`
- `backend/tests/`
- `backend/postman/`
- `backend/README.md`

El criterio usado fue práctico: no solo verificar que el código compile, sino si el backend puede sostener un MVP realista con un flujo de desarrollo y despliegue repetible.

## Resumen ejecutivo

El backend está **cerca de un MVP funcional**, pero todavía presenta puntos que conviene corregir antes de darlo por cerrado.

Lo más valioso ya existe:

- autenticación con JWT,
- CRUD de usuarios,
- CRUD de productos,
- creación y listado de pedidos,
- validaciones base,
- colección Postman,
- pruebas automatizadas iniciales,
- documentación operativa.

Sin embargo, la revisión detectó problemas importantes en:

- consistencia del esquema SQL,
- seguridad de JWT por fallback inseguro,
- validación real del flujo de productos,
- robustez del flujo de pedidos,
- duplicación de carga de variables de entorno,
- coherencia entre esquema y migraciones.

## Hallazgos principales

### 1. Esquema de base de datos inconsistente

En `backend/db/schema.sql` la tabla `productos` quedó con un bloque de columnas y validaciones mal estructurado. Esto compromete la creación limpia de la base de datos y hace frágil la inicialización del entorno.

Impacto:

- riesgo de fallos al recrear el contenedor,
- dificultad para garantizar una instalación reproducible,
- dependencia de una base ya existente para que el backend funcione.

### 2. JWT con fallback inseguro

En `backend/src/middlewares/auth.js` y `backend/src/controllers/usuariosController.js` el token se firma/verifica con `process.env.JWT_SECRET || 'secret'`.

Impacto:

- si falta la variable de entorno, el sistema sigue funcionando con una clave débil,
- se oculta un error de configuración,
- se reduce la seguridad real del backend.

### 3. Validación de productos no integrada al flujo CRUD

Existe el middleware `backend/src/middlewares/validacionProducto.js`, pero no está montado en las rutas de productos.

Además:

- el controlador acepta ciertos valores que la base de datos no admite,
- hay campos requeridos en el esquema que pueden llegar como `null` o sin validar,
- el backend responde con errores SQL donde debería responder con `400 Bad Request`.

Impacto:

- peor experiencia de API,
- más errores en tiempo de ejecución,
- menos consistencia entre capa HTTP y base de datos.

### 4. Flujo de pedidos sensible a fallos de conexión

En `backend/src/controllers/pedidosController.js` la conexión se obtiene fuera del bloque principal de error.

Impacto:

- si falla `db.getConnection()`, el manejo del error no queda completamente controlado,
- el flujo transaccional es correcto en intención, pero todavía frágil ante errores de inicialización de conexión.

### 5. Duplicación de carga de dotenv

`backend/server.js` y `backend/src/app.js` cargan variables de entorno.

Esto no rompe el sistema, pero sí introduce duplicación y confusión sobre cuál es el punto real de inicialización del entorno.

Impacto:

- más complejidad de mantenimiento,
- mayor riesgo de cambios inconsistentes,
- dificultad para explicar el orden de arranque.

### 6. Migración y esquema no están perfectamente alineados

`backend/db/migrations/001_add_product_dimensions.sql` repite parte de lo que ya se define en `schema.sql`.

Impacto:

- dos fuentes de verdad para la misma estructura,
- riesgo de conflictos al aplicar migraciones sobre una BD ya inicializada,
- mantenimiento más costoso.

## Aspectos positivos

El backend sí tiene una base sólida para un MVP:

- uso de Express y MySQL,
- separación por rutas, controladores y middlewares,
- autenticación por JWT,
- hash de contraseñas con bcrypt,
- operaciones CRUD funcionales,
- endpoints de health y perfil,
- documentación operativa,
- colección Postman de ejemplo,
- presencia de pruebas automatizadas.

## Estado frente a un MVP

### Cumple parcialmente

- autenticación y sesión básica,
- catálogo de productos,
- gestión simple de usuarios,
- creación/listado de pedidos,
- arranque del backend con Docker y MySQL,
- estructura de proyecto entendible.

### Falta cerrar

- robustez del esquema SQL,
- seguridad de configuración,
- validación consistente de entradas,
- coherencia entre migraciones y esquema,
- estabilización del flujo de pedidos,
- limpieza del punto de arranque.

## Recomendaciones prioritarias

1. Corregir el esquema SQL para que la creación limpia de la BD sea reproducible.
2. Eliminar cualquier fallback inseguro de JWT y exigir `JWT_SECRET` real.
3. Conectar el middleware de validación de productos al router correspondiente.
4. Ajustar controladores para devolver `400` en vez de errores SQL cuando falten campos o sean inválidos.
5. Centralizar la carga de variables de entorno en un solo punto de arranque.
6. Unificar esquema y migraciones para evitar duplicidad.
7. Ampliar tests de integración sobre productos y pedidos.

## Conclusión

La revisión realizada con ayuda de **GitHub Copilot** muestra que el backend **sí tiene forma de MVP**, pero todavía no lo consideraría cerrado ni robusto para una entrega final sin tocar.

La base funcional está ahí, pero conviene corregir primero la consistencia de la BD, la configuración de JWT y la validación de entradas. Con esos ajustes, el backend quedaría bastante más alineado con un MVP estable y mantenible.

## Nota sobre la revisión

Esta documentación refleja una revisión asistida por IA sobre el código existente. La IA ayudó a organizar, leer y sintetizar el estado del backend, pero la validación final debe complementarse con pruebas reales de ejecución, reinicialización limpia de la base de datos y comprobación de endpoints en un entorno controlado.
