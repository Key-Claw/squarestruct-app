# Flujo De Peticiones Backend

Este documento explica como viaja una peticion desde el frontend hasta MySQL y de vuelta al cliente.

## Flujo General

```text
Frontend
  -> services/api.js
  -> fetch /api/...
  -> Express app.js
  -> route
  -> middlewares
  -> controller
  -> mysql2/promise
  -> MySQL/MariaDB
  -> JSON response
```

## Ejemplo: Login

1. `LoginForm` envia credenciales a `authService.loginUser`.
2. `authService` llama a `POST /usuarios/login`.
3. `api.js` compone la URL base.
4. Express recibe `POST /api/usuarios/login`.
5. `validarLogin` revisa email y contrasena.
6. `loginUsuario` busca el usuario en MySQL.
7. `bcrypt.compare` valida la contrasena.
8. `jsonwebtoken.sign` genera token.
9. El frontend guarda `authToken` y `currentUser`.

## Ejemplo: Perfil

1. El frontend llama a `GET /api/perfil`.
2. `api.js` incluye `Authorization: Bearer TOKEN`.
3. `authMiddleware` valida el JWT.
4. `perfil.js` consulta el usuario por `req.user.idUsuario`.
5. Devuelve `{ usuario }`.

## Ejemplo: Catalogo

1. `Catalog.jsx` llama a `productService.getProductos`.
2. El frontend solicita `GET /api/productos`.
3. `productosController.getProductos` consulta productos y proveedores.
4. El resultado se normaliza y se devuelve al frontend.
5. Los filtros de V2 se aplican en cliente.

## Ejemplo: Checkout

1. `CartPanel` abre `Checkout`.
2. `Checkout.jsx` valida direccion, metodo de pago y carrito.
3. `orderService.crearPedido` llama a `POST /api/orders`.
4. `/api/orders` usa el mismo router que `/api/pedidos`.
5. `authMiddleware` valida el token.
6. `crearPedido` abre transaccion.
7. Se consultan precios reales de productos.
8. Se inserta `pedidos`.
9. Se insertan lineas en `pedidoDetalles`.
10. Se confirma la transaccion.

## Ejemplo: Facturacion Admin

1. `Settings.jsx` en tab `facturacion` llama a `obtenerPedidosAdmin`.
2. El frontend solicita `GET /api/orders/admin/todos`.
3. `authMiddleware` valida JWT.
4. `adminMiddleware` exige rol `admin`.
5. `listarPedidosAdmin` devuelve pedidos con datos de usuario y total de productos.
6. El frontend aplica filtros, estadisticas y paginacion.

Para aceptar o denegar:

```text
PATCH /api/orders/:id/estado
{ "nuevoEstado": "aceptado" }
```

El backend solo permite cambiar pedidos en estado `pendiente`.

## Errores

`api.js` prioriza `error` o `mensaje` devuelto por backend. Si la respuesta no es correcta, lanza `Error`, que las paginas muestran como alertas o estados de error.

## Decisiones

- La API no confia en precios enviados desde cliente; recalcula el total desde MySQL.
- Los pedidos se crean dentro de transaccion.
- Los endpoints admin combinan `authMiddleware` y `adminMiddleware`.
- La cancelacion conserva el pedido y registra `fechaCancelacion`.
