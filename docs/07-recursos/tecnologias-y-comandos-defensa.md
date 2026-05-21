# Tecnologias Y Comandos

Resumen rapido de tecnologias, comandos y comprobaciones de SquareStruct V2.

## Tecnologias

| Area | Tecnologia | Uso |
| --- | --- | --- |
| Frontend | React | Componentes y estado de la SPA. |
| Frontend | Vite | Desarrollo, proxy y build. |
| Frontend | React Router DOM | Rutas con `HashRouter`. |
| Frontend | Bootstrap | Grid, formularios, tablas y utilidades. |
| Frontend | SweetAlert2 | Confirmaciones y alertas. |
| Backend | Node.js | Entorno de ejecucion. |
| Backend | Express | API REST. |
| Backend | mysql2/promise | Conexion MySQL con `async/await`. |
| Backend | bcrypt | Hash de contrasenas. |
| Backend | jsonwebtoken | JWT. |
| Backend | dotenv | Variables de entorno. |
| Backend | CORS | Separacion frontend/backend. |
| Base de datos | MySQL/MariaDB | Persistencia relacional. |
| Testing | Jest + Supertest | Tests backend. |
| Testing | Vitest + Testing Library | Tests frontend. |
| DevOps | Docker Compose | MySQL local y entorno completo. |
| CI | GitHub Actions | Tests, lint y build. |
| Manual | Postman | Pruebas manuales de API. |

## Comandos Backend

```bash
cd backend
npm install
npm run dev
npm test
npm run test:unit
npm run test:integration
```

## Comandos Frontend

```bash
cd frontend
npm install
npm run dev
npm run test:run
npm run lint
npm run build
```

## Docker

Desarrollo con MySQL:

```bash
docker compose -f docker/docker-compose-dev.yml up -d
```

Entorno completo:

```bash
docker compose -f docker/docker-compose.yml up --build
```

## URLs Locales

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3000
Health:   http://localhost:3000/api/health
DB:       http://localhost:3000/api/db-status
```

## Endpoints Clave

```text
POST   /api/usuarios/register
POST   /api/usuarios/login
GET    /api/perfil
GET    /api/productos
POST   /api/productos
GET    /api/orders
POST   /api/orders
GET    /api/orders/admin/todos
PATCH  /api/orders/:id/estado
PATCH  /api/orders/:id/cancelar
```

## Checklist Tecnico

- Backend arranca.
- MySQL carga `schema.sql` y `seeds.sql`.
- Login devuelve JWT.
- Catalogo carga productos.
- Checkout crea pedido.
- Usuario ve facturas.
- Admin ve usuarios.
- Admin ve facturacion y cambia estados.
- Tests backend pasan.
- Tests frontend pasan.
- Lint frontend pasa.
- Build frontend pasa.
