# Backups de base de datos

## Objetivo

Los backups son copias de seguridad de la base de datos.

Sirven para guardar el estado de los datos y poder recuperarlos si algo falla.

## Importante

No se deben subir backups reales al repositorio si contienen datos privados, contraseñas, correos o información sensible.

## Crear un backup manual

Ejemplo con MySQL local:

```bash
mysqldump -u root -p squarestruct > backend/db/backups/backup.sql
```

## Restaurar un backup

```bash
mysql -u root -p squarestruct < backend/db/backups/backup.sql
```

## En este proyecto

La carpeta `backend/db/backups/` se mantiene como referencia, pero no debería contener copias reales con datos sensibles.

## Idea clave para explicar

Un backup permite recuperar datos, pero hay que tratarlo con cuidado porque puede contener información privada.
