# API REST

## Objetivo

La API REST permite que el frontend se comunique con el backend.

El frontend envia peticiones HTTP y el backend responde con datos en formato JSON.

## URL base

En desarrollo local:

```text
http://localhost:3000
```

Prefijo general:

```text
/api
```

En el frontend, Vite usa proxy para que las llamadas a `/api` apunten al backend local.

## Convenciones

- Los recursos se nombran en plural: `usuarios`, `productos`, `pedidos`.
- Se usan metodos HTTP estandar.
- Las respuestas se devuelven en JSON.
- Las rutas privadas usan JWT.

## Metodos HTTP usados

| Metodo | Uso |
| --- | --- |
| `GET` | Consultar datos. |
| `POST` | Crear datos o iniciar una accion. |
| `PATCH` | Actualizar parcialmente un dato o ejecutar una accion concreta. |
| `PUT` | Actualizar datos. |
| `DELETE` | Eliminar datos. |

## Endpoints publicos

| Metodo | Endpoint | Funcion |
| --- | --- | --- |
| `POST` | `/api/usuarios/register` | Registrar un usuario. |
| `POST` | `/api/usuarios/login` | Iniciar sesion y obtener token JWT. |
| `GET` | `/api/productos` | Consultar productos. |
| `GET` | `/api/productos/:id` | Consultar un producto concreto. |
| `GET` | `/api/health` | Comprobar que el backend responde. |
| `GET` | `/api/db-status` | Comprobar tablas y totales de base de datos. |

## Endpoints protegidos

Requieren:

```text
Authorization: Bearer <TOKEN>
```

| Metodo | Endpoint | Funcion |
| --- | --- | --- |
| `GET` | `/api/perfil` | Consultar datos del usuario autenticado desde el JWT. |
| `GET` | `/api/pedidos` | Listar pedidos del usuario autenticado. |
| `POST` | `/api/pedidos` | Crear un pedido. |
| `GET` | `/api/pedidos/:id` | Consultar un pedido concreto si pertenece al usuario o si el usuario es admin. |
| `PATCH` | `/api/pedidos/:id/cancelar` | Cancelar logicamente un pedido permitido. |
| `GET` | `/api/orders` | Alias de pedidos para clientes que usan nomenclatura en ingles. |
| `POST` | `/api/orders` | Alias para crear pedido. |

## Endpoints de administracion

Requieren token JWT y rol `admin`.

| Metodo | Endpoint | Funcion |
| --- | --- | --- |
| `GET` | `/api/usuarios` | Listar usuarios. |
| `GET` | `/api/usuarios/:id` | Consultar un usuario por id. |
| `PUT` | `/api/usuarios/:id` | Actualizar datos o rol de usuario. |
| `DELETE` | `/api/usuarios/:id` | Eliminar usuario si no tiene dependencias que lo impidan. |
| `POST` | `/api/productos` | Crear producto. |
| `PUT` | `/api/productos/:id` | Actualizar producto. |
| `DELETE` | `/api/productos/:id` | Eliminar producto. |

Nota: las rutas de productos de escritura requieren token de administrador. El frontend actual se centra sobre todo en la consulta del catalogo.

## Seguridad

El login devuelve un token JWT.

Ese token se envia en rutas protegidas usando el header:

```text
Authorization: Bearer <TOKEN>
```

El backend valida el token con `authMiddleware`.

Para rutas de administracion, tambien se usa `adminMiddleware`, que comprueba que el rol sea `admin`.

## Ejemplo de producto

```json
{
  "idProducto": 1,
  "nombre": "Bloque modular",
  "descripcion": "Bloque para construccion modular",
  "precio": 25.5,
  "tipo": "bloque",
  "material": "Hormigon",
  "alto": 80,
  "ancho": 80,
  "largo": 160,
  "idProveedor": 2
}
```

## Ejemplo de usuario admin

```json
{
  "idUsuario": 1,
  "nombre": "Admin",
  "primerApellido": "SquareStruct",
  "email": "admin@squarestruct.com",
  "rol": "admin",
  "creadoEn": "2026-05-09T07:23:31.000Z"
}
```

## Ejemplo de cancelacion de pedido

```text
PATCH /api/pedidos/1/cancelar
Authorization: Bearer <TOKEN>
```

Respuesta esperada:

```json
{
  "message": "Pedido cancelado correctamente",
  "pedido": {
    "idPedido": 1,
    "estado": "cancelado"
  }
}
```

Reglas principales:

- Solo puede cancelar el propietario del pedido o un admin.
- No se puede cancelar un pedido ya cancelado.
- No se puede cancelar un pedido `enviado` o `entregado`.
- La cancelacion es logica: el pedido se conserva y se actualiza `estado = cancelado`.

## Ejemplo de error

```json
{
  "error": "Token no proporcionado"
}
```

## Estado actual

- Catalogo conectado a `/api/productos`.
- Escritura de productos protegida con rol `admin`.
- Login y registro conectados a `/api/usuarios`.
- Gestion de usuarios admin conectada a `/api/usuarios`.
- Pedidos tienen backend para creacion, listado, detalle y cancelacion logica.
- El checkout completo desde carrito queda para fases siguientes.

## Idea clave para explicar

La API es el puente entre frontend y base de datos. El frontend no consulta MySQL directamente: siempre pasa por el backend.

Si usas la coleccion de Postman del repo, la URL base se configura con la variable `baseUrl` y por defecto apunta a `http://localhost:3000`.
