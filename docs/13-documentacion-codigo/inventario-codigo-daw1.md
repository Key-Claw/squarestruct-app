# Inventario Del Codigo Para Defensa DAW1

## Objetivo

Este documento ayuda a estudiar el codigo antes de la exposicion. Resume que hace cada zona importante del repositorio y que conviene saber explicar.

## Vista General

```text
frontend React/Vite
  -> llama a la API con services/api.js
backend Express
  -> valida datos y permisos
  -> consulta MySQL con mysql2/promise
base de datos MySQL
  -> guarda usuarios, proveedores, productos, pedidos y detalles
tests y CI
  -> comprueban backend, frontend, lint y build
```

## Archivos Raiz

| Archivo o carpeta | Para que sirve | Que defender |
| --- | --- | --- |
| `README.md` | Presentacion general del proyecto. | Es la entrada principal para entender alcance, stack y comandos. |
| `docs/README.md` | Indice de documentacion tecnica. | Marca el orden recomendado de estudio. |
| `.github/workflows/tests.yml` | CI de GitHub Actions. | Automatiza pruebas de backend, frontend, lint y build. |
| `docker/` | Compose para MySQL o entorno completo. | Facilita repetir el entorno sin instalar MySQL manualmente. |

## Backend

| Archivo | Responsabilidad | Que defender |
| --- | --- | --- |
| `backend/server.js` | Arranca Express y comprueba la conexion a BD. | Separacion entre arranque y app para poder testear. |
| `backend/src/app.js` | Configura Express, CORS, JSON, rutas y pool MySQL. | Punto central de la API. |
| `backend/src/routes/usuarios.js` | Registro, login y CRUD de usuarios. | Rutas publicas y privadas. |
| `backend/src/routes/productos.js` | Catalogo y CRUD admin de productos. | Lectura publica, escritura solo admin. |
| `backend/src/routes/pedidos.js` | Pedidos de usuario y gestion admin. | Proteccion JWT y admin segun ruta. |
| `backend/src/routes/perfil.js` | Perfil del usuario autenticado. | Uso de `req.user` desde JWT. |
| `backend/src/controllers/usuariosController.js` | Logica de usuarios, bcrypt y JWT. | Hash de contrasenas, login y roles. |
| `backend/src/controllers/productosController.js` | Logica de productos y proveedores. | Validaciones y consultas con joins. |
| `backend/src/controllers/pedidosController.js` | Creacion, consulta, cancelacion y estados de pedidos. | Transacciones, calculo de total en backend y permisos. |
| `backend/src/middlewares/auth.js` | Valida `Authorization: Bearer TOKEN`. | Seguridad de rutas privadas. |
| `backend/src/middlewares/admin.js` | Comprueba rol `admin`. | Separacion entre usuario normal y administrador. |
| `backend/src/middlewares/validacion.js` | Valida registro/login. | Evita datos incompletos. |
| `backend/src/middlewares/validacionProducto.js` | Valida productos. | Protege integridad antes de llegar a MySQL. |

## Base De Datos

| Archivo | Responsabilidad | Que defender |
| --- | --- | --- |
| `backend/db/schema.sql` | Crea tablas, restricciones, claves foraneas e indices. | Modelo relacional y reglas de integridad. |
| `backend/db/seeds.sql` | Inserta datos de prueba. | Permite demo y tests reproducibles. |
| `backend/db/migrations/` | Guarda cambios historicos del modelo. | Explica evolucion del proyecto. |
| `backend/db/consultas.md` | Consultas SQL utiles. | Sirve para comprobar relaciones y datos. |

Tablas reales:

- `usuarios`
- `proveedores`
- `productos`
- `pedidos`
- `pedidoDetalles`

No existe todavia tabla `planos`; el disenador guarda borradores en navegador.

## Frontend

