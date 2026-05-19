# Frontend SquareStruct

Interfaz de SquareStruct App. Es un frontend academico de 1 DAW hecho con React, Vite, Bootstrap, React Router y CSS tradicional. La prioridad de la estructura es que sea facil de seguir, defender y mantener sin convertir el proyecto en una arquitectura demasiado grande.

## Estructura

```text
frontend/src/
  assets/                 Imagenes, logos y recursos visuales
  components/
    auth/                 Modal y formularios de login/registro
    catalog/              Filtros y tarjetas del catalogo
    common/               Piezas reutilizables pequenas, como Icon
    layout/               Navbar, footer y panel lateral del carrito
    settings/             Componentes ligados a cuenta, perfil y checkout
  data/                   Datos demo usados como fallback
  pages/
    auth/                 Login y Register tradicionales
    settings/             Settings, Invoices y Users
    *.jsx                 Home, Catalog, Gallery, Design y AboutUs
  services/               Capa de comunicacion con la API
  styles/
    base/                 Variables, base visual y responsive global compartido
    components/           CSS de componentes reutilizables
    layout/               Navbar y footer
    pages/                CSS especifico de paginas
  tests/                  Vitest + Testing Library
  utils/                  Validadores y helpers
  App.jsx                 Shell principal, rutas y overlays globales
  main.jsx                Entrada React/Vite
  routes.js               Rutas y enlaces reutilizables
```

## Organizacion CSS

`App.css` es el indice de estilos. Los archivos reales viven en `src/styles/`.

- `styles/layout/navbar.css`: toda la responsabilidad visual del navbar, incluyendo logo, acciones, buscador, menu y responsive propio.
- `styles/layout/footer.css`: footer y beneficios inferiores.
- `styles/pages/home.css`, `about.css`, `catalog.css`, `gallery.css`, `design.css`: estilos de cada pagina principal.
- `styles/pages/auth/auth.css`: paginas tradicionales de login y registro.
- `styles/pages/settings/settings.css`: ecosistema principal de Mi Cuenta. Incluye perfil, facturas de usuario, panel de facturacion admin y usuarios admin porque comparten layout y estado.
- `styles/pages/settings/invoices.css`, `users.css`, `billing.css`: soporte para paginas standalone antiguas o secciones especificas.
- `styles/components/*`: modales, carrito, checkout, profile panel y primitivas reutilizables.
- `styles/base/responsive.css`: capa global compartida. Se mantiene solo para coordinacion visual transversal entre paginas y helpers responsive que afectan a varias areas a la vez.

La regla de mantenimiento es sencilla: si una clase pertenece claramente a una pagina o componente, debe vivir en su archivo responsable. `responsive.css` no debe crecer con reglas especificas nuevas.

## Rutas

La app usa `HashRouter` para que las rutas funcionen bien en despliegues estaticos.

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

Las rutas viven en `src/routes.js`. Se mantiene `/setings` por compatibilidad con el proyecto y `/settings` redirige al alias correcto.

## Auth y roles

El modal principal de autenticacion esta en `components/auth/AuthModal.jsx` y reutiliza `LoginForm`, `RegisterForm` y `AuthErrorMessage`.

La autenticacion se gestiona en `services/authService.js`:

- guarda y lee el usuario actual;
- maneja login, registro y logout;
- valida expiracion del token;
- expone helpers de rol como `isAdmin`.

Las secciones admin de Mi Cuenta se protegen desde `App.jsx` y `Settings.jsx`. Si un usuario no admin intenta entrar en `billing` o `users`, vuelve a perfil.

## Servicios y backend

La capa API esta separada en `src/services/`:

- `api.js`: cliente base para `GET`, `POST`, `PUT` y `DELETE`.
- `authService.js`: autenticacion, perfil y usuarios.
- `productService.js`: productos y filtrado local.
- `orderService.js`: pedidos, facturas y cambios de estado.

Por defecto Vite usa el proxy hacia el backend local. Si hace falta apuntar a otra API:

```text
VITE_API_URL=http://localhost:3000/api
```

## Como trabajar en el frontend

1. Cambia componentes en su carpeta por responsabilidad.
2. Cambia estilos en el CSS del componente o pagina correspondiente.
3. No anadas reglas nuevas a `responsive.css` salvo que sean globales de verdad.
4. Si tocas rutas, revisa `routes.js`, `App.jsx` y los links del navbar.
5. Si tocas Mi Cuenta, revisa usuario normal y admin.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run test:run
npm run lint
```

URL habitual:

```text
http://localhost:5173
```

## Decisiones defendibles

- Se mantiene React + CSS tradicional para que el proyecto siga siendo realista para 1 DAW.
- No se usan librerias nuevas de UI ni Tailwind.
- Los componentes se agrupan por responsabilidad, no por patrones complejos.
- `Settings.jsx` sigue siendo una pantalla central porque concentra estado compartido de Mi Cuenta; dividirla del todo ahora tendria mas riesgo que beneficio.
- El responsive de tablet prioriza experiencia desktop cuando el ancho lo permite.
