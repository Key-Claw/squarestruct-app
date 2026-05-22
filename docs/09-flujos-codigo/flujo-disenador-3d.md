# Flujo Disenador 3D

## Entrada

La vista 3D se activa desde el disenador cambiando `viewMode` a `3d`.

## Archivos Principales

| Archivo | Funcion |
| --- | --- |
| `Viewer3D.jsx` | Contenedor del visor 3D. |
| `Scene.jsx` | Escena principal. |
| `ModularBlock.jsx` | Representacion de piezas. |
| `Grid.jsx` | Rejilla de referencia. |
| `Lights.jsx` | Iluminacion. |
| `DimensionGuides.jsx` | Guias visuales. |
| `Controls.jsx` | Controles de camara/interaccion. |

## Procesamiento

1. El visor recibe `placements` y piezas del editor.
2. Cada pieza colocada se transforma en geometria visual.
3. La escena respeta planta, dimensiones y altura aproximada.
4. La camara puede reiniciarse con `threeCameraResetKey`.
5. La rejilla 3D se puede mostrar u ocultar.

## Integracion

El 3D no tiene estado de negocio propio. Depende del mismo estado del editor 2D. Esto evita que el plano 2D y la vista 3D se contradigan.

## Como Defenderlo

La vista 3D es una representacion del plano, no una entidad nueva. La decision importante es que el estado unico vive en `useDesignEditor`, y tanto el 2D como el 3D leen de ahi.
