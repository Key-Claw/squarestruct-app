# Docker SquareStruct

## Objetivo

La carpeta `docker/` contiene la configuración necesaria para levantar servicios de infraestructura del proyecto.

Actualmente se usa principalmente para arrancar MySQL.

## Levantar servicios

Desde la raíz del repositorio:

```bash
docker compose -f docker/docker-compose.yml up -d
```

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

## Idea clave

Docker ayuda a que todos puedan usar una base de datos parecida sin instalar MySQL manualmente en su equipo.
