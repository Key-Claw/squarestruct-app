# Flujo CRUD

## Que Es

CRUD significa crear, leer, actualizar y eliminar. En SquareStruct aparece de forma real en usuarios y productos. Pedidos no es un CRUD puro porque crear, cancelar y cambiar estado tienen reglas propias.

## Usuarios

| Operacion | Endpoint | Restriccion |
| --- | --- | --- |
| Crear | `POST /api/usuarios/register` | Publico con validacion. |
| Leer lista | `GET /api/usuarios` | Admin. |
| Leer detalle | `GET /api/usuarios/:id` | Admin. |
| Actualizar | `PUT /api/usuarios/:id` | Usuario autenticado; reglas en controlador. |
| Eliminar | `DELETE /api/usuarios/:id` | Usuario autenticado; eliminacion logica/anominizada segun backend. |

## Productos

| Operacion | Endpoint | Restriccion |
| --- | --- | --- |
| Leer lista | `GET /api/productos` | Publico. |
| Leer detalle | `GET /api/productos/:id` | Publico. |
| Crear | `POST /api/productos` | Admin. |
| Actualizar | `PUT /api/productos/:id` | Admin. |
| Eliminar | `DELETE /api/productos/:id` | Admin. |

## Pedidos

| Operacion | Endpoint | Restriccion |
| --- | --- | --- |
| Crear | `POST /api/orders` | Usuario autenticado. |
| Leer propios | `GET /api/orders` | Usuario autenticado. |
| Leer detalle | `GET /api/orders/:id` | Usuario autenticado y propietario/admin segun controlador. |
| Cancelar | `PATCH /api/orders/:id/cancelar` | Usuario autenticado. |
| Cambiar estado | `PATCH /api/orders/:id/estado` | Admin. |

## Como Defenderlo

El CRUD no se aplica igual a todo. Productos y usuarios son recursos editables; pedidos representan una accion de compra y por eso usan estados (`pendiente`, `aceptado`, `denegado`, `cancelado`).
