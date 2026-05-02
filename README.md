# SquareStruct App

SquareStruct es una aplicación web pensada para acercar la construcción modular al usuario final.

La idea principal es que una persona pueda consultar productos de construcción modular, registrarse, iniciar sesión y realizar pedidos. En una versión futura, la plataforma podría evolucionar hacia un configurador visual de viviendas por bloques.

## Estado del proyecto

El proyecto se encuentra en fase de MVP, es decir, Producto Mínimo Viable.

Un MVP no intenta tener todas las funcionalidades finales. Su objetivo es demostrar que el flujo principal funciona:

```text
registro -> login -> catálogo de productos -> pedido
```

## Roadmap

| Versión | Objetivo |
| --- | --- |
| `MVP v1 - Funcional` | Validar el flujo básico de usuarios, productos y pedidos. |
| `v2 - Aplicación completa y estilizada` | Mejorar interfaz, autenticación, validaciones, tests y estabilidad. |
| `v3 - Diseñador de planos 3D` | Añadir editor visual de planos, bloques modulares, presupuesto y vista 3D. |

## Funcionalidades actuales

- Registro de usuarios.
- Inicio de sesión con JWT.
- Consulta de productos.
- Gestión básica de pedidos.
- API REST conectada con MySQL.
- Frontend en React conectado al backend.

## Tecnologías principales

| Parte | Tecnologías |
| --- | --- |
| Backend | Node.js, Express, MySQL, JWT, bcrypt |
| Frontend | React, Vite, JavaScript, Bootstrap |
| Base de datos | MySQL |
| Pruebas | Postman, Jest, Supertest |
| Entorno | Docker Compose |

## Estructura del proyecto

```text
squarestruct-app/
  backend/      API REST, lógica de negocio y base de datos
  frontend/     Interfaz web de usuario
  docker/       Configuración de Docker Compose
  docs/         Documentación técnica y de presentación
  scripts/      Scripts de ayuda para arrancar el entorno
  README.md     Resumen general del proyecto
```

## Backend

El backend recibe las peticiones del frontend, aplica la lógica de negocio, consulta la base de datos y devuelve respuestas en formato JSON.

```text
backend/
  db/              Scripts SQL, seeds, migraciones y backups
  postman/         Colección de pruebas manuales
  src/
    config/        Configuración del proyecto
    controllers/   Reciben las peticiones HTTP
    services/      Contienen lógica reutilizable
    routes/        Definen los endpoints
    middlewares/   Autenticación y validaciones
    utils/         Funciones auxiliares
    app.js         Configuración de Express
  tests/           Tests del backend
  server.js        Punto de entrada
```

## Frontend

El frontend es la parte visual de la aplicación. Permite navegar por las páginas, consultar productos, registrarse e iniciar sesión.

```text
frontend/
  public/          Recursos públicos
  src/
    assets/        Imágenes y recursos visuales
    components/    Componentes reutilizables
    pages/         Páginas principales
    services/      Conexión con la API
    styles/        Estilos globales
    App.jsx        Componente principal
    main.jsx       Punto de entrada de React
```

## Cómo arrancar el proyecto

### 1. Levantar la base de datos

Desde la raíz del repositorio:

```bash
docker compose -f docker/docker-compose.yml up -d
```

### 2. Arrancar el backend

```bash
cd backend
npm install
npm run dev
```

El backend queda disponible en:

```text
http://localhost:3000
```

### 3. Arrancar el frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El frontend queda disponible en:

```text
http://localhost:5173
```

## Documentación

La documentación está organizada en la carpeta `docs/`:

- `docs/00-workflow/`: forma de trabajar con Git y commits.
- `docs/01-proyecto/`: visión general del proyecto.
- `docs/02-mvp/`: explicación del MVP.
- `docs/03-arquitectura/`: estructura del backend, frontend y base de datos.
- `docs/04-api/`: endpoints principales.
- `docs/05-testing/`: pruebas manuales con Postman.
- `docs/06-debug/`: errores frecuentes y soluciones.
- `docs/07-recursos/`: documentación de apoyo.

## Contexto académico

Este proyecto está desarrollado dentro del ciclo de Desarrollo de Aplicaciones Web. La documentación está pensada para que pueda entenderse, mantenerse y explicarse en una presentación de clase.
