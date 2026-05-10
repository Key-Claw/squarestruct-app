# Flujo de peticiones del backend

## Objetivo

Este documento explica qué ocurre dentro del backend cuando el frontend llama a la API.

La idea principal es que el backend actúa como intermediario entre la interfaz y MySQL.

## Flujo general

```text
Frontend -> Ruta Express -> Middleware -> Controlador -> MySQL -> Respuesta JSON
```

Cada parte tiene una responsabilidad:

| Parte | Responsabilidad |
| --- | --- |
| Frontend | Envía la petición HTTP. |
| Ruta | Decide qué controlador debe ejecutarse. |
| Middleware | Valida datos, token o permisos. |
| Controlador | Ejecuta la lógica principal de la petición. |
| MySQL | Guarda o devuelve datos. |
| Respuesta JSON | Devuelve el resultado al frontend. |

## Ejemplo: consultar productos

```text
GET /api/productos
```

Flujo:

1. El frontend pide el catálogo.
2. Express recibe la petición en `routes/productos.js`.
3. Se ejecuta `getProductos`.
4. El controlador consulta `productos` y `proveedores`.
5. MySQL devuelve los registros.
6. El backend responde con JSON.

Este endpoint es público porque el catálogo debe poder consultarse sin iniciar sesión.

## Ejemplo: login

```text
POST /api/usuarios/login
```

Flujo:

1. El frontend envía email y contraseña.
2. El middleware valida que los datos tengan formato correcto.
3. El controlador busca el usuario por email.
4. `bcrypt.compare` compara la contraseña enviada con el hash guardado.
5. Si coincide, se genera un token JWT.
6. El backend devuelve el token al frontend.

## Ejemplo: perfil autenticado

```text
GET /api/perfil
```

Flujo:

1. El frontend envía el token en la cabecera `Authorization`.
2. `authMiddleware` extrae el token.
3. `jsonwebtoken` valida el token.
4. Si es correcto, se añade el usuario a `req.user`.
5. La ruta devuelve los datos del usuario autenticado.

## Ejemplo: crear pedido

```text
POST /api/pedidos
```

Flujo:

1. El usuario debe estar autenticado.
2. El backend obtiene el `idUsuario` desde el JWT.
3. Se comprueba que el pedido tenga dirección, método de pago y productos.
4. Se consulta el precio de cada producto en MySQL.
5. Se calcula el total.
6. Se crea el pedido en `pedidos`.
7. Se insertan las líneas en `pedidoDetalles`.
8. Se confirma la transacción.

## Idea clave para explicar

El backend no es solo un puente: también valida, protege rutas, calcula datos y asegura que la información que llega a MySQL sea coherente.
