# Backups de base de datos

Esta carpeta contiene copias de seguridad de la base de datos.

No se suben backups reales al repositorio por seguridad.

## Crear backup

```bash
mysqldump -u root -p squarestruct_db > backend/db/backups/backup.sql
```
