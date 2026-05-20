
# Autenticación y roles en el backend

## Objetivo

Este documento explica cómo funciona la autenticación real del proyecto, cómo se protegen las rutas y cómo se justifica en una defensa DAW o presentación profesional.

El sistema implementa:
- `bcrypt` para proteger contraseñas
- `jsonwebtoken` para generar tokens JWT
- Middlewares para proteger rutas y limitar acceso según rol
- Variables de entorno para claves sensibles

## Registro de usuario

Endpoint:

```text
POST /api/usuarios/register
```

El usuario envía:

```json
{
  "nombre": "Test",
  "primerApellido": "Usuario",
  "email": "test@mail.com",
  "contrasena": "12345678"
}
```

Antes de guardar el usuario:

1. Se validan los campos principales.
2. Se comprueba que el email no exista.
3. La contraseña se hashea con `bcrypt`.
4. Se inserta el usuario en MySQL.

La contraseña real no se guarda en texto plano.

## Login

Endpoint:

```text
POST /api/usuarios/login
```

El usuario envía:

```json
{
  "email": "test@mail.com",
  "contrasena": "12345678"
}
```

El backend:

1. Busca el usuario.
2. Compara la contraseña con `bcrypt.compare`.
3. Si es correcta, genera un JWT.
4. Devuelve el token.

Respuesta:

```json
{
  "token": "TOKEN_JWT"
}
```

## Uso del token

En rutas protegidas, el frontend envía:

```http
Authorization: Bearer TOKEN_JWT
```

El middleware `auth.js`:

1. Lee la cabecera `Authorization`.
2. Extrae el token.
3. Verifica la firma con `JWT_SECRET`.
4. Añade los datos del usuario a `req.user`.

Si el token no existe, responde `401`.

Si el token no es válido, responde `403`.

## Roles

El MVP trabaja con dos roles:

| Rol | Uso |
| --- | --- |
| `usuario` | Usuario normal de la plataforma. |
| `admin` | Usuario con permisos para gestionar usuarios, escribir productos y cancelar pedidos de cualquier usuario. |

El middleware `admin.js` comprueba:

```text
req.user?.rol?.toLowerCase() === 'admin'
```

Se normaliza a minusculas para evitar problemas si el rol llega como `Admin` o `ADMIN`.

## Rutas públicas y protegidas

| Ruta | Tipo |
| --- | --- |
| `POST /api/usuarios/register` | Pública |
| `POST /api/usuarios/login` | Pública |
| `GET /api/productos` | Pública |
| `GET /api/perfil` | Protegida |
| `GET /api/pedidos` | Protegida |
| `POST /api/pedidos` | Protegida |
| `GET /api/usuarios` | Protegida y admin |
| `GET /api/usuarios/:id` | Protegida y admin |
| `PUT /api/usuarios/:id` | Protegida y admin |

Rutas protegidas anadidas en V2:

| Ruta | Tipo |
| --- | --- |
| `GET /api/productos/:id` | Publica |
| `POST /api/productos` | Protegida y admin |
| `PUT /api/productos/:id` | Protegida y admin |
| `DELETE /api/productos/:id` | Protegida y admin |
| `GET /api/pedidos/:id` | Protegida: propietario o admin |
| `PATCH /api/pedidos/:id/cancelar` | Protegida: propietario o admin |
| `DELETE /api/usuarios/:id` | Protegida y admin |

## Seguridad en el MVP

Decisiones aplicadas:

- No guardar contraseñas en texto plano.
- Usar JWT para sesiones sin guardar estado en servidor.
- Separar rutas públicas y privadas.
- Usar roles para limitar operaciones administrativas.
- Guardar `JWT_SECRET` como variable de entorno.


## Buenas prácticas y defensa DAW

- Explica el flujo completo: registro, login, obtención de JWT, uso en frontend y protección de rutas.
- Justifica el uso de JWT para sesiones sin estado y la separación de roles.
- Muestra ejemplos reales de rutas públicas, protegidas y de administración.
- Demuestra en la defensa cómo se protege la contraseña y cómo se limita el acceso según el rol.
