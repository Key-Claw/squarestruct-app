
# Tests del backend: cobertura real y defensa DAW

## Objetivo

Este documento explica las pruebas automáticas reales del backend, su cobertura y cómo justificarlas en una defensa DAW o presentación profesional.

Los tests aseguran que la API y las reglas de negocio funcionan tras cada cambio y permiten demostrar calidad y seguridad en la defensa.

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

La suite actual combina tests unitarios e integracion.

Cubren:

- health check de la API;
- registro, login y perfil autenticado;
- listado y detalle de usuarios con rol `admin`;
- consulta publica de productos;
- creacion de productos solo con token admin;
- rechazo de escritura de productos sin token o con usuario normal;
- rutas de pedidos protegidas sin token;
- creacion de pedidos autenticada;
- consulta de pedidos y detalle por propietario;
- cancelacion logica de pedidos;
- bloqueo de doble cancelacion;
- bloqueo de cancelacion de pedidos enviados o entregados;
- bloqueo de cancelacion por usuarios que no son propietarios;
- cancelacion por administrador.

No cubren todavia:

- checkout completo desde el carrito del frontend;
- facturacion real;
- flujo visual completo de administracion desde navegador.

Para esas partes se usan comprobaciones manuales con Postman y la revision de frontend con `npm run test:run`, `npm run lint` y `npm run build`.


## Buenas prácticas y defensa DAW

- Explica la cobertura real: health, auth, roles, productos, pedidos y cancelación lógica.
- Justifica la separación entre tests unitarios e integración.
- Muestra ejemplos de tests y resultados reales.
- Relaciona los tests con la calidad, la seguridad y la trazabilidad del backend.

## Integracion continua

El proyecto tiene un workflow de GitHub Actions en [.github/workflows/tests.yml](../../.github/workflows/tests.yml) que se ejecuta en `push` y `pull_request` hacia `dev`.

El pipeline levanta MySQL como servicio, carga `backend/db/schema.sql` y `backend/db/seeds.sql`, instala las dependencias del backend y ejecuta `npm test`.

Esto permite comprobar automaticamente que el backend sigue funcionando antes de fusionar cambios a `dev`.
