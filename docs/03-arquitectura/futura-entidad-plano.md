# Futura entidad plano

## Objetivo

Este documento explica cómo podría crecer la base de datos cuando se implemente el diseñador de planos 3D.

En el MVP todavía no existe la entidad `plano`. La prioridad actual es validar registro, login, catálogo y pedidos.

## Por qué no está en el MVP

El diseñador 3D es una funcionalidad más compleja que requiere:

- interfaz visual;
- colocación de piezas;
- cálculo de medidas;
- guardado de posiciones;
- cálculo de presupuesto;
- posible visualización 3D.

Por eso se deja para una fase posterior.

## Qué problema resolvería

La entidad `plano` permitiría guardar diseños creados por los usuarios.

Ejemplo:

```text
usuario -> plano -> piezas colocadas -> productos
```

Así un usuario podría:

- crear un proyecto;
- colocar bloques o pilares;
- guardar el diseño;
- consultar el coste estimado;
- convertir el diseño en pedido.

## Posible tabla `planos`

Campos posibles:

| Campo | Uso |
| --- | --- |
| `idPlano` | Identificador del plano. |
| `idUsuario` | Usuario propietario. |
| `nombre` | Nombre del proyecto. |
| `descripcion` | Descripción opcional. |
| `anchoTerreno` | Medida base del espacio. |
| `largoTerreno` | Medida base del espacio. |
| `costeEstimado` | Presupuesto calculado. |
| `creadoEn` | Fecha de creación. |
| `actualizadoEn` | Última modificación. |

## Posible tabla `planoPiezas`

Para guardar las piezas colocadas haría falta una tabla intermedia.

Campos posibles:

| Campo | Uso |
| --- | --- |
| `idPlano` | Plano al que pertenece la pieza. |
| `idProducto` | Producto usado. |
| `cantidad` | Número de piezas iguales. |
| `posX` | Posición horizontal. |
| `posY` | Posición de profundidad. |
| `posZ` | Altura o nivel. |
| `rotacion` | Orientación de la pieza. |

## Relación con el modelo actual

La futura entidad se conectaría con:

- `usuarios`, porque cada plano pertenece a un usuario;
- `productos`, porque el plano usa piezas del catálogo;
- `pedidos`, si el usuario decide comprar las piezas del diseño.

## Relación con el SaaS

Guardar planos es una funcionalidad típica de SaaS porque permite que el usuario conserve proyectos en su cuenta y vuelva a ellos desde cualquier dispositivo.

## Idea clave para explicar

El MVP prepara la base para el futuro diseñador 3D porque los productos ya tienen dimensiones. La entidad `plano` será la evolución natural para guardar diseños modulares creados por usuarios.
