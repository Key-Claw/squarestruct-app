# Diagnostico De CI

Este documento complementa [`ci-github-actions.md`](ci-github-actions.md) con pautas para revisar fallos del workflow.

## Workflow Actual

Archivo:

```text
.github/workflows/tests.yml
```

Jobs:

- `backend-tests`
- `frontend-build`

El backend usa `npm ci`. El frontend usa `npm install` por compatibilidad con dependencias opcionales nativas del stack Vite/Rolldown en el estado actual del lock.

## Tecnologias Del Workflow

| Area | Tecnologia |
| --- | --- |
| Runner | `ubuntu-latest`. |
| Node | `20.19.0`. |
| Base de datos | MySQL `8.0` como servicio de GitHub Actions. |
| Backend | Express, mysql2, Jest y Supertest. |
| Frontend | React, Vite, Vitest, Testing Library, jsdom y ESLint. |
| Datos | `schema.sql` y `seeds.sql` cargados antes de ejecutar los tests de backend. |

## Comprobacion Local Rapida

Frontend:

```bash
cd frontend
npm install
npm run test:run
npm run lint
npm run build
```

Backend:

```bash
docker compose -f docker/docker-compose-dev.yml up -d
cd backend
npm ci
npm test
```

## Si Falla Backend

Revisar:

- MySQL levantado;
- `backend/db/schema.sql`;
- `backend/db/seeds.sql`;
- variables `DB_*`;
- `JWT_SECRET`;
- endpoints protegidos por `authMiddleware` o `adminMiddleware`;
- datos seed usados por tests.

## Si Falla Frontend

Revisar:

- version de Node (`20.19.0` en CI);
- dependencias instaladas;
- errores de Vitest;
- errores de ESLint;
- imports de assets;
- variables `VITE_API_URL`;
- errores de build de Vite.

## Lectura De Logs

El primer paso rojo suele indicar la causa real. Conviene revisar en este orden:

1. nombre del job;
2. paso exacto que falla;
3. primeras lineas del error;
4. si el error pertenece a instalacion, tests, lint o build;
5. cambios recientes en package, lock, tests o workflow.

## Criterio De Cierre

Un cambio se considera validado cuando:

- `backend-tests` pasa;
- `frontend-build` pasa;
- no hay cambios documentales contradictorios con el workflow;
- los comandos equivalentes se han comprobado localmente cuando sea posible.
