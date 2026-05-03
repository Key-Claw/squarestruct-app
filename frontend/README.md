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

El responsive se organiza en `src/App.css` siguiendo los puntos de corte de Bootstrap:

| Tipo de pantalla | Rango usado |
| --- | --- |
| Movil | Menos de `768px` |
| Tablet | Entre `768px` y `1199.98px` |
| PC | Desde `1200px` |
| PC grande | Desde `1600px` |

La idea es que todas las paginas usen el ancho disponible con `container-fluid`, y que el contenido se reorganice segun el tamano de pantalla.

## Bootstrap

Bootstrap se usa para:

- Navbar y menu hamburguesa.
- Botones.
- Formularios.
- Grid y columnas.
- Cards.
- Tablas.
- Modal.
- Alerts.
- Carousel.

En el codigo hay comentarios con enlaces a la documentacion oficial de Bootstrap para poder explicar de donde sale cada pieza.

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
