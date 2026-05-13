# Estructura del frontend

## Objetivo

El frontend es la capa visual de SquareStruct. Se encarga de mostrar las pantallas al usuario, gestionar la navegacion interna, mantener estado de sesion, mostrar productos y comunicarse con el backend mediante una API REST.

No accede directamente a MySQL. Toda la informacion real llega a traves del backend.

## Estructura real del proyecto

```text
frontend/
  public/
  src/
    assets/
      about/
      design/
      galeria/
      inicio/
      logo/
    components/
      auth/
      catalogo/
      AuthModal.jsx
      CartPanel.jsx
      Navbar.jsx
      ProfilePanel.jsx
      SiteFooter.jsx
    data/
      productosDemo.js
    hero/
    pages/
      AboutUs.jsx
      Catalogo.jsx
      Design.jsx
      Facturacion.jsx
      Galeria.jsx
      Home.jsx
      Login.jsx
      Register.jsx
      Settings.jsx
      Usuarios.jsx
    services/
      api.js
      authService.js
      orderService.js
      productService.js
    styles/
      about.css
      app-base.css
      auth-modal.css
      cart-panel.css
      catalogo.css
      design.css
      facturacion.css
      galeria.css
      home.css
      legacy-pages.css
      navbar.css
      profile-panel.css
      responsive.css
      settings.css
      site-footer.css
      usuarios.css
      variables.css
    utils/
      text.js
      validators.js
    App.css
    App.jsx
    index.css
    main.jsx
```

## Responsabilidad de cada carpeta

| Carpeta o archivo | Responsabilidad |
| --- | --- |
| `assets/` | Imagenes usadas por home, galeria, about, design y logo. |
| `components/` | Componentes reutilizables que no son una pagina completa. |
| `components/auth/` | Piezas internas del modal de autenticacion. |
| `components/catalogo/` | Filtros y tarjetas del catalogo. |
| `data/` | Datos demo o fallback. Actualmente contiene productos demo para catalogo. |
| `pages/` | Vistas principales renderizadas desde `App.jsx`. |
| `services/` | Capa de comunicacion con backend y helpers de API. |
| `styles/` | CSS propio separado por dominio, pagina o componente. |
| `utils/` | Funciones auxiliares como normalizacion de texto y validacion de email. |
| `App.jsx` | Estado principal, navegacion interna, usuario actual, carrito y proteccion de vistas admin. |
| `App.css` | Indice de imports CSS. No contiene ya toda la hoja de estilos grande. |
| `main.jsx` | Importa Bootstrap, CSS base y monta React en `index.html`. |

## Navegacion interna

El proyecto no usa React Router. La navegacion se controla con estado en `App.jsx`.

`App.jsx` mantiene:

- pagina activa (`page`);
- termino de busqueda enviado al catalogo;
- seccion inicial del catalogo;
- usuario autenticado;
- estado del modal de autenticacion;
- estado del carrito lateral;
- estado del panel de perfil.

Cuando el usuario pulsa un boton del navbar, `handleNavigate` cambia la pagina activa. Segun ese valor, `renderPage` devuelve una pagina u otra.

Las vistas `Usuarios` y `Facturacion` estan protegidas: si no hay usuario o el usuario no es admin, `App.jsx` redirige a `Home`.

## Paginas principales

| Pagina | Estado actual |
| --- | --- |
| `Home.jsx` | Pantalla principal con carrusel e imagenes. Enlaza a catalogo, galeria y Design. |
| `Catalogo.jsx` | Conectada a `/api/productos`. Si falla backend, muestra productos demo. Tiene busqueda, orden, categorias y anadir al carrito visual. |
| `Galeria.jsx` | Vista visual de inspiracion con imagenes locales. |
| `Design.jsx` | Maqueta del futuro disenador. Muestra paneles, piezas, resumen y controles visuales, pero no tiene motor 3D real. |
| `AboutUs.jsx` | Presentacion del proyecto/equipo con contenido visual. |
| `Login.jsx` | Login como pagina tradicional. |
| `Register.jsx` | Registro como pagina tradicional. |
| `Usuarios.jsx` | Gestion admin conectada al backend: lista usuarios y permite cambiar rol entre `usuario` y `admin`. |
| `Facturacion.jsx` | Panel visual administrativo con datos de maqueta. |
| `Settings.jsx` | Vista de ajustes visuales de usuario/interfaz. |

## Componentes principales

