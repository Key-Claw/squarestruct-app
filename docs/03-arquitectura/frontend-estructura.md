# Estructura del frontend

## Objetivo

El frontend es la parte visual de SquareStruct.

Permite que el usuario navegue por la aplicacion, consulte productos, se registre e inicie sesion. Esta desarrollado con React y Vite.

## Tecnologias usadas

- React.
- Vite.
- JavaScript.
- Bootstrap.
- CSS.
- ESLint.

## Estructura principal

```text
frontend/
  public/
  src/
    assets/          Imagenes y recursos visuales
    components/      Componentes reutilizables
    pages/           Paginas principales
    services/        Funciones para llamar a la API
    styles/          Estilos globales
    App.jsx          Componente principal
    main.jsx         Punto de entrada de React
  index.html
  package.json
  vite.config.js
```

## Responsabilidad de cada parte

| Carpeta o archivo | Funcion |
| --- | --- |
| `components/` | Elementos reutilizables como `Navbar` o `ProductCard`. |
| `pages/` | Vistas completas como `Home`, `Catalogo`, `Login` o `Register`. |
| `services/` | Codigo que se comunica con el backend. |
| `assets/` | Imagenes, logos e iconos. |
| `styles/` | Estilos globales y variables CSS. |
| `App.jsx` | Organiza la estructura principal de la aplicacion. |
| `main.jsx` | Monta React dentro de `index.html`. |

## Comunicacion con el backend

El frontend consume la API REST del backend mediante peticiones HTTP.

Ejemplo de flujo:

```text
Usuario abre catalogo -> React llama a /api/productos -> Express consulta MySQL -> React muestra productos
```

## Paginas principales

- `Home.jsx`: pagina de inicio.
- `Catalogo.jsx`: listado de productos conectado al backend.
- `Products.jsx`: seccion interna de productos dentro del catalogo.
- `Galeria.jsx`: ejemplos visuales de aplicaciones de bloques.
- `Design.jsx`: maqueta inicial del futuro disenador de planos.
- `Carrito.jsx`: vista MVP del carrito enlazada desde el icono de la navbar.
- `Login.jsx`: inicio de sesion.
- `Register.jsx`: registro de usuario.
- `AboutUs.jsx`: informacion del proyecto y carrusel accesible desde el logo.
- `Perfil.jsx`: datos del usuario autenticado.
- `Usuarios.jsx`: gestion basica de usuarios para administracion.

## Responsive y coherencia visual

El diseno se organiza para tres tipos de pantalla:

| Pantalla | Rango |
| --- | --- |
| Movil | Menos de `768px` |
| Tablet | Entre `768px` y `1199.98px` |
| PC | Desde `1200px` |

Las paginas principales usan `container-fluid` para ocupar el ancho disponible.

El archivo `src/App.css` contiene las reglas responsive principales.

## Bootstrap

Bootstrap se usa para:

- Navbar y menu hamburguesa.
- Botones.
- Formularios.
- Grid responsive.
- Cards.
- Tablas.
- Modal.
- Alerts.
- Carousel.

El CSS propio completa la identidad visual de SquareStruct.

## Revision de calidad con ESLint

El frontend incluye un script de revision:

```bash
npm run lint
```

Este comando ejecuta ESLint y ayuda a detectar problemas de codigo antes de subir cambios.

Tambien se comprueba la compilacion con:

```bash
npm run build
```

## Servicios

Los archivos de `src/services/` ayudan a separar la logica de conexion con el backend.

Esto evita escribir `fetch` o llamadas HTTP directamente en todas las paginas.

## Como arrancar el frontend

```bash
cd frontend
npm install
npm run dev
```

URL local:

```text
http://localhost:5173
```

## Idea clave para explicar

El frontend muestra la interfaz al usuario, usa Bootstrap para componentes visuales, React para organizar vistas y servicios para comunicarse con el backend.
