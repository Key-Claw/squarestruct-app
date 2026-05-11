# Docker SquareStruct

## Objetivo

La carpeta `docker/` contiene la configuración necesaria para levantar el entorno local completo de SquareStruct mediante Docker Compose.

El entorno se divide en tres servicios independientes:

- `frontend`: aplicación React/Vite.
- `backend`: API Node.js/Express.
- `mysql`: base de datos MySQL 8.4.

La idea es que cualquier persona del equipo pueda arrancar el proyecto sin instalar Node.js ni MySQL directamente en su equipo.

## Requisitos

Antes de ejecutar los comandos, asegúrese de tener:

- Docker instalado.
- Docker Desktop abierto y en ejecución si usa Windows o macOS.
- El repositorio clonado en una carpeta local.

En Linux, si Docker falla por permisos, puede que necesite añadir su usuario al grupo `docker`:

```bash
sudo usermod -aG docker $USER
```

Después cierre sesión y vuelva a entrar para que el cambio tenga efecto.

## Comprobar Docker

Desde cualquier sistema operativo:

```bash
docker info
```

Si el comando responde con información del motor de Docker, puede continuar.

## Levantar el proyecto completo

Desde la raíz del repositorio:

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
- ejecuta `backend/db/schema.sql` y `backend/db/seeds.sql` la primera vez que la base de datos está vacía.

## Puertos disponibles

Cuando los contenedores estén levantados:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3000
Health:   http://localhost:3000/api/health
DB check: http://localhost:3000/api/db-status
MySQL:    localhost:3306
```

## Servicios

### Frontend

El frontend se ejecuta con Vite dentro del contenedor:

```bash
npm run dev -- --host 0.0.0.0
```

Se usa `--host 0.0.0.0` para que Vite sea accesible desde el navegador del equipo anfitrión.

La variable principal es:

```text
VITE_API_URL=http://localhost:3000/api
```

### Backend

El backend se ejecuta con:

```bash
npm start
```

Dentro de Docker, el backend se conecta a MySQL usando el nombre del servicio:

```text
DB_HOST=mysql
```

No se usa `localhost` dentro del contenedor porque `localhost` apuntaría al propio contenedor del backend, no al contenedor de base de datos.

### MySQL

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

MySQL solo ejecuta esos scripts automáticamente cuando el volumen de datos está vacío.

## Comprobar contenedores

Ver el estado de los servicios:

```bash
docker compose -f docker/docker-compose.yml ps
```

Ver todos los contenedores:

```bash
docker ps -a
```

Ver volúmenes:

```bash
docker volume ls
```

El volumen de datos puede aparecer con un nombre parecido a:

```text
docker_squarestruct_mysql_data
```

El prefijo puede cambiar según el nombre del proyecto de Docker Compose.

## Ver logs

Todos los servicios:

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

## Parar servicios

```bash
docker compose -f docker/docker-compose.yml down
```

Este comando para y elimina los contenedores, pero conserva el volumen de MySQL.

## Reiniciar la base de datos desde cero

Si cambia `schema.sql` o `seeds.sql`, puede que necesite borrar el volumen anterior para que MySQL vuelva a ejecutar los scripts iniciales.

```bash
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up --build
```

El parámetro `-v` elimina el volumen de datos. Úselo solo si quiere reconstruir la base de datos desde cero.

## Acceso manual a MySQL

Entrar al cliente MySQL dentro del contenedor:

```bash
docker exec -it squarestruct-mysql mysql -uadmin -p
```

Cuando pida la contraseña, use la definida en `docker/docker-compose.yml`.

## Validación recomendada

Después de levantar el entorno, compruebe:

```text
http://localhost:5173
http://localhost:3000/api/health
http://localhost:3000/api/db-status
```

Resultado esperado:

- el frontend carga correctamente;
- `/api/health` responde `OK`;
- `/api/db-status` devuelve información de tablas y totales de la base de datos.

## Problemas comunes

### El frontend no carga

Compruebe los logs:

```bash
docker compose -f docker/docker-compose.yml logs frontend
```

Revise también que el puerto `5173` no esté ocupado por otro proceso.

### El backend no conecta con MySQL

Compruebe que `DB_HOST` tenga el valor:

```text
mysql
```

También puede revisar los logs:

```bash
docker compose -f docker/docker-compose.yml logs backend
docker compose -f docker/docker-compose.yml logs mysql
```

### Los cambios en schema.sql o seeds.sql no aparecen

MySQL solo ejecuta los scripts iniciales cuando el volumen está vacío. Reinicie la base de datos con:

```bash
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up --build
```

### Error de descarga de imagen

Si aparece un error parecido a:

```text
context deadline exceeded
```

normalmente significa que Docker no ha podido descargar una imagen por red lenta o inestable. Puede volver a ejecutar:

```bash
docker compose -f docker/docker-compose.yml up --build
```

O descargar primero la imagen de MySQL:

```bash
docker pull mysql:8.4
```

## Nota para AWS

Esta configuración está pensada para desarrollo local. En un futuro despliegue en AWS habrá que revisar red, puertos, variables de entorno, secretos y persistencia de datos.

Para producción no conviene depender de una base de datos dentro de un contenedor sin planificar bien almacenamiento, backups y recuperación. Normalmente sería mejor usar un servicio gestionado como Amazon RDS para MySQL.
