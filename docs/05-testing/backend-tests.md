# Tests Del Backend

Los tests del backend usan Jest y Supertest para validar la API Express contra el comportamiento real de V3.

## Comandos

```bash
cd backend
npm test
npm run test:unit
npm run test:integration
```

## Requisitos

Los tests de integracion necesitan MySQL levantado y variables `DB_*` correctas. En local:

```bash
docker compose -f docker/docker-compose-dev.yml up -d
```

## Cobertura Actual

| Area | Cobertura |
| --- | --- |
| Health | `GET /api/health`. |
| Auth | Registro, login y generacion de token. |
| Perfil | Rechazo sin token y perfil autenticado. |
| Usuarios admin | Listado y detalle solo para admin. |
| Productos | Listado publico, creacion protegida y rechazo sin token. |
| Pedidos | Listado autenticado, creacion, detalle y cancelacion. |
| Permisos | Rechazo de usuarios no propietarios y permisos admin. |
| Estados | Bloqueo de doble cancelacion y de pedidos enviados/entregados. |

## Tests De Integracion

`tests/integration/auth-perfil.test.js` valida:

- registro de usuario;
- login;
- perfil con y sin token;
- login admin;
- proteccion de usuarios admin;
- detalle de usuario.

`tests/integration/productos-pedidos.test.js` valida:

- catalogo publico;
- creacion de producto con admin;
- rechazo de producto sin token;
- creacion de pedidos;
- consulta de pedido;
- cancelacion logica;
- restricciones de cancelacion.

## CI

El job `backend-tests` de GitHub Actions:

1. levanta MySQL;
2. carga `schema.sql`;
3. carga `seeds.sql`;
4. ejecuta `npm ci`;
5. ejecuta `npm test`.

## Pendientes Realistas

- Ampliar tests de endpoints admin de facturacion (`/admin/todos`, `/admin/pendientes`, `/:id/estado`).
- Cubrir actualizacion y eliminacion de usuarios.
- Cubrir errores de validacion de productos con mas casos.
- Cubrir conflictos por producto asociado a pedido.
