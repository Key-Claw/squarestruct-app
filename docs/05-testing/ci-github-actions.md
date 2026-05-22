# CI Con GitHub Actions

El workflow principal esta en `.github/workflows/tests.yml`. Se ejecuta en `push` y `pull_request` contra `dev` y `main`.

## Jobs

| Job | Objetivo |
| --- | --- |
| `backend-tests` | Levanta MySQL, carga schema/seeds, instala backend y ejecuta Jest. |
| `frontend-build` | Instala frontend, ejecuta Vitest, ESLint y build de Vite. |

## Version De Node

El workflow usa:

```yaml
env:
  NODE_VERSION: 20.19.0
```

Esta version evita problemas con dependencias modernas del frontend que requieren Node reciente.

## Tecnologias Usadas En El Workflow

| Area | Tecnologia |
| --- | --- |
| CI | GitHub Actions sobre `ubuntu-latest`. |
| Runtime | Node.js `20.19.0` con cache de npm por `package-lock.json`. |
| Base de datos | Servicio MySQL `8.0` con healthcheck y cliente `default-mysql-client`. |
| Backend | `npm ci`, Jest 29 y Supertest 7 contra Express 5 y MySQL. |
| Frontend | `npm install`, Vitest 4, Testing Library, jsdom, ESLint 10 y Vite 8. |
| Datos | `backend/db/schema.sql` y `backend/db/seeds.sql` cargados antes de los tests de integracion. |

## Backend

El job de backend usa MySQL como servicio temporal:

```yaml
services:
  mysql:
    image: mysql:8.0
```

Variables del job:

```text
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=ci_user
DB_PASSWORD=ci_password
DB_NAME=squarestruct_test
JWT_SECRET=ci_jwt_secret
NODE_ENV=test
```

Pasos principales:

1. checkout del repositorio;
2. setup de Node;
3. instalacion del cliente MySQL;
4. espera hasta que MySQL responda;
5. carga de `backend/db/schema.sql`;
6. carga de `backend/db/seeds.sql`;
7. `npm ci`;
8. `npm test`.

## Frontend

El job de frontend usa:

```text
VITE_API_URL=http://localhost:3000/api
```

Pasos:

1. checkout;
2. setup de Node;
3. `npm install`;
4. `npm run test:run`;
5. `npm run lint`;
6. `npm run build`.

Se usa `npm install` en frontend porque el lock actual puede resolver dependencias opcionales nativas de Vite/Rolldown de forma distinta segun plataforma. El backend mantiene `npm ci` porque su lock es estable en CI.

## Validacion Local Equivalente

Backend:

```bash
docker compose -f docker/docker-compose-dev.yml up -d
cd backend
npm test
```

Frontend:

```bash
cd frontend
npm run test:run
npm run lint
npm run build
```

## Fallos Habituales

| Paso | Posible causa |
| --- | --- |
| Wait for MySQL | Servicio no listo, credenciales incorrectas o puerto ocupado. |
| Load schema and seeds | SQL incompatible o datos duplicados. |
| Backend tests | Endpoint, permisos, datos seed o `JWT_SECRET`. |
| Frontend install | Dependencias/lock no sincronizados o dependencia opcional nativa. |
| Frontend tests | Renderizado, rutas o mocks. |
| Lint | Reglas ESLint incumplidas. |
| Build | Error de import, asset, Vite o variable de entorno. |
