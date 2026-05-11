# Verificacion del frontend con lint y build

## Objetivo

Este documento explica como comprobar el frontend antes de entregar cambios o abrir una pull request.

En esta version no hay una suite de tests automatizados de frontend. Por eso se combinan:

- revision automatica con ESLint;
- build de produccion;
- prueba manual de los flujos afectados.

## Comandos principales

Los comandos se ejecutan desde `frontend/`:

```bash
cd frontend
npm run lint
npm run build
```

## `npm run lint`

Ejecuta ESLint:

```bash
npm run lint
```

Sirve para detectar problemas como:

- imports no usados;
- variables no usadas;
- errores o malas practicas con hooks de React;
- codigo dificil de mantener;
- problemas basicos antes de subir cambios.

Resultado esperado:

```text
eslint .
```

El comando debe terminar sin errores.

## `npm run build`

Ejecuta el build de Vite:

```bash
npm run build
```

Sirve para comprobar que la aplicacion puede compilarse para produccion.

El build valida que:

- los imports son correctos;
- las rutas de assets se resuelven;
- Vite puede transformar los modulos;
- no hay errores de compilacion.

Si aparecen warnings, hay que revisar si son nuevos y si estan relacionados con el cambio. Por ejemplo, una ruta de imagen mal movida en CSS puede compilar con aviso, pero debe corregirse antes de entregar.

## Diferencia entre lint y build

| Comando | Que comprueba |
| --- | --- |
| `npm run lint` | Calidad y reglas de codigo JavaScript/React. |
| `npm run build` | Compilacion de produccion con Vite. |

Un cambio puede pasar `build` y fallar `lint`, o al reves. Por eso se ejecutan ambos.

## Comprobacion manual recomendada

Despues de lint y build, abrir la app en desarrollo:

```bash
npm run dev
```

URL habitual:

```text
http://localhost:5173
```

Revisar segun el area tocada:

| Area | Comprobacion |
| --- | --- |
| Navbar | Navegar entre Inicio, Galeria, Catalogo y Design. Probar dropdown de usuario y carrito. |
| Catalogo | Comprobar carga de productos, busqueda, orden, categorias y anadir al carrito. |
| Auth | Probar login, registro, errores visibles y cierre del modal. |
| Carrito | Anadir producto, cambiar cantidad, eliminar y revisar total. |
| Perfil | Abrir panel, ver datos y cerrar sesion. |
| Usuarios admin | Entrar como admin, abrir Gestionar usuarios, listar usuarios y editar rol. |
| Responsive | Revisar al menos movil y escritorio en las pantallas tocadas. |
| Build visual | Confirmar que no hay assets rotos ni textos descuadrados. |

## Backend durante la comprobacion

Para flujos con datos reales, el backend debe estar arrancado en `http://localhost:3000`.

El frontend usa proxy de Vite:

```text
/api -> http://localhost:3000
```

Si el backend no esta disponible:

- el catalogo puede mostrar productos demo;
- login/registro no funcionaran;
- gestion de usuarios no cargara datos reales.

## Variables de entorno

Por defecto, el frontend usa `/api`.

Si se necesita otra URL:

```text
VITE_API_URL=http://localhost:3000/api
```

## Antes de crear PR

Checklist minimo:

- [ ] `npm run lint` termina sin errores.
- [ ] `npm run build` termina correctamente.
- [ ] Se ha probado manualmente la pantalla afectada.
- [ ] Si hay backend implicado, se ha probado con backend arrancado.
- [ ] Si hay login/admin, se ha iniciado sesion con un token nuevo.
- [ ] No quedan warnings nuevos sin explicar.
- [ ] No se han documentado funcionalidades que sean solo maqueta como si fueran completas.

## Limitaciones actuales

- No hay tests unitarios o E2E de frontend.
- Algunas vistas son visuales/provisionales, como `Design.jsx` y `Facturacion.jsx`.
- El flujo completo de pedido desde el carrito todavia no esta cerrado.

## Idea clave para explicar

`lint` demuestra que el codigo respeta reglas basicas de calidad. `build` demuestra que la app puede compilarse. La prueba manual confirma que el flujo afectado funciona de cara al usuario.
