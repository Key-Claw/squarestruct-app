# Backend SquareStruct

## Objetivo

El backend implementa la API REST de SquareStruct.

Se encarga de:

- Recibir peticiones del frontend.
- Validar datos.
- Gestionar usuarios, productos y pedidos.
- Conectarse con MySQL.
- Devolver respuestas JSON.

## Estructura

```text
backend/
  db/              Scripts SQL, seeds, migraciones y backups
  postman/         Colecciones para pruebas manuales
  src/
    config/        Configuración del backend
    controllers/   Lógica de entrada de las peticiones
    services/      Lógica reutilizable
    routes/        Endpoints de la API
    middlewares/   Autenticación y validaciones
    utils/         Funciones auxiliares
    app.js         Configuración de Express
  tests/           Tests unitarios e integración
  server.js        Punto de entrada
  package.json     Scripts y dependencias
```

## Requisitos

- Node.js.
- Docker Desktop o Docker Engine.
- MySQL si se quiere ejecutar sin Docker.

## Configurar entorno

Crear el archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

Variables importantes:

- `PORT`: puerto del backend.
- `DB_HOST`: host de MySQL.
- `DB_PORT`: puerto de MySQL.
- `DB_USER`: usuario de la base de datos.
- `DB_PASSWORD`: contraseña.
- `DB_NAME`: nombre de la base de datos.
- `JWT_SECRET`: clave para firmar tokens JWT.

## Levantar base de datos con Docker

Desde la raíz del repositorio:

```bash
docker compose -f docker/docker-compose.yml up -d
```

Esto levanta MySQL y carga los scripts de `backend/db/` cuando el volumen se crea por primera vez.

Si necesitas reiniciar la base de datos desde cero:

```bash
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up -d
```

## Instalar dependencias

Desde `backend/`:

```bash
npm install
```

## Arrancar backend

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

URL local:

```text
http://localhost:3000
```

## Tests

```bash
npm test
```

Tests unitarios:

```bash
npm run test:unit
```

Tests de integración:

```bash
npm run test:integration
```

## Idea clave

El backend es la capa intermedia entre frontend y base de datos. El frontend nunca accede directamente a MySQL.
