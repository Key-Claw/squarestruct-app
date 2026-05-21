# Pruebas del MVP y V3 con Postman

## Objetivo

Este documento explica cómo probar manualmente el flujo principal del MVP y cómo automatizar la validación básica de la API con Postman y Newman.

El objetivo no es cubrir todos los casos posibles, sino comprobar que la API funciona, que las piezas principales están conectadas y que las reglas de acceso se respetan: productos, registro, login, token JWT, rutas protegidas, gestión de administradores y base de pedidos.

Además, se documenta la evolución hacia V3, donde el backend ya se prueba con mayor enfoque en automatización, reutilización de variables dinámicas y validación de respuestas reales de la API.

## Requisitos previos

Antes de probar:

* El backend debe estar arrancado.
* La base de datos debe estar inicializada.
* Deben existir datos de prueba en MySQL.
* Postman debe estar instalado.
* Para ejecutar la colección desde terminal, también debe estar instalado Newman.

URL base:

```text
http://localhost:3000
```

## Variables que hacen que la colección funcione sola

En lugar de escribir tokens e IDs a mano en cada request, la colección usa variables de Postman.

### Variables principales

| Variable | Uso |
| --- | --- |
| `baseUrl` | URL base de la API, por defecto `http://localhost:3000/api`. |
| `adminToken` | Token del login de administrador seed. |
| `userToken` | Token del login de usuario seed. |
| `testUserToken` | Token del usuario demo creado por la coleccion. |
| `idUsuarioDemo` | ID del usuario demo obtenido desde `/perfil`. |
| `idProductoSeed` | ID de un producto existente del catalogo. |
| `idProductoTemporal` | ID del producto temporal creado para probar CRUD. |
| `idPedido` | ID del pedido recien creado. |

### Por qué se usan `{{variable}}`

Las variables entre dobles llaves, como `{{adminToken}}`, se sustituyen automáticamente antes de enviar la request.

Eso permite:

* reutilizar tokens e IDs sin copiarlos manualmente;
* ejecutar la colección completa con el Runner o con Newman;
* evitar errores por IDs fijos o tokens caducados;
* hacer la colección reutilizable en local y en otros entornos.

### Cómo se guardan los datos dinámicos

En los scripts de **Post-response** de algunas requests se guarda la información devuelta por el backend.

Ejemplo para el token del login:

```javascript
const res = pm.response.json();
pm.collectionVariables.set("adminToken", res.token);
```

Ejemplo para un pedido recién creado:

```javascript
const res = pm.response.json();
pm.collectionVariables.set("idPedido", res.idPedido);
```

Ejemplo para un producto temporal recien creado:

```javascript
const res = pm.response.json();
pm.collectionVariables.set("idProductoTemporal", res.idProducto);
```

## Flujo recomendado

1. Consultar productos.
2. Registrar un usuario.
3. Iniciar sesión.
4. Guardar automáticamente el token JWT.
5. Probar una ruta protegida.
6. Probar gestión de usuarios si se dispone de token admin.
7. Probar escritura de productos si se dispone de token admin.
8. Probar pedidos, detalle y cancelación lógica como validación técnica del backend.

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

### Qué valida el test

* que la ruta pública responde;
* que la respuesta es un array;
* que cada producto tiene los campos mínimos esperados;
* que no hay errores de conexión con la base de datos.

### Por qué es importante

Es la forma más sencilla de comprobar que la API está viva y que la capa de lectura funciona antes de probar autenticación o escritura.

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
  "email": "test{{$timestamp}}@mail.com",
  "contrasena": "12345678"
}
```

Respuesta esperada:

```text
201 Created
```

### Qué valida el test

* que el registro funciona;
* que el backend genera un alta correcta;
* que el email dinámico evita conflictos por duplicado.

### Por qué se usa un email con `{{$timestamp}}`

Porque el email cambia en cada ejecución y así se evita el error `409 Conflict` por intentar registrar un correo ya existente.

## 3. Login de usuario

Autentica al usuario y devuelve un token JWT.

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

### Qué valida el test

* que las credenciales son válidas;
* que el backend genera un JWT;
* que ese token se puede guardar en `userToken` o `adminToken`.

### Por qué el token no se pone a mano

El token cambia en cada login. Guardarlo automáticamente hace que la colección funcione sin intervención manual y que Newman pueda ejecutar todo el flujo.

## 4. Obtener perfil

Comprueba que una ruta protegida solo funciona con token.

```text
Método: GET
URL: http://localhost:3000/api/perfil
Header: Authorization: Bearer {{userToken}}
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

### Qué valida el test

* que el token autentica correctamente;
* que el backend asocia la petición al usuario logueado;
* que la respuesta devuelve el perfil esperado.

### Qué ocurre sin token

La petición debe devolver `401 Unauthorized` con un mensaje del tipo `Token no proporcionado`.

## 5. Gestión de usuarios admin

Esta prueba solo funciona con un token de administrador.

```text
Método: GET
URL: http://localhost:3000/api/usuarios
Header: Authorization: Bearer {{adminToken}}
```

Respuesta esperada:

```text
200 OK
```

Si se usa un token de usuario normal, la respuesta esperada es:

```text
403 Forbidden
```

### Qué valida el test

* que solo el admin puede listar usuarios;
* que el backend separa correctamente permisos y autenticación.

### Actualizar un usuario

