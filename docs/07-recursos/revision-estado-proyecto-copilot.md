# Revision del estado del proyecto

## Objetivo

Este documento resume el estado general de SquareStruct contrastando backend, frontend, base de datos, Docker, testing, Postman, documentacion y requisitos del reto.

La revision parte de una propuesta generada con Copilot, pero ha sido corregida para que sea coherente con el estado real del repositorio.

Documento de referencia del reto:

- [reto-1daw-transcripcion.md](reto-1daw-transcripcion.md)

## Resumen ejecutivo

SquareStruct tiene una base V2 solida sobre el MVP v1:

- backend Express con API REST;
- base de datos MySQL con schema, seeds y migraciones;
- frontend React/Vite conectado al backend;
- autenticacion JWT y roles;
- productos con escritura protegida para admin;
- pedidos con creacion, detalle y cancelacion logica;
- tests backend y frontend;
- workflow de GitHub Actions;
- Docker para desarrollo y entorno completo;
- documentacion tecnica amplia.

El proyecto es defendible para DAW1, pero aun tiene puntos que deben explicarse como pendientes o parciales:

- checkout completo desde carrito;
- facturacion real;
- herramienta 3D funcional;
- tests de Postman mas completos;
- revision de vulnerabilidades high detectadas por `npm audit` en backend.

## Backend

Estado: **cumplido con pendientes menores**.

Evidencias:

- `backend/src/app.js`
- `backend/src/routes/`
- `backend/src/controllers/`
- `backend/src/middlewares/`
- `backend/db/schema.sql`
- `backend/tests/`

Puntos fuertes:

- API REST organizada por rutas, controladores y middlewares.
- Autenticacion JWT.
- Roles `usuario` y `admin`.
- Escritura de productos protegida para admin.
- Pedidos con cancelacion logica.
- Tests unitarios e integracion.

Pendientes:

- Revisar vulnerabilidades high de dependencias backend.
- Mantener coherencia entre `schema.sql` y migraciones.
- Ampliar tests si se modifica el checkout o pedidos.

## Frontend

Estado: **cumplido parcialmente**.

Evidencias:

- `frontend/src/App.jsx`
- `frontend/src/pages/`
- `frontend/src/components/`
- `frontend/src/services/`
- `frontend/src/styles/`
- `frontend/src/tests/`

Puntos fuertes:

- React con Vite.
- Navegacion interna controlada por estado en `App.jsx`.
- Catalogo conectado al backend con fallback demo.
- Carrito visual.
- Modal de autenticacion.
- Perfil y vistas admin.
- CSS modularizado.
- Tests iniciales con Vitest y Testing Library.

Importante:

- El proyecto **no usa React Router**. La navegacion se gestiona con estado propio.

Pendientes:

- Checkout completo desde carrito.
- Facturacion con datos reales.
- Revision manual final de responsive y flujos visuales.
- Evolucion de `Design.jsx` hacia una herramienta real.

## Base de datos

Estado: **cumplido**.

Evidencias:

- `backend/db/schema.sql`
- `backend/db/seeds.sql`
- `backend/db/migrations/`
- `backend/db/consultas.md`

Puntos fuertes:

- Modelo relacional con usuarios, proveedores, productos, pedidos y detalles.
- Restricciones y claves foraneas.
- Seeds para demo y pruebas.
- Migracion de cancelacion de pedidos.

Matiz:

- `backend/db/backups/` esta documentado como carpeta reservada. No significa que existan backups reales subidos al repositorio.

## Docker

Estado: **cumplido**.

Evidencias:

- `docker/docker-compose-dev.yml`
- `docker/docker-compose.yml`
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `docker/README.md`

Uso real:

- `docker-compose-dev.yml`: levanta solo MySQL para desarrollo local.
- `docker-compose.yml`: levanta MySQL, backend y frontend en contenedores.

## Testing y calidad

Estado: **cumplido con cobertura inicial en frontend**.

Evidencias:

- `backend/tests/unit/`
- `backend/tests/integration/`
- `frontend/src/tests/`
- `frontend/eslint.config.js`
- `.github/workflows/tests.yml`

Comandos:

```bash
cd backend
npm test
```

```bash
cd frontend
npm run test:run
npm run lint
npm run build
```

Matiz:

- Backend tiene cobertura mas amplia.
- Frontend tiene cobertura inicial, suficiente como base pero ampliable.

## Postman

Estado: **cumplido con pendiente de mejora**.

Evidencias:

- `backend/postman/squarestruct-mvp.postman_collection.json`
- `backend/postman/squarestruct-v2.postman_collection.json`

Puntos corregidos:

- JWTs hardcodeados sustituidos por variables.
- Placeholder `Bearer <JWT>` sustituido por `Bearer {{token}}`.
- Request de cancelacion V2 corregida.

Pendiente:

- Anadir tests automaticos de Postman en mas requests.

## CI

Estado: **CI cumplida**.

Evidencia:

- `.github/workflows/tests.yml`

Valida:

- tests backend con MySQL;
- tests frontend;
- lint frontend;
- build frontend.

No se debe presentar como CD completo, porque no despliega automaticamente a produccion.

## Documentacion

Estado: **cumplido**.

Evidencias:

- `README.md`
- `backend/README.md`
- `frontend/README.md`
- `docker/README.md`
- `docs/`

Puntos fuertes:

- Arquitectura backend/frontend.
- API REST.
- Base de datos.
- Testing y CI.
- Postman.
- Docker.
- Guia de tecnologias y comandos para defensa.

## Conclusion

SquareStruct cumple la base exigida por el reto y presenta extras razonables para una defensa de DAW1.

La defensa debe ser honesta: V2 esta estabilizando el proyecto, pero checkout completo, facturacion real y diseno 3D pertenecen a fases posteriores.
