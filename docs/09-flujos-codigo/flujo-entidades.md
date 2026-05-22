# Flujo Completo De Entidades

## Entidades Reales

Las entidades persistentes reales estan en `backend/db/schema.sql`:

| Entidad | Tabla | Uso |
| --- | --- | --- |
| Usuario | `usuarios` | Auth, perfil, roles y administracion. |
| Proveedor | `proveedores` | Origen de productos. |
| Producto | `productos` | Catalogo y piezas base del disenador. |
| Pedido | `pedidos` | Compra realizada por usuario. |
| Detalle de pedido | `pedidoDetalles` | Lineas de productos dentro de un pedido. |

## Recorrido De Una Entidad

1. Se define la tabla y relaciones en `schema.sql`.
2. Se anaden datos iniciales en `seeds.sql`.
3. El backend expone rutas en `backend/src/routes/`.
4. El controlador lee o escribe en MySQL.
5. El frontend crea un servicio en `frontend/src/services/`.
6. Una pagina o componente consume el servicio.
7. Postman y tests validan el comportamiento.
8. La documentacion de API explica el contrato.

## Entidad No Persistente: Plano

El plano del disenador existe como estado frontend y borrador en `localStorage`, pero no como tabla. Por eso no aparece en `schema.sql` ni tiene endpoint propio.

## Como Defenderlo

Una entidad completa no es solo una tabla. Debe tener datos, API, interfaz, validacion y documentacion. En V3 las entidades completas son usuarios, productos y pedidos.
