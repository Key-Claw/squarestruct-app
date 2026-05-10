# Docker SquareStruct

## Objetivo

La carpeta `docker/` contiene la configuración necesaria para levantar servicios de infraestructura del proyecto.

Actualmente se usa principalmente para arrancar MySQL.

## Requisitos por sistema operativo

Los comandos para usar Docker en este proyecto son los mismos en Windows, macOS y Linux. Lo que cambia es la instalación previa de Docker.

### Windows

Antes de ejecutar los comandos, asegúrate de tener:

- Docker Desktop instalado en Windows.
- Docker Desktop abierto y en ejecución.
- WSL 2 habilitado si Docker Desktop lo solicita.
- El repositorio clonado en una carpeta local de Windows.

### macOS

Antes de ejecutar los comandos, asegúrate de tener:

- Docker Desktop instalado en el Mac.
- Docker Desktop abierto y en ejecución.
- El repositorio clonado en una carpeta local del Mac.

### Linux

En Ubuntu y Fedora puedes usar Docker Engine o Docker Desktop.

Si el comando falla por permisos, puede que necesites añadir tu usuario al grupo `docker`:

```bash
sudo usermod -aG docker $USER
```

Después cierra sesión y vuelve a entrar para que el cambio tenga efecto.

## Comprobar Docker

En cualquier sistema operativo, puedes comprobar que Docker está funcionando con:

```bash
docker info
```

## Levantar servicios

Desde la raíz del repositorio:

```bash
docker compose -f docker/docker-compose.yml up -d
```

Este comando:

- descarga la imagen `mysql:8.4` si no existe todavía;
- crea el contenedor `squarestruct-mysql`;
- crea automáticamente el volumen de Docker para guardar los datos de MySQL;
- ejecuta `schema.sql` y `seeds.sql` solo la primera vez, cuando la base de datos está vacía.

No tienes que crear el volumen manualmente. Docker Compose lo crea automáticamente la primera vez que levantas el servicio.

## Comprobar que se ha creado correctamente

Ver servicios levantados:

```bash
docker compose -f docker/docker-compose.yml ps
```

Ver contenedores:

```bash
docker ps -a
```

Ver volúmenes:

```bash
docker volume ls
```

El volumen puede aparecer con un nombre parecido a:

```text
docker_squarestruct_mysql_data
```

El prefijo puede cambiar según el nombre de la carpeta o del proyecto de Docker Compose.

## Parar servicios

```bash
docker compose -f docker/docker-compose.yml down
```

## Reiniciar la base de datos desde cero

Si cambias `schema.sql` o `seeds.sql`, puede que necesites borrar el volumen anterior para que MySQL vuelva a ejecutar los scripts iniciales.

```bash
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up -d
```

El parámetro `-v` elimina el volumen de datos. Úsalo solo si quieres reconstruir la base de datos desde cero.

## Comprobar logs

```bash
docker logs squarestruct-mysql
```

## Acceso a MySQL

Según la configuración del `docker-compose.yml`, MySQL se expone en el puerto local correspondiente.

También puedes entrar al contenedor:

```bash
docker exec -it squarestruct-mysql mysql -uadmin -p
```

Cuando pida la contraseña, usa la definida en `docker/docker-compose.yml`.

## Problemas comunes

Si aparece un error parecido a:

```text
context deadline exceeded
```

normalmente significa que Docker no ha podido descargar la imagen por red lenta o inestable. Puedes volver a ejecutar:

```bash
docker compose -f docker/docker-compose.yml up -d
```

O descargar primero la imagen:

```bash
docker pull mysql:8.4
```

## Nota para AWS

Estos comandos están pensados para desarrollo local. Si el proyecto se levanta en AWS, la inicialización con Docker Compose puede ser parecida, pero habrá que revisar la configuración de red, puertos, variables de entorno y persistencia de datos.

En AWS no conviene depender de una base de datos dentro de un contenedor sin planificar bien el volumen o el servicio de almacenamiento. Para producción suele ser mejor usar un servicio gestionado como Amazon RDS para MySQL.

## Idea clave

Docker ayuda a que todos puedan usar una base de datos parecida sin instalar MySQL manualmente en su equipo.
