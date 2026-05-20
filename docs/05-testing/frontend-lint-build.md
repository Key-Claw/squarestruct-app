
# Verificación del frontend: lint, build, tests y defensa DAW

## Objetivo

Este documento explica cómo comprobar el frontend antes de entregar cambios, abrir una pull request o defender el proyecto en DAW. Resume el checklist real, la cobertura de tests y cómo justificarlo en una presentación profesional.

Actualmente existe una base de tests automatizados, pero la cobertura es inicial. Por eso se combinan:
- Revisión automática con ESLint
- Build de producción
- Tests básicos con Vitest y React Testing Library
- Prueba manual de los flujos afectados

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

## `npm run test:run`

Ejecuta la suite basica de frontend con Vitest en modo no interactivo:

```bash
npm run test:run
```

Sirve para comprobar que los componentes principales siguen renderizando sin errores.

La cobertura actual valida:

- `App`;
- `Navbar`;
- `Home`.

Estos tests no sustituyen la prueba manual completa del frontend, pero ayudan a detectar regresiones rapidas en la base visual.

## Diferencia entre lint y build

| Comando | Que comprueba |
| --- | --- |
| `npm run lint` | Calidad y reglas de codigo JavaScript/React. |
| `npm run build` | Compilacion de produccion con Vite. |
| `npm run test:run` | Renderizado basico de componentes principales con Vitest en modo CI/local no interactivo. |

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

- La cobertura de tests de frontend es basica y solo valida renderizados principales.
- Algunas vistas son visuales/provisionales, como `Design.jsx` y `Facturacion.jsx`.
- El flujo completo de pedido desde el carrito todavia no esta cerrado.


## Buenas prácticas y defensa DAW

- Explica la diferencia entre lint, build y tests.
- Justifica la importancia de la prueba manual y el checklist real.
- Muestra ejemplos de errores detectados y cómo se corrigen antes de entregar.
- Relaciona la verificación con la calidad y la experiencia de usuario en la defensa.
