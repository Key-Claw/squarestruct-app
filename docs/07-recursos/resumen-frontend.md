# Resumen del frontend

## Objetivo

Este documento es una chuleta rapida para explicar el frontend de SquareStruct.

El frontend es la interfaz que ve el usuario. Esta hecho con React y Vite, usa Bootstrap como base visual y se comunica con el backend mediante una API REST.

## Stack

- React
- Vite
- JavaScript
- Bootstrap
- CSS propio en `src/styles/`
- Vitest y Testing Library
- ESLint

## Estructura principal

```text
frontend/
  src/
    assets/       Imagenes y recursos
    components/   Navbar, footer, modal auth, carrito, perfil, catalogo
    data/         Datos demo o fallback
    pages/        Home, Catalogo, Galeria, Design, AboutUs, Login, Register, Usuarios, Facturacion, Settings
    services/     api, auth, productos y pedidos
    styles/       CSS separado por dominio
    utils/        Helpers y validadores
    App.jsx       Navegacion interna y estado principal
    main.jsx      Entrada de React
```

## Paginas

- `Home`: portada.
- `Catalogo`: productos conectados al backend con fallback demo.
- `Galeria`: inspiracion visual.
- `Design`: maqueta del futuro disenador.
- `AboutUs`: informacion del proyecto y equipo.
- `Login` y `Register`: vistas tradicionales de autenticacion.
- `Usuarios`: gestion admin conectada al backend.
- `Facturacion`: panel visual administrativo con datos de ejemplo.
- `Settings`: vista de ajustes visuales de usuario/interfaz.

## Servicios

- `api.js`: base comun para peticiones HTTP y token JWT.
- `authService.js`: login, registro, sesion, perfil y usuarios admin.
- `productService.js`: productos y filtrado en cliente.
- `orderService.js`: base para pedidos, pendiente de integracion completa con checkout.

## Backend

El frontend llama a `/api`. En desarrollo, Vite redirige esas llamadas a:

```text
http://localhost:3000
```

El token JWT se guarda en `localStorage` y se envia en:

```text
Authorization: Bearer <token>
```

## Validacion antes de entregar

```bash
cd frontend
npm run test:run
npm run lint
npm run build
```

Ademas hay que probar manualmente la pantalla tocada en navegador.

## Estado V2 sobre base MVP

Funcional:

- navegacion principal;
- catalogo conectado;
- login y registro;
- gestion de usuarios admin;
- carrito visual en cliente.
- base inicial de tests con Vitest.

Provisional:

- Design es maqueta visual.
- Facturacion usa pedidos reales obtenidos desde `/api/orders/admin/todos`.
- checkout/pedidos no esta integrado por completo desde carrito.
