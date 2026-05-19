
# Backend SquareStruct

## Objetivo

El backend implementa la API REST de SquareStruct, actuando como capa intermedia entre el frontend y la base de datos MySQL. Valida datos, aplica reglas de negocio, gestiona autenticación JWT, roles y permisos, y expone endpoints REST seguros y claros.

## Tecnologías principales

- Node.js (entorno de ejecución)
- Express (API REST modular)
- MySQL 8.4 (base de datos relacional)
- mysql2/promise (conexión a MySQL)
- dotenv (.env y variables de entorno)
- cors (CORS frontend-backend)
- bcrypt (hash de contraseñas)
- jsonwebtoken (tokens JWT)

## Comandos y scripts disponibles

Desde la carpeta `backend/`:

- `npm install` — Instala dependencias
- `npm run dev` — Arranca el backend con Nodemon (desarrollo hot reload)
- `npm start` — Arranca el backend en modo producción
- `npm test` — Ejecuta todos los tests (Jest)
- `npm run test:unit` — Ejecuta solo tests unitarios
- `npm run test:integration` — Ejecuta solo tests de integración (requiere MySQL levantado)

### Base de datos con Docker

Desde la raíz del repositorio:

```bash
docker compose -f docker/docker-compose.yml up -d
```
Esto levanta MySQL y ejecuta automáticamente los scripts de `db/schema.sql` y `db/seeds.sql`.

Si cambias el modelo y quieres reiniciar la base de datos:

```bash
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up -d
```
GET /
GET /api/health
GET /api/db-status
```


## Autenticación, middlewares y roles

La autenticación se basa en JWT y middlewares Express:

- `auth.js`: Verifica el token JWT y añade el usuario autenticado a `req.user`.
- `admin.js`: Permite acceso solo a usuarios con rol `admin`.
- `validacion.js` y `validacionProducto.js`: Validan datos de entrada para registro, login y productos.

**Flujo típico:**
1. El usuario se registra (`/api/usuarios/register`), la contraseña se hashea con bcrypt.
2. Al hacer login (`/api/usuarios/login`), se devuelve un JWT.
3. El frontend envía el JWT en la cabecera `Authorization: Bearer TOKEN`.
4. El middleware `auth.js` valida el token en rutas protegidas.
5. El middleware `admin.js` protege rutas de administración.

**Roles:**
- `usuario`: acceso normal
- `admin`: acceso a gestión de usuarios y productos

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

## Endpoints y rutas principales

**Salud y estado:**
- `GET /` — Comprueba que el backend responde
- `GET /api/health` — Devuelve `OK`
- `GET /api/db-status` — Comprueba tablas y totales básicos en MySQL

### Usuarios y auth

**Usuarios y autenticación:**
- `POST /api/usuarios/register` — Registro (pública)
- `POST /api/usuarios/login` — Login y obtención de JWT (pública)
- `GET /api/usuarios` — Listar usuarios (admin)
- `GET /api/usuarios/:id` — Consultar usuario (admin)
- `PUT /api/usuarios/:id` — Actualizar usuario (admin)
- `DELETE /api/usuarios/:id` — Eliminar usuario (admin)
- `GET /api/perfil` — Perfil del usuario autenticado

**Productos:**
- `GET /api/productos` — Listar productos (pública)
- `GET /api/productos/:id` — Consultar producto (pública)
- `POST /api/productos` — Crear producto (admin)
- `PUT /api/productos/:id` — Editar producto (admin)
- `DELETE /api/productos/:id` — Eliminar producto (admin)

**Pedidos:**
- `GET /api/pedidos` — Listar pedidos del usuario autenticado
- `POST /api/pedidos` — Crear pedido
- `GET /api/pedidos/:id` — Consultar detalle de pedido
- `PATCH /api/pedidos/:id/cancelar` — Cancelar pedido (lógica, no borrado)

**Alias:**
- `/api/orders` — Alias para pedidos (internacionalización)

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


## Variables de entorno y configuración

Copia `.env.example` a `.env` y revisa los valores:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=tu_password
DB_NAME=squarestruct
JWT_SECRET=CAMBIA_ESTA_CLAVE
VITE_API_URL=http://localhost:3000/api
NODE_ENV=development
```

- `PORT`: Puerto del backend Express
- `DB_*`: Configuración de conexión a MySQL (debe coincidir con Docker si usas Compose)
- `JWT_SECRET`: Clave secreta para firmar tokens JWT (¡cámbiala en producción!)
- `VITE_API_URL`: URL base que usa el frontend para llamar a la API (documentada aquí porque conecta ambos)
- `NODE_ENV`: Entorno de ejecución

> Si usas Docker, asegúrate de que los valores coincidan con los definidos en `docker/docker-compose.yml`.
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

Las colecciones Postman están en:

- `backend/postman/squarestruct-mvp.postman_collection.json`
- `backend/postman/squarestruct-v2.postman_collection.json`

Permiten probar manualmente:
- Registro y login (JWT)
- Acceso a perfil autenticado
- Endpoints públicos y protegidos
- Gestión admin de usuarios y productos
- Pedidos y cancelación lógica

Variables recomendadas: `baseUrl`, `token`, `adminToken`, `idUsuario`, `idProducto`.

Para flujos de defensa DAW, se recomienda mostrar:
- Registro, login y obtención de token
- Acceso a rutas protegidas con y sin token
- Pruebas de roles (usuario/admin)

## Tests automatizados


Los tests del backend están en `backend/tests/` y documentados en `tests/README.md`.

Comandos:
- `npm test` — Ejecuta todos los tests (Jest)
- `npm run test:unit` — Solo tests unitarios
- `npm run test:integration` — Solo tests de integración (requiere MySQL levantado)

Cobertura:
- Controladores, servicios y middlewares clave
- Flujos de registro, login, productos y pedidos

Para defensa DAW, se recomienda mostrar tests de integración y mocks de base de datos.

## Notas de desarrollo

## Buenas prácticas y defensa DAW

- Documenta variables y comandos en `.env.example`.
- Usa middlewares para proteger rutas y validar datos.
- Mantén la separación de controladores, servicios y rutas.
- Explica los flujos de autenticación y roles en la defensa.
- Muestra ejemplos reales en Postman y tests.
- Justifica el uso de JWT, roles y validaciones en la presentación.

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
