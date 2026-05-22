# Flujo Frontend

## Entrada

El frontend arranca en `frontend/src/main.jsx`. Desde ahi se renderiza `App.jsx`, que monta `HashRouter`, navbar, contenido principal, footer y overlays globales.

## Procesamiento Y Estado

`App.jsx` mantiene estado compartido:

- usuario autenticado;
- modal de login/registro;
- carrito;
- checkout;
- busqueda enviada al catalogo;
- tab activa de ajustes;
- proteccion de tabs admin.

Las paginas principales viven en `frontend/src/pages/` y los componentes reutilizables en `frontend/src/components/`.

## Renderizado

El renderizado depende de la ruta:

| Ruta | Pagina |
| --- | --- |
| `/#/home` | `Home.jsx` |
| `/#/gallery` | `Gallery.jsx` |
| `/#/catalog` | `Catalog.jsx` |
| `/#/design` | `Design.jsx` |
| `/#/about-us` | `AboutUs.jsx` |
| `/#/setings/...` | `Settings.jsx` |

Se usa `HashRouter` para evitar problemas de rutas al desplegar frontend estatico.

## Integracion

Los servicios de `frontend/src/services/` centralizan las llamadas:

- `api.js`: base de `fetch`, JWT, idioma y errores.
- `authService.js`: login, registro, perfil y usuarios.
- `productService.js`: productos.
- `orderService.js`: pedidos y facturacion.

## Como Defenderlo

La idea principal es que `App.jsx` organiza la aplicacion y las paginas se encargan de cada vista. Los servicios separan la UI de la API, asi no se mezclan formularios con detalles de `fetch`.
