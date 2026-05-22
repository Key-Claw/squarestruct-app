# Guia De Edicion Frontend

Esta guia ayuda a modificar el frontend sin romper rutas, responsive ni componentes compartidos.

## Que Es

Un conjunto de criterios practicos para tocar React y CSS de forma segura en SquareStruct V3.

## Donde Mirar Antes De Editar

| Necesidad | Lugar |
| --- | --- |
| Rutas y estado global | `frontend/src/App.jsx`, `frontend/src/routes.js` |
| Paginas | `frontend/src/pages/` |
| Componentes reutilizables | `frontend/src/components/` |
| Servicios API | `frontend/src/services/` |
| Estilos globales | `frontend/src/styles/` |
| Tests | `frontend/src/tests/` |

## Reglas Practicas

- Mantener `HashRouter` porque simplifica despliegue estatico.
- No cambiar nombres de rutas sin actualizar navegacion y documentacion.
- Revisar responsive despues de tocar CSS compartido.
- Usar servicios existentes para llamadas HTTP.
- Mantener los estados de carga, error y vacio.
- Ejecutar `npm run test:run`, `npm run lint` y `npm run build` despues de cambios importantes.

## Como Defenderlo

Podemos explicar que el frontend esta dividido por paginas, componentes, servicios y estilos. Esa separacion permite localizar errores y hacer cambios pequenos sin reescribir la aplicacion.
