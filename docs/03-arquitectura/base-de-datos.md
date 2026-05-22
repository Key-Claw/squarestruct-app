# Base De Datos

La base de datos de SquareStruct guarda usuarios, proveedores, productos, pedidos y lineas de pedido. El modelo real esta en `backend/db/schema.sql` y los datos iniciales en `backend/db/seeds.sql`.

## Motor

El desarrollo local usa MySQL 8.4 en Docker. El CI usa MySQL 8.0 como servicio de GitHub Actions para mejorar estabilidad del runner. El modelo usa SQL compatible con MySQL/MariaDB.

## Tablas

| Tabla | Responsabilidad |
| --- | --- |
| `usuarios` | Cuentas, credenciales hasheadas, rol y fecha de alta. |
| `proveedores` | Empresas proveedoras, categoria, web, telefono y validacion. |
| `productos` | Bloques y pilares del catalogo, precios, material y dimensiones. |
| `pedidos` | Cabecera del pedido, total, estado, direccion, pago y usuario. |
| `pedidoDetalles` | Productos incluidos en cada pedido, cantidad y precio unitario. |

## Relaciones

```text
usuarios 1 ---- N pedidos
proveedores 1 - N productos
pedidos N ----- N productos
          mediante pedidoDetalles
```

## Restricciones

El schema define:

- `UNIQUE` en `usuarios.email`;
- roles permitidos: `usuario`, `admin`;
- precio y dimensiones positivas;
- materiales permitidos: `Plastico reciclable`, `Hormigon`;
- tipos de producto: `bloque`, `pilar`;
- estados de pedido: `pendiente`, `aceptado`, `denegado`, `pagado`, `enviado`, `entregado`, `cancelado`;
- metodos de pago: `tarjeta`, `transferencia`, `paypal`, `efectivo`;
- claves foraneas con `ON UPDATE CASCADE`;
- `ON DELETE RESTRICT` para evitar borrar productos o usuarios con dependencias criticas;
- `ON DELETE CASCADE` de `pedidos` a `pedidoDetalles`.

## Indices

```sql
CREATE INDEX idxProductosIdProveedor ON productos (idProveedor);
CREATE INDEX idxPedidosIdUsuario ON pedidos (idUsuario);
CREATE INDEX idxDetallesIdProducto ON pedidoDetalles (idProducto);
```

Estos indices apoyan joins y consultas frecuentes del catalogo, pedidos y facturacion.

## Datos Iniciales

`seeds.sql` inserta:

- proveedores de hormigon y plastico reciclable;
- usuario admin `admin@squarestruct.com`;
- usuarios de ejemplo;
- productos reales del catalogo;
- pedidos de ejemplo y sus detalles.

La contrasena seed usa un hash bcrypt temporal. Debe cambiarse antes de un despliegue real.

## Flujo De Pedido

Cuando el frontend confirma checkout:

1. `Checkout.jsx` envia direccion, metodo de pago y productos.
2. `pedidosController.crearPedido` abre transaccion.
3. Consulta precios reales de `productos`.
4. Calcula `total`.
5. Inserta en `pedidos`.
6. Inserta lineas en `pedidoDetalles`.
7. Confirma la transaccion.

Esto evita confiar en precios calculados por el cliente.

## Cancelacion Y Estados

La cancelacion no borra datos:

```sql
estado = 'cancelado'
fechaCancelacion = NOW()
```

Los pedidos enviados o entregados no se pueden cancelar desde el controlador.

El panel admin cambia pedidos pendientes a:

- `aceptado`
- `denegado`

## Dimensionado De Productos

`productos` incluye:

- `alto`
- `ancho`
- `largo`

Estos campos ya se usan en catalogo y en el disenador para transformar productos en piezas colocables. No existe todavia una tabla `planos`, por lo que los borradores del disenador se guardan solo en el navegador.

## Migraciones

`backend/db/migrations/` conserva cambios incrementales aplicados durante el desarrollo:

- dimensiones de producto;
- metadatos de proveedor;
- material de producto;
- fecha de cancelacion;
- estados de pedido.

Para un entorno limpio se usa `schema.sql`. Las migraciones explican la evolucion del modelo.
