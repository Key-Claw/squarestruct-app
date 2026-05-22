# Docker SquareStruct

## Objetivo

La carpeta `docker/` contiene la configuracion Docker del proyecto.

Hay dos modos de uso:

| Archivo | Uso | Servicios |
| --- | --- | --- |
| `docker-compose-dev.yml` | Desarrollo diario con backend/frontend en local | MySQL |
| `docker-compose.yml` | Despliegue EC2 y prueba completa | nginx proxy, frontend, backend, MySQL |

## Desarrollo Local Recomendado

Este modo levanta solo MySQL en Docker. Backend y frontend se ejecutan con `npm run dev`.

```bash
docker compose -f docker/docker-compose-dev.yml up -d
```

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Puertos:

```text
Frontend local: http://localhost:5173
Backend local:  http://localhost:3000
MySQL Docker:   localhost:3306
```

## Entorno Completo Con Proxy

Este modo es el que se usa para AWS EC2. Solo publica el puerto `80`.

```bash
cp docker/.env.example docker/.env
docker compose -f docker/docker-compose.yml --env-file docker/.env up -d --build
```

Puertos:

```text
Frontend publico: http://localhost
Backend publico:  http://localhost/api/health
MySQL:            interno, sin puerto publico
```

Servicios internos:

| Servicio | Puerto interno | Puerto publico |
| --- | --- | --- |
| `proxy` | `80` | `80` |
| `frontend` | `80` | ninguno |
| `backend` | `3000` | ninguno |
| `mysql` | `3306` | ninguno |

## Idea De Red

El navegador entra por nginx:

```text
http://IP_EC2       -> proxy -> frontend
http://IP_EC2/api   -> proxy -> backend
backend -> mysql    -> red Docker interna
```

Asi se evitan problemas de CORS y no se exponen directamente backend ni MySQL.

## Variables

Copia `docker/.env.example` como `docker/.env` y cambia secretos:

```text
MYSQL_ROOT_PASSWORD
DB_NAME
DB_USER
DB_PASSWORD
JWT_SECRET
VITE_API_URL=
CORS_ORIGIN=
```

En produccion con nginx, `VITE_API_URL` debe quedarse vacio para que el frontend use `/api`.

## Comprobaciones

```bash
docker compose -f docker/docker-compose.yml --env-file docker/.env ps
docker compose -f docker/docker-compose.yml --env-file docker/.env logs proxy
docker compose -f docker/docker-compose.yml --env-file docker/.env logs backend
docker compose -f docker/docker-compose.yml --env-file docker/.env logs mysql
```

URLs:

```text
http://localhost
http://localhost/api/health
http://localhost/api/db-status
```

## Persistencia

MySQL usa el volumen `squarestruct_mysql_data`.

Reiniciar sin borrar datos:

```bash
docker compose -f docker/docker-compose.yml --env-file docker/.env down
docker compose -f docker/docker-compose.yml --env-file docker/.env up -d --build
```

Reiniciar desde cero:

```bash
docker compose -f docker/docker-compose.yml --env-file docker/.env down -v
docker compose -f docker/docker-compose.yml --env-file docker/.env up -d --build
```

## HTTPS Futuro

El compose deja comentado el puerto `443`. Para activarlo hacen falta certificados y un bloque SSL en `docker/nginx/nginx.conf`.

## Como Defenderlo

Docker empaqueta cada capa. nginx es la entrada publica, React queda como estatico, Express queda interno y MySQL no se publica. Es una solucion simple y defendible para DAW.
