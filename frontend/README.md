# Frontend SquareStruct

## Objetivo

El frontend es la interfaz de usuario de SquareStruct.

Esta desarrollado con React y Vite, y permite navegar por la aplicacion, consultar productos, registrarse e iniciar sesion.

La version actual del MVP tambien trabaja la parte visual para que la web sea coherente en movil, tablet y PC.

## Estructura

```text
frontend/
  public/          Recursos publicos
  src/
    assets/        Imagenes y recursos visuales
    components/    Componentes reutilizables
    pages/         Paginas principales
    services/      Llamadas a la API
    styles/        Estilos globales
    App.jsx        Componente principal
    main.jsx       Punto de entrada
  package.json
  vite.config.js
```

## Paginas actuales

| Pagina | Funcion |
| --- | --- |
| `Home.jsx` | Entrada principal del usuario, con accesos a catalogo, productos y Design. |
| `AboutUs.jsx` | Pagina abierta desde el logo. Conserva el carrusel visual inicial hecho por el companero, adaptado a React y Bootstrap. |
| `Galeria.jsx` | Muestra ejemplos de aplicaciones de los bloques modulares. |
| `Catalogo.jsx` | Carga productos reales desde el backend y contiene la seccion de productos. |
| `Products.jsx` | Seccion interna usada dentro del catalogo; no aparece como pagina independiente en la navbar. |
| `Design.jsx` | Maqueta inicial para explicar la futura herramienta de diseno de planos. |
| `Carrito.jsx` | Vista MVP del carrito, enlazada desde el icono del carrito en la navbar. |
| `Login.jsx` y `Register.jsx` | Formularios de acceso y registro. |
| `Perfil.jsx` y `Usuarios.jsx` | Vistas de usuario autenticado y administracion. |

## Responsive

El responsive general se organiza en `src/App.css` siguiendo los puntos de corte de Bootstrap.
La navbar tiene sus ajustes propios en `src/styles/navbar.css`, porque necesitaba copiar un boceto concreto.

| Tipo de pantalla | Rango usado |
| --- | --- |
| Movil | Menos de `768px` |
| Tablet | Entre `768px` y `1199.98px` |
| PC | Desde `1200px` |
| PC grande | Desde `1600px` |

La idea es que todas las paginas usen el ancho disponible con `container-fluid`, y que el contenido se reorganice segun el tamano de pantalla.

En la navbar:

- PC: logo grande, menu, buscador y acciones en una sola fila.
- Tablet: todo sigue en una fila, pero con controles mas pequenos.
- Movil: arriba quedan logo, buscador y hamburguesa; al desplegar, los botones salen en una fila horizontal.

## Bootstrap

Bootstrap se usa para:

- Navbar, collapse y menu hamburguesa.
- Dropdown de usuario.
- `input-group`, `form-control` y `btn` del buscador.
- Botones.
- Formularios.
- Grid y columnas.
- Cards.
- Tablas.
- Modal.
- Alerts.
- Carousel.

En `src/components/Navbar.jsx` se mantiene la estructura de Bootstrap. Las clases usadas en la barra son:

- `navbar`, `navbar-expand-md`, `navbar-light`
- `container-fluid`
- `navbar-brand`
- `navbar-toggler`, `collapse`, `navbar-collapse`
- `navbar-nav`, `nav-item`
- `dropdown`, `dropdown-toggle`, `dropdown-menu`, `dropdown-item`
- `input-group`, `form-control`, `btn`

En `src/styles/navbar.css` se pisa el aspecto visual para ajustar medidas, colores y responsive al boceto. La referencia principal es la documentacion oficial de Bootstrap:

- Navbar: https://getbootstrap.com/docs/5.3/components/navbar/
- Collapse: https://getbootstrap.com/docs/5.3/components/collapse/
- Dropdowns: https://getbootstrap.com/docs/5.3/components/dropdowns/
- Input group: https://getbootstrap.com/docs/5.3/forms/input-group/
- Buttons: https://getbootstrap.com/docs/5.3/components/buttons/

Para trabajar dos personas sin pisarse:

- Si cambia la navegacion o las acciones, tocar primero `Navbar.jsx`.
- Si cambia el tamano, color, espaciado o responsive de la barra, tocar `navbar.css`.
- Mantener `data-bs-target="#mainNavbar"` y `id="mainNavbar"` sincronizados; si no, la hamburguesa deja de abrir.
- Evitar mover estilos de la navbar a `App.css`, porque se vuelve mas dificil saber que regla gana.

## ESLint

ESLint es la herramienta que usamos para revisar la calidad del codigo JavaScript y React.

No instala nada nuevo ni arranca la web. Solo analiza el codigo y avisa de problemas como:

- Variables declaradas pero no usadas.
- `catch` con errores que no se utilizan.
- Malas practicas con hooks de React.
- Codigo innecesario o dificil de mantener.

Comando:

```bash
npm run lint
```

Uso en el proyecto:

1. Antes de subir cambios.
2. Antes de una pull request.
3. Antes de presentar, para demostrar que el frontend no tiene errores basicos de calidad.

Si el comando termina sin errores, significa que ESLint no ha detectado problemas.

## Requisitos

- Node.js.
- Backend arrancado si se quieren cargar datos reales.

## Instalar dependencias

```bash
npm install
```

## Arrancar frontend

```bash
npm run dev
```

URL local:

```text
http://localhost:5173
```

## Comprobar frontend antes de entregar

```bash
npm run lint
npm run build
```

`npm run lint` revisa el codigo.

`npm run build` comprueba que la aplicacion puede compilar para produccion.

## Comunicacion con backend

El frontend se comunica con la API REST del backend, normalmente en:

```text
http://localhost:3000
```

Las llamadas estan organizadas en `src/services/`.

## Idea clave

React construye la interfaz, Bootstrap ayuda con componentes visuales y los servicios se encargan de pedir datos al backend.
