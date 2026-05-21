# Estructura Del Frontend

El frontend esta en `frontend/` y usa React con Vite. La aplicacion es una SPA con `HashRouter`, estilos CSS propios, Bootstrap como apoyo visual y servicios de comunicacion con la API.

## Entrada Y Rutas

- `src/main.jsx`: importa Bootstrap, estilos base y renderiza `<App />`.
- `src/App.jsx`: define el shell principal, rutas, estado global y overlays.
- `src/routes.js`: centraliza rutas, aliases y enlaces del navbar.

Rutas principales:

```text
/#/
/#/home
/#/gallery
/#/catalog
/#/design
/#/about-us
/#/setings/profile
/#/setings/invoices
/#/setings/billing
/#/setings/users
/#/setings/plans
```

`/settings` redirige a `/setings` para mantener compatibilidad.

## Estado Principal

`App.jsx` mantiene:

- usuario autenticado;
- modal de autenticacion;
- modo login/registro;
- carrito;
- checkout;
- busqueda enviada al catalogo desde otras vistas;
- tab activa de Mi Cuenta;
- proteccion de tabs admin.

Los overlays `AuthModal`, `CartPanel` y `Checkout` se renderizan fuera de las rutas para que no pierdan estado al navegar.

## Paginas

| Archivo | Funcion |
| --- | --- |
| `Home.jsx` | Pagina inicial y acceso a secciones principales. |
| `Gallery.jsx` | Galeria visual de soluciones modulares con filtro y modal. |
| `Catalog.jsx` | Catalogo conectado a API con filtros y carrito. |
| `Design.jsx` | Editor visual modular 2D/3D: carga piezas de catalogo, coloca elementos, calcula resumen y gestiona borrador local. |
| `AboutUs.jsx` | Presentacion del equipo/proyecto. |
| `settings/Settings.jsx` | Perfil, facturas, facturacion admin, usuarios admin y seccion de planos pendiente de persistencia en BD. |

## Componentes

| Carpeta | Contenido |
| --- | --- |
| `components/auth/` | Modal de autenticacion, login, registro y errores. |
| `components/catalog/` | Filtros y tarjetas de producto. |
| `components/common/` | Iconos reutilizables. |
| `components/layout/` | Navbar, footer y carrito lateral. |
| `components/settings/` | Checkout y componentes relacionados con cuenta. |

## Servicios

| Archivo | Uso |
| --- | --- |
| `api.js` | Cliente `fetch` con `VITE_API_URL`, headers JSON, JWT y errores. |
| `authService.js` | Registro, login, logout, perfil, usuarios admin y expiracion de token. |
| `productService.js` | `GET /productos` y filtro local por texto. |
| `orderService.js` | Pedidos y facturacion usando `/orders`. |

## Catalogo

`Catalog.jsx` carga productos con `getProductos()`. Si la API falla, muestra `productosDemo` como fallback. El filtrado se hace en cliente:

- busqueda por nombre o descripcion;
- filtro por tipo;
- filtro por material;
- precio maximo;
- orden por reciente/precio;
- paginacion;
- vista grid/lista.

El carrito recibe productos desde `onAddToCart`, definido en `App.jsx`.

## Auth Y Area Privada

`authService.js` guarda:

```text
authToken
currentUser
```

Tambien decodifica el JWT para detectar expiracion. Si el token caduca, limpia la sesion local.

Las tabs administrativas se protegen en `App.jsx` y `Settings.jsx`. Si un usuario sin rol `admin` intenta acceder a usuarios o facturacion admin, se redirige a perfil.

## Checkout Y Pedidos

`CartPanel` muestra productos, cantidades y total. Al confirmar:

1. si no hay usuario, se abre login;
2. despues de login, se abre `Checkout`;
3. `Checkout.jsx` valida direccion y metodo de pago;
4. `orderService.crearPedido()` llama a `POST /api/orders`;
5. el backend crea el pedido;
6. el carrito se limpia y se navega a facturas.

## Disenador

`Design.jsx` usa `useDesignEditor.js` como hook principal. El flujo real es:

1. carga productos desde `/api/productos`;
2. transforma bloques y pilares en piezas colocables con `mapProductToDesignPiece`;
3. anade accesorios locales como puerta, ventana, escalera y suelo;
4. permite colocar piezas en un plano 2D por celdas;
5. visualiza el resultado en 3D con Three.js, React Three Fiber y Drei;
6. calcula piezas colocadas, superficie, altura y precio estimado;
7. guarda/carga un borrador en `localStorage` con la clave `squarestruct-design-draft`;
8. exporta el plano como JSON.

El limite importante para defenderlo es que todavia no existe una tabla `planos`: el borrador no se guarda en MySQL ni esta asociado a un usuario.

## Settings

`Settings.jsx` concentra tabs porque comparten usuario, permisos y datos de pedidos:

- `perfil`: datos del usuario, edicion y eliminacion de cuenta.
- `facturas`: pedidos reales del usuario autenticado.
- `facturacion`: historial admin con filtros, estadisticas y acciones aceptar/denegar.
- `usuarios`: administracion de usuarios.
- `planos`: seccion pendiente de persistencia en BD; el disenador guarda borrador local en navegador.

## Estilos

`App.css` importa la organizacion real de `src/styles/`.

```text
styles/base/         Variables, base visual y responsive compartido
styles/layout/       Navbar y footer
styles/pages/        CSS por pagina
styles/components/   CSS de modales, carrito, checkout, alertas y componentes
```

`responsive.css` contiene reglas transversales, especialmente ajustes de tablet y movil que afectan a varias paginas. Las reglas especificas deben mantenerse en el CSS de su pagina cuando no se reutilizan.

## Testing

Los tests estan en `src/tests/`:

- `App.test.jsx`
- `Home.test.jsx`
- `Navbar.test.jsx`

Se ejecutan con:

```bash
npm run test:run
```

## Decisiones Tecnicas

- `HashRouter`: simplifica despliegue estatico.
- Bootstrap: acelera grid, botones, tablas y formularios.
- CSS propio: permite identidad visual sin depender de un kit de componentes.
- SweetAlert2: confirma acciones delicadas como eliminar usuarios/cuentas.
- Fallback de catalogo: la interfaz sigue siendo util si la API no responde.
- Filtros en cliente: suficientes para el volumen actual de productos.
