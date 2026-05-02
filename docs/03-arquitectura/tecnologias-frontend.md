# Tecnologías del frontend

## Objetivo

El frontend busca ofrecer una interfaz clara para que el usuario pueda navegar por SquareStruct y consumir los datos del backend.

## Tecnologías utilizadas

| Tecnología | Uso en el proyecto |
| --- | --- |
| React | Construcción de la interfaz mediante componentes. |
| Vite | Entorno de desarrollo rápido para React. |
| JavaScript | Lenguaje principal del frontend. |
| Bootstrap | Ayuda con estilos y componentes visuales. |
| CSS | Personalización del diseño. |

## Por qué React

React permite dividir la interfaz en componentes reutilizables.

Por ejemplo:

- `Navbar` para la navegación.
- `ProductCard` para mostrar productos.
- Páginas como `Home`, `Catalogo`, `Login` o `Register`.

Esto hace que el código sea más ordenado y fácil de ampliar.

## Por qué Vite

Vite facilita el desarrollo porque:

- Arranca rápido.
- Actualiza la página al guardar cambios.
- Tiene una configuración sencilla.

## Comunicación con backend

El frontend no accede directamente a la base de datos. Se comunica con el backend mediante la API REST.

```text
React -> API REST -> MySQL
```

## Idea clave para explicar

React construye la parte visual, Vite facilita el desarrollo y los servicios del frontend se encargan de comunicarse con la API.
