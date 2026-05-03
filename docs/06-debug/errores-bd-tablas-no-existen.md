# Error: las tablas no existen en la base de datos

## Problema

Al hacer una petición a la API, puede aparecer un error parecido a este:

```json
{
  "error": "Error al obtener productos",
  "detalle": "Table 'squarestruct.productos' doesn't exist"
}
```

Esto significa que MySQL está funcionando, pero la tabla que necesita el backend no existe.

## Cuándo puede pasar

Puede ocurrir al probar endpoints como:

- `GET /api/productos`
- `POST /api/usuarios/register`
- `POST /api/pedidos`

## Causas habituales

- `schema.sql` no se ejecutó correctamente.
- El volumen de Docker ya existía y no volvió a cargar los scripts SQL.
- La base de datos está creada, pero no tiene las tablas.
- El contenedor de MySQL arrancó con una configuración antigua.

## Solución con Docker

Si estás usando Docker Compose, puedes reinicializar la base de datos.

Desde la raíz del proyecto:

```powershell
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up -d
```

El parámetro `-v` elimina el volumen anterior. Así MySQL vuelve a ejecutar los scripts iniciales.

## Comprobar tablas

Para revisar si las tablas existen:

```powershell
docker exec -it squarestruct-mysql mysql -uadmin -p -e "USE squarestruct; SHOW TABLES;"
```

Deberían aparecer tablas como:

- `usuarios`
- `proveedores`
- `productos`
- `pedidos`
- `pedidoDetalles`

## Si el error continúa

Revisa:

- Que `backend/db/schema.sql` existe.
- Que el archivo no tiene errores SQL.
- Que `docker/docker-compose.yml` monta correctamente los scripts.
- Que el nombre de la base de datos coincide con el `.env`.

## Idea clave para explicar

El backend puede estar bien programado, pero si la base de datos no tiene sus tablas, la API no puede funcionar.
