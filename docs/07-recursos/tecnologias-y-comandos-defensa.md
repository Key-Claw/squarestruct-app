# Tecnologias y comandos para defensa

## Objetivo

Este documento resume las tecnologias reales usadas en SquareStruct y los comandos principales para instalar, arrancar, validar y explicar el proyecto.

Esta pensado como chuleta de defensa para dos alumnos de DAW1: no sustituye a la documentacion tecnica completa, pero ayuda a tener una vision clara y ordenada.

## Vision general

SquareStruct es una aplicacion web separada en tres capas:

```text
Frontend React/Vite -> Backend Express -> MySQL
```

El frontend no accede directamente a la base de datos. Siempre llama a la API REST del backend.

## Tecnologias principales

| Parte | Tecnologia | Para que se usa |
| --- | --- | --- |
| Frontend | React | Crear la interfaz por componentes. |
| Frontend | Vite | Servidor de desarrollo y build de produccion. |
| Frontend | JavaScript + JSX | Logica e interfaz del cliente. |
| Frontend | Bootstrap | Base visual y componentes CSS. |
| Frontend | CSS propio | Estilos por paginas, componentes y responsive. |
| Backend | Node.js | Ejecutar JavaScript en servidor. |
| Backend | Express | Crear rutas REST y middlewares. |
| Backend | mysql2/promise | Conectar Node.js con MySQL usando promesas. |
| Backend | bcrypt | Hashear y comprobar contrasenas. |
| Backend | jsonwebtoken | Crear y validar tokens JWT. |
| Backend | dotenv | Cargar variables de entorno desde `.env`. |
| Backend | cors | Permitir peticiones entre frontend y backend. |
| Base de datos | MySQL 8.4 | Guardar usuarios, proveedores, productos, pedidos y detalles. |
| Testing backend | Jest | Ejecutar tests automaticos. |
| Testing backend | Supertest | Probar endpoints HTTP de Express. |
| Testing frontend | Vitest | Ejecutar tests de componentes React. |
| Testing frontend | Testing Library | Renderizar componentes en tests. |
| Calidad frontend | ESLint | Revisar reglas de codigo JavaScript/React. |
| Manual testing | Postman | Probar la API manualmente con colecciones. |
| Contenedores | Docker Compose | Levantar MySQL o el entorno completo. |
| CI | GitHub Actions | Validar tests, lint y build en pull requests. |
| Control de versiones | Git + GitHub | Ramas, commits, issues y pull requests. |

## Backend

El backend esta en `backend/`.

Responsabilidades:

- recibir peticiones HTTP;
- validar datos;
- comprobar JWT y roles;
- aplicar reglas de negocio;
- consultar o modificar MySQL;
- devolver respuestas JSON.

Comandos principales:

```bash
cd backend
npm install
npm run dev
npm start
npm test
npm run test:unit
npm run test:integration
npm.cmd audit --audit-level=high
```

Explicacion rapida:

| Comando | Uso |
| --- | --- |
| `npm install` | Instala dependencias. |
| `npm run dev` | Arranca backend con Nodemon para desarrollo. |
| `npm start` | Arranca backend con Node, pensado para ejecucion normal. |
| `npm test` | Ejecuta todos los tests backend. |
| `npm run test:unit` | Ejecuta tests unitarios. |
| `npm run test:integration` | Ejecuta tests de integracion con MySQL. |
| `npm.cmd audit --audit-level=high` | Revisa vulnerabilidades altas en Windows/PowerShell. |

En Windows se puede usar `npm.cmd` si PowerShell bloquea `npm.ps1`.

## Frontend

El frontend esta en `frontend/`.

Responsabilidades:

- mostrar paginas y componentes;
- gestionar navegacion interna;
- guardar sesion en cliente;
- llamar a la API;
- mostrar catalogo, carrito, perfil y vistas admin.

Comandos principales:

```bash
cd frontend
npm install
npm run dev
npm run test:run
npm run lint
npm run build
npm run preview
```

Explicacion rapida:

| Comando | Uso |
| --- | --- |
| `npm install` | Instala dependencias. |
| `npm run dev` | Arranca Vite en desarrollo. |
| `npm run test:run` | Ejecuta Vitest una vez, adecuado para CI y PR. |
| `npm run lint` | Ejecuta ESLint. |
| `npm run build` | Genera build de produccion en `dist/`. |
| `npm run preview` | Sirve localmente el build generado. |

`npm test` existe, pero deja Vitest en modo observacion. Para validar antes de una PR se usa `npm run test:run`.

