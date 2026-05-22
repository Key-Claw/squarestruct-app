# Flujo De Pedidos

## Que Es

Es el recorrido desde que el usuario anade productos al carrito hasta que se crea un pedido y aparece como factura.

## Donde Esta

| Parte | Archivo |
| --- | --- |
| Catalogo | `frontend/src/pages/Catalog.jsx` |
| Carrito | `frontend/src/components/layout/CartPanel.jsx` |
| Checkout | `frontend/src/components/settings/Checkout.jsx` |
| Servicio frontend | `frontend/src/services/orderService.js` |
| Rutas backend | `backend/src/routes/orders.routes.js` |
| Controlador backend | `backend/src/controllers/orders.controller.js` |
| Base de datos | Tablas `pedidos` y `pedidoDetalles` |

## Como Funciona

1. El catalogo carga productos desde `/api/productos`.
2. El usuario anade productos al carrito.
3. `App.jsx` mantiene el estado del carrito.
4. Al confirmar, si no hay usuario autenticado se pide login.
5. `Checkout` valida direccion y metodo de pago.
6. `orderService.crearPedido()` llama a `POST /api/orders`.
7. El backend comprueba JWT, calcula y guarda el pedido.
8. El usuario puede ver sus pedidos en facturas.
9. Admin puede revisar pedidos y cambiar estado.

## Decisiones Tomadas

- El carrito vive en estado de React porque es una interaccion de interfaz.
- El pedido vive en MySQL porque ya es informacion persistente.
- El estado del pedido es sencillo para poder defenderlo y testearlo.

## Como Defenderlo

Conviene explicar la diferencia entre carrito y pedido: el carrito es temporal, mientras que el pedido se guarda en base de datos cuando el usuario confirma.
