# Frontend SquareStruct

Frontend React/Vite de SquareStruct V2. Implementa la interfaz publica, catalogo, galeria, disenador visual provisional, autenticacion, carrito, checkout, area privada y paneles administrativos.

## Stack

- React 19
- Vite 8
- React Router DOM 7 con `HashRouter`
- Bootstrap 5
- SweetAlert2
- Vitest + Testing Library
- ESLint
- CSS propio organizado por dominio

## Estructura

```text
frontend/src/
  assets/                 Imagenes, logos y recursos visuales
  components/
    auth/                 Modal y formularios de login/registro
    catalog/              Filtros y tarjetas del catalogo
    common/               Iconos reutilizables
    layout/               Navbar, footer y panel lateral del carrito
    settings/             Checkout y componentes ligados a cuenta
  data/                   Productos demo como fallback
  pages/
    auth/                 Paginas legacy de Login y Register
    settings/             Pantallas legacy/standalone de cuenta
    *.jsx                 Home, Catalog, Gallery, Design, AboutUs
  services/               api, authService, productService, orderService
  styles/
    base/                 Variables, base visual y responsive global
    components/           CSS de componentes reutilizables
    layout/               Navbar y footer
    pages/                CSS especifico de pagina
  tests/                  Vitest + Testing Library
  utils/                  Validadores, alertas y normalizacion de texto
  App.jsx                 Rutas, estado principal y overlays globales
  main.jsx                Entrada React/Vite
  routes.js               Rutas, aliases y enlaces de navegacion
```

## Rutas

La aplicacion usa `HashRouter` para funcionar en despliegues estaticos sin configurar fallback de servidor.

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

`/settings` existe como alias y redirige internamente a `/setings`, que se mantiene por compatibilidad con rutas ya usadas en el proyecto.

## Estado Global En App.jsx

`App.jsx` concentra estado transversal:

- usuario autenticado;
- modal de login/registro;
- carrito;
- checkout;
- busqueda inicial del catalogo;
- seccion inicial del catalogo;
- tab activa de Mi Cuenta.

Los overlays globales (`AuthModal`, `CartPanel`, `Checkout`) viven fuera de las rutas para conservar su estado durante la navegacion.

## Servicios

| Archivo | Responsabilidad |
| --- | --- |
| `services/api.js` | Cliente `fetch`, URL base, headers JSON, JWT y manejo de errores. |
| `services/authService.js` | Registro, login, logout, perfil, usuarios admin, expiracion del token y rol admin. |
| `services/productService.js` | Carga de productos y busqueda local por nombre/descripcion. |
| `services/orderService.js` | Checkout, pedidos, facturas de usuario y facturacion admin mediante `/orders`. |

La URL base se toma de:

```text
VITE_API_URL=http://localhost:3000/api
```

Si no existe, se usa `/api` y Vite lo redirige al backend local con el proxy de `vite.config.js`.

## Funcionalidades Implementadas

- Navbar responsive con navegacion, cuenta, carrito e idioma visual.
- Autenticacion modal con login y registro.
- Persistencia de JWT y usuario en `localStorage`.
- Proteccion de tabs admin en frontend.
- Catalogo conectado a backend con fallback a `productosDemo`.
- Busqueda, filtros, ordenacion, paginacion y vista grid/lista.
- Carrito lateral con cantidades, eliminacion y total.
- Checkout con direccion, metodo de pago y creacion de pedido.
- Facturas del usuario autenticado.
- Facturacion admin con filtros, estadisticas, paginacion y acciones aceptar/denegar.
- Gestion admin de usuarios con busqueda, filtro, detalle, edicion y eliminacion.
- Galeria con filtros por material y modal de imagen.
- Disenador visual provisional con paneles, herramientas y resumen simulado.
- Alertas de confirmacion/error/exito con SweetAlert2.
- Loaders, estados vacios y mensajes de error.

## CSS

`App.css` funciona como indice de estilos. Los archivos reales estan en `src/styles/`.

- `styles/base/variables.css`: tokens visuales.
- `styles/base/app-base.css`: base comun.
- `styles/base/responsive.css`: reglas responsive compartidas entre varias paginas.
- `styles/layout/navbar.css`: navbar.
- `styles/layout/footer.css`: footer.
- `styles/pages/*.css`: estilos de paginas.
- `styles/components/*`: modales, checkout, carrito, profile panel y alertas.

Regla de mantenimiento: si una clase pertenece claramente a una pagina o componente, debe vivir en su archivo responsable. `responsive.css` se reserva para ajustes transversales.

## Comandos

```bash
npm install
npm run dev
npm run test:run
npm run lint
npm run build
```

URL local:

```text
http://localhost:5173
```

## Tests

Los tests actuales estan en `src/tests/` y usan Vitest + Testing Library. Cubren renderizado principal de la app, Home y Navbar. La cobertura puede ampliarse en componentes de flujo critico como checkout, catalogo y Settings.

## Decisiones Tecnicas

- `HashRouter` reduce problemas al refrescar rutas internas en hosting estatico.
- Bootstrap se usa como apoyo de grid, botones, tablas, formularios y utilidades.
- CSS propio mantiene la identidad visual sin introducir una libreria UI adicional.
- SweetAlert2 se reserva para confirmaciones y feedback de acciones destructivas o relevantes.
- El catalogo filtra en cliente porque V2 carga un volumen pequeno de productos desde `/api/productos`.
- `Settings.jsx` concentra varias tabs porque comparten usuario, permisos, pedidos y estados administrativos.