## Base de datos

La base de datos usa MySQL y se define en:

```text
backend/db/schema.sql
backend/db/seeds.sql
backend/db/migrations/
backend/db/consultas.md
```

Tablas principales:

- `usuarios`;
- `proveedores`;
- `productos`;
- `pedidos`;
- `pedidoDetalles`.

Reglas importantes:

- las contrasenas se guardan hasheadas;
- los roles permitidos son `usuario` y `admin`;
- productos tiene tipo, material, precio y dimensiones;
- pedidos guarda estado y `fechaCancelacion`;
- la cancelacion de pedidos es logica, no borra datos.

## Docker

Modo recomendado para desarrollo:

```bash
docker compose -f docker/docker-compose-dev.yml up -d
```

Este modo levanta solo MySQL:

```text
MySQL Docker: localhost:3306
Backend local: http://localhost:3000
Frontend local: http://localhost:5173
```

Modo entorno completo:

```bash
docker compose -f docker/docker-compose.yml up --build
```

Este modo levanta MySQL, backend y frontend en contenedores:

```text
MySQL Docker: localhost:3307
Backend Docker: http://localhost:3001
Frontend Docker: http://localhost:5174
```

Comandos utiles:

```bash
docker compose -f docker/docker-compose-dev.yml ps
docker compose -f docker/docker-compose-dev.yml logs mysql
docker compose -f docker/docker-compose-dev.yml down
docker compose -f docker/docker-compose-dev.yml down -v
```

`down -v` borra el volumen de MySQL. Se usa solo cuando se quiere reconstruir la base desde cero.

## API REST

Endpoints principales:

| Endpoint | Uso |
| --- | --- |
| `GET /api/health` | Comprobar que backend responde. |
| `GET /api/db-status` | Comprobar conexion y tablas de MySQL. |
| `POST /api/usuarios/register` | Registrar usuario. |
| `POST /api/usuarios/login` | Iniciar sesion y obtener JWT. |
| `GET /api/perfil` | Consultar perfil autenticado. |
| `GET /api/productos` | Consultar catalogo. |
| `POST /api/productos` | Crear producto, solo admin. |
| `GET /api/pedidos` | Listar pedidos autenticados. |
| `POST /api/pedidos` | Crear pedido autenticado. |
| `GET /api/pedidos/:id` | Ver detalle, propietario o admin. |
| `PATCH /api/pedidos/:id/cancelar` | Cancelar logicamente, propietario o admin. |

Las rutas protegidas usan:

```text
Authorization: Bearer <token>
```

## Postman

Colecciones:

```text
backend/postman/squarestruct-mvp.postman_collection.json
backend/postman/squarestruct-v2.postman_collection.json
```

Variables importantes:

- `baseUrl`;
- `token`;
- `adminToken`;
- `idUsuario`;
- `idProducto`;
- `idPedido`.

Idea clave: Postman permite probar backend sin depender del frontend.

## GitHub Actions

Workflow:

```text
.github/workflows/tests.yml
```

Jobs:

| Job | Que valida |
| --- | --- |
| `backend-tests` | MySQL, schema, seeds y tests backend. |
| `frontend-build` | Tests frontend, lint y build. |

Comandos equivalentes en local:

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

## Seguridad basica explicable

- Las contrasenas se guardan con bcrypt.
- El login genera JWT.
- Las rutas privadas usan `authMiddleware`.
- Las rutas admin usan `adminMiddleware`.
- La escritura de productos requiere rol `admin`.
- La cancelacion de pedidos requiere propietario o admin.
- No se imprimen contrasenas de base de datos por consola.
- Los JWT de Postman se manejan con variables, no hardcodeados.

## Comandos de Git utiles

```bash
git status --short
git status -sb
git log --oneline --decorate -10
git diff --check
git add <archivo>
git commit -m "tipo(scope): mensaje"
git push origin <rama>
```

Uso:

- `git status --short`: ver cambios pendientes.
- `git status -sb`: ver rama y si hay commits por subir.
- `git log --oneline`: revisar commits.
- `git diff --check`: detectar errores de espacios antes de commit.

## Como defenderlo en una frase

SquareStruct es una aplicacion web por capas: React/Vite en frontend, Express en backend y MySQL como base de datos. La V2 refuerza permisos, pedidos, testing, Postman, documentacion y CI sobre la base funcional del MVP v1.

## Checklist antes de entregar

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

```bash
git diff --check
git status -sb
```

Despues de push, revisar que GitHub Actions aparece en verde.
