# Backend SquareStruct

Backend Express de SquareStruct V2. Expone una API REST para autenticacion, usuarios, perfil, productos y pedidos, usando MySQL/MariaDB mediante `mysql2/promise`.

## Stack

- Node.js con modulos ES
- Express 5
- MySQL/MariaDB
- `mysql2/promise`
- `dotenv`
- `cors`
- `bcrypt`
- `jsonwebtoken`
- Jest
- Supertest
- Nodemon

## Estructura

```text
backend/
  db/
    schema.sql       Modelo relacional completo
    seeds.sql        Datos iniciales
    migrations/      Cambios incrementales aplicados durante V2
    consultas.md     Consultas SQL de comprobacion
  postman/           Colecciones MVP y V2
  src/
    app.js           Express, CORS, JSON, pool MySQL y montaje de rutas
    routes/          usuarios, productos, pedidos y perfil
    controllers/     Logica HTTP y consultas reales
    middlewares/     auth, admin y validaciones
    config/          Configuracion auxiliar
    utils/           Utilidades simples
  tests/
    unit/            Tests unitarios
    integration/     Tests de API con Supertest y MySQL
  server.js          Arranque del servidor
```

Nota: `src/services/userService.js` y `src/services/productService.js` son restos historicos en CommonJS y no forman parte del flujo ESM activo de V2. La logica real esta actualmente en controladores y middlewares.

## Variables De Entorno

Copia `.env.example` a `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=20doblajepuro37
DB_NAME=squarestruct
JWT_SECRET=CAMBIA_ESTA_CLAVE
NODE_ENV=development
```

`VITE_API_URL` pertenece al frontend, pero puede aparecer documentada junto al backend porque define la URL que usa la interfaz para llamar a esta API.

## Arranque

Base de datos de desarrollo:

```bash
docker compose -f docker/docker-compose-dev.yml up -d
```

Backend:

```bash
cd backend
npm install
npm run dev
```

Comprobaciones:

```text
http://localhost:3000/
http://localhost:3000/api/health
http://localhost:3000/api/db-status
```

## Flujo De Peticion

1. Express recibe la peticion en `app.js`.
2. La ruta correspondiente aplica middlewares.
3. `authMiddleware` valida JWT cuando la ruta es privada.
4. `adminMiddleware` comprueba rol `admin` cuando la ruta es administrativa.
5. Las validaciones revisan estructura y campos.
6. El controlador ejecuta consultas con el pool `db`.
7. La respuesta se devuelve como JSON controlado.

## Autenticacion Y Roles

Registro:

- `POST /api/usuarios/register`
- valida nombre, email y contrasena;
- comprueba email duplicado;
- guarda contrasena hasheada con bcrypt.

Login:

- `POST /api/usuarios/login`
- admite email + contrasena;
- tambien admite nombre + primerApellido + contrasena;
- devuelve JWT con `idUsuario`, `nombre`, `email` y `rol`.

Roles:

- `usuario`: puede acceder a perfil, carrito, checkout y sus pedidos/facturas.
- `admin`: puede consultar usuarios, gestionar roles, gestionar productos desde API y revisar facturacion/pedidos.

## Endpoints Principales

| Metodo | Ruta | Proteccion |
| --- | --- | --- |
| `GET` | `/api/health` | Publica |
| `GET` | `/api/db-status` | Publica |
| `POST` | `/api/usuarios/register` | Publica |
| `POST` | `/api/usuarios/login` | Publica |
| `GET` | `/api/perfil` | JWT |
| `GET` | `/api/usuarios` | JWT + admin |
| `GET` | `/api/usuarios/:id` | JWT + admin |
| `PUT` | `/api/usuarios/:id` | JWT |
| `DELETE` | `/api/usuarios/:id` | JWT |
| `GET` | `/api/productos` | Publica |
| `GET` | `/api/productos/:id` | Publica |
| `POST` | `/api/productos` | JWT + admin |
| `PUT` | `/api/productos/:id` | JWT + admin |
| `DELETE` | `/api/productos/:id` | JWT + admin |
| `GET` | `/api/pedidos` | JWT |
| `POST` | `/api/pedidos` | JWT |
| `GET` | `/api/pedidos/:id` | JWT |
| `PATCH` | `/api/pedidos/:id/cancelar` | JWT |
| `GET` | `/api/pedidos/admin/pendientes` | JWT + admin |
| `GET` | `/api/pedidos/admin/todos` | JWT + admin |
| `PATCH` | `/api/pedidos/:id/estado` | JWT + admin |

`/api/orders` es alias de `/api/pedidos` y lo usa el frontend V2.

## Pedidos Y Facturacion

V2 tiene checkout conectado al backend:

- `Checkout.jsx` construye un pedido desde el carrito.
- `orderService.js` envia `POST /api/orders`.
- `pedidosController.js` calcula el total desde precios actuales de productos.
- Se guarda cabecera en `pedidos` y lineas en `pedidoDetalles`.
- El usuario consulta sus facturas desde pedidos reales.
- El admin consulta historial con `/api/orders/admin/todos`.
- El admin cambia estados pendientes a `aceptado` o `denegado`.
- La cancelacion logica usa `estado = 'cancelado'` y `fechaCancelacion`.

## Base De Datos

Tablas reales:

- `usuarios`
- `proveedores`
- `productos`
- `pedidos`
- `pedidoDetalles`

El modelo usa claves foraneas, restricciones `CHECK`, indices e InnoDB. Los productos tienen dimensiones (`alto`, `ancho`, `largo`) para preparar calculos de volumen y futuras funcionalidades del disenador.

## Tests

```bash
npm test
npm run test:unit
npm run test:integration
```

La suite cubre:

- health check;
- registro y login;
- perfil autenticado;
- usuarios admin;
- listado y escritura de productos protegida;
- pedidos autenticados;
- detalle de pedido;
- cancelacion logica;
- permisos por propietario/admin.

Los tests de integracion requieren MySQL levantado y datos cargados desde `schema.sql` y `seeds.sql`.

## Postman

```text
backend/postman/squarestruct-v2.postman_collection.json
backend/postman/squarestruct-mvp.postman_collection.json
```

La coleccion V2 es la referencia actual para pruebas manuales.

## Despliegue

El backend puede ejecutarse en contenedor con `docker/docker-compose.yml`. Para un despliegue real en AWS EC2 u otra plataforma hay que revisar:

- secretos fuera del repositorio;
- `JWT_SECRET`;
- credenciales de base de datos;
- CORS;
- HTTPS;
- persistencia y backups de MySQL/MariaDB;
- usuarios seed y contrasenas temporales.