| Archivo | Responsabilidad | Que defender |
| --- | --- | --- |
| `frontend/src/main.jsx` | Entrada de React. | Renderiza la app y carga estilos globales. |
| `frontend/src/App.jsx` | Shell, rutas, usuario, carrito, checkout y modales. | Estado global principal. |
| `frontend/src/routes.js` | Rutas y aliases. | `HashRouter`, `/setings` y alias `/settings`. |
| `frontend/src/services/api.js` | Cliente fetch comun. | URL base, JSON, JWT y errores. |
| `frontend/src/services/authService.js` | Login, registro, token, perfil y usuarios admin. | `localStorage`, expiracion JWT y rol admin. |
| `frontend/src/services/productService.js` | Carga y filtro de productos. | Catalogo desde backend con filtro en cliente. |
| `frontend/src/services/orderService.js` | Pedidos y facturacion. | Alias `/orders` para la API de pedidos. |
| `frontend/src/pages/Catalog.jsx` | Catalogo, filtros y carrito. | Carga desde API y fallback local. |
| `frontend/src/pages/Design.jsx` | Editor 2D/3D. | Piezas de BD, accesorios locales, localStorage, JSON y estimacion. |
| `frontend/src/pages/settings/Settings.jsx` | Cuenta, facturas, usuarios y facturacion admin. | Area privada y tabs protegidas por rol. |
| `frontend/src/components/layout/CartPanel.jsx` | Carrito lateral. | Cantidades, total y paso a checkout. |
| `frontend/src/components/settings/Checkout.jsx` | Formulario de compra. | Crea pedidos autenticados en backend. |
| `frontend/src/components/design/editor/useDesignEditor.js` | Logica del editor. | Colocacion, validaciones, resumen, guardado local y exportacion. |
| `frontend/src/components/design/three/Viewer3D.jsx` | Vista 3D. | Three.js integrado con React. |

## Testing

| Zona | Archivos | Que comprueba |
| --- | --- | --- |
| Backend unitario | `backend/tests/unit/health.test.js` | Health check de Express. |
| Backend integracion | `backend/tests/integration/*.test.js` | Auth, perfil, productos, pedidos y permisos. |
| Frontend | `frontend/src/tests/*.test.jsx` | Renderizado principal de App, Home y Navbar. |
| Config frontend | `frontend/vitest.config.js` | jsdom y setup de Testing Library. |

## CI

`.github/workflows/tests.yml` tiene dos jobs:

- `backend-tests`: levanta MySQL 8.0, carga `schema.sql` y `seeds.sql`, instala con `npm ci` y ejecuta Jest.
- `frontend-build`: instala frontend, ejecuta Vitest, ESLint y `vite build`.

## Flujo Que Hay Que Saber Dibujar

```text
Login
  -> LoginForm
  -> authService.loginUser
  -> POST /api/usuarios/login
  -> usuariosController
  -> bcrypt compara contrasena
  -> jsonwebtoken crea JWT
  -> frontend guarda authToken y currentUser
```

```text
Pedido
  -> CartPanel
  -> Checkout
  -> orderService.crearPedido
  -> POST /api/orders
  -> authMiddleware
  -> pedidosController.crearPedido
  -> transaccion MySQL
  -> pedidos + pedidoDetalles
  -> facturas del usuario
```

```text
Disenador
  -> Design.jsx
  -> useDesignEditor
  -> GET /api/productos
  -> productos convertidos en piezas
  -> plano 2D
  -> vista 3D
  -> borrador localStorage o export JSON
```

## Limites Que Hay Que Decir Sin Miedo

- No hay pagos reales; `metodoPago` es un dato del pedido.
- No hay despliegue productivo cerrado.
- No hay tabla `planos` todavia.
- El disenador guarda borrador en navegador, no en MySQL.
- Los tests cubren los flujos principales, pero no todo el frontend visual.

Decir estos limites suma puntos si se explica que el proyecto esta pensado como final de DAW1 y que se han priorizado integracion, claridad y capacidad de defensa.
