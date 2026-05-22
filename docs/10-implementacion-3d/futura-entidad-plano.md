# Futura entidad plano

## Objetivo

Este documento explica como podria crecer la base de datos cuando se implemente el disenador de planos 3D.

En V3 todavia no existe la entidad `plano` en MySQL. El disenador actual permite trabajar en 2D/3D y guardar un borrador local en el navegador, pero no guarda proyectos en la base de datos.

## Por que no esta en el MVP

El disenador 3D es una funcionalidad mas compleja que requiere:

- interfaz visual;
- colocacion de piezas;
- calculo de medidas;
- guardado de posiciones;
- calculo de presupuesto;
- posible visualizacion 3D.

Por eso la persistencia en base de datos se deja para una fase posterior. La pagina `Design.jsx` ya permite colocar piezas, verlas en 3D, calcular resumen estimado y exportar JSON, pero el guardado real por usuario requiere nuevas tablas.

## Que problema resolveria

La entidad `plano` permitiria guardar disenos creados por los usuarios.

Ejemplo:

```text
usuario -> plano -> piezas colocadas -> productos
```

Asi un usuario podria:

- crear un proyecto;
- colocar bloques o pilares;
- guardar el diseno;
- consultar el coste estimado;
- convertir el diseno en pedido.

## Posible tabla `planos`

Campos posibles:

| Campo | Uso |
| --- | --- |
| `idPlano` | Identificador del plano. |
| `idUsuario` | Usuario propietario. |
| `nombre` | Nombre del proyecto. |
| `descripcion` | Descripcion opcional. |
| `anchoTerreno` | Medida base del espacio. |
| `largoTerreno` | Medida base del espacio. |
| `costeEstimado` | Presupuesto calculado. |
| `creadoEn` | Fecha de creacion. |
| `actualizadoEn` | Ultima modificacion. |

## Posible tabla `planoPiezas`

Para guardar las piezas colocadas haria falta una tabla intermedia.

Campos posibles:

| Campo | Uso |
| --- | --- |
| `idPlano` | Plano al que pertenece la pieza. |
| `idProducto` | Producto usado. |
| `cantidad` | Numero de piezas iguales. |
| `posX` | Posicion horizontal. |
| `posY` | Posicion de profundidad. |
| `posZ` | Altura o nivel. |
| `rotacion` | Orientacion de la pieza. |

## Relacion con el modelo actual

La futura entidad se conectaria con:

- `usuarios`, porque cada plano pertenece a un usuario;
- `productos`, porque el plano usa piezas del catalogo;
- `pedidos`, si el usuario decide comprar las piezas del diseno.

El modelo actual ya prepara parte de esta evolucion porque los productos tienen dimensiones y los pedidos pueden guardar varias lineas mediante `pedidoDetalles`.

## Relacion con la aplicacion actual

Guardar planos permitiria que el usuario conserve proyectos en su cuenta, los retome mas adelante y los conecte con catalogo, presupuesto y pedidos.

## Idea clave para explicar

V3 prepara la base para persistir el disenador porque ya separa usuarios, productos, pedidos y roles, y porque el frontend ya genera colocaciones de piezas. La entidad `plano` seria la evolucion natural para guardar disenos modulares creados por usuarios.
