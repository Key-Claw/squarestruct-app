# Frontend SquareStruct

## Objetivo

El frontend es la interfaz de usuario de SquareStruct.

Está desarrollado con React y Vite, y permite navegar por la aplicación, consultar productos, registrarse e iniciar sesión.

## Estructura

```text
frontend/
  public/          Recursos públicos
  src/
    assets/        Imágenes y recursos visuales
    components/    Componentes reutilizables
    pages/         Páginas principales
    services/      Llamadas a la API
    styles/        Estilos globales
    App.jsx        Componente principal
    main.jsx       Punto de entrada
  package.json
  vite.config.js
```

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

## Comunicación con backend

El frontend se comunica con la API REST del backend, normalmente en:

```text
http://localhost:3000
```

Las llamadas están organizadas en `src/services/`.

## Idea clave

React construye la interfaz y los servicios se encargan de pedir datos al backend.
