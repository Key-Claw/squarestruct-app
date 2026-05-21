# Documentacion De SquareStruct

Esta carpeta contiene la documentacion tecnica viva de SquareStruct. La fuente principal es el codigo actual del repositorio y el foco documental es la **V3**. La MVP se mantiene solo como contexto historico para entender la evolucion del proyecto.

## Lectura Recomendada

1. [`01-proyecto/vision-general.md`](01-proyecto/vision-general.md): alcance real de V3 y roadmap.
2. [`01-proyecto/enfoque-producto-y-evolucion.md`](01-proyecto/enfoque-producto-y-evolucion.md): evolucion del producto sin mezclar MVP y V3.
3. [`03-arquitectura/frontend-estructura.md`](03-arquitectura/frontend-estructura.md): paginas, componentes, servicios, estado y CSS.
4. [`03-arquitectura/backend-estructura.md`](03-arquitectura/backend-estructura.md): Express, rutas, controladores, middlewares y pool MySQL.
5. [`03-arquitectura/backend-autenticacion.md`](03-arquitectura/backend-autenticacion.md): registro, login, JWT, roles y permisos.
6. [`03-arquitectura/backend-flujo-peticiones.md`](03-arquitectura/backend-flujo-peticiones.md): recorrido de una peticion real.
7. [`03-arquitectura/base-de-datos.md`](03-arquitectura/base-de-datos.md): modelo relacional V3.
8. [`04-api/endpoints.md`](04-api/endpoints.md): endpoints REST reales.
9. [`05-testing/backend-tests.md`](05-testing/backend-tests.md): tests Jest/Supertest.
10. [`05-testing/frontend-lint-build.md`](05-testing/frontend-lint-build.md): tests, lint y build del frontend.
11. [`05-testing/ci-github-actions.md`](05-testing/ci-github-actions.md): workflow de GitHub Actions.
12. [`../docker/README.md`](../docker/README.md): Docker Compose de desarrollo y entorno completo.
13. [`07-recursos/guia-defensa-daw1.md`](07-recursos/guia-defensa-daw1.md): resumen para estudiar y defender el proyecto en la exposicion.
14. [`07-recursos/inventario-codigo-daw1.md`](07-recursos/inventario-codigo-daw1.md): mapa de archivos para explicar el codigo en la defensa.

## Mapa Documental

| Carpeta | Contenido |
| --- | --- |
| `00-workflow/` | GitFlow, commits, issues, milestones y pull requests. |
| `01-proyecto/` | Vision general, fases y evolucion del producto. |
| `02-mvp/` | Documentacion historica de la primera version funcional. |
| `03-arquitectura/` | Frontend, backend, autenticacion, base de datos y decisiones tecnicas. |
| `04-api/` | Endpoints REST reales de la API. |
| `05-testing/` | Tests, Postman, CI, lint y build. |
| `06-debug/` | Errores frecuentes y utilidades de diagnostico. |
| `07-recursos/` | Recursos auxiliares y revisiones historicas. No es la documentacion principal. |

## Documentacion Backend

| Documento | Uso |
| --- | --- |
| [`../backend/README.md`](../backend/README.md) | Guia practica del backend: instalacion, variables, endpoints y tests. |
| [`03-arquitectura/backend-estructura.md`](03-arquitectura/backend-estructura.md) | Capas reales: `app.js`, rutas, controladores y middlewares. |
| [`03-arquitectura/backend-autenticacion.md`](03-arquitectura/backend-autenticacion.md) | JWT, bcrypt, roles `usuario`/`admin` y rutas protegidas. |
| [`03-arquitectura/backend-flujo-peticiones.md`](03-arquitectura/backend-flujo-peticiones.md) | Flujo desde HTTP hasta MySQL y respuesta JSON. |
| [`03-arquitectura/tecnologias-backend.md`](03-arquitectura/tecnologias-backend.md) | Node, Express, mysql2, dotenv, CORS, JWT, bcrypt, Jest y Supertest. |
| [`03-arquitectura/base-de-datos.md`](03-arquitectura/base-de-datos.md) | Tablas, relaciones, restricciones e indices. |
| [`04-api/endpoints.md`](04-api/endpoints.md) | Contrato REST actual. |

## Documentacion Frontend

| Documento | Uso |
| --- | --- |
| [`../frontend/README.md`](../frontend/README.md) | Guia practica del frontend. |
| [`03-arquitectura/frontend-estructura.md`](03-arquitectura/frontend-estructura.md) | Estructura de `src`, paginas, servicios, estado y CSS. |
| [`03-arquitectura/tecnologias-frontend.md`](03-arquitectura/tecnologias-frontend.md) | React, Vite, HashRouter, Bootstrap, Three.js, SweetAlert2, Vitest y ESLint. |
| [`05-testing/frontend-lint-build.md`](05-testing/frontend-lint-build.md) | Validacion automatica y manual del frontend. |

## Estado Real De V3

V3 incluye:

- autenticacion JWT;
- roles `usuario` y `admin`;
- catalogo conectado al backend;
- busqueda, filtros, ordenacion y paginacion de productos;
- carrito lateral;
- checkout conectado a `/api/orders`;
- pedidos y facturas de usuario;
- facturacion admin con historial, filtros y cambio de estado;
- gestion admin de usuarios;
- escritura de productos protegida en backend;
- disenador 2D/3D con piezas de catalogo, accesorios locales, presupuesto estimado, borrador en navegador y exportacion JSON;
- Docker Compose;
- GitHub Actions;
- tests de backend y frontend;
- coleccion Postman V3.

## Tecnologias Del Workflow De Tests

El workflow `.github/workflows/tests.yml` valida la V3 con:

| Area | Tecnologia |
| --- | --- |
| Runner | Ubuntu latest en GitHub Actions. |
| Runtime | Node.js `20.19.0`. |
| Backend CI | MySQL `8.0`, cliente MySQL, `npm ci`, Jest y Supertest. |
| Frontend CI | `npm install`, Vitest, Testing Library, jsdom, ESLint y Vite build. |
| Datos de prueba | `backend/db/schema.sql` y `backend/db/seeds.sql`. |

## MVP Como Contexto Historico

La carpeta `02-mvp/` conserva la explicacion de la primera version funcional. No debe usarse para describir el estado actual si entra en conflicto con el codigo V3. En caso de duda, prevalecen:

1. codigo actual;
2. tests actuales;
3. coleccion Postman V3;
4. documentacion V3.
