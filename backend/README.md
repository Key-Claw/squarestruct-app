# Backend SquareStruct

## Objetivo

El backend implementa la API REST de SquareStruct.

Su responsabilidad es actuar como capa intermedia entre el frontend y la base de datos MySQL. El frontend no accede directamente a MySQL: hace peticiones HTTP al backend, y el backend valida datos, aplica reglas de negocio, consulta la base de datos y devuelve respuestas JSON.

Actualmente gestiona:

Nota de revision V2: ademas de la base tecnica inicial, el backend ya protege la escritura de productos con rol `admin` y permite crear, consultar y cancelar pedidos de forma logica sin borrarlos de la base de datos.

- autenticación de usuarios;
- perfil de usuario autenticado;
- administración básica de usuarios;
- catálogo de productos modulares;
- base técnica para creación y consulta de pedidos;
- conexión con MySQL;
- consultas y scripts SQL para explicar y validar el modelo de datos.

## Tecnologías usadas

- Node.js como entorno de ejecución.
- Express para crear la API REST.
- MySQL como base de datos relacional.
- mysql2/promise para conectarse a MySQL desde Node.js.
- dotenv para cargar variables de entorno desde `.env`.
- cors para permitir peticiones desde el frontend.
- bcrypt para hashear contraseñas.
- jsonwebtoken para generar y validar tokens JWT.
- Jest y Supertest para tests unitarios e integración.
- Nodemon para arrancar el backend en modo desarrollo.

El proyecto usa módulos ES (`import/export`) porque `package.json` contiene:

```json
"type": "module"
```

## Estructura

```text
backend/
  db/
    schema.sql       Creación completa de tablas, claves e índices
    seeds.sql        Datos iniciales para desarrollo y demo
    consultas.md     Consultas útiles para comprobar y explicar la BD
    migrations/      Cambios SQL aplicados durante la evolución del modelo
    backups/         Documentación de copias de seguridad
  postman/           Colección para pruebas manuales de la API
  src/
    app.js           Configuración de Express, rutas y pool de MySQL
    config/          Configuración auxiliar
    controllers/     Lógica de entrada de las peticiones
    middlewares/     Autenticación, autorización y validaciones
    routes/          Endpoints de la API
    services/        Servicios auxiliares del MVP
    utils/           Funciones auxiliares
  tests/
    unit/            Tests unitarios
    integration/     Tests de integración
  .env.example       Plantilla de variables de entorno
  package.json       Scripts y dependencias
  server.js          Punto de entrada del backend
```

## Configuración inicial

Desde la carpeta `backend/`, instala dependencias:

```bash
npm install
```

Crea el archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

Variables importantes:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=20doblajepuro37
DB_NAME=squarestruct
JWT_SECRET=CAMBIA_ESTA_CLAVE
VITE_API_URL=http://localhost:3000/api
NODE_ENV=development
```

Si se usa la base de datos levantada con `docker/docker-compose.yml`, los valores de conexión deben coincidir con los definidos en Docker.

`JWT_SECRET` debe cambiarse antes de desplegar el proyecto fuera del entorno local.

`VITE_API_URL` indica la URL base que usa el frontend para llamar a la API. En desarrollo local apunta al backend:

```text
http://localhost:3000/api
```

Aunque el prefijo `VITE_` es propio del frontend con Vite, se documenta aquí porque conecta directamente el frontend con este backend.

## Base de datos con Docker

Desde la raíz del repositorio:

```bash
docker compose -f docker/docker-compose.yml up -d
```

Este comando levanta MySQL y ejecuta automáticamente:

```text
backend/db/schema.sql
backend/db/seeds.sql
```

Los scripts de inicialización solo se ejecutan la primera vez que MySQL crea el volumen de datos. Si se cambia `schema.sql` o `seeds.sql` y se quiere reconstruir la base de datos desde cero:

```bash
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up -d
```

## Arrancar backend

Desde `backend/`:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

URL local:

```text
http://localhost:3000
```

Comprobaciones rápidas:

```text
GET /
GET /api/health
GET /api/db-status
```

## Scripts disponibles

```bash
npm run dev
```

Arranca el backend con Nodemon y reinicia el servidor al detectar cambios.

```bash
npm start
```

Arranca el backend con Node.js.

```bash
npm test
```

Ejecuta todos los tests.

```bash
npm run test:unit
```

Ejecuta tests unitarios.

```bash
npm run test:integration
```

Ejecuta tests de integración. Para estos tests es necesario que MySQL esté levantado y que `.env` apunte a una base de datos válida.

## Autenticación y autorización

La autenticación se basa en JWT.

Flujo actual:

1. El usuario se registra con `POST /api/usuarios/register`.
2. La contraseña se hashea con `bcrypt`.
3. El usuario inicia sesión con `POST /api/usuarios/login`.
4. Si las credenciales son correctas, el backend devuelve un token JWT.
5. El frontend envía ese token en las rutas protegidas usando la cabecera:

```http
Authorization: Bearer TOKEN
```

El middleware `auth.js` valida el token y añade los datos del usuario autenticado a `req.user`.

El middleware `admin.js` comprueba que el usuario tenga rol `admin`. Se usa en las rutas privadas de gestión de usuarios.

Roles actuales:

- `usuario`: rol normal.
- `admin`: puede consultar, actualizar y eliminar usuarios desde las rutas protegidas de administración.

## Endpoints principales

### Salud y estado

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/` | Comprueba que el backend responde. |
| GET | `/api/health` | Devuelve `OK`. |
| GET | `/api/db-status` | Comprueba tablas y totales básicos en MySQL. |

