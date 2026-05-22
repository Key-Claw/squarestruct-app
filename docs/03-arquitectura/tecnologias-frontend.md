# Tecnologias Del Frontend

Este documento describe las tecnologias reales usadas en `frontend/package.json` y su papel en SquareStruct V3.

## Stack Principal

| Tecnologia | Uso |
| --- | --- |
| React 19 | Componentes, estado y renderizado de la SPA. |
| Vite 8 | Servidor de desarrollo, build y proxy `/api`. |
| React Router DOM 7 | Rutas de la SPA mediante `HashRouter`. |
| Bootstrap 5 | Grid, utilidades, tablas, formularios, botones y dropdowns. |
| Three.js | Renderizado 3D del visor/disenador visual. |
| React Three Fiber | Integracion declarativa de Three.js con React. |
| Drei | Utilidades y controles para la escena 3D. |
| SweetAlert2 | Confirmaciones y alertas de acciones relevantes. |
| CSS propio | Identidad visual, responsive y componentes. |
| Vitest | Tests unitarios/de renderizado. |
| Testing Library | Renderizado de componentes desde perspectiva de usuario. |
| ESLint | Calidad estatica del codigo. |

## React

React se usa para:

- componer paginas y componentes;
- mantener estado de usuario, carrito, checkout y filtros;
- mostrar modales y paneles;
- renderizar vistas distintas segun rol.

## Vite

Vite aporta:

- desarrollo local rapido;
- build de produccion;
- proxy de `/api` hacia `http://localhost:3000`;
- integracion con React mediante `@vitejs/plugin-react`.

## HashRouter

Se usa `HashRouter` para que rutas como `/#/catalog` funcionen en hostings estaticos sin reglas de fallback. El servidor entrega `index.html` y React interpreta la parte posterior al `#`.

## Bootstrap

Bootstrap se usa como base para:

- grid responsive;
- `container-fluid`, `row`, `col-*`;
- botones;
- tablas;
- formularios;
- dropdowns;
- utilidades de espaciado y alineacion.

La apariencia final se define con CSS propio.

## SweetAlert2

`frontend/src/utils/alerts.js` centraliza:

- `confirmDelete`;
- `showSuccess`;
- `showError`.

Se usa principalmente en eliminacion de cuentas/usuarios y feedback de acciones importantes.

## CSS Propio

La estructura CSS real:

```text
styles/base/
styles/layout/
styles/pages/
styles/components/
```

`responsive.css` existe para ajustes transversales, pero las reglas especificas deben vivir en el CSS de su pagina o componente.

## Comunicacion Con Backend

`services/api.js` centraliza `fetch` y token JWT. Servicios principales:

- `authService.js`
- `productService.js`
- `orderService.js`

Endpoints consumidos:

- `/usuarios/register`
- `/usuarios/login`
- `/perfil`
- `/usuarios`
- `/productos`
- `/orders`
- `/orders/admin/todos`
- `/orders/:id/estado`

## Testing Y Calidad

Vitest y Testing Library validan renderizado basico. ESLint revisa consistencia del codigo y reglas de hooks. El build de Vite confirma que imports, assets y CSS compilan correctamente.

## Decisiones

- No se usa TypeScript en V3; se compensa con nombres claros, servicios separados y validaciones.
- No se usa libreria UI adicional porque Bootstrap + CSS propio cubren el alcance actual.
- Los filtros de catalogo son locales porque el volumen de datos es pequeno.
- `Settings.jsx` sigue centralizando tabs por estado compartido de usuario, facturas y permisos.
