# Base de datos

## Objetivo

La base de datos guarda la información principal de SquareStruct:

- Usuarios.
- Proveedores.
- Productos.
- Pedidos.
- Detalles de pedido.

Se usa MySQL porque el proyecto trabaja con datos relacionados entre sí. Por ejemplo, un pedido pertenece a un usuario y contiene productos.

## Entidades principales

| Tabla | Qué representa |
| --- | --- |
| `usuarios` | Personas registradas en la plataforma. |
| `proveedores` | Empresas que ofrecen productos modulares. |
| `productos` | Piezas o bloques de construcción modular. |
| `pedidos` | Compras o solicitudes realizadas por usuarios. |
| `pedidoDetalles` | Productos concretos incluidos en cada pedido. |

## Relaciones principales

- Un usuario puede realizar muchos pedidos.
- Un pedido pertenece a un solo usuario.
- Un proveedor puede tener muchos productos.
- Un producto pertenece a un proveedor.
- Un pedido puede tener muchos productos.
- Un producto puede aparecer en muchos pedidos.

La tabla `pedidoDetalles` permite resolver la relación entre pedidos y productos.

## Modelo Entidad/Relación

El modelo Entidad/Relación representa las entidades principales y cómo se conectan entre sí.

En este proyecto, la idea central es:

```text
usuarios -> pedidos -> pedidoDetalles -> productos -> proveedores
```

## Modelo relacional

El modelo relacional traduce esas entidades a tablas, columnas, claves primarias y claves foráneas.

La relación más importante es `pedidoDetalles`, porque conecta pedidos con productos. Sin esa tabla, un pedido solo podría tener un producto o habría que repetir datos.

## Tablas principales

### `usuarios`

- `idUsuario`: clave primaria.
- `nombre`: nombre del usuario.
- `email`: correo usado para iniciar sesión.
- `contrasena`: contraseña cifrada.
- `rol`: tipo de usuario.
- `creadoEn`: fecha de creación.

### `proveedores`

- `idProveedor`: clave primaria.
- `nombreEmpresa`: nombre del proveedor.
- `telefono`: teléfono de contacto.
- `validado`: indica si el proveedor está validado.
- `creadoEn`: fecha de creación.

### `productos`

- `idProducto`: clave primaria.
- `nombre`: nombre del producto.
- `descripcion`: explicación breve.
- `precio`: precio unitario.
- `tipo`: categoría del producto.
- `stock`: unidades disponibles.
- `idProveedor`: proveedor asociado.
- `creadoEn`: fecha de creación.

### `pedidos`

- `idPedido`: clave primaria.
- `fecha`: fecha del pedido.
- `total`: importe total.
- `estado`: estado del pedido.
- `direccionEnvio`: dirección de entrega.
- `metodoPago`: forma de pago.
- `idUsuario`: usuario que realiza el pedido.

### `pedidoDetalles`

- `idPedido`: pedido asociado.
- `idProducto`: producto asociado.
- `cantidad`: unidades solicitadas.
- `precioUnitario`: precio del producto en el momento del pedido.

## Flujo de datos

1. El usuario se registra.
2. El usuario inicia sesión.
3. Consulta productos.
4. Crea un pedido.
5. El pedido se guarda en `pedidos`.
6. Los productos del pedido se guardan en `pedidoDetalles`.

## Scripts del proyecto

Los scripts SQL están en:

```text
backend/db/
```

Archivos principales:

- `schema.sql`: crea las tablas.
- `seeds.sql`: inserta datos de prueba.
- `consultas.sql`: consultas útiles para revisar la base de datos.
- `migrations/`: cambios incrementales de estructura.

## Idea clave para explicar

La base de datos es relacional porque los datos están conectados: usuarios, productos y pedidos dependen unos de otros.
