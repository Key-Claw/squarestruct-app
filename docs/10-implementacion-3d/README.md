# Implementacion 2D/3D

Esta seccion documenta el disenador visual de SquareStruct.

## Que Es

El disenador permite montar una propuesta modular con piezas del catalogo, verla en 2D/3D, obtener un resumen y exportar el resultado.

## Donde Esta

- Pagina principal: `frontend/src/pages/Design.jsx`.
- Hook de estado y acciones: `frontend/src/components/design/editor/useDesignEditor.js`.
- Componentes visuales: `frontend/src/components/design/`.
- Estilos: `frontend/src/styles/pages/design.css` y estilos relacionados.

## Como Se Conecta

- Lee productos desde `/api/productos`.
- Usa accesorios locales para completar la experiencia.
- Guarda borrador en `localStorage`.
- No escribe planos en MySQL.

## Documentos

- [`futura-entidad-plano.md`](futura-entidad-plano.md): propuesta realista para persistir planos en una fase futura.

## Como Defenderlo

La clave es explicar que el 3D no sustituye al backend: es una capa visual del frontend. El backend aporta catalogo y productos; la persistencia de planos queda documentada como ampliacion.
