# Docker SquareStruct

## Objetivo

La carpeta `docker/` contiene la configuracion Docker del proyecto.

Hay dos modos de uso:

| Archivo | Uso | Servicios |
| --- | --- | --- |
| `docker-compose-dev.yml` | Desarrollo diario con backend y frontend en local | MySQL |
| `docker-compose.yml` | Prueba del entorno completo en contenedores | MySQL, backend y frontend |

## Requisitos

- Docker instalado.
- Docker Desktop abierto si se usa Windows o macOS.
- Repositorio clonado.
- Node.js instalado si se usa el modo de desarrollo con `docker-compose-dev.yml`.

## Desarrollo local recomendado

Este modo levanta solo MySQL en Docker. El backend y el frontend se ejecutan en local con `npm run dev`, lo que permite ver cambios sin reconstruir imagenes.

Desde la raiz del repositorio:

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

Puertos en desarrollo:

```text
Frontend local: http://localhost:5173
Backend local:  http://localhost:3000
Health:         http://localhost:3000/api/health
DB check:       http://localhost:3000/api/db-status
MySQL Docker:   localhost:3306
```

En este modo, `backend/.env` debe apuntar a MySQL local:

```text
DB_HOST=localhost
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=20doblajepuro37
DB_NAME=squarestruct
```

### Parar MySQL de desarrollo

```bash
docker compose -f docker/docker-compose-dev.yml down
```

### Reiniciar la base de datos de desarrollo

Este comando borra el volumen de desarrollo y vuelve a cargar `schema.sql` y `seeds.sql`.

```bash
docker compose -f docker/docker-compose-dev.yml down -v
docker compose -f docker/docker-compose-dev.yml up -d
```

## Entorno completo con Docker

Este modo levanta frontend, backend y MySQL dentro de contenedores.

```bash
docker compose -f docker/docker-compose.yml up --build
```

Puertos en Docker completo:

```text
Frontend Docker: http://localhost:5174
Backend Docker:  http://localhost:3001
Health:          http://localhost:3001/api/health
DB check:        http://localhost:3001/api/db-status
MySQL Docker:    localhost:3307
```

Dentro de Docker, el backend se conecta a MySQL usando el nombre del servicio:

```text
DB_HOST=mysql
DB_PORT=3306
```

No se usa `localhost` dentro del contenedor porque `localhost` apuntaria al propio contenedor del backend.

### Parar entorno completo

```bash
docker compose -f docker/docker-compose.yml down
```

### Reiniciar la base de datos del entorno completo

```bash
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up --build
```

## Comprobar contenedores

Modo desarrollo:

```bash
docker compose -f docker/docker-compose-dev.yml ps
```

Modo completo:

```bash
docker compose -f docker/docker-compose.yml ps
```

Todos los contenedores:

```bash
docker ps -a
```

Volumenes:

```bash
docker volume ls
```

## Ver logs

MySQL en desarrollo:

```bash
docker compose -f docker/docker-compose-dev.yml logs mysql
```

Todos los servicios del entorno completo:

```bash
docker compose -f docker/docker-compose.yml logs
```

Solo backend:

```bash
docker compose -f docker/docker-compose.yml logs backend
```

Solo frontend:

```bash
docker compose -f docker/docker-compose.yml logs frontend
```

Solo MySQL:

```bash
docker compose -f docker/docker-compose.yml logs mysql
```

## Acceso manual a MySQL

```bash
docker exec -it squarestruct-mysql mysql -uadmin -p
```

La contrasena local definida en los compose es:

```text
20doblajepuro37
```

Comprobar tablas:

```sql
SHOW TABLES;
```

## Validacion recomendada

En desarrollo local:

```text
http://localhost:5173
http://localhost:3000/api/health
http://localhost:3000/api/db-status
```

En entorno completo Docker:

```text
http://localhost:5174
http://localhost:3001/api/health
http://localhost:3001/api/db-status
```

Resultado esperado:

- el frontend carga correctamente;
- `/api/health` responde `OK`;
- `/api/db-status` devuelve informacion de tablas y totales.

## AWS

Esta configuracion Docker sirve como base local y como referencia para un despliegue futuro, pero AWS requerira revisar:

- variables de entorno;
- secretos;
- red y puertos;
- HTTPS;
- persistencia de datos;
- backups.

En un despliegue real, lo mas razonable seria separar servicios:

```text
Frontend -> S3/CloudFront o contenedor
Backend  -> ECS, EC2, App Runner u otro servicio
MySQL    -> Amazon RDS
```

## Problemas comunes

### Los cambios de schema.sql o seeds.sql no aparecen

MySQL solo ejecuta los scripts iniciales cuando el volumen esta vacio. Reinicie con `down -v` en el modo que este usando.

### El backend no conecta con MySQL

Revise `DB_HOST`:

- desarrollo local con `docker-compose-dev.yml`: `localhost`;
- backend dentro de `docker-compose.yml`: `mysql`.

### Error al descargar imagenes

Si aparece `context deadline exceeded`, suele ser un problema temporal de red. Puede reintentar o descargar primero la imagen:

```bash
docker pull mysql:8.4
```

## Idea clave

Para trabajar en clase y desarrollar con rapidez, use `docker-compose-dev.yml`. Para comprobar que todo el proyecto puede arrancar en contenedores, use `docker-compose.yml`.
