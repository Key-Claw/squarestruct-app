# Flujo Disenador 2D

## Entrada

El usuario entra en `/#/design`, que renderiza `frontend/src/pages/Design.jsx`. La logica central esta en `useDesignEditor.js`.

## Procesamiento

1. El hook carga productos con `getProductos()`.
2. Los productos se normalizan y se convierten en piezas con `mapProductToDesignPiece`.
3. Se suman accesorios locales definidos en `designEditorData.js`.
4. El usuario selecciona categoria, material, pieza, planta, rotacion y orientacion.
5. `DesignBoard2D.jsx` muestra la cuadricula.
6. Al colocar una pieza se valida limite, colision y soporte.
7. Si es valida, se guarda en `placements`.
8. Undo y redo guardan historico local de colocaciones.

## Respuesta Visual

El tablero cambia segun `placements`, `activeFloor`, zoom y desplazamiento. Los mensajes de estado explican si una accion se acepta o se rechaza.

## Persistencia

El boton de guardar usa `localStorage` con la clave `squarestruct-design-draft`. No guarda en MySQL.

## Como Defenderlo

El 2D demuestra logica propia: no solo pinta piezas, tambien evita colisiones y piezas sin soporte. Para DAW1 es una funcionalidad visual con reglas sencillas pero defendibles.
