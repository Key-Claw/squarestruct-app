# Estructura del frontend

## Objetivo

El frontend es la parte visual de SquareStruct.

Permite que el usuario navegue por la aplicación, consulte productos, se registre e inicie sesión. Está desarrollado con React y Vite.

## Tecnologías usadas

- React.
- Vite.
- JavaScript.
- Bootstrap.
- CSS.

## Estructura principal

```text
frontend/
  public/
  src/
    assets/          Imágenes y recursos visuales
    components/      Componentes reutilizables
    pages/           Páginas principales
    services/        Funciones para llamar a la API
    styles/          Estilos globales
    App.jsx          Componente principal
    main.jsx         Punto de entrada de React
  index.html
  package.json
  vite.config.js
```

## Responsabilidad de cada parte

| Carpeta o archivo | Función |
| --- | --- |
| `components/` | Elementos reutilizables como `Navbar` o `ProductCard`. |
| `pages/` | Vistas completas como `Home`, `Catalogo`, `Login` o `Register`. |
| `services/` | Código que se comunica con el backend. |
| `assets/` | Imágenes, logos e iconos. |
| `styles/` | Estilos globales y variables CSS. |
| `App.jsx` | Organiza la estructura principal de la aplicación. |
| `main.jsx` | Monta React dentro de `index.html`. |

## Comunicación con el backend

El frontend consume la API REST del backend mediante peticiones HTTP.

Ejemplo de flujo:

```text
Usuario abre catálogo -> React llama a /api/productos -> Express consulta MySQL -> React muestra productos
```

## Páginas principales

- `Home.jsx`: página de inicio.
- `Catalogo.jsx`: listado de productos.
- `Login.jsx`: inicio de sesión.
- `Register.jsx`: registro de usuario.
- `AboutUs.jsx`: información del proyecto.
- `Galeria.jsx`: sección visual.

## Servicios

Los archivos de `src/services/` ayudan a separar la lógica de conexión con el backend.

Esto evita escribir `fetch` o llamadas HTTP directamente en todas las páginas.

## Cómo arrancar el frontend

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

El frontend muestra la interfaz al usuario y se comunica con el backend para obtener o enviar datos.
