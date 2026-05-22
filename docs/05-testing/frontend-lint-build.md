# Verificacion Del Frontend

Este documento resume como validar el frontend React/Vite de SquareStruct V3.

## Comandos

```bash
cd frontend
npm run test:run
npm run lint
npm run build
```

## Tests

`npm run test:run` ejecuta Vitest con Testing Library.

Tests actuales:

- `App.test.jsx`
- `Home.test.jsx`
- `Navbar.test.jsx`

Validan que la aplicacion y componentes principales renderizan sin romper rutas ni dependencias basicas.

## Lint

`npm run lint` ejecuta ESLint sobre el frontend. Sirve para detectar:

- imports sin usar;
- problemas de hooks;
- errores de sintaxis;
- patrones no compatibles con la configuracion del proyecto.

## Build

`npm run build` compila la aplicacion con Vite. Comprueba:

- imports de componentes;
- imports de assets;
- CSS;
- compatibilidad de dependencias;
- generacion final en `dist/`.

## Revision Manual Recomendada

Despues de cambios visuales o de flujo conviene revisar:

- Home;
- Gallery;
- Catalog con filtros y busqueda;
- carrito;
- login y registro;
- checkout;
- Mi Cuenta como usuario;
- Mi Cuenta como admin;
- responsive movil/tablet/escritorio.

## Riesgos Habituales

| Area | Riesgo |
| --- | --- |
| Rutas | Romper alias `/setings` o redireccion `/settings`. |
| Auth | Token caducado o usuario local inconsistente. |
| Catalogo | Fallback demo ocultando errores reales de API. |
| Checkout | Carrito vacio, direccion invalida o token ausente. |
| Settings | Acceso admin mal protegido o tabs desincronizadas. |
| CSS responsive | Reglas globales en `responsive.css` afectando varias paginas. |

## Criterio De Cierre

Un cambio de frontend queda validado cuando:

- pasan tests;
- pasa lint;
- pasa build;
- el flujo tocado se revisa manualmente en navegador;
- no se introducen reglas CSS globales innecesarias.
