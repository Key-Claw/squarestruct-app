# Frontend SquareStruct

## Objetivo

El frontend es la interfaz de usuario de SquareStruct. Esta desarrollado con React y Vite, y permite navegar por la web, consultar el catalogo, registrarse, iniciar sesion, usar un carrito visual y acceder a vistas de administracion cuando el usuario tiene rol `admin`.

Esta guia resume lo necesario para instalar, arrancar y validar el frontend. La explicacion mas detallada de arquitectura esta en `docs/03-arquitectura/`.

## Tecnologias

- React
- Vite
- JavaScript
- Bootstrap 5
- CSS propio organizado en `src/styles/`
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
  package.json
  vite.config.js
```

`App.css` funciona como indice de imports CSS. Los estilos reales estan repartidos en `src/styles/` para que cada pagina o componente tenga su archivo.

## Paginas principales

| Pagina | Funcion |
| --- | --- |
| `Home.jsx` | Portada con carrusel, accesos a catalogo, galeria y Design. |
| `Catalogo.jsx` | Carga productos desde backend y usa productos demo si la API falla. Permite buscar, filtrar por categoria, ordenar y anadir al carrito visual. |
| `Galeria.jsx` | Muestra proyectos e imagenes de inspiracion. |
| `Design.jsx` | Maqueta visual del futuro disenador de estructuras. Todavia no es una herramienta 3D real. |
| `AboutUs.jsx` | Presentacion del proyecto y del equipo. |
| `Login.jsx` | Vista de login tradicional. |
| `Register.jsx` | Vista de registro tradicional. |
| `Usuarios.jsx` | Vista protegida para administradores. Lista usuarios y permite cambiar rol entre `usuario` y `admin`. |
| `Facturacion.jsx` | Panel administrativo visual de facturacion. Sus datos actuales son de maqueta. |

Ademas, la autenticacion principal del navbar se gestiona con `AuthModal`, que muestra login y registro en un modal reutilizable.

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

## Servicios y backend

Los servicios viven en `src/services/` y evitan hacer `fetch` directamente desde todas las paginas.

| Servicio | Funcion |
| --- | --- |
| `api.js` | Base comun para `GET`, `POST`, `PUT` y `DELETE`. Lee `VITE_API_URL` o usa `/api` por defecto. Anade `Authorization: Bearer <token>` si hay token. |
| `authService.js` | Registro, login, logout, usuario actual, validacion de expiracion JWT, perfil, listado y actualizacion de usuarios. |
| `productService.js` | Carga productos con `/productos` y filtra productos en cliente. |
| `orderService.js` | Funciones para crear y consultar pedidos usando `/orders`. Existe la base, pero la integracion completa de checkout sigue pendiente. |

Durante desarrollo, `vite.config.js` redirige `/api` a `http://localhost:3000`, por lo que normalmente no hace falta configurar nada si el backend esta arrancado en ese puerto.

Si se quiere apuntar a otra API, se puede crear un `.env` del frontend con:

```text
VITE_API_URL=http://localhost:3000/api
```

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

Revisar calidad del codigo:

```bash
npm run lint
```

Comprobar compilacion de produccion:

```bash
npm run build
```

## Comprobacion antes de entregar

Antes de abrir una pull request o dar por terminada una tarea de frontend:

1. Arrancar backend si la tarea usa datos reales.
2. Ejecutar `npm run lint`.
3. Ejecutar `npm run build`.
4. Probar en navegador las rutas afectadas.
5. Si hay login/admin, cerrar sesion e iniciar sesion de nuevo para renovar el JWT.
6. Revisar que no quedan errores visibles en consola.

## Relacion con el MVP

El frontend cubre las partes principales del MVP:

- registro e inicio de sesion;
- catalogo conectado al backend;
- carrito visual en cliente;
- base de pedidos preparada en servicios;
- vistas protegidas para administracion;
- gestion de usuarios admin;
- maqueta de Design como base del futuro disenador.

## Pendiente o mejorable

- Integrar por completo el flujo de pedidos desde el carrito.
- Sustituir datos de maqueta en `Facturacion.jsx` por datos reales.
- Evolucionar `Design.jsx` hacia una herramienta real de diseno o calculo.
- Anadir tests automatizados de frontend.
- Revisar textos con caracteres especiales si aparecen problemas de codificacion.
