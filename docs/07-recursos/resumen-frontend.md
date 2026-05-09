# Resumen del frontend

## Objetivo

Este documento resume la estructura del frontend de SquareStruct.

El frontend es la interfaz que ve el usuario. Está hecho con React y Vite.

## Stack principal

- React.
- Vite.
- JavaScript.
- Bootstrap.
- CSS.

## Estructura

```text
frontend/
  public/
  src/
    assets/        Imágenes y recursos
    components/    Componentes reutilizables
    pages/         Vistas principales
    services/      Llamadas a la API
    styles/        Estilos globales
    App.jsx        Componente raíz
    main.jsx       Punto de entrada
  package.json
  vite.config.js
```

## Arranque rápido

```bash
cd frontend
npm install
npm run dev
```

URL local:

```text
http://localhost:5173
```

## Comunicación con backend

El frontend consume la API REST del backend, normalmente disponible en:

```text
http://localhost:3000
```

Los archivos de `src/services/` centralizan esas llamadas.

## Idea clave para explicar

El frontend no trabaja directamente con MySQL. Pide datos al backend y muestra la respuesta al usuario.
