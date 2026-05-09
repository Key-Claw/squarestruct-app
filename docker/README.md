# Docker SquareStruct

## Objetivo

La carpeta `docker/` contiene la configuración necesaria para levantar servicios de infraestructura del proyecto.

Actualmente se usa principalmente para arrancar MySQL.

## Windows

### Requisitos

Antes de ejecutar los comandos, asegúrate de tener:

- Docker Desktop instalado en Windows.
- Docker Desktop abierto y en ejecución.
- El repositorio clonado en una carpeta local de Windows.
- WSL 2 habilitado si Docker Desktop lo solicita.

Puedes comprobar que Docker responde con:

```bash
docker info
```

### Levantar servicios

Desde la raíz del repositorio:

```bash
docker compose -f docker/docker-compose.yml up -d
```

Este comando crea el contenedor `squarestruct-mysql` y un volumen de Docker para guardar los datos de MySQL.

No tienes que crear el volumen manualmente. Docker Compose lo crea automáticamente la primera vez que levantas el servicio.

### Comprobar que se ha creado correctamente

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

### Parar servicios

```bash
docker compose -f docker/docker-compose.yml down
```

### Reiniciar la base de datos desde cero

Si cambias `schema.sql` o `seeds.sql`, puede que necesites borrar el volumen anterior para que MySQL vuelva a ejecutar los scripts iniciales.

```bash
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up -d
```

El parámetro `-v` elimina el volumen de datos. Úsalo solo si quieres reconstruir la base de datos desde cero.

### Comprobar logs

```bash
docker logs squarestruct-mysql
```

### Acceso a MySQL

Según la configuración del `docker-compose.yml`, MySQL se expone en el puerto local correspondiente.

También puedes entrar al contenedor:

```bash
docker exec -it squarestruct-mysql mysql -uadmin -p
```

Cuando pida la contraseña, usa la definida en `docker/docker-compose.yml`.

## macOS

### Requisitos

Antes de ejecutar los comandos, asegúrate de tener:

- Docker Desktop instalado en el Mac.
- Docker Desktop abierto y en ejecución.
- El repositorio clonado en una carpeta local del Mac.

Puedes comprobar que Docker responde con:

```bash
docker info
```

### Levantar servicios

Desde la raíz del repositorio:

```bash
docker compose -f docker/docker-compose.yml up -d
```

Este comando crea el contenedor `squarestruct-mysql` y un volumen de Docker para guardar los datos de MySQL.

En macOS no tienes que crear el volumen manualmente. Docker Compose lo crea automáticamente la primera vez que levantas el servicio.

### Comprobar que se ha creado correctamente

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

### Parar servicios

```bash
docker compose -f docker/docker-compose.yml down
```

### Reiniciar la base de datos desde cero

Si cambias `schema.sql` o `seeds.sql`, puede que necesites borrar el volumen anterior para que MySQL vuelva a ejecutar los scripts iniciales.

```bash
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up -d
```

El parámetro `-v` elimina el volumen de datos. Úsalo solo si quieres reconstruir la base de datos desde cero.

### Comprobar logs

```bash
docker logs squarestruct-mysql
```

### Acceso a MySQL

Según la configuración del `docker-compose.yml`, MySQL se expone en el puerto local correspondiente.

También puedes entrar al contenedor:

```bash
docker exec -it squarestruct-mysql mysql -uadmin -p
```

Cuando pida la contraseña, usa la definida en `docker/docker-compose.yml`.

## Linux

En Linux el uso del proyecto es el mismo en Ubuntu y Fedora. Lo que cambia principalmente es la forma de instalar Docker.

### Ubuntu

Instala Docker siguiendo la documentación oficial de Docker para Ubuntu o usando Docker Desktop si prefieres una interfaz gráfica.

Después de instalar Docker Engine, comprueba que Docker responde:

```bash
docker info
```

Si el comando falla por permisos, puede que necesites añadir tu usuario al grupo `docker`:

```bash
sudo usermod -aG docker $USER
```

Después cierra sesión y vuelve a entrar para que el cambio tenga efecto.

### Fedora

Instala Docker siguiendo la documentación oficial de Docker para Fedora o usando Docker Desktop si prefieres una interfaz gráfica.

Después de instalar Docker Engine, comprueba que Docker responde:

```bash
docker info
```

Si el comando falla por permisos, puede que necesites añadir tu usuario al grupo `docker`:

```bash
sudo usermod -aG docker $USER
```

Después cierra sesión y vuelve a entrar para que el cambio tenga efecto.

### Levantar servicios

Desde la raíz del repositorio:

```bash
docker compose -f docker/docker-compose.yml up -d
```

Este comando crea el contenedor `squarestruct-mysql` y un volumen de Docker para guardar los datos de MySQL.

No tienes que crear el volumen manualmente. Docker Compose lo crea automáticamente la primera vez que levantas el servicio.

### Comprobar que se ha creado correctamente

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

### Parar servicios

```bash
docker compose -f docker/docker-compose.yml down
```

### Reiniciar la base de datos desde cero

Si cambias `schema.sql` o `seeds.sql`, puede que necesites borrar el volumen anterior para que MySQL vuelva a ejecutar los scripts iniciales.

```bash
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up -d
```

El parámetro `-v` elimina el volumen de datos. Úsalo solo si quieres reconstruir la base de datos desde cero.

### Comprobar logs

```bash
docker logs squarestruct-mysql
```

### Acceso a MySQL

Según la configuración del `docker-compose.yml`, MySQL se expone en el puerto local correspondiente.

También puedes entrar al contenedor:

```bash
docker exec -it squarestruct-mysql mysql -uadmin -p
```

Cuando pida la contraseña, usa la definida en `docker/docker-compose.yml`.

## Idea clave

Docker ayuda a que todos puedan usar una base de datos parecida sin instalar MySQL manualmente en su equipo.
