# Scripts de automatización

## Objetivo

La carpeta `scripts/` contiene utilidades para facilitar el arranque del entorno de desarrollo.

## `init-backend.ps1`

Script de PowerShell pensado para Windows.

Automatiza parte del arranque del backend y la base de datos.

## Qué hace

1. Puede cerrar procesos `node` activos si se usa `-ForceKillNode`.
2. Levanta MySQL con Docker Compose.
3. Espera a que el contenedor esté listo.
4. Entra en `backend/`.
5. Ejecuta `npm install`.
6. Abre una nueva ventana con `npm run dev`.

## Requisitos

- Windows.
- PowerShell.
- Docker Desktop o Docker Engine.
- Node.js.
- Git, si se clona el repositorio por primera vez.

## Uso

Desde la raíz del repositorio:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\init-backend.ps1
```

Con cierre previo de procesos Node:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\init-backend.ps1 -ForceKillNode
```

## Errores frecuentes

- Si PowerShell bloquea el script, usar `-ExecutionPolicy Bypass`.
- Si Docker no arranca, revisar Docker Desktop.
- Si MySQL no queda listo, revisar `docker logs squarestruct-mysql`.
- Si el backend no conecta, revisar `backend/.env`.

## Idea clave

Este script no cambia la lógica del proyecto. Solo ahorra pasos repetitivos al arrancar el entorno.
