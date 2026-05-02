# Pruebas del MVP con Postman

## Objetivo

Este documento explica cómo probar manualmente el flujo principal del MVP usando Postman.

El objetivo no es probar todos los casos posibles, sino comprobar que la aplicación funciona de principio a fin.

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
3. Iniciar sesión.
4. Copiar el token JWT.
5. Probar una ruta protegida.

## 1. Obtener productos

Comprueba que la API puede leer productos desde la base de datos.

```text
Método: GET
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
    "descripcion": "Bloque para construcción modular",
    "precio": 25.5,
    "tipo": "bloque",
    "stock": 100,
    "idProveedor": 1
  }
]
```

## 2. Registrar usuario

Crea un usuario nuevo en el sistema.

```text
Método: POST
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
Método: POST
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
Método: GET
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
  "idUsuario": 1,
  "nombre": "Test User",
  "email": "testuser@mail.com",
  "rol": "cliente"
}
```

## Errores comunes

| Código | Significado |
| --- | --- |
| `400 Bad Request` | Faltan campos o el formato no es correcto. |
| `401 Unauthorized` | El usuario no está autenticado o el token no es válido. |
| `409 Conflict` | El email ya está registrado. |
| `500 Internal Server Error` | Error interno del servidor o base de datos. |

## Resultado esperado

Si estas pruebas funcionan, se puede explicar que:

- La API responde.
- La base de datos está conectada.
- El registro funciona.
- El login genera un token.
- Las rutas protegidas validan JWT.

## Idea clave para explicar

Postman permite probar el backend sin depender del frontend. Así se comprueba si la API funciona por sí sola.
