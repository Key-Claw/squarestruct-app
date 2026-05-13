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

## Frontend

### Tests

Comando:

```bash
cd frontend
npm.cmd test -- --run
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

Pendientes detectados:

- Hay JWTs hardcodeados en colecciones Postman.
- Hay placeholders `Bearer <JWT>` en colecciones Postman.
- En Postman v2, el request de cancelacion aparece mal formado como `PATCH PATCH /api/pedidos/1/cancelar`.
- Faltan tests basicos de Postman en varios requests.

## Revision estatica de seguridad

Pendientes detectados:

- `backend/src/app.js` imprime `DB_PASSWORD` por consola al arrancar el backend.

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

Quedan pendientes ajustes de Postman, revision de logs sensibles, revision de vulnerabilidades backend y validacion manual del frontend.
