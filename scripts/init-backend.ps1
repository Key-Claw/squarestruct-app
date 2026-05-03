# Inicializa el entorno backend en Windows (PowerShell)
# Uso: Ejecutar desde la raíz del repo:
#   powershell -ExecutionPolicy Bypass -File .\scripts\init-backend.ps1

param(
    [switch]$ForceKillNode
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$repoRoot = Resolve-Path (Join-Path $scriptDir "..")
Write-Host "Repo root: $repoRoot"

# Opcional: matar procesos node si el usuario lo solicita
if ($ForceKillNode) {
    Write-Host "Deteniendo procesos node activos..."
    Get-Process -Name node -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.Id -Force }
}

# Levantar Docker Compose desde la carpeta docker (rutas relativas del compose)
Push-Location (Join-Path $repoRoot "docker")
Write-Host "Iniciando Docker Compose desde: $PWD"
docker compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Error "docker compose falló (exit $LASTEXITCODE)"
    Pop-Location
    exit 1
}
Pop-Location

# Esperar a que el contenedor MySQL esté healthy
$maxRetries = 60
$retry = 0
Write-Host "Esperando que MySQL esté healthy (máx $maxRetries intentos)..."
while ($retry -lt $maxRetries) {
    $status = docker inspect --format='{{.State.Health.Status}}' squarestruct-mysql 2>$null
    if ($status -eq 'healthy') {
        Write-Host "MySQL está healthy"
        break
    }
    Start-Sleep -Seconds 2
    $retry++
}

if ($retry -ge $maxRetries) {
    Write-Warning "MySQL no se volvió healthy en el tiempo esperado. Últimos logs:"
    docker logs squarestruct-mysql -n 200
    exit 1
}

# Instalar dependencias del backend y arrancar en una nueva ventana de PowerShell
Push-Location (Join-Path $repoRoot "backend")
Write-Host "Instalando dependencias en backend..."
npm install

Write-Host "Abriendo backend en una nueva ventana (npm run dev)..."
$backendPath = (Join-Path $repoRoot "backend")
$backendCmd = "cd '$backendPath'; npm run dev"
Start-Process powershell -ArgumentList '-NoProfile','-NoExit','-Command',$backendCmd
Pop-Location

Write-Host "Script finalizado. Backend arrancado en nueva terminal (si todo fue correcto)."