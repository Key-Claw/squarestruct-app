# API REST De SquareStruct

Este documento recoge los endpoints reales montados en `backend/src/app.js` y definidos en `backend/src/routes/`. La API responde bajo `/api` y usa JSON.

## Base

| Metodo | Ruta | Proteccion | Uso |
| --- | --- | --- | --- |
| `GET` | `/` | Publica | Comprobacion rapida del backend. |
| `GET` | `/api/health` | Publica | Health check simple. Devuelve `OK`. |
| `GET` | `/api/db-status` | Publica | Comprueba tablas y totales basicos de MySQL. |

## Autenticacion Y Usuarios

Rutas definidas en `backend/src/routes/usuarios.js`.

| Metodo | Ruta | Proteccion | Uso |
| --- | --- | --- | --- |
| `POST` | `/api/usuarios/register` | Publica | Registra un usuario con contrasena hasheada con bcrypt. |
| `POST` | `/api/usuarios/login` | Publica | Valida credenciales y devuelve JWT. |
| `GET` | `/api/usuarios` | JWT + admin | Lista usuarios. |
| `GET` | `/api/usuarios/:id` | JWT + admin | Consulta un usuario. |
| `PUT` | `/api/usuarios/:id` | JWT | Actualiza datos. Admin puede cambiar rol; usuario normal solo su propia cuenta. |
| `DELETE` | `/api/usuarios/:id` | JWT | Anonimiza/elimina cuenta. Admin puede eliminar usuarios; usuario normal solo su propia cuenta. |

Registro:

```json
{
  "nombre": "Ana",
  "primerApellido": "Gomez",
  "email": "ana@example.com",
  "contrasena": "12345678"
}
```

Login por email:

```json
{
  "email": "ana@example.com",
  "contrasena": "12345678"
}
```

El login tambien admite `nombre` + `primerApellido` + `contrasena`, aunque el flujo principal del frontend usa email.

## Perfil

Ruta definida en `backend/src/routes/perfil.js`.

| Metodo | Ruta | Proteccion | Uso |
| --- | --- | --- | --- |
| `GET` | `/api/perfil` | JWT | Devuelve el perfil del usuario autenticado. |

## Productos

Rutas definidas en `backend/src/routes/productos.js`.

| Metodo | Ruta | Proteccion | Uso |
| --- | --- | --- | --- |
| `GET` | `/api/productos` | Publica | Lista productos con datos del proveedor. |
| `GET` | `/api/productos/:id` | Publica | Consulta un producto. |
| `POST` | `/api/productos` | JWT + admin | Crea producto. |
| `PUT` | `/api/productos/:id` | JWT + admin | Actualiza producto. |
| `DELETE` | `/api/productos/:id` | JWT + admin | Elimina producto si no esta asociado a pedidos. |

Producto:

```json
{
  "nombre": "Bloque EcoBase",
  "descripcion": "Bloque ligero de plastico reciclable",
  "precio": 42.5,
  "tipo": "bloque",
  "material": "Plastico reciclable",
  "alto": 22.7,
  "ancho": 19.7,
  "largo": 39.4,
  "idProveedor": 1
}
```

## Pedidos

Rutas definidas en `backend/src/routes/pedidos.js`. Estan montadas tanto en `/api/pedidos` como en `/api/orders`. El frontend V3 usa el alias `/api/orders` desde `frontend/src/services/orderService.js`.

| Metodo | Ruta | Proteccion | Uso |
| --- | --- | --- | --- |
| `GET` | `/api/pedidos` | JWT | Lista pedidos del usuario autenticado. |
| `POST` | `/api/pedidos` | JWT | Crea pedido desde una lista de productos. |
| `GET` | `/api/pedidos/:id` | JWT | Consulta un pedido si pertenece al usuario o si el usuario es admin. |
| `PATCH` | `/api/pedidos/:id/cancelar` | JWT | Cancela logicamente un pedido si esta permitido. |
| `GET` | `/api/pedidos/admin/pendientes` | JWT + admin | Lista pedidos pendientes. |
| `GET` | `/api/pedidos/admin/todos` | JWT + admin | Lista el historial completo de pedidos. |
| `PATCH` | `/api/pedidos/:id/estado` | JWT + admin | Cambia estado de pedido pendiente a `aceptado` o `denegado`. |

Alias equivalentes:

```text
/api/orders
/api/orders/:id
/api/orders/admin/pendientes
/api/orders/admin/todos
/api/orders/:id/estado
```

Crear pedido:

```json
{
  "direccionEnvio": "Calle Principal 123, Madrid",
  "metodoPago": "tarjeta",
  "productos": [
    {
      "idProducto": 1,
      "cantidad": 2
    }
  ]
}
```

Cambiar estado admin:

```json
{
  "nuevoEstado": "aceptado"
}
```

## Autorizacion

Las rutas protegidas esperan:

```http
Authorization: Bearer TOKEN
```

`authMiddleware` valida el JWT y anade `req.user`. `adminMiddleware` comprueba `req.user.rol === 'admin'`.

## Errores Habituales

| Codigo | Causa |
| --- | --- |
| `400` | Datos incompletos o formato invalido. |
| `401` | Falta token. |
| `403` | Token invalido o usuario sin rol suficiente. |
| `404` | Recurso inexistente. |
| `409` | Conflicto: email duplicado, pedido no cancelable o producto asociado a pedido. |
| `500` | Error interno o problema de base de datos. |
