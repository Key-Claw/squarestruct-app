# Tests del backend

## Objetivo

Este documento explica las pruebas automáticas actuales del backend dentro del MVP.

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

Ejecuta tests de integración.

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
2. Iniciar sesión.
3. Recibir token.
4. Intentar acceder a perfil sin token.
5. Acceder a perfil con token.

## Requisitos para integración

Para los tests de integración:

- MySQL debe estar levantado.
- El archivo `.env` debe tener credenciales correctas.
- La base de datos debe tener el esquema creado.

## Idea clave para explicar

Los tests actuales no cubren todo el backend, pero sí validan el flujo mínimo del MVP: la API responde y la autenticación básica funciona.
