# Tests del backend

## Objetivo

Este documento explica las pruebas automaticas actuales del backend dentro del MVP.

Los tests ayudan a comprobar que partes importantes de la API siguen funcionando cuando se hacen cambios.

## Herramientas usadas

| Herramienta | Uso |
| --- | --- |
| Jest | Ejecuta los tests. |
| Supertest | Lanza peticiones HTTP contra la app de Express. |

## Comandos

Desde `backend/`:

```bash
npm test
```

Ejecuta todos los tests.

```bash
npm run test:unit
```

Ejecuta solo tests unitarios.

```bash
npm run test:integration
```

Ejecuta tests de integracion.

## Test de health

Archivo:

```text
backend/tests/unit/health.test.js
```

Comprueba:

```text
GET /api/health
```

Respuesta esperada:

```text
200 OK
```

## Test de auth y perfil

Archivo:

```text
backend/tests/integration/auth-perfil.test.js
```

Comprueba el flujo:

1. Registrar usuario.
2. Iniciar sesion.
3. Recibir token.
4. Intentar acceder a perfil sin token.
5. Acceder a perfil con token.

## Requisitos para integracion

Para los tests de integracion:

- MySQL debe estar levantado.
- El archivo `.env` debe tener credenciales correctas.
- La base de datos debe tener el esquema creado.

## Cobertura actual

Los tests automaticos actuales no cubren todo el MVP.

Cubren:

- health check de la API;
- registro, login y perfil autenticado.

No cubren todavia:

- catalogo de productos;
- gestion de usuarios admin;
- pedidos;
- pruebas automatizadas de frontend.

Para esas partes se usan comprobaciones manuales con Postman y la revision de frontend con `npm run lint` y `npm run build`.

## Idea clave para explicar

Los tests actuales validan la base de disponibilidad y autenticacion del backend. Son un punto de partida, pero la cobertura deberia ampliarse en una fase posterior para productos, pedidos y administracion.

## Integracion continua

El proyecto tiene un workflow de GitHub Actions en [.github/workflows/tests.yml](../../.github/workflows/tests.yml) que se ejecuta en `push` y `pull_request` hacia `dev`.

El pipeline levanta MySQL como servicio, carga `backend/db/schema.sql` y `backend/db/seeds.sql`, instala las dependencias del backend y ejecuta `npm test`.

Esto permite comprobar automaticamente que el backend sigue funcionando antes de fusionar cambios a `dev`.
