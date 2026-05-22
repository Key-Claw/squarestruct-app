# Autenticacion Y Autorizacion

SquareStruct usa JWT para autenticar peticiones y roles para limitar funciones administrativas.

## Registro

Endpoint:

```text
POST /api/usuarios/register
```

Flujo:

1. `validarRegistro` comprueba nombre, email y contrasena.
2. `registerUsuario` comprueba que el email no exista.
3. `bcrypt.hash` cifra la contrasena.
4. Se inserta el usuario con rol por defecto `usuario`.

## Login

Endpoint:

```text
POST /api/usuarios/login
```

Flujo:

1. `validarLogin` comprueba email y contrasena para el flujo principal.
2. `loginUsuario` busca usuario por email.
3. Tambien acepta login por `nombre` + `primerApellido` + `contrasena`.
4. `bcrypt.compare` valida la contrasena.
5. `jsonwebtoken.sign` genera un token con expiracion de 2 horas.

Payload del JWT:

```json
{
  "idUsuario": 1,
  "nombre": "Admin",
  "email": "admin@sqst.com",
  "rol": "admin"
}
```

## Uso Del Token

El frontend guarda:

```text
localStorage.authToken
localStorage.currentUser
```

En cada peticion autenticada, `api.js` envia:

```http
Authorization: Bearer TOKEN
```

`authService.js` decodifica el token para comprobar caducidad y limpiar la sesion si ha expirado.

## Middleware Auth

`backend/src/middlewares/auth.js`:

- lee `Authorization`;
- extrae el token;
- comprueba `JWT_SECRET`;
- valida con `jwt.verify`;
- guarda el payload en `req.user`.

Errores:

- `401` si falta token;
- `403` si el token es invalido;
- `500` si falta `JWT_SECRET`.

## Middleware Admin

`backend/src/middlewares/admin.js` permite continuar solo si:

```js
req.user?.rol?.toLowerCase() === 'admin'
```

Se usa en:

- listar usuarios;
- consultar usuario por id;
- crear, editar y eliminar productos;
- listar pedidos admin;
- cambiar estado de pedidos.

## Roles

| Rol | Permisos |
| --- | --- |
| `usuario` | Perfil, checkout, pedidos propios y facturas propias. |
| `admin` | Permisos de usuario mas administracion de usuarios, productos y facturacion. |

## Proteccion En Frontend

`App.jsx` y `Settings.jsx` evitan que usuarios normales accedan a tabs admin. Si se intenta abrir `usuarios` o `facturacion` sin rol admin, se redirige a `perfil`.

La proteccion real sigue estando en backend. La proteccion frontend mejora experiencia, pero no sustituye middlewares.

## Cuentas Sensibles

El backend trata `admin@sqst.com` como cuenta super admin para evitar editarla o eliminarla desde flujos normales.
