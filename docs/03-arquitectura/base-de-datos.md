
# Base de datos: modelo real y defensa DAW

## Objetivo

La base de datos guarda la información principal de SquareStruct y asegura la integridad y trazabilidad de los datos. Este documento resume el modelo real, su justificación y cómo defenderlo en una presentación profesional o DAW.

Se usa MySQL porque el proyecto trabaja con datos conectados y relaciones reales: un pedido pertenece a un usuario y contiene productos, cada producto tiene proveedor, y todo queda trazable.

## Entidades principales

| Tabla | Que representa |
| --- | --- |
| `usuarios` | Personas registradas en la plataforma. |
| `proveedores` | Empresas que ofrecen productos modulares. |
| `productos` | Piezas o bloques de construccion modular. |
| `pedidos` | Compras o solicitudes realizadas por usuarios. |
| `pedidoDetalles` | Productos concretos incluidos en cada pedido. |

## Relaciones principales

- Un usuario puede realizar muchos pedidos.
- Un pedido pertenece a un solo usuario.
- Un proveedor puede tener muchos productos.
- Un producto pertenece a un proveedor.
- Un pedido puede tener muchos productos.
- Un producto puede aparecer en muchos pedidos.

La tabla `pedidoDetalles` permite resolver la relacion entre pedidos y productos.

## Modelo Entidad/Relacion

El modelo Entidad/Relacion representa las entidades principales y como se conectan entre si.

En este proyecto, la idea central es:

```text
usuarios -> pedidos -> pedidoDetalles -> productos -> proveedores
```

## Modelo relacional

El modelo relacional traduce esas entidades a tablas, columnas, claves primarias y claves foraneas.

La relacion mas importante es `pedidoDetalles`, porque conecta pedidos con productos. Sin esa tabla, un pedido solo podria tener un producto o habria que repetir datos.

## Tablas principales

### `usuarios`

- `idUsuario`: clave primaria.
- `nombre`: nombre del usuario.
- `email`: correo usado para iniciar sesion.
- `contrasena`: contrasena cifrada.
- `rol`: tipo de usuario, actualmente `usuario` o `admin`.
- `creadoEn`: fecha de creacion.

### `proveedores`

- `idProveedor`: clave primaria.
- `nombreEmpresa`: nombre del proveedor.
- `telefono`: telefono de contacto.
- `sitioWeb`: pagina web del proveedor.
- `categoria`: categoria comercial del proveedor.
- `validado`: indica si el proveedor esta validado.
- `creadoEn`: fecha de creacion.

### `productos`

- `idProducto`: clave primaria.
- `nombre`: nombre del producto.
- `descripcion`: explicacion breve.
- `precio`: precio unitario.
- `tipo`: categoria del producto.
- `material`: material comercial del producto.
- `alto`: altura de la pieza.
- `ancho`: anchura de la pieza.
- `largo`: longitud de la pieza.
- `idProveedor`: proveedor asociado.

### `pedidos`

- `idPedido`: clave primaria.
- `fecha`: fecha del pedido.
- `total`: importe total.
- `estado`: estado del pedido.
- `fechaCancelacion`: fecha en la que se cancela logicamente el pedido, si aplica.
- `direccionEnvio`: direccion de entrega.
- `metodoPago`: forma de pago.
- `idUsuario`: usuario que realiza el pedido.

### `pedidoDetalles`

- `idPedido`: pedido asociado.
- `idProducto`: producto asociado.
- `cantidad`: unidades solicitadas.
- `precioUnitario`: precio del producto en el momento del pedido.

## Flujo de datos del MVP

1. El usuario se registra.
2. El usuario inicia sesion.
3. Consulta productos desde el catalogo.
4. Puede anadir productos a un carrito visual en el frontend.
5. La base de datos y el backend ya tienen tablas para guardar pedidos y sus detalles.

El checkout completo desde el carrito queda para fases siguientes, pero la estructura relacional ya esta preparada para ese crecimiento.

## Cancelacion logica de pedidos

Los pedidos no se eliminan fisicamente cuando se cancelan. El backend cambia su `estado` a `cancelado` y guarda `fechaCancelacion`.

Esto mantiene historial y trazabilidad: se puede saber que pedido existio, quien lo hizo, que productos tenia y cuando se cancelo.

## Scripts del proyecto

Los scripts SQL estan en:

```text
backend/db/
```

Archivos principales:

- `schema.sql`: crea las tablas.
- `seeds.sql`: inserta datos de prueba.
- `consultas.md`: consultas utiles para revisar y explicar la base de datos.
- `migrations/`: cambios incrementales de estructura.


## Buenas prácticas y defensa DAW

- Explica el modelo relacional y las relaciones reales entre entidades.
- Justifica la trazabilidad: los pedidos no se borran, se cancelan lógicamente.
- Muestra ejemplos de consultas y scripts reales.
- Relaciona la estructura con la seguridad y la integridad de los datos.