### Usuarios y auth

| Método | Ruta | Protección | Descripción |
| --- | --- | --- | --- |
| POST | `/api/usuarios/register` | Pública | Registra un usuario. |
| POST | `/api/usuarios/login` | Pública | Inicia sesión y devuelve un JWT. |
| GET | `/api/usuarios` | Admin | Lista usuarios. |
| GET | `/api/usuarios/:id` | Admin | Consulta un usuario. |
| PUT | `/api/usuarios/:id` | Admin | Actualiza un usuario. |
| DELETE | `/api/usuarios/:id` | Admin | Elimina un usuario. |
| GET | `/api/perfil` | Usuario autenticado | Devuelve los datos del usuario a partir del JWT. |

Ejemplo de registro:

```json
{
  "nombre": "Test",
  "primerApellido": "Usuario",
  "email": "test@mail.com",
  "contrasena": "12345678"
}
```

Ejemplo de login:

```json
{
  "email": "test@mail.com",
  "contrasena": "12345678"
}
```

### Productos

Las rutas `GET` son publicas. Las rutas `POST`, `PUT` y `DELETE` requieren JWT y rol `admin`.

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/productos` | Lista productos con información del proveedor. |
| GET | `/api/productos/:id` | Consulta un producto por id. |
| POST | `/api/productos` | Crea un producto. |
| PUT | `/api/productos/:id` | Actualiza un producto. |
| DELETE | `/api/productos/:id` | Elimina un producto. |

Campos principales de producto:

- `nombre`
- `descripcion`
- `precio`
- `tipo`: `bloque` o `pilar`
- `material`: `Plastico reciclable` u `Hormigon`
- `alto`
- `ancho`
- `largo`
- `idProveedor`

Las dimensiones se guardan porque el catálogo está pensado para piezas modulares y para futuras funcionalidades de cálculo, presupuesto y representación 3D.

### Pedidos

Revision V2: la API de pedidos permite crear pedidos autenticados, listar pedidos del usuario, consultar un pedido concreto y cancelarlo de forma logica. El checkout completo desde el carrito del frontend queda para fases siguientes.

| Método | Ruta | Protección | Descripción |
| --- | --- | --- | --- |
| GET | `/api/pedidos` | Usuario autenticado | Lista los pedidos del usuario autenticado. |
| POST | `/api/pedidos` | Usuario autenticado | Crea un pedido con varios productos. |
| GET | `/api/pedidos/:id` | Propietario o admin | Consulta el detalle de un pedido. |
| PATCH | `/api/pedidos/:id/cancelar` | Propietario o admin | Cambia el estado a `cancelado` y guarda `fechaCancelacion`. |
| GET | `/api/orders` | Usuario autenticado | Alias de `/api/pedidos`. |
| POST | `/api/orders` | Usuario autenticado | Alias de `/api/pedidos`. |

Ejemplo de cancelacion logica:

```text
PATCH /api/pedidos/1/cancelar
Authorization: Bearer TOKEN
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

No se elimina el pedido de la base de datos. Solo se actualiza el estado. No se pueden cancelar pedidos ya cancelados, enviados o entregados.

Ejemplo de creación de pedido:

```json
{
  "direccionEnvio": "Calle Falsa 123, Madrid",
  "metodoPago": "tarjeta",
  "productos": [
    {
      "idProducto": 1,
      "cantidad": 2
    }
  ]
}
```

## Concepción de la base de datos

La base de datos se ha diseñado como una tienda online de bloques y piezas modulares.

Entidades actuales:

- `usuarios`: clientes y administradores.
- `proveedores`: empresas proveedoras de bloques y pilares.
- `productos`: catálogo de piezas modulares.
- `pedidos`: cabecera del pedido realizado por un usuario.
- `pedidoDetalles`: relación entre pedidos y productos, con cantidad y precio unitario.

Relaciones principales:

