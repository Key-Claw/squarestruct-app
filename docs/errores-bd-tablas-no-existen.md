# Error: Las tablas no existen en la base de datos

## Descripción del problema

Cuando haces peticiones a la API (por ejemplo, GET /api/productos o POST /api/usuarios/register) y recibes un error como:

```json
{
  "error": "Error al obtener productos",
  "detalle": "Table 'squarestruct.productos' doesn't exist"
}
```

Esto significa que la base de datos MySQL no tiene la tabla solicitada (productos, usuarios, etc.).

---

## Causas habituales
- El script de creación de tablas (`schema.sql`) no se ejecutó correctamente al crear el contenedor Docker.
- El volumen de datos de Docker está vacío o corrupto.
- El usuario y contraseña de MySQL son correctos, pero la estructura de la base de datos no existe.

---

## Solución recomendada

1. **Reinicializar la base de datos para forzar la ejecución de los scripts:**
   ```powershell
   docker compose -f docker/docker-compose.yml down
   docker volume rm docker_squarestruct_mysql_data
   docker compose -f docker/docker-compose.yml up -d
   ```
2. **Verificar que las tablas existen:**
   ```powershell
   docker exec -it squarestruct-mysql mysql -uadmin -p<tu_contraseña> -e "USE squarestruct; SHOW TABLES;"
   ```
   Debes ver productos, usuarios, pedidos, etc.

3. **Si no aparecen, revisa que el archivo `backend/db/schema.sql` esté bien escrito y montado en el contenedor.**

---

## Nota
No es posible solucionar este error solo desde el código fuente del backend (`src`). La base de datos debe tener las tablas necesarias para que la API funcione correctamente.

---

## Referencia
- Consulta también `docs/debug-backend-errores.md` para ver cómo mostrar el error real en las respuestas del backend y facilitar la depuración.
