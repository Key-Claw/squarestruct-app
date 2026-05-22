# Flujo Frontend Backend

## Entrada

El usuario interactua con React. Cuando una accion necesita datos reales, la pagina o componente llama a un servicio del frontend.

## Conexion

`frontend/src/services/api.js` define:

- URL base: `VITE_API_URL` o `/api`;
- cabecera `Content-Type: application/json`;
- cabecera `Authorization: Bearer <token>` si existe JWT;
- cabecera y parametro de idioma;
- manejo comun de errores.

## Recorrido General

1. Un componente dispara una accion.
2. Un servicio frontend llama a `getRequest`, `postRequest`, `putRequest`, `patchRequest` o `deleteRequest`.
3. Express recibe la peticion en `/api/...`.
4. La ruta aplica middlewares si hacen falta.
5. El controlador ejecuta la logica y consulta MySQL.
6. El backend responde JSON.
7. El frontend actualiza estado y renderiza carga, error, vacio o datos.

## Ejemplos Reales

| Accion | Servicio frontend | Endpoint |
| --- | --- | --- |
| Login | `authService.loginUser` | `POST /api/usuarios/login` |
| Catalogo | `productService.getProductos` | `GET /api/productos` |
| Crear pedido | `orderService.crearPedido` | `POST /api/orders` |
| Facturas usuario | `orderService.obtenerMisPedidos` | `GET /api/orders` |
| Facturacion admin | `orderService.obtenerPedidosAdmin` | `GET /api/orders/admin/todos` |

## Como Defenderlo

Frontend y backend no estan pegados directamente: se comunican mediante una API REST. Eso permite probar backend con Postman/Jest y frontend con Vitest sin depender siempre de toda la app levantada.
