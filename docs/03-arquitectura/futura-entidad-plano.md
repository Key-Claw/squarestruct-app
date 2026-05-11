# Futura entidad plano

## Objetivo

Este documento explica como podria crecer la base de datos cuando se implemente el disenador de planos 3D.

En `MVP v1` todavia no existe la entidad `plano`. La prioridad actual es validar registro, login, catalogo, carrito/base de pedidos y administracion inicial.

## Por que no esta en el MVP

El disenador 3D es una funcionalidad mas compleja que requiere:

- interfaz visual;
- colocacion de piezas;
- calculo de medidas;
- guardado de posiciones;
- calculo de presupuesto;
- posible visualizacion 3D.

Por eso se deja para una fase posterior. La pagina `Design.jsx` existe como maqueta visual para explicar la direccion futura, pero no guarda planos ni calcula estructuras reales.

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

## Relacion con el SaaS

Guardar planos es una funcionalidad tipica de SaaS porque permite que el usuario conserve proyectos en su cuenta y vuelva a ellos desde cualquier dispositivo.

## Idea clave para explicar

`MVP v1` prepara la base para el futuro disenador 3D porque ya separa usuarios, productos, pedidos y roles. La entidad `plano` seria la evolucion natural para guardar disenos modulares creados por usuarios en `v3`.