- Un usuario puede tener muchos pedidos.
- Un pedido pertenece a un usuario.
- Un pedido puede contener muchos productos.
- Un producto puede aparecer en muchos pedidos.
- Un producto pertenece a un proveedor.
- Un proveedor puede tener muchos productos.

La tabla intermedia `pedidoDetalles` permite resolver la relación muchos a muchos entre `pedidos` y `productos`.

El modelo usa claves foráneas, restricciones `CHECK`, índices y motor `InnoDB` para reforzar la integridad de datos.

## Producto modular y futura entidad plano

Los productos ya tienen dimensiones físicas:

- `alto`
- `ancho`
- `largo`

Esto permite preparar el backend para funcionalidades futuras como:

- cálculo de volumen;
- cálculo de presupuesto por número de piezas;
- validación de compatibilidad entre bloques y pilares;
- generación o visualización de un plano 3D.

Todavía no existe una entidad `plano`. La idea futura sería ampliarla para guardar diseños creados por el usuario, por ejemplo:

- usuario propietario del plano;
- nombre del proyecto;
- dimensiones del espacio;
- piezas colocadas;
- posiciones 2D/3D;
- coste estimado;
- fecha de creación y modificación.

Esa ampliación debería conectarse con `usuarios`, `productos` y, si se convierte en compra, con `pedidos`.

## Archivos SQL

`schema.sql` crea el modelo completo desde cero.

`seeds.sql` inserta datos de ejemplo:

- proveedores reales o inspirados en proveedores reales;
- usuarios de prueba;
- productos de plástico reciclable y hormigón;
- pedidos de ejemplo.

`consultas.md` contiene consultas preparadas para comprobar la base de datos y explicar el modelo en una presentación. Incluye consultas de lectura y análisis sobre catálogo, usuarios, proveedores, pedidos, cálculos de volumen y consultas orientadas al futuro diseño 3D.

`migrations/` contiene cambios incrementales que se fueron aplicando durante el desarrollo, como dimensiones de productos, metadatos de proveedores y material del producto.

## Validaciones

El backend valida datos antes de llegar a la base de datos:

- registro de usuario: nombre, email y contraseña mínima;
- login: email y contraseña;
- productos: nombre, precio, tipo, material, dimensiones y proveedor;
- pedidos: dirección, método de pago y lista de productos.

Además, la base de datos refuerza reglas importantes con restricciones:

- roles permitidos en usuarios;
- tipos y materiales permitidos;
- precios y dimensiones positivas;
- estados y métodos de pago permitidos;
- integridad entre usuarios, pedidos, productos y proveedores.

## Pruebas manuales con Postman

Existe una colección en:

```text
backend/postman/squarestruct-mvp.postman_collection.json
```

Sirve para probar manualmente el flujo básico del MVP:

- registro;
- login;
- acceso a perfil con token;
- productos;
- gestión admin de usuarios;
- base de pedidos.

## Tests automatizados

Los tests del backend estan documentados en `tests/README.md`.

Comandos:

```bash
npm test
npm run test:unit
npm run test:integration
```

## Notas de desarrollo

El backend se ha trabajado por capas:

- `routes`: definen las URLs y middlewares aplicados.
- `controllers`: contienen la lógica principal de cada petición.
- `middlewares`: validan autenticación, permisos y datos de entrada.
- `db`: centraliza el modelo SQL y datos iniciales.

También se han añadido normalizadores de texto en usuarios y productos para corregir posibles problemas de codificación en datos con tildes.

## Pendiente o mejorable

Nota de revision V2: la proteccion admin de escritura de productos y la cobertura principal de productos, pedidos y permisos admin ya existen. Los pendientes siguientes se mantienen como mejoras de evolucion.

- Crear la entidad `plano` para guardar diseños 2D/3D de usuarios.
- Revisar si el stock debe formar parte del modelo de productos antes de consolidar pedidos con control de inventario.
- Extraer más lógica desde controllers hacia services cuando crezca el backend.
- Añadir protección de administrador a creación, actualización y borrado de productos si el frontend lo requiere.
- Ampliar cobertura cuando se cierre el checkout completo desde frontend.
- Cambiar secretos y credenciales antes de desplegar en AWS.

## Nota para AWS

En desarrollo local, MySQL se levanta con Docker Compose.

Para AWS habrá que decidir si:

- se mantiene MySQL en contenedor con volúmenes persistentes bien configurados;
- o se usa Amazon RDS para MySQL, que suele ser mejor para producción.

Antes de desplegar se deben revisar:

- variables de entorno;
- `JWT_SECRET`;
- credenciales de base de datos;
- puertos expuestos;
- CORS;
- persistencia de datos;
- backups;
- usuarios seed y contraseñas temporales.

## Idea clave

El backend concentra la lógica de la aplicación: recibe las peticiones del frontend, valida los datos, aplica autenticación y permisos, habla con MySQL y devuelve respuestas JSON controladas.
