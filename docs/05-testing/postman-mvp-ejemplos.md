# Pruebas del MVP con Postman

## Objetivo

Este documento explica como probar manualmente el flujo principal del MVP usando Postman.

El objetivo no es probar todos los casos posibles, sino comprobar que la API funciona y que las piezas principales estan conectadas: productos, registro, login, token JWT, rutas protegidas, gestion admin y base de pedidos.

## Requisitos previos

Antes de probar:

- El backend debe estar arrancado.
- La base de datos debe estar inicializada.
- Deben existir datos de prueba en MySQL.
- Postman debe estar instalado, o se puede usar una herramienta similar.

URL base:

```text
http://localhost:3000
```

## Flujo recomendado

1. Consultar productos.
2. Registrar un usuario.
3. Iniciar sesion.
4. Copiar el token JWT.
5. Probar una ruta protegida.
6. Si existe un usuario admin, probar gestion de usuarios.
7. Si existe un usuario admin, probar escritura de productos.
8. Probar pedidos, detalle y cancelacion logica como comprobacion tecnica del backend.

## 1. Obtener productos

Comprueba que la API puede leer productos desde la base de datos.

```text
Metodo: GET
URL: http://localhost:3000/api/productos
```

Respuesta esperada:

```text
200 OK
```

Ejemplo:

```json
[
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
    "idProveedor": 1
  }
]
```

## 2. Registrar usuario

Crea un usuario nuevo en el sistema.

```text
Metodo: POST
URL: http://localhost:3000/api/usuarios/register
Header: Content-Type: application/json
```

Body:

```json
{
  "nombre": "Test User",
  "email": "testuser@mail.com",
  "contrasena": "12345678"
}
```

Respuesta esperada:

```text
201 Created
```

## 3. Login de usuario

Autentica el usuario y devuelve un token JWT.

```text
Metodo: POST
URL: http://localhost:3000/api/usuarios/login
Header: Content-Type: application/json
```

Body:

```json
{
  "email": "testuser@mail.com",
  "contrasena": "12345678"
}
```

Respuesta esperada:

```text
200 OK
```

Ejemplo:

```json
{
  "token": "<JWT>"
}
```

## 4. Obtener perfil

Comprueba que una ruta protegida solo funciona con token.

```text
Metodo: GET
URL: http://localhost:3000/api/perfil
Header: Authorization: Bearer <JWT>
```

Respuesta esperada:

```text
200 OK
```

Ejemplo:

```json
{
  "usuario": {
    "idUsuario": 1,
    "nombre": "Test User",
    "email": "testuser@mail.com",
    "rol": "usuario"
  }
}
```

## 5. Gestion de usuarios admin

Esta prueba solo funciona con un token de usuario administrador.

```text
Metodo: GET
URL: http://localhost:3000/api/usuarios
Header: Authorization: Bearer <JWT_ADMIN>
```

Respuesta esperada:

```text
200 OK
```

Si se usa un token de usuario normal, la respuesta esperada es:

```text
403 Forbidden
```

Para actualizar un rol:

```text
Metodo: PUT
URL: http://localhost:3000/api/usuarios/1
Header: Authorization: Bearer <JWT_ADMIN>
Header: Content-Type: application/json
```

Body:

```json
{
  "nombre": "Test User",
  "email": "testuser@mail.com",
  "rol": "admin"
}
```

Roles validos en el MVP:

```text
usuario, admin
```

## 6. Escritura de productos admin

La lectura de productos es publica, pero crear, actualizar o eliminar productos requiere token admin.

```text
Metodo: POST
URL: http://localhost:3000/api/productos
Header: Authorization: Bearer <JWT_ADMIN>
Header: Content-Type: application/json
```

Body:

```json
{
  "nombre": "Bloque demo Postman",
  "descripcion": "Producto de prueba creado desde Postman",
  "precio": 25.5,
  "tipo": "bloque",
  "material": "Hormigon",
  "alto": 80,
  "ancho": 40,
  "largo": 120,
  "idProveedor": 1
}
```

Respuesta esperada:

```text
201 Created
```

Con token de usuario normal, la respuesta esperada es:

```text
403 Forbidden
```

## 7. Base de pedidos

El backend tiene endpoints y tablas para pedidos. Esta prueba valida la base tecnica, aunque el checkout completo desde el carrito del frontend queda para fases siguientes.

```text
Metodo: POST
URL: http://localhost:3000/api/pedidos
Header: Authorization: Bearer <JWT>
Header: Content-Type: application/json
```

Body:

```json
{
  "direccionEnvio": "Calle Prueba 123",
  "metodoPago": "tarjeta",
  "productos": [
    {
      "idProducto": 1,
      "cantidad": 2
    }
  ]
}
```

Respuesta esperada si los datos son validos:

```text
201 Created
```

Para listar pedidos del usuario autenticado:

```text
Metodo: GET
URL: http://localhost:3000/api/pedidos
Header: Authorization: Bearer <JWT>
```

Para consultar un pedido concreto:

```text
Metodo: GET
URL: http://localhost:3000/api/pedidos/1
Header: Authorization: Bearer <JWT>
```

Para cancelar un pedido:

```text
Metodo: PATCH
URL: http://localhost:3000/api/pedidos/1/cancelar
Header: Authorization: Bearer <JWT>
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

La cancelacion es logica: no elimina el pedido, solo actualiza `estado` y `fechaCancelacion`.

## Errores comunes

| Codigo | Significado |
| --- | --- |
| `400 Bad Request` | Faltan campos o el formato no es correcto. |
| `401 Unauthorized` | El usuario no esta autenticado o el token no es valido. |
| `403 Forbidden` | El usuario no tiene permisos de administrador. |
| `404 Not Found` | El recurso solicitado no existe. |
| `409 Conflict` | El email ya esta registrado, no se puede eliminar un usuario con dependencias o el pedido no se puede cancelar por su estado. |
| `500 Internal Server Error` | Error interno del servidor o base de datos. |

## Resultado esperado

Si estas pruebas funcionan, se puede explicar que:

- La API responde.
- La base de datos esta conectada.
- El registro funciona.
- El login genera un token.
- Las rutas protegidas validan JWT.
- Las rutas admin requieren rol `admin`.
- Las rutas de escritura de productos requieren rol `admin`.
- Existe base tecnica para pedidos, detalle y cancelacion logica.

## Idea clave para explicar

Postman permite probar el backend sin depender del frontend. Asi se comprueba si la API funciona por si sola y se separan los problemas de backend de los problemas de interfaz.
