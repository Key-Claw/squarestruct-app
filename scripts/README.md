# Scripts de automatización

Esta carpeta contiene utilidades para inicializar y facilitar el arranque del entorno de desarrollo.

## init-backend.ps1
Script PowerShell que automatiza la inicialización del backend en Windows.

### Propósito
- Levantar los servicios de infraestructura (MySQL) mediante Docker Compose.
- Esperar a que MySQL esté listo (estado `healthy`).
- Instalar dependencias de Node en `backend` y arrancar el servidor en una nueva ventana de PowerShell (`npm run dev`).
- Facilitar arranques limpios en máquinas nuevas o después de reinicializar la base de datos.

### Requisitos
- Windows con PowerShell (recomendado PowerShell 7+).
- Docker Desktop o Docker Engine instalado y en ejecución.
- Permiso para ejecutar scripts: si tu PowerShell bloquea scripts, ejecuta la orden con `-ExecutionPolicy Bypass`.
- Git (si vas a clonar el repo por primera vez).

### Uso
Ejecutar desde la raíz del repositorio (ruta donde está la carpeta `scripts`):

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\init-backend.ps1
```

Opcionalmente, si querés que el script termine procesos Node activos antes de arrancar (útil si hay instancias colgando):

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\init-backend.ps1 -ForceKillNode
```

### ¿Qué hace exactamente?
1. (Opcional) Mata procesos `node` en ejecución si se pasó `-ForceKillNode`.
2. Cambia al directorio `docker/` y ejecuta `docker compose up -d` para levantar MySQL.
3. Espera hasta que el contenedor `squarestruct-mysql` reporte `healthy` o hasta un timeout.
4. Si MySQL quedó healthy, entra en `backend/`, ejecuta `npm install` y abre una nueva ventana de PowerShell con `npm run dev`.

### Salida esperada
- Logs de Docker durante el arranque de MySQL.
- Una nueva ventana de PowerShell donde se ejecuta `npm run dev` y se ven los logs del backend (nodemon).
- Si hay errores (por ejemplo MySQL no queda `healthy`), el script muestra los últimos logs del contenedor para diagnóstico.

### Resolución de problemas
- Si PowerShell impide la ejecución por políticas de seguridad, usa `-ExecutionPolicy Bypass` como en el ejemplo.
- Si Docker no arranca correctamente, ejecuta manualmente `cd docker` y `docker compose up -d`, luego revisa `docker logs squarestruct-mysql`.
- Si el backend no arranca por variables de entorno, revisa `backend/.env` y que el contenedor MySQL esté `healthy`.

### Notas para Linux/macOS
- Este script es específico de PowerShell/Windows. Para Linux/macOS se puede crear un `scripts/init-backend.sh` con la misma lógica (usar `docker compose`, `sleep`/`retry` para esperar a MySQL y `gnome-terminal`/`open` para abrir nuevas ventanas si se desea).

---

Si querés, genero también la versión Bash (`init-backend.sh`) y la agrego aquí con instrucciones para macOS/Linux.