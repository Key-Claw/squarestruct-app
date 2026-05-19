# Frontend SquareStruct

## Objetivo

El frontend es la interfaz de usuario de SquareStruct. Esta desarrollado con React y Vite, y permite navegar por la web, consultar el catalogo, registrarse, iniciar sesion, usar un carrito visual y acceder a vistas de administracion cuando el usuario tiene rol `admin`.

Esta guia resume lo necesario para instalar, arrancar y validar el frontend. La explicacion mas detallada de arquitectura esta en `docs/03-arquitectura/`.

## Tecnologias

- React
- React Router DOM con `HashRouter`
- Vite
- JavaScript
- Bootstrap 5
- CSS propio organizado en `src/styles/`
- Vitest y Testing Library
- ESLint

## Estructura

```text
frontend/
  public/             Recursos publicos de Vite
  src/
    assets/           Imagenes, logos y recursos visuales
    components/       Componentes reutilizables
      auth/           Formularios y mensajes del modal de autenticacion
      catalogo/       Filtros y tarjetas del catalogo
    data/             Datos demo usados como fallback
    pages/            Vistas principales
    services/         Comunicacion con la API REST
    styles/           CSS separado por dominio o componente
    utils/            Helpers y validadores
    App.jsx           Componente principal y navegacion interna
    main.jsx          Punto de entrada de React
    routes.js         Rutas principales y enlaces reutilizables
  package.json
  vite.config.js
```

`App.css` funciona como indice de imports CSS. Los estilos reales estan repartidos en `src/styles/` para que cada pagina o componente tenga su archivo.

## Paginas principales

| Pagina | Funcion |
| --- | --- |
| `Home.jsx` | Portada con carrusel, accesos a catalogo, galeria y Design. |
| `Catalog.jsx` | Carga productos desde backend y usa productos demo si la API falla. Permite buscar, filtrar por categoria, ordenar y anadir al carrito visual. |
| `Gallery.jsx` | Muestra proyectos e imagenes de inspiracion. |
| `Design.jsx` | Maqueta visual del futuro disenador de estructuras. Todavia no es una herramienta 3D real. |
| `AboutUs.jsx` | Presentacion del proyecto y del equipo. |
| `Login.jsx` | Vista de login tradicional. |
| `Register.jsx` | Vista de registro tradicional. |
| `Users.jsx` | Vista protegida para administradores. Lista usuarios y permite cambiar rol entre `usuario` y `admin`. |
| `Invoices.jsx` | Historial de ordenes/facturas del usuario. |
| `Settings.jsx` | Pantalla de ajustes visuales de usuario/interfaz. |

Ademas, la autenticacion principal del navbar se gestiona con `AuthModal`, que muestra login y registro en un modal reutilizable.

## Rutas del frontend

El frontend usa `react-router-dom` con `HashRouter`.

Se usa `HashRouter` para facilitar despliegues estaticos en AWS, Apache u otros hostings donde no este configurado el fallback de rutas hacia `index.html`. Con este sistema, el servidor recibe la ruta base y React interpreta la parte posterior al `#`.

Rutas principales:

```text
http://localhost:5173/#/
http://localhost:5173/#/home
http://localhost:5173/#/gallery
http://localhost:5173/#/catalog
http://localhost:5173/#/design
http://localhost:5173/#/about-us
```

Las rutas y enlaces reutilizables viven en `src/routes.js`.

Login, registro, carrito, checkout y Mi Cuenta no tienen rutas propias por ahora. Funcionan como modal, panel o estado interno para mantener la aplicacion sencilla.

## Componentes principales

| Componente | Funcion |
| --- | --- |
| `Navbar.jsx` | Barra superior, navegacion, busqueda, dropdown de usuario, acceso al carrito y selector visual de idioma. |
| `SiteFooter.jsx` | Footer para paginas publicas. |
| `AuthModal.jsx` | Modal de autenticacion con modo login/registro. |
| `auth/LoginForm.jsx` | Formulario de login dentro del modal. |
| `auth/RegisterForm.jsx` | Formulario de registro dentro del modal. |
| `auth/AuthErrorMessage.jsx` | Mensaje de error reutilizable del modal. |
| `CartPanel.jsx` | Panel lateral del carrito. Calcula cantidades y total en cliente. |
| `ProfilePanel.jsx` | Panel lateral de perfil. Muestra datos del usuario y acceso admin a usuarios. |
| `catalogo/CatalogFilters.jsx` | Sidebar de filtros del catalogo. |
| `catalogo/CatalogProductCard.jsx` | Tarjeta de producto del catalogo. |