```text
Método: PUT
URL: http://localhost:3000/api/usuarios/1
Header: Authorization: Bearer {{adminToken}}
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

### Qué valida el test

* que la edición existe;
* que el backend responde con el mensaje correcto;
* que el rol solo puede cambiarse con permiso.

### Reglas de negocio a tener en cuenta

Queda documentado para futuras ampliaciones que el sistema puede incluir estas restricciones:

* un usuario puede editarse a sí mismo sin necesidad de ser admin;
* un usuario puede borrarse a sí mismo sin necesidad de ser admin;
* un usuario no puede editar o borrar a otros usuarios sin permiso;
* el admin principal (`id = 1`) no debería poder editarse ni borrarse a sí mismo;
* los demás usuarios sí podrían hacerlo si la lógica de negocio lo permite.

Estas reglas no tienen por qué estar todas implementadas todavía, pero quedan preparadas como referencia para validar la evolución del backend.

## 6. Escritura de productos admin

La lectura de productos es pública, pero crear, actualizar o eliminar productos requiere token admin.

```text
Método: POST
URL: http://localhost:3000/api/productos
Header: Authorization: Bearer {{adminToken}}
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

### Qué valida el test

* que la escritura está protegida;
* que solo el rol admin puede crear productos;
* que el backend devuelve un mensaje de creación correcto;
* que el `idProducto` creado se puede reutilizar en tests posteriores.

### Que pasa con `idProductoTemporal`

Tras crear el producto, el ID se guarda en `idProductoTemporal` para usarlo automaticamente en `PUT` y `DELETE`.

## 7. Base de pedidos

El backend tiene endpoints y tablas para pedidos. En V3 el checkout del frontend ya crea pedidos reales, por lo que estas pruebas sirven para validar el mismo flujo desde Postman.

```text
Método: POST
URL: http://localhost:3000/api/pedidos
Header: Authorization: Bearer {{userToken}}
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

Respuesta esperada si los datos son válidos:

```text
201 Created
```

### Qué valida el test

* que el backend puede crear pedidos;
* que el pedido guarda dirección, método de pago y productos;
* que devuelve un mensaje de éxito;
* que el `idPedido` se guarda para pruebas posteriores.

### Listar pedidos del usuario autenticado

```text
Método: GET
URL: http://localhost:3000/api/pedidos
Header: Authorization: Bearer {{userToken}}
```

### Consultar un pedido concreto

```text
Método: GET
URL: http://localhost:3000/api/pedidos/{{idPedido}}
Header: Authorization: Bearer {{userToken}}
```

### Cancelar un pedido

```text
Método: PATCH
URL: http://localhost:3000/api/pedidos/{{idPedido}}/cancelar
Header: Authorization: Bearer {{userToken}}
```

Respuesta esperada:

```json
{
  "mensaje": "Pedido cancelado correctamente",
  "pedido": {
    "idPedido": 1,
    "estado": "cancelado"
  }
}
```

La cancelación es lógica: no elimina el pedido, solo actualiza `estado` y `fechaCancelacion`.

### Qué valida el test de cancelación

* que el pedido existe;
* que el usuario tiene permisos;
* que el estado pasa a `cancelado`;
* que la lógica no borra físicamente el registro.

## 8. Respuestas sin token

Para rutas protegidas sin autenticación, el backend debe devolver `401 Unauthorized`.

Ejemplo de mensaje esperado:

```json
{
  "error": "Token no proporcionado"
}
```

### Qué valida este caso

* que el backend protege las rutas sensibles;
* que la seguridad no depende del frontend;
* que el mensaje de error es claro y coherente.

## 9. Errores comunes

| Código                      | Significado                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------- |
| `400 Bad Request`           | Faltan campos o el formato no es correcto.                                               |
| `401 Unauthorized`          | El usuario no está autenticado o el token no es válido.                                  |
| `403 Forbidden`             | El usuario no tiene permisos de administrador o no puede ejecutar la acción.             |
| `404 Not Found`             | El recurso solicitado no existe o el ID guardado no coincide.                            |
| `409 Conflict`              | El email ya está registrado o el dato entra en conflicto con una restricción de negocio. |
| `500 Internal Server Error` | Error interno del servidor o de base de datos.                                           |

## 10. Qué validan los tests de Postman

Los tests añadidos en la colección no solo comprueban que la request responde, sino también:

* que el código HTTP es el esperado;
* que el contenido devuelto es JSON cuando debe serlo;
* que el mensaje de éxito o error coincide con lo esperado;
* que las propiedades del JSON existen;
* que los arrays contienen elementos válidos;
* que los IDs se reutilizan sin hardcodearlos;
* que los tiempos de respuesta son razonables;
* que las rutas protegidas fallan sin token.

## 11. Comandos útiles con Newman

### Ejecutar la colección completa

```bash
newman run squarestruct-v3.postman_collection.json
```

### Ejecutar con más detalle

```bash
newman run squarestruct-v3.postman_collection.json --verbose
```

### Ejecutar con reporte en consola y JSON

```bash
newman run squarestruct-v3.postman_collection.json -r cli json
```

### Ejecutar con environment exportado

```bash
newman run squarestruct-v3.postman_collection.json -e local.postman_environment.json
```

### Pasar un token por terminal si hace falta

```bash
newman run squarestruct-v3.postman_collection.json --env-var adminToken="TU_TOKEN"
```

## 12. Qué se considera correcto al pasar la colección

Si todo funciona, se puede defender que:

* la API responde correctamente;
* la base de datos está conectada;
* el registro funciona;
* el login genera un token;
* las rutas protegidas validan JWT;
* las rutas admin requieren rol `admin`;
* las rutas de escritura de productos requieren rol `admin`;
* existe base técnica para pedidos, detalle y cancelación lógica;
* la colección puede ejecutarse manualmente y de forma automática con Newman.

## Idea clave para explicar

Postman permite probar el backend sin depender del frontend. Así se comprueba si la API funciona por sí sola y se separan los problemas de backend de los problemas de interfaz.

Newman permite llevar esas mismas pruebas a terminal, dejándolas preparadas para revisión técnica, estabilización del proyecto y futuras automatizaciones.
