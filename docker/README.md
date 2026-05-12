# Docker SquareStruct

## Objetivo

La carpeta `docker/` contiene la configuracion Docker del proyecto SquareStruct.

Actualmente hay dos formas principales de uso:

- `docker-compose.yml`: levanta el entorno completo con MySQL, backend y frontend en contenedores.
- `docker-compose-dev.yml`: levanta solo MySQL para trabajar con backend y frontend en local.

## Requisitos

Antes de ejecutar los comandos, asegurese de tener:

- Docker instalado.
- Docker Desktop abierto y en ejecucion si usa Windows o macOS.
- El repositorio clonado en una carpeta local.
- Node.js instalado si va a usar el modo de desarrollo local con `docker-compose-dev.yml`.

En Linux, si Docker falla por permisos, puede que necesite anadir su usuario al grupo `docker`:

```bash
sudo usermod -aG docker $USER
```

Despues cierre sesion y vuelva a entrar para que el cambio tenga efecto.

## Comprobar Docker

Desde cualquier sistema operativo:

```bash
docker info
```

Si el comando responde con informacion del motor de Docker, puede continuar.

## Opcion recomendada para desarrollo local

Para trabajar comodamente tocando codigo de React o Express, use `docker-compose-dev.yml`.

Este archivo levanta solo MySQL en Docker. El backend y el frontend se ejecutan en local con `npm run dev`, por lo que los cambios se ven sin reconstruir imagenes Docker.

Desde la raiz del repositorio:

```bash
docker compose -f docker/docker-compose-dev.yml up -d
```

Despues arranque el backend en otra terminal:

```bash
cd backend
npm run dev
```

Y el frontend en otra terminal:

```bash
cd frontend
npm run dev
```

Puertos en este modo:

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

### Reiniciar la BD de desarrollo desde cero

Use este comando solo si quiere borrar los datos del volumen de desarrollo:

```bash
docker compose -f docker/docker-compose-dev.yml down -v
docker compose -f docker/docker-compose-dev.yml up -d
```

El volumen usado por este modo es:

```text
squarestruct_mysql_data_dev
```

## Levantar el proyecto completo con Docker

Si quiere levantar frontend, backend y MySQL dentro de Docker:

```bash
docker compose -f docker/docker-compose.yml up --build
```

Este comando:

- construye la imagen del backend desde `backend/Dockerfile`;
- construye la imagen del frontend desde `frontend/Dockerfile`;
- descarga la imagen `mysql:8.4` si no existe en local;
- crea el contenedor `squarestruct-mysql`;
- crea el contenedor `squarestruct-backend`;
- crea el contenedor `squarestruct-frontend`;
- crea un volumen para persistir los datos de MySQL;
- ejecuta `backend/db/schema.sql` y `backend/db/seeds.sql` la primera vez que la base de datos esta vacia.

Puertos en este modo:

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

No se usa `localhost` dentro del contenedor porque `localhost` apuntaria al propio contenedor del backend, no al contenedor de base de datos.

### Parar el entorno completo

```bash
docker compose -f docker/docker-compose.yml down
```

### Reiniciar la BD del entorno completo desde cero

Use este comando solo si quiere borrar los datos del volumen del entorno completo:

```bash
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up --build
```

El volumen usado por este modo es:

```text
squarestruct_mysql_data
```

## MySQL

MySQL se levanta con la imagen:

```text
mysql:8.4
```

La base de datos inicial se crea con:

```text
MYSQL_DATABASE=squarestruct
MYSQL_USER=admin
```

Los scripts iniciales se montan en:

```text
/docker-entrypoint-initdb.d/
```

MySQL solo ejecuta esos scripts automaticamente cuando el volumen de datos esta vacio.

## Comprobar contenedores

Ver el estado de los servicios:

```bash
docker compose -f docker/docker-compose-dev.yml ps
```

O, si usa el entorno completo:

```bash
docker compose -f docker/docker-compose.yml ps
```

Ver todos los contenedores:

```bash
docker ps -a
```

Ver volumenes:

```bash
docker volume ls
```

## Ver logs

Logs de MySQL en modo desarrollo:

```bash
docker compose -f docker/docker-compose-dev.yml logs mysql
```

Logs del entorno completo:

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

## Acceso manual a MySQL

Entrar al cliente MySQL dentro del contenedor:

```bash
docker exec -it squarestruct-mysql mysql -uadmin -p
```

Cuando pida la contrasena, use la definida en el compose:

```text
20doblajepuro37
```

Comprobar tablas:

```sql
SHOW TABLES;
```

## Diferencia entre los dos modos

| Modo | Archivo | Uso recomendado | Frontend | Backend | MySQL |
| --- | --- | --- | --- | --- | --- |
| Desarrollo local | `docker-compose-dev.yml` | Programar con hot reload | Local `5173` | Local `3000` | Docker `3306` |
| Docker completo | `docker-compose.yml` | Probar todo en contenedores | Docker `5174` | Docker `3001` | Docker `3307` |

Para el trabajo diario, normalmente es mas comodo usar `docker-compose-dev.yml`.

Para comprobar que el proyecto puede levantarse completo sin instalar Node.js, use `docker-compose.yml`.

## Problemas comunes

### No veo cambios en el frontend

Si esta entrando en:

```text
http://localhost:5174
```

esta usando el frontend dentro de Docker. Para desarrollo con cambios en caliente, use:

```text
http://localhost:5173
```

y arranque el frontend con:

```bash
cd frontend
npm run dev
```

### El backend no conecta con MySQL en local

Si usa `docker-compose-dev.yml`, revise `backend/.env`:

```text
DB_HOST=localhost
DB_PORT=3306
```

Si usa `docker-compose.yml`, dentro del contenedor debe ser:

```text
DB_HOST=mysql
DB_PORT=3306
```

### Los cambios en schema.sql o seeds.sql no aparecen

MySQL solo ejecuta los scripts iniciales cuando el volumen esta vacio.

Para modo desarrollo:

```bash
docker compose -f docker/docker-compose-dev.yml down -v
docker compose -f docker/docker-compose-dev.yml up -d
```

Para entorno completo:

```bash
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up --build
```

### Error de descarga de imagen

Si aparece un error parecido a:

```text
context deadline exceeded
```

normalmente significa que Docker no ha podido descargar una imagen por red lenta o inestable. Puede volver a ejecutar el comando o descargar primero la imagen:

```bash
docker pull mysql:8.4
```

## Nota para AWS

Esta configuracion Docker esta pensada para desarrollo local. En un futuro despliegue en AWS habra que revisar red, puertos, variables de entorno, secretos y persistencia de datos.

Para produccion no conviene depender de una base de datos dentro de un contenedor sin planificar bien almacenamiento, backups y recuperacion. Normalmente seria mejor usar un servicio gestionado como Amazon RDS para MySQL.
