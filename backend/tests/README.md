# Tests del backend

Los tests del backend usan Jest y Supertest para validar endpoints de Express.

## Comandos

Desde la carpeta `backend/`:

```bash
npm test
```

Ejecuta todos los tests.

```bash
npm run test:unit
```

Ejecuta solo los tests unitarios.

```bash
npm run test:integration
```

Ejecuta solo los tests de integracion.

## Requisitos para tests de integracion

Los tests de integracion necesitan que MySQL este levantado y que el archivo `.env` apunte a una base de datos valida.

En local se puede levantar la base de datos con:

```bash
docker compose -f docker/docker-compose-dev.yml up -d
```

## Cobertura actual

Actualmente la suite cubre:

- `GET /api/health`.
- Registro y login de usuarios.
- Perfil autenticado.
- `GET /api/productos`.
- Escritura de productos protegida para administradores.
- Rechazo de escritura de productos sin token o con usuario normal.
- Gestion y consulta de usuarios con rol `admin`.
- Rutas de pedidos protegidas sin token.
- Rutas de pedidos protegidas con token.
- Creacion de pedidos autenticada.
- Consulta de detalle de pedido por propietario.
- Cancelacion logica de pedidos.
- Bloqueo de doble cancelacion.
- Bloqueo de cancelacion de pedidos enviados o entregados.
- Bloqueo de cancelacion por usuarios que no son propietarios.
- Cancelacion de pedidos por administrador.
