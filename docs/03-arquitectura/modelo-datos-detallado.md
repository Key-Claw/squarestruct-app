# Modelo de datos detallado

## Objetivo

Este documento amplía la explicación de la base de datos del MVP.

La base de datos se ha diseñado con MySQL porque el proyecto necesita relaciones claras entre usuarios, proveedores, productos y pedidos.

## Entidades del MVP

| Tabla | Representa |
| --- | --- |
| `usuarios` | Personas registradas y administradores. |
| `proveedores` | Empresas que ofrecen productos modulares. |
| `productos` | Bloques y pilares disponibles en el catálogo. |
| `pedidos` | Compras o solicitudes de usuarios. |
| `pedidoDetalles` | Productos concretos dentro de cada pedido. |

## Relación principal

```text
usuarios -> pedidos -> pedidoDetalles -> productos -> proveedores
```

Este recorrido permite responder preguntas como:

- qué usuario hizo un pedido;
- qué productos contiene ese pedido;
- qué proveedor suministra cada producto;
- cuánto cuesta cada línea del pedido.

## Usuarios

La tabla `usuarios` guarda los datos de acceso y rol.

Campos importantes:

- `idUsuario`: identificador único.
- `nombre`, `primerApellido`, `segundoApellido`: datos personales básicos.
- `email`: usado para login y marcado como único.
- `contrasena`: hash bcrypt.
- `rol`: `usuario` o `admin`.
- `creadoEn`: fecha de alta.

Restricción importante:

```text
rol IN ('usuario', 'admin')
```

## Proveedores

La tabla `proveedores` guarda empresas relacionadas con el catálogo.

Campos importantes:

- `idProveedor`: identificador único.
- `nombreEmpresa`: nombre comercial.
- `telefono`: contacto.
- `sitioWeb`: web del proveedor.
- `categoria`: tipo de proveedor.
- `validado`: indica si está validado.

Esta entidad permite separar el producto de la empresa que lo proporciona.

## Productos

La tabla `productos` representa piezas modulares.

Campos importantes:

- `idProducto`: identificador único.
- `nombre`: nombre comercial.
- `descripcion`: explicación del producto.
- `precio`: precio unitario.
- `tipo`: `bloque` o `pilar`.
- `material`: `Plastico reciclable` u `Hormigon`.
- `alto`, `ancho`, `largo`: dimensiones físicas.
- `idProveedor`: proveedor asociado.

Las dimensiones preparan el sistema para cálculos de volumen, presupuesto y diseño 3D.

## Pedidos

La tabla `pedidos` funciona como cabecera del pedido.

Campos importantes:

- `idPedido`: identificador único.
- `fecha`: momento de creación.
- `total`: importe total calculado.
- `estado`: situación del pedido.
- `direccionEnvio`: dirección del usuario.
- `metodoPago`: forma de pago elegida.
- `idUsuario`: usuario que realiza el pedido.

Estados permitidos:

```text
pendiente, pagado, enviado, entregado, cancelado
```

Métodos de pago permitidos:

```text
tarjeta, transferencia, paypal, efectivo
```

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

Guardar `precioUnitario` evita que un pedido antiguo cambie si más adelante cambia el precio del producto.

## Integridad

El modelo usa:

- claves primarias;
- claves foráneas;
- restricciones `CHECK`;
- índices;
- motor `InnoDB`.

Esto ayuda a que los datos sean coherentes y evita registros huérfanos.

## Idea clave para explicar

La base de datos no solo almacena datos: también protege relaciones y reglas del negocio, como roles válidos, precios positivos, dimensiones positivas y pedidos vinculados a usuarios reales.
