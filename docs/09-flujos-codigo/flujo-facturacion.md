# Flujo Facturacion

## Que Es

La facturacion muestra pedidos reales guardados en MySQL. Hay dos vistas: facturas del usuario y facturacion admin.

## Facturas De Usuario

| Paso | Archivo |
| --- | --- |
| Entrada | `Settings.jsx`, tab `facturas`, o `Invoices.jsx` |
| Servicio | `orderService.obtenerMisPedidos()` |
| Endpoint | `GET /api/orders` |
| Backend | `pedidosController.listarPedidosUsuario` |
| Renderizado | tabla/lista con fecha, total, metodo de pago y estado |

## Facturacion Admin

| Paso | Archivo |
| --- | --- |
| Entrada | `Settings.jsx`, tab `facturacion` |
| Servicio | `orderService.obtenerPedidosAdmin()` |
| Endpoint | `GET /api/orders/admin/todos` |
| Accion estado | `PATCH /api/orders/:id/estado` |
| Restriccion | JWT + rol `admin` |

## Procesamiento

El admin ve historial, filtros, estadisticas y botones para aceptar o denegar pedidos pendientes. El backend valida el rol antes de permitir el cambio.

## Como Defenderlo

No es una pasarela de pago real. Es una gestion academica de pedidos y estados, suficiente para demostrar integracion completa entre frontend, API y base de datos.
