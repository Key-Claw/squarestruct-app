# Integracion continua con GitHub Actions

## Objetivo

Este documento explica el workflow de integracion continua del proyecto.

La CI sirve para comprobar automaticamente que el backend y el frontend siguen funcionando antes de fusionar cambios en las ramas principales.

## Archivo del workflow

El workflow esta definido en:

```text
.github/workflows/tests.yml
```

## Cuando se ejecuta

El workflow se lanza automaticamente en:

- `push` hacia `dev` o `main`;
- `pull_request` hacia `dev` o `main`.

## Jobs actuales

| Job | Que comprueba |
| --- | --- |
| `backend-tests` | Levanta MySQL, carga schema/seeds y ejecuta los tests del backend. |
| `frontend-build` | Ejecuta lint y build del frontend React/Vite. |

## Backend

El job `backend-tests` usa un runner Linux limpio y levanta un servicio MySQL con la imagen:

```text
mysql:8.4
```

Despues realiza estos pasos:

1. Descarga el codigo del repositorio.
2. Configura Node.js 20.
3. Instala el cliente de MySQL en el runner.
4. Espera a que MySQL este listo.
5. Carga `backend/db/schema.sql`.
6. Carga `backend/db/seeds.sql`.
7. Instala las dependencias dentro de `backend/`.
8. Ejecuta `npm test`.

El script `npm test` ejecuta Jest con los tests unitarios e integracion disponibles.

## Frontend

El job `frontend-build` trabaja dentro de `frontend/` y realiza estos pasos:

1. Descarga el codigo del repositorio.
2. Configura Node.js 20.
3. Instala las dependencias del frontend.
4. Ejecuta `npm run lint`.
5. Ejecuta `npm run build`.

`npm run lint` comprueba reglas basicas de calidad en JavaScript/React.

`npm run build` comprueba que la aplicacion React puede compilarse correctamente con Vite.

## Secrets necesarios

El workflow usa variables guardadas como GitHub Secrets:

| Secret | Uso |
| --- | --- |
| `DB_HOST` | Host de MySQL usado por el backend durante la CI. |
| `DB_PORT` | Puerto de MySQL usado por el backend durante la CI. |
| `DB_USER` | Usuario de MySQL. |
| `DB_PASSWORD` | Password de MySQL. |
| `DB_NAME` | Nombre de la base de datos. |
| `JWT_SECRET` | Clave usada para firmar tokens durante los tests. |

Para el entorno de CI, los valores habituales son:

```text
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=admin
DB_NAME=squarestruct
```

`DB_PASSWORD` y `JWT_SECRET` deben configurarse en GitHub como secretos del repositorio.

## Resultado esperado

La pull request debe mostrar el estado del workflow en GitHub.

Para considerar correcta la CI:

- `backend-tests` debe terminar en verde;
- `frontend-build` debe terminar en verde;
- el estado debe aparecer en la pull request antes de fusionar.

## Limitaciones actuales

La CI valida el backend con tests automatizados y el frontend con lint/build.

Todavia no existen tests automatizados especificos de componentes React. Esa mejora se puede anadir mas adelante con Vitest y Testing Library si el frontend gana mas logica interactiva.