## Autenticación, roles y protección de rutas

La autenticación se basa en JWT:
- El usuario se registra o inicia sesión, obteniendo un token JWT.
- El token se almacena en localStorage y se añade automáticamente en la cabecera `Authorization` por los servicios.
- El frontend detecta expiración y fuerza logout si el token es inválido.
- El rol (`usuario` o `admin`) se obtiene del backend y se usa para mostrar u ocultar vistas protegidas.
- Las rutas de administración solo aparecen si el usuario es `admin`.

**Flujo típico:**
1. Registro/login → obtención de JWT
2. Navegación protegida por rol (admin/usuario)
3. Logout borra el token y limpia el estado

**Defensa DAW:**
- Demuestra el acceso condicional a vistas y componentes según rol
- Muestra el flujo de login, expiración y logout
- Justifica el uso de JWT y protección de rutas en la interfaz

## Servicios y backend

Los servicios viven en `src/services/` y evitan hacer `fetch` directamente desde todas las páginas.

| Servicio | Función |
| --- | --- |
| `api.js` | Base común para `GET`, `POST`, `PUT` y `DELETE`. Lee `VITE_API_URL` o usa `/api` por defecto. Añade `Authorization: Bearer <token>` si hay token. |
| `authService.js` | Registro, login, logout, usuario actual, validación de expiración JWT, perfil, listado y actualización de usuarios. |
| `productService.js` | Carga productos con `/productos` y filtra productos en cliente. |
| `orderService.js` | Funciones para crear y consultar pedidos usando `/orders`. Existe la base, pero la integración completa de checkout queda para fases siguientes. |

Durante desarrollo, `vite.config.js` redirige `/api` a `http://localhost:3000`, por lo que normalmente no hace falta configurar nada si el backend está arrancado en ese puerto.

Si se quiere apuntar a otra API, se puede crear un `.env` del frontend con:

```text
VITE_API_URL=http://localhost:3000/api
```


## Testing y defensa DAW

**Testing:**
- `npm run test:run` — Ejecuta tests automatizados (Vitest + Testing Library)
- Cobertura: componentes principales, servicios, helpers y flujos de usuario
- Los tests viven en `src/tests/` y junto a componentes críticos

**Defensa DAW:**
- Demuestra tests de componentes clave (AuthModal, Catalog, Navbar)
- Justifica la cobertura y la integración con el backend simulado
- Explica la separación de tests unitarios y de integración

## Comandos

Instalar dependencias:

```bash
npm install
```

Arrancar en desarrollo:

```bash
npm run dev
```

URL local habitual:

```text
http://localhost:5173
```

Revisar calidad del código:

```bash
npm run lint
```

Comprobar compilación de producción:

```bash
npm run build
```

Ejecutar tests automatizados:

```bash
npm run test:run
```


## Buenas prácticas y checklist de entrega

- Documenta variables y comandos en `.env.example`.
- Usa servicios para toda comunicación con la API.
- Protege vistas y componentes según el rol del usuario.
- Mantén la separación de componentes, páginas y servicios.
- Ejecuta siempre `lint`, `build` y `test:run` antes de entregar.
- Justifica la estructura y flujos en la defensa DAW.
- Muestra ejemplos reales de login, navegación protegida y tests en la presentación.

## Estado V2 sobre base MVP

El frontend mantiene las partes principales de `MVP v1 - Funcional` y suma validacion automatica basica en V2:

- registro e inicio de sesion;
- catalogo conectado al backend;
- carrito visual en cliente;
- base de pedidos preparada en servicios;
- vistas protegidas para administracion;
- gestion de usuarios admin;
- maqueta de Design como base del futuro disenador;
- base de tests automatizados con Vitest.

## Queda para fases siguientes

- Integrar por completo el flujo de pedidos desde el carrito.
- Sustituir datos de maqueta en `Facturacion.jsx` por datos reales.
- Evolucionar `Design.jsx` hacia una herramienta real de diseno o calculo.
- Ampliar la cobertura de tests automatizados de frontend.
- Revisar textos con caracteres especiales si aparecen problemas de codificacion.
