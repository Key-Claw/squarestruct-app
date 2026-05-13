# Flujo de peticiones del backend

## Objetivo

Este documento explica que ocurre dentro del backend cuando el frontend llama a la API.

La idea principal es que el backend actua como intermediario entre la interfaz y MySQL.

## Flujo general

```text
Frontend -> Ruta Express -> Middleware -> Controlador -> MySQL -> Respuesta JSON
```

Cada parte tiene una responsabilidad:

| Parte | Responsabilidad |
| --- | --- |
| Frontend | Envia la peticion HTTP. |
| Ruta | Decide que controlador debe ejecutarse. |
| Middleware | Valida datos, token o permisos. |
| Controlador | Ejecuta la logica principal de la peticion. |
| MySQL | Guarda o devuelve datos. |
| Respuesta JSON | Devuelve el resultado al frontend. |

## Ejemplo: consultar productos

```text
GET /api/productos
```

Flujo:

1. El frontend pide el catalogo.
2. Express recibe la peticion en `routes/productos.js`.
3. Se ejecuta `getProductos`.
4. El controlador consulta `productos` y `proveedores`.
5. MySQL devuelve los registros.
6. El backend responde con JSON.

Este endpoint es publico porque el catalogo debe poder consultarse sin iniciar sesion.

## Ejemplo: crear producto como admin

```text
POST /api/productos
```

Flujo:

1. El cliente envia el token JWT en `Authorization`.
2. `authMiddleware` comprueba que el token sea valido.
3. `adminMiddleware` comprueba que el rol sea `admin`.
4. `validarProducto` revisa nombre, precio, tipo, material, dimensiones y proveedor.
5. El controlador crea el producto en MySQL.
6. El backend devuelve el producto creado.

Esto evita que un usuario normal pueda modificar el catalogo.

## Ejemplo: login

```text
POST /api/usuarios/login
```

Flujo:

1. El frontend envia email y contrasena.
2. El middleware valida que los datos tengan formato correcto.
3. El controlador busca el usuario por email.
4. `bcrypt.compare` compara la contrasena enviada con el hash guardado.
5. Si coincide, se genera un token JWT.
6. El backend devuelve el token al frontend.

## Ejemplo: perfil autenticado

```text
GET /api/perfil
```

Flujo:

1. El frontend envia el token en la cabecera `Authorization`.
2. `authMiddleware` extrae el token.
3. `jsonwebtoken` valida el token.
4. Si es correcto, se anade el usuario a `req.user`.
5. La ruta devuelve los datos del usuario autenticado.

## Ejemplo: gestion de usuarios admin

```text
GET /api/usuarios
PUT /api/usuarios/:id
```

Flujo:

1. El frontend envia el token JWT del administrador.
2. `authMiddleware` comprueba que el token sea valido.
3. `adminMiddleware` comprueba que el rol sea `admin`.
4. El controlador consulta o actualiza la tabla `usuarios`.
5. El backend devuelve la lista de usuarios o el resultado de la actualizacion.

Esta parte demuestra que el MVP ya tiene una primera administracion protegida por rol.

## Ejemplo: pedido

```text
POST /api/pedidos
```

Flujo previsto en backend:

1. El usuario debe estar autenticado.
2. El backend obtiene el `idUsuario` desde el JWT.
3. Se comprueba que el pedido tenga direccion, metodo de pago y productos.
4. Se consulta el precio de cada producto en MySQL.
5. Se calcula el total.
6. Se crea el pedido en `pedidos`.
7. Se insertan las lineas en `pedidoDetalles`.
8. Se confirma la transaccion.

En el frontend actual existe carrito visual y servicio de pedidos, pero el checkout completo desde el carrito queda para fases siguientes. Por eso se documenta como base tecnica de pedidos, no como flujo final cerrado.

## Ejemplo: cancelar pedido

```text
PATCH /api/pedidos/:id/cancelar
```

Flujo:

1. El usuario envia el token JWT.
2. `authMiddleware` valida el token.
3. El controlador busca el pedido.
4. Se comprueba que el usuario sea propietario del pedido o tenga rol `admin`.
5. Se rechaza si el pedido ya esta `cancelado`, `enviado` o `entregado`.
6. Se actualiza `estado = cancelado` y `fechaCancelacion = NOW()`.
7. El backend responde con el id del pedido y su nuevo estado.

La cancelacion es logica: no borra el pedido ni sus lineas, mantiene trazabilidad.

## Idea clave para explicar

El backend no es solo un puente: tambien valida, protege rutas, calcula datos y asegura que la informacion que llega a MySQL sea coherente.
