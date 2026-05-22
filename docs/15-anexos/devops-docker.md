# Documentacion DevOps Docker

Este documento resume la parte DevOps local del proyecto y se conecta con la guia de AWS EC2.

## Modos De Ejecucion

| Modo | Archivo | Cuando usarlo |
| --- | --- | --- |
| Desarrollo | `docker/docker-compose-dev.yml` | Backend y frontend en local, MySQL en Docker. |
| Completo | `docker/docker-compose.yml` | MySQL, backend y frontend en Docker. |

## Desarrollo Local

```bash
docker compose -f docker/docker-compose-dev.yml up -d
cd backend
npm run dev
cd ../frontend
npm run dev
```

Puertos:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3000
MySQL:    localhost:3306
```

En este modo, `backend/.env` debe usar:

```text
DB_HOST=localhost
DB_PORT=3306
```

## Entorno Completo

```bash
docker compose -f docker/docker-compose.yml up -d --build
```

Puertos:

```text
Frontend: http://localhost:5174
Backend:  http://localhost:3001
MySQL:    localhost:3307
```

En este modo, el backend usa:

```text
DB_HOST=mysql
DB_PORT=3306
```

## Flujo De Integracion Docker

1. MySQL arranca con volumen persistente.
2. MySQL carga schema y seeds si el volumen esta vacio.
3. Backend espera al healthcheck de MySQL.
4. Backend expone API en el puerto interno `3000`, publicado como `3001`.
5. Frontend se sirve con Vite en `5173`, publicado como `5174`.
6. El navegador llama a la API configurada en `VITE_API_URL`.

## Persistencia

Los volumenes Docker guardan los datos de MySQL:

- `squarestruct_mysql_data_dev` para desarrollo.
- `squarestruct_mysql_data` para entorno completo.

Para reiniciar sin borrar datos:

```bash
docker compose -f docker/docker-compose.yml down
docker compose -f docker/docker-compose.yml up -d --build
```

Para borrar datos y recargar schema/seeds:

```bash
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up -d --build
```

## Comprobaciones

```bash
docker compose -f docker/docker-compose.yml ps
docker compose -f docker/docker-compose.yml logs backend
docker compose -f docker/docker-compose.yml logs frontend
docker compose -f docker/docker-compose.yml logs mysql
```

URLs:

```text
http://localhost:5174
http://localhost:3001/api/health
http://localhost:3001/api/db-status
```

## Como Defenderlo

Docker no cambia la aplicacion. Solo empaqueta sus servicios para ejecutarlos de forma repetible. Para DAW1, lo importante es saber explicar puertos, variables, volumenes y conexion entre contenedores.
