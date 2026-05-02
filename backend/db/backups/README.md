# Backups de base de datos

Esta carpeta está reservada para copias de seguridad de la base de datos.

No se deben subir backups reales con datos sensibles al repositorio.

## Crear backup

```bash
mysqldump -u root -p squarestruct > backend/db/backups/backup.sql
```

## Restaurar backup

```bash
mysql -u root -p squarestruct < backend/db/backups/backup.sql
```
