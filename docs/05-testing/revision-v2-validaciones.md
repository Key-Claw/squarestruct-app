# Revision V2 - Validaciones por comando

Este documento recoge las validaciones ejecutadas durante la revision general de V2.

La revision manual del frontend queda pendiente hasta terminar los retoques visuales finales.

## Backend

### Tests de integracion

Comando:

```bash
cd backend
npm.cmd run test:integration
```

Resultado:

- 2 suites correctas.
- 22 tests correctos.
- Sin fallos en la suite de integracion.

### Tests unitarios

Comando:

```bash
cd backend
npm.cmd run test:unit
```

Resultado:

- 1 suite correcta.
- 1 test correcto.
- Sin fallos en la suite unitaria.

### Auditoria de dependencias

Comando:

```bash
cd backend
npm.cmd audit --audit-level=high
```

Resultado:

- Detectadas 2 vulnerabilidades `high`.
- Origen: dependencia `tar` a traves de `@mapbox/node-pre-gyp`.
- Pendiente revisar si `npm audit fix` es seguro antes de aplicarlo.

Nota:

- En Windows se usa `npm.cmd` para evitar bloqueos de PowerShell con `npm.ps1`.
- `npm audit fix` no se aplica automaticamente; antes hay que revisar que el cambio no rompa dependencias.

## Frontend

### Tests

Comando:

```bash
cd frontend
npm.cmd run test:run
```

Resultado:

- 3 test files correctos.
- 3 tests correctos.
- Sin fallos en tests frontend.

### Build

Comando:

```bash
cd frontend
npm.cmd run build
```

Resultado:

- Build completado correctamente.
- Artefactos generados en `frontend/dist`.

### Lint

Comando:

```bash
cd frontend
npm.cmd run lint
```

Resultado:

- ESLint ejecutado sin errores reportados.

### Auditoria de dependencias

Comando:

```bash
cd frontend
npm.cmd audit --audit-level=high
```

Resultado:

- 0 vulnerabilidades detectadas.

## Revision estatica de Postman

Se revisaron las colecciones Postman de forma estatica.

Acciones realizadas:

- Se sustituyeron JWTs hardcodeados por variables `{{adminToken}}`.
- Se sustituyo el placeholder `Bearer <JWT>` por `Bearer {{token}}`.
- En Postman v2, se corrigio el request de cancelacion para apuntar a `http://localhost:3000/api/pedidos/1/cancelar` con metodo `PATCH`.

Pendientes detectados:

- Faltan tests basicos de Postman en varios requests.

## Revision estatica de seguridad

Acciones realizadas:

- Se elimino el log de `backend/src/app.js` que imprimia `DB_PASSWORD` al arrancar el backend.

## Comandos auxiliares usados

Durante la revision se usaron estos comandos para comprobar estado y calidad sin modificar codigo:

```bash
git status --short
git diff --check
rg -n "patron" rutas
npm.cmd audit --audit-level=high
```

Uso recomendado:

- `git status --short`: comprobar que archivos estan modificados antes de commitear.
- `git diff --check`: detectar espacios finales o errores de diff antes de abrir PR.
- `rg`: buscar referencias rapidas en codigo y documentacion.
- `npm.cmd audit --audit-level=high`: revisar vulnerabilidades altas sin entrar en modo interactivo.

## Pendiente de revision manual

La revision manual del frontend se realizara cuando terminen los ajustes visuales finales:

- Navegacion general.
- Login y logout.
- Catalogo.
- Perfil protegido.
- Panel administrador.
- Carrito y pedidos.
- Responsive basico.

## Resumen

La validacion automatica principal pasa correctamente:

- Backend tests OK.
- Frontend tests OK.
- Frontend build OK.
- Frontend lint OK.

Quedan pendientes ampliar tests de Postman, revisar vulnerabilidades backend y validacion manual del frontend.