| Componente | Funcion |
| --- | --- |
| `Navbar.jsx` | Navegacion principal, buscador, usuario, carrito, idioma visual y accesos admin. |
| `SiteFooter.jsx` | Footer de paginas publicas. |
| `AuthModal.jsx` | Controla estado y envio de login/registro en modal. |
| `LoginForm.jsx` | Formulario de login dentro del modal. |
| `RegisterForm.jsx` | Formulario de registro dentro del modal. |
| `AuthErrorMessage.jsx` | Mensaje de error reusable para autenticacion. |
| `CartPanel.jsx` | Panel lateral de carrito en cliente. Permite cantidades, eliminar productos y calcula total. |
| `ProfilePanel.jsx` | Panel lateral de perfil; refresca datos de usuario y da acceso a gestion de usuarios si es admin. |
| `CatalogFilters.jsx` | Filtros laterales del catalogo. Algunos controles son visuales/provisionales. |
| `CatalogProductCard.jsx` | Tarjeta de producto con datos, medidas, precio y boton de anadir. |

## Servicios

| Archivo | Responsabilidad |
| --- | --- |
| `api.js` | Crea funciones comunes `getRequest`, `postRequest`, `putRequest`, `deleteRequest`. Usa `VITE_API_URL` o `/api`. Anade token JWT si existe. |
| `authService.js` | Registro, login, logout, usuario actual, caducidad de token, perfil, usuarios admin y actualizacion de usuarios. |
| `productService.js` | Obtiene productos y filtra en cliente por texto. |
| `orderService.js` | Base para crear y consultar pedidos con `/orders`. La integracion completa desde el carrito queda para fases siguientes. |

## Comunicacion con backend

El frontend consume la API REST del backend:

```text
React -> services/api.js -> /api -> Express -> MySQL
```

Durante desarrollo, Vite usa proxy:

```text
/api -> http://localhost:3000
```

Por eso los servicios pueden llamar a rutas como:

- `/usuarios/register`
- `/usuarios/login`
- `/usuarios`
- `/productos`
- `/orders`

Si se define `VITE_API_URL`, `api.js` usara ese valor como base. Si no, usara `/api`.

## Autenticacion y token

El login recibe un JWT del backend. El frontend guarda:

- `authToken`;
- `currentUser`.

En peticiones protegidas, `api.js` envia:

```text
Authorization: Bearer <token>
```

`authService.js` comprueba si el token ha caducado. Si no es valido, limpia la sesion local para evitar que la interfaz muestre un usuario conectado cuando el backend ya no acepta el token.

## Estilos

Bootstrap aporta estructura y componentes base. El aspecto propio de SquareStruct se define con CSS en `src/styles/`.

`App.css` importa los bloques principales:

```text
app-base.css
home.css
about.css
galeria.css
catalogo.css
site-footer.css
design.css
legacy-pages.css
responsive.css
```

Algunos componentes tienen CSS dedicado:

- `navbar.css`
- `auth-modal.css`
- `cart-panel.css`
- `profile-panel.css`
- `usuarios.css`
- `facturacion.css`
- `settings.css`
- `variables.css`

## Responsive

El responsive combina Bootstrap con CSS propio. Las reglas principales estan en `responsive.css` y en los CSS especificos de cada modulo cuando la pantalla exige ajustes concretos.

Rangos usados como referencia:

| Pantalla | Rango |
| --- | --- |
| Movil | Menos de `768px` |
| Tablet | Entre `768px` y `1199.98px` |
| PC | Desde `1200px` |
| PC grande | Desde `1600px` |

## Estado de MVP v1

El frontend cubre el flujo principal de `MVP v1 - Funcional`:

- home y navegacion;
- catalogo conectado al backend;
- registro y login;
- sesion con JWT;
- carrito visual;
- base de pedidos en servicios;
- gestion de usuarios admin;
- vistas visuales de galeria, about, design y facturacion.
- base de tests automatizados de frontend con Vitest.

Queda para fases siguientes:

- `Design.jsx` es una maqueta visual, no un diseno 3D funcional.
- `Facturacion.jsx` usa datos de ejemplo.
- algunos filtros del catalogo son visuales y no aplican logica real todavia.
- el checkout completo de pedidos desde carrito queda para fases siguientes.

## Idea clave para explicar

El frontend esta organizado en paginas, componentes, servicios y estilos. React gestiona la interfaz, Bootstrap aporta estructura visual y `src/services/` centraliza la comunicacion con el backend.
