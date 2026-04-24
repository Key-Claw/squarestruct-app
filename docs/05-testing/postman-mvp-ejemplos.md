# 🧪 Pruebas del MVP con Postman

## 🎯 Objetivo

Este documento recoge ejemplos de pruebas manuales con Postman para validar el funcionamiento básico del MVP de SquareStruct.

Las pruebas propuestas permiten comprobar el flujo principal de la aplicación:

1. Consulta de productos
2. Registro de usuario
3. Inicio de sesión
4. Acceso a una ruta protegida

---

## ⚙️ Requisitos previos

Antes de realizar las pruebas, es necesario:

* Tener el backend en ejecución
* Tener la base de datos inicializada
* Disponer de datos de prueba cargados en la base de datos
* Utilizar Postman o una herramienta similar para enviar peticiones HTTP

Base URL utilizada en los ejemplos:

```text
http://localhost:3000
```

---

## 📦 Colección recomendada en Postman

Se recomienda crear una colección llamada:

```text
SquareStruct - MVP
```

Dentro de ella se pueden organizar las peticiones por bloques:

* Productos
* Usuarios
* Perfil

---

# 1. Obtener productos

## Descripción

Permite comprobar que el endpoint de productos responde correctamente y devuelve información almacenada en la base de datos.

## Petición

* **Método:** GET
* **URL:** `http://localhost:3000/api/productos`
* **Headers:** ninguno
* **Body:** ninguno

## Respuesta esperada

Código de estado esperado:

```text
200 OK
```

Ejemplo de respuesta:

```json
[
  {
    "idProducto": 1,
    "nombre": "Bloque aislante Gablok",
    "descripcion": "Bloque modular para construcción",
    "precio": 25.5,
    "tipo": "aislante",
    "stock": 100,
    "idProveedor": 1
  }
]
```

---

# 2. Registro de usuario

## Descripción

Permite crear un nuevo usuario en el sistema.

## Petición

* **Método:** POST
* **URL:** `http://localhost:3000/api/usuarios/register`
* **Headers:**

  * `Content-Type: application/json`

## Body

```json
{
  "nombre": "Test User",
  "email": "testuser@mail.com",
  "contrasena": "12345678"
}
```

## Respuesta esperada

Código de estado esperado:

```text
201 Created
```

Ejemplo de respuesta:

```json
{
  "mensaje": "Usuario registrado correctamente"
}
```

## Posibles errores

* **400 Bad Request** → faltan campos obligatorios
* **409 Conflict** → el email ya está registrado
* **500 Internal Server Error** → error del servidor

---

# 3. Login de usuario

## Descripción

Permite autenticar un usuario registrado y obtener un token JWT para acceder a rutas protegidas.

## Petición

* **Método:** POST
* **URL:** `http://localhost:3000/api/usuarios/login`
* **Headers:**

  * `Content-Type: application/json`

## Body

```json
{
  "email": "testuser@mail.com",
  "contrasena": "12345678"
}
```

## Respuesta esperada

Código de estado esperado:

```text
200 OK
```

Ejemplo de respuesta:

```json
{
  "token": "<JWT>"
}
```

## Posibles errores

* **400 Bad Request** → faltan campos obligatorios
* **401 Unauthorized** → credenciales incorrectas
* **500 Internal Server Error** → error interno

---

# 4. Obtener perfil de usuario (ruta protegida)

## Descripción

Permite comprobar que una ruta protegida solo puede consultarse si se envía un token JWT válido.

## Petición

* **Método:** GET

* **URL:** `http://localhost:3000/api/perfil`

* **Headers:**

  * `Authorization: Bearer <JWT>`

* **Body:** ninguno

## Respuesta esperada

Código de estado esperado:

```text
200 OK
```

Ejemplo de respuesta:

```json
{
  "idUsuario": 1,
  "nombre": "Test User",
  "email": "testuser@mail.com",
  "rol": "cliente"
}
```

## Posibles errores

* **401 Unauthorized** → token ausente o inválido
* **403 Forbidden** → acceso no permitido
* **500 Internal Server Error** → error interno

---

# 🔁 Flujo recomendado de prueba

Para validar correctamente el MVP, se recomienda seguir este orden:

1. Ejecutar la petición de **obtener productos**
2. Registrar un nuevo usuario
3. Iniciar sesión con ese usuario
4. Copiar el token JWT recibido
5. Probar la ruta protegida incluyendo el token en el header `Authorization`

---

# ✅ Resultado esperado

Si todas las pruebas responden correctamente, se puede considerar validado el flujo principal del MVP:

* La API responde
* La base de datos está conectada
* El sistema registra usuarios
* El login funciona
* La protección mediante JWT está operativa

---

# 🧠 Observaciones

Estas pruebas corresponden a una validación manual inicial del sistema.
Más adelante, este proceso debería complementarse con:

* tests unitarios
* tests de integración
* automatización de pruebas en el workflow del repositorio
