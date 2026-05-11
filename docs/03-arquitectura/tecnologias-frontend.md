# Tecnologias del frontend

## Objetivo

Este documento explica las tecnologias usadas en el frontend de SquareStruct y por que encajan con el MVP.

El objetivo no es listar herramientas sin contexto, sino poder defender como se construye la interfaz, como se conecta con backend y como se revisa antes de entregar.

## Stack principal

| Tecnologia | Uso en SquareStruct |
| --- | --- |
| React | Construccion de la interfaz mediante componentes y estado. |
| Vite | Servidor de desarrollo, build de produccion y proxy hacia backend. |
| JavaScript | Lenguaje principal del frontend. |
| Bootstrap | Base para grid, navbar, dropdowns, botones, formularios, tablas y cards. |
| CSS propio | Personalizacion visual y responsive en `src/styles/`. |
| ESLint | Revision automatica de calidad de codigo. |

## React

React permite separar la interfaz en piezas reutilizables.

En SquareStruct se usa para:

- renderizar paginas segun el estado de `App.jsx`;
- mantener estado de usuario, carrito, modal y busqueda;
- crear componentes reutilizables como `Navbar`, `CartPanel`, `AuthModal` o tarjetas de catalogo;
- actualizar la interfaz cuando cambia el estado, por ejemplo al anadir productos al carrito.

El proyecto no usa React Router. La navegacion del MVP se gestiona en `App.jsx` con un estado `page`.

## Vite

Vite se usa como entorno de desarrollo y herramienta de build.

Funciones principales:

- arranca el frontend con `npm run dev`;
- sirve la aplicacion en `http://localhost:5173`;
- recompila rapido al guardar cambios;
- genera una version de produccion con `npm run build`;
- configura un proxy para que `/api` apunte al backend local.

La configuracion del proxy esta en `frontend/vite.config.js`.

## JavaScript

El frontend esta escrito en JavaScript con JSX.

No se usa TypeScript en esta version del MVP. Por eso es importante mantener nombres claros, servicios separados y pasar `npm run lint` antes de entregar.

## Bootstrap

Bootstrap se usa como apoyo para componentes visuales conocidos y responsivos.

Ejemplos de uso:

- navbar y menu hamburguesa;
- dropdown de usuario;
- grid responsive (`container-fluid`, `row`, `col-*`);
- botones;
- formularios;
- cards;
- tablas;
- alerts;
- modal;
- carousel.

Bootstrap no define toda la identidad visual. El aspecto final se ajusta con CSS propio.

## CSS propio modularizado

Antes el CSS estaba concentrado en `App.css`. Ahora `App.css` actua como indice de imports, y los estilos se reparten en `src/styles/`.

Ejemplos:

| Archivo | Uso |
| --- | --- |
| `app-base.css` | Estructura general de la app. |
| `home.css` | Portada. |
| `catalogo.css` | Catalogo, filtros y tarjetas de producto. |
| `design.css` | Maqueta de Design. |
| `galeria.css` | Galeria de inspiracion. |
| `about.css` | Pagina About Us. |
| `navbar.css` | Navbar y responsive especifico. |
| `auth-modal.css` | Modal de autenticacion. |
| `cart-panel.css` | Panel lateral de carrito. |
| `profile-panel.css` | Panel lateral de perfil. |
| `usuarios.css` | Gestion de usuarios. |
| `facturacion.css` | Panel visual de facturacion. |
| `responsive.css` | Ajustes responsive generales. |
| `variables.css` | Variables CSS globales. |

Esta separacion reduce archivos grandes y facilita encontrar donde cambiar un estilo.

## ESLint

ESLint revisa el codigo JavaScript y React.

Sirve para detectar:

- imports o variables no usados;
- errores comunes con hooks;
- problemas de mantenimiento;
- codigo innecesario.

Comando:

```bash
cd frontend
npm run lint
```

## Comunicacion con backend

El frontend consume la API REST del backend usando `fetch` centralizado en `src/services/api.js`.

La base de la API se calcula asi:

```js
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
```

En desarrollo, `/api` se redirige por proxy a `http://localhost:3000`.

Flujos principales:

| Flujo | Ruta usada |
| --- | --- |
| Registro | `POST /api/usuarios/register` |
| Login | `POST /api/usuarios/login` |
| Perfil/usuarios admin | `GET /api/usuarios`, `GET /api/usuarios/:id`, `PUT /api/usuarios/:id` |
| Catalogo | `GET /api/productos` |
| Pedidos | `/api/orders` desde `orderService.js` |

## JWT y vistas protegidas

Cuando el backend devuelve un token, el frontend lo guarda en `localStorage`.

Datos guardados:

- `authToken`;
- `currentUser`.

En peticiones autenticadas, `api.js` anade:

```text
Authorization: Bearer <token>
```

`authService.js` comprueba si el JWT ha caducado. Si ha caducado, limpia la sesion local.

Las paginas `Usuarios` y `Facturacion` solo se muestran si el usuario tiene rol `admin`.

## Relacion con MVP v1

Estas tecnologias permiten cubrir `MVP v1 - Funcional` sin sobrecargar el proyecto:

- React organiza vistas y componentes;
- Vite simplifica desarrollo y build;
- Bootstrap acelera la parte visual;
- CSS propio da identidad a SquareStruct;
- los servicios conectan con backend;
- ESLint ayuda a mantener calidad.

## Pendiente tecnico

- Anadir tests automatizados de frontend.
- Completar integracion real de pedidos desde el carrito.
- Sustituir datos mock de facturacion por datos reales.
- Evolucionar Design hacia una herramienta funcional de diseno o calculo.
