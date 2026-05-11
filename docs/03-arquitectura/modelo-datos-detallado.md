# Modelo de datos detallado

## Objetivo

Este documento amplia la explicacion de la base de datos del MVP.

La base de datos se ha disenado con MySQL porque el proyecto necesita relaciones claras entre usuarios, proveedores, productos y pedidos.

## Entidades del MVP

| Tabla | Representa |
| --- | --- |
| `usuarios` | Personas registradas y administradores. |
| `proveedores` | Empresas que ofrecen productos modulares. |
| `productos` | Bloques y pilares disponibles en el catalogo. |
| `pedidos` | Compras o solicitudes de usuarios. |
| `pedidoDetalles` | Productos concretos dentro de cada pedido. |

## Relacion principal

```text
usuarios -> pedidos -> pedidoDetalles -> productos -> proveedores
```

Este recorrido permite responder preguntas como:

- que usuario hizo un pedido;
- que productos contiene ese pedido;
- que proveedor suministra cada producto;
- cuanto cuesta cada linea del pedido.

## Usuarios

La tabla `usuarios` guarda los datos de acceso y rol.

Campos importantes:

- `idUsuario`: identificador unico.
- `nombre`, `primerApellido`, `segundoApellido`: datos personales basicos.
- `email`: usado para login y marcado como unico.
- `contrasena`: hash bcrypt.
- `rol`: `usuario` o `admin`.
- `creadoEn`: fecha de alta.

Restriccion importante:

```text
rol IN ('usuario', 'admin')
```

## Proveedores

La tabla `proveedores` guarda empresas relacionadas con el catalogo.

Campos importantes:

- `idProveedor`: identificador unico.
- `nombreEmpresa`: nombre comercial.
- `telefono`: contacto.
- `sitioWeb`: web del proveedor.
- `categoria`: tipo de proveedor.
- `validado`: indica si esta validado.

Esta entidad permite separar el producto de la empresa que lo proporciona.

## Productos

La tabla `productos` representa piezas modulares.

Campos importantes:

- `idProducto`: identificador unico.
- `nombre`: nombre comercial.
- `descripcion`: explicacion del producto.
- `precio`: precio unitario.
- `tipo`: `bloque` o `pilar`.
- `material`: `Plastico reciclable` u `Hormigon`.
- `alto`, `ancho`, `largo`: dimensiones fisicas.
- `idProveedor`: proveedor asociado.

Las dimensiones preparan el sistema para calculos de volumen, presupuesto y diseno 3D.

## Pedidos

La tabla `pedidos` funciona como cabecera del pedido.

Campos importantes:

- `idPedido`: identificador unico.
- `fecha`: momento de creacion.
- `total`: importe total calculado.
- `estado`: situacion del pedido.
- `direccionEnvio`: direccion del usuario.
- `metodoPago`: forma de pago elegida.
- `idUsuario`: usuario que realiza el pedido.

Estados permitidos:

```text
pendiente, pagado, enviado, entregado, cancelado
```

Metodos de pago permitidos:

```text
tarjeta, transferencia, paypal, efectivo
```

En `MVP v1`, estas tablas existen como base tecnica. El frontend ya tiene carrito visual y servicio de pedidos, pero el checkout completo desde carrito todavia no esta integrado.

## PedidoDetalles

La tabla `pedidoDetalles` conecta pedidos y productos.

Es necesaria porque:

- un pedido puede tener varios productos;
- un producto puede aparecer en varios pedidos.

Campos importantes:

- `idPedido`: pedido asociado.
- `idProducto`: producto asociado.
- `cantidad`: unidades solicitadas.
- `precioUnitario`: precio del producto en el momento del pedido.

Guardar `precioUnitario` evita que un pedido antiguo cambie si mas adelante cambia el precio del producto.

## Integridad

El modelo usa:

- claves primarias;
- claves foraneas;
- restricciones `CHECK`;
- indices;
- motor `InnoDB`.

Esto ayuda a que los datos sean coherentes y evita registros huerfanos.

## Idea clave para explicar

La base de datos no solo almacena datos: tambien protege relaciones y reglas del negocio, como roles validos, precios positivos, dimensiones positivas y pedidos vinculados a usuarios reales.
