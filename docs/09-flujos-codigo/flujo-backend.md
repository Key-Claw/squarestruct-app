# Flujo Backend

## Entrada

El backend entra por `backend/src/server.js` y configura la aplicacion en `backend/src/app.js`. `app.js` crea Express, carga variables de entorno con `dotenv`, activa `cors`, acepta JSON y crea la pool MySQL con `mysql2/promise`.

## Rutas Reales

| Ruta base | Archivo | Funcion |
| --- | --- | --- |
| `/api/health` | `backend/src/app.js` | Comprobar que el servidor responde. |
| `/api/db-status` | `backend/src/app.js` | Comprobar tablas y totales basicos de MySQL. |
| `/api/usuarios` | `backend/src/routes/usuarios.js` | Registro, login y CRUD de usuarios. |
| `/api/perfil` | `backend/src/routes/perfil.js` | Perfil del usuario autenticado. |
| `/api/productos` | `backend/src/routes/productos.js` | Catalogo y escritura admin de productos. |
| `/api/pedidos` | `backend/src/routes/pedidos.js` | Pedidos de usuario y gestion admin. |
| `/api/orders` | `backend/src/app.js` | Alias de `/api/pedidos` usado por el frontend. |

## Procesamiento

1. Express recibe la peticion.
2. Si la ruta es privada, pasa por `authMiddleware`.
3. Si la ruta es de administrador, pasa tambien por `adminMiddleware`.
4. Las validaciones especificas se hacen antes del controlador.
5. El controlador consulta o modifica MySQL usando la pool `db`.
6. La respuesta vuelve como JSON con datos o mensaje de error.

## Conexion Con Base De Datos

La base real se define en `backend/db/schema.sql`. Las tablas principales son:

- `usuarios`;
- `proveedores`;
- `productos`;
- `pedidos`;
- `pedidoDetalles`.

## Como Defenderlo

El backend sigue una estructura sencilla: ruta, middleware, controlador y base de datos. No hay una capa empresarial compleja porque el objetivo DAW1 es que sea entendible y mantenible.
