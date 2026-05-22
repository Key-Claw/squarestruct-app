# Estructura Del Backend

El backend esta en `backend/` y usa Express con modulos ES. La API se organiza en rutas, controladores y middlewares. La conexion a MySQL/MariaDB se centraliza en `src/app.js` mediante `mysql2/promise`.

## Estructura

```text
backend/src/
  app.js             Express, CORS, JSON, rutas y pool MySQL
  routes/
    usuarios.js      Registro, login y gestion de usuarios
    productos.js     Catalogo y CRUD protegido de productos
    pedidos.js       Pedidos de usuario y gestion admin
    perfil.js        Perfil autenticado
  controllers/
    usuariosController.js
    productosController.js
    pedidosController.js
  middlewares/
    auth.js          Valida JWT
    admin.js         Valida rol admin
    validacion.js    Registro y login
    validacionProducto.js
  utils/
    formatDate.js
    generateId.js
```

## app.js

`app.js` hace cuatro cosas principales:

1. carga variables de entorno con `dotenv`;
2. configura Express, CORS y JSON;
3. crea el pool MySQL exportado como `db`;
4. monta rutas.

Rutas montadas:

```js
app.use('/api/perfil', perfilRouter)
app.use('/api/pedidos', pedidosRouter)
app.use('/api/orders', pedidosRouter)
app.use('/api/productos', productosRouter)
app.use('/api/usuarios', usuariosRouter)
```

Tambien define:

- `GET /`
- `GET /api/health`
- `GET /api/db-status`

## Rutas

Las rutas solo definen URL, metodo y middlewares. La logica queda en controladores.

Ejemplo real:

```js
router.post('/', authMiddleware, adminMiddleware, validarProducto, crearProducto)
```

Esto significa que crear productos requiere:

1. token valido;
2. rol `admin`;
3. producto valido;
4. controlador `crearProducto`.

## Controladores

Los controladores contienen la logica actual de V3:

- consultas a `db`;
- validaciones especificas de negocio;
- calculo de total de pedidos;
- transacciones;
- normalizacion de texto;
- respuestas JSON.

`pedidosController.js` usa transaccion al crear pedidos:

```text
beginTransaction
  comprobar productos
  calcular total
  insertar pedido
  insertar detalles
commit
```

Si algo falla, ejecuta rollback.

## Middlewares

| Middleware | Funcion |
| --- | --- |
| `auth.js` | Lee `Authorization: Bearer TOKEN`, valida JWT y guarda payload en `req.user`. |
| `admin.js` | Rechaza si `req.user.rol` no es `admin`. |
| `validacion.js` | Valida registro y login. |
| `validacionProducto.js` | Valida campos, tipos y valores de productos. |

## Servicios Historicos

`src/services/userService.js` y `src/services/productService.js` no siguen el estilo activo de V3: usan `require` y hacen referencia a un `db` que no forma parte del flujo ESM actual. Se consideran restos historicos del MVP y no deben documentarse como capa activa.

## Integracion Con Base De Datos

El pool:

```js
mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  charset: 'utf8mb4'
})
```

Las tablas usadas son:

- `usuarios`
- `proveedores`
- `productos`
- `pedidos`
- `pedidoDetalles`

## Decisiones Tecnicas

- Express mantiene la API directa y facil de depurar.
- `mysql2/promise` permite usar `async/await`.
- JWT evita sesiones de servidor.
- `bcrypt` protege contrasenas guardadas.
- CORS permite separar frontend y backend.
- La cancelacion de pedidos es logica para conservar trazabilidad.
- `/api/orders` se mantiene como alias para el frontend sin duplicar controladores.
