# Flujo Del Disenador

## Que Es

Es el recorrido del editor visual que permite colocar piezas modulares, ver una representacion 2D/3D, calcular un resumen aproximado y exportar el plano.

## Donde Esta

| Parte | Archivo |
| --- | --- |
| Pagina | `frontend/src/pages/Design.jsx` |
| Logica principal | `frontend/src/components/design/editor/useDesignEditor.js` |
| Componentes del editor | `frontend/src/components/design/` |
| Catalogo de piezas | Productos desde `/api/productos` y accesorios locales |
| Persistencia actual | `localStorage`, clave `squarestruct-design-draft` |

## Como Funciona

1. El disenador carga productos reales del catalogo.
2. Algunos productos se transforman en piezas colocables.
3. Se anaden accesorios locales como puerta, ventana, escalera y suelo.
4. El usuario coloca piezas en el plano 2D.
5. La vista 3D representa el resultado con Three.js, React Three Fiber y Drei.
6. El resumen calcula piezas, superficie, altura y precio estimado.
7. El borrador se guarda en el navegador.
8. El usuario puede exportar el plano como JSON.

## Limite Actual

No existe tabla `planos` en MySQL. Por tanto, el disenador no guarda planos por usuario en backend todavia.

## Como Defenderlo

Es una funcionalidad visual avanzada para DAW1, pero se debe explicar con honestidad: la parte 2D/3D y el borrador local funcionan; la persistencia de planos seria una mejora futura.
