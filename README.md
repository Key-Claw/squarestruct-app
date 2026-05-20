<p align="center">
  <img src="./frontend/src/assets/logo/squarestruct-logo.png" alt="SquareStruct Logo" width="240" />
</p>

<h1 align="center"></h1>

<p align="center">
  <a href="https://img.shields.io/badge/version-1.0-blue?style=flat-square"><img src="https://img.shields.io/badge/version-1.0-blue?style=flat-square" alt="version"/></a>
  <a href="https://img.shields.io/badge/status-MVP-yellow?style=flat-square"><img src="https://img.shields.io/badge/status-MVP-yellow?style=flat-square" alt="status"/></a>
  <a href="https://img.shields.io/badge/React-19.2.5-61dafb?logo=react&logoColor=white&style=flat-square"><img src="https://img.shields.io/badge/React-19.2.5-61dafb?logo=react&logoColor=white&style=flat-square" alt="React"/></a>
  <a href="https://img.shields.io/badge/Vite-8.0.10-646cff?logo=vite&logoColor=white&style=flat-square"><img src="https://img.shields.io/badge/Vite-8.0.10-646cff?logo=vite&logoColor=white&style=flat-square" alt="Vite"/></a>
  <a href="https://img.shields.io/badge/Express-5.1.0-000000?logo=express&logoColor=white&style=flat-square"><img src="https://img.shields.io/badge/Express-5.1.0-000000?logo=express&logoColor=white&style=flat-square" alt="Express"/></a>
  <a href="https://img.shields.io/badge/MySQL-8.4-4479a1?logo=mysql&logoColor=white&style=flat-square"><img src="https://img.shields.io/badge/MySQL-8.4-4479a1?logo=mysql&logoColor=white&style=flat-square" alt="MySQL"/></a>
  <a href="https://img.shields.io/badge/Docker-Compose-2496ed?logo=docker&logoColor=white&style=flat-square"><img src="https://img.shields.io/badge/Docker-Compose-2496ed?logo=docker&logoColor=white&style=flat-square" alt="Docker Compose"/></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="MIT License"/></a>
</p>

<h2 align="center">Plataforma web para consultar productos de construccion modular, validar un MVP funcional y evolucionar hacia una experiencia SaaS</h2>

SquareStruct es una aplicacion web planteada por fases. El `MVP v1 - Funcional` ya cubre la base del sistema: usuarios, autenticacion, catalogo, carrito visual, base de pedidos y gestion administrativa inicial.

La revision actual se centra en estabilizar la `v2 - Aplicacion completa y estilizada`: mejorar validaciones, permisos, pedidos, documentacion, tests y colecciones Postman. Despues, el roadmap continua con `v3 - Disenador de planos 3D`, donde se ampliaran la facturacion y el futuro disenador de estructuras modulares.

---

## Tabla de Contenidos

- [Caracteristicas](#caracteristicas)
- [Estado del Proyecto](#estado-del-proyecto)
- [Tecnologias](#tecnologias)
- [Instalacion y Uso](#instalacion-y-uso)
- [Inicializacion del Backend y Base de Datos](#inicializacion-del-backend-y-base-de-datos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Comandos de Validacion](#comandos-de-validacion)
- [Coleccion Postman](#coleccion-postman)
- [Documentacion Ampliada](#documentacion-ampliada)
- [Roadmap](#roadmap)
- [Licencia](#licencia)
- [Contexto Academico](#contexto-academico)

---


## Características principales

- **SPA real con React + Vite**: Navegación fluida entre páginas principales usando `HashRouter` para compatibilidad con despliegues estáticos (Apache, AWS, etc.).
- **Autenticación JWT**: Registro, login, cierre de sesión y validación de token en frontend y backend. Middleware de autenticación y roles (`usuario`/`admin`).
- **Catálogo conectado al backend**: Productos obtenidos desde la API REST, con fallback de productos demo en frontend para robustez.
- **Carrito visual y pedidos**: Selección de productos, cantidades y cálculo de total en cliente. Base de pedidos lista para integración completa de checkout.
- **Gestión administrativa**: Vista protegida para listar usuarios, cambiar roles y gestionar productos (solo admin).
- **API REST Express**: Backend modular con rutas para usuarios, productos, perfil, pedidos, cancelación lógica y estado de base de datos.
- **Base de datos relacional**: MySQL 8.4, modelo relacional documentado y migraciones versionadas.
- **Frontend modular y responsive**: Componentes reutilizables, CSS por dominio, Bootstrap y helpers propios.
- **Variables de entorno documentadas**: `.env.example` y explicación de `VITE_API_URL` para integración frontend-backend.
- **Testing y calidad**: Jest, Supertest, Vitest, Testing Library, ESLint y validaciones manuales y automáticas.
- **Docker y CI/CD**: Docker Compose para MySQL y workflows de GitHub Actions para tests, lint y build.
- **Documentación profesional**: Explicación de arquitectura, decisiones técnicas, API, MVP, testing, workflows, recursos de defensa y patrones reutilizables.

---

## Estado del Proyecto

El `MVP v1 - Funcional` cubre el flujo base:

```text
registro → login → catálogo → carrito/base de pedidos → gestión admin inicial
```

**Funcionalidades actuales:**
- Registro e inicio de sesión
- Catálogo de productos conectado al backend
- Escritura de productos protegida para usuarios `admin`
- Carrito visual en frontend
- Gestión de usuarios para administradores
- Backend con API REST y conexión a MySQL
- Pedidos autenticados, consulta de detalle y cancelación lógica
- Pruebas manuales con Postman y tests backend/frontend

**Pendiente para siguientes fases:**
- Checkout completo desde el carrito
- Facturación conectada con datos reales
- Herramienta `Design` como diseñador 3D real
- Panel administrativo completo
- Ampliar cobertura de tests automatizados de frontend

## Tecnologías principales

| Parte | Tecnologías |
| --- | --- |
| Frontend | React, Vite, JavaScript, Bootstrap, CSS modular, HashRouter |
| Backend | Node.js, Express, JWT, bcrypt, dotenv, cors, mysql2 |
| Base de datos | MySQL 8.4, migraciones, seeds |
| Testing y calidad | Jest, Supertest, Vitest, Testing Library, Postman, ESLint |
| Entorno y CI | Docker Compose, GitHub Actions |

## Instalación y uso rápido

```bash
# Clonar repositorio
git clone https://github.com/Key-Claw/squarestruct-app.git
cd squarestruct-app

# Instalar dependencias backend y frontend
cd backend && npm install
cd ../frontend && npm install
```

## Inicialización del backend y base de datos

1. **Levantar MySQL con Docker Compose**

```bash
docker compose -f docker/docker-compose.yml up -d
```
Esto crea el contenedor MySQL y carga los scripts de `backend/db/schema.sql` y `backend/db/seeds.sql`.

2. **Arrancar el backend**

```bash
cd backend
npm run dev
```
El backend queda disponible en:
http://localhost:3000

3. **Arrancar el frontend**

```bash
cd frontend
npm run dev
```
El frontend queda disponible en:
http://localhost:5173

> **Nota:** Vite usa proxy para que las llamadas a `/api` apunten al backend local. Si necesitas apuntar a otra API, configura `VITE_API_URL` en `.env` del frontend.

## Estructura del proyecto

```text
squarestruct-app/
  backend/
    db/              Scripts SQL, seeds, migraciones y backups
    postman/         Colección Postman del MVP y V2
    src/
      controllers/   Lógica de peticiones HTTP
      routes/        Endpoints de la API
      middlewares/   Autenticación, admin y validaciones
      services/      Lógica reutilizable
      config/        Configuración
      utils/         Funciones auxiliares
      app.js         Configuración de Express
    tests/           Tests Jest/Supertest
    server.js        Punto de entrada del backend

  frontend/
    public/          Recursos públicos
    src/
      assets/        Imágenes y logotipo
      components/    Navbar, footer, auth, carrito, perfil, catálogo
      data/          Datos demo
      pages/         Home, Catalog, Gallery, Design, AboutUs, Users...
      services/      api, auth, productos y pedidos
      styles/        CSS modular y por dominio
      utils/         Helpers y validadores
      App.jsx        Estado principal y navegación interna
      main.jsx       Punto de entrada de React

  docker/            Docker Compose para MySQL
  docs/              Documentación técnica y de defensa
  scripts/           Scripts auxiliares documentados
```

## Comandos de validación y testing

**Frontend:**
```bash
cd frontend
npm run test:run   # Ejecuta tests automáticos (Vitest)
npm run lint       # Lint con ESLint
npm run build      # Build de producción (Vite)
```

**Backend:**
```bash
cd backend
npm test           # Ejecuta todos los tests (Jest)
npm run test:unit  # Solo tests unitarios
npm run test:integration # Solo tests de integración
```

## Colección Postman

Las colecciones Postman están en:

```text
backend/postman/squarestruct-mvp.postman_collection.json
backend/postman/squarestruct-v2.postman_collection.json
```

Incluyen pruebas manuales para:
- Health y estado de base de datos
- Productos públicos y escritura de productos con token admin
- Registro, login y perfil
- Gestión admin de usuarios
- Pedidos con `/api/pedidos`, detalle y cancelación lógica
- Alias `/api/orders`

Variables de entorno recomendadas: `baseUrl`, `token`, `adminToken`, `idUsuario`, `idProducto`.

## Documentación ampliada

La documentación extendida está en [`docs/`](docs/):

- [`docs/README.md`](docs/README.md): índice general de documentación
- [`docs/01-proyecto/vision-general.md`](docs/01-proyecto/vision-general.md): visión del proyecto
- [`docs/01-proyecto/enfoque-saas-y-evolucion.md`](docs/01-proyecto/enfoque-saas-y-evolucion.md): enfoque SaaS y evolución
- [`docs/02-mvp/metodologia-mvp.md`](docs/02-mvp/metodologia-mvp.md): alcance del MVP
- [`docs/02-mvp/decisiones-tecnicas-mvp.md`](docs/02-mvp/decisiones-tecnicas-mvp.md): decisiones técnicas
- [`docs/03-arquitectura/frontend-estructura.md`](docs/03-arquitectura/frontend-estructura.md): estructura del frontend
- [`docs/03-arquitectura/backend-estructura.md`](docs/03-arquitectura/backend-estructura.md): estructura del backend
- [`docs/03-arquitectura/base-de-datos.md`](docs/03-arquitectura/base-de-datos.md): modelo de base de datos
- [`docs/03-arquitectura/modelo-datos-detallado.md`](docs/03-arquitectura/modelo-datos-detallado.md): modelo relacional y entidades
- [`docs/04-api/endpoints.md`](docs/04-api/endpoints.md): endpoints principales
- [`docs/05-testing/frontend-lint-build.md`](docs/05-testing/frontend-lint-build.md): validación del frontend
- [`docs/05-testing/postman-mvp-ejemplos.md`](docs/05-testing/postman-mvp-ejemplos.md): pruebas manuales con Postman
- [`docs/05-testing/revision-v2-validaciones.md`](docs/05-testing/revision-v2-validaciones.md): validaciones ejecutadas en la revisión V2
- [`docs/07-recursos/tecnologias-y-comandos-defensa.md`](docs/07-recursos/tecnologias-y-comandos-defensa.md): tecnologías, comandos y checklist para defensa

## Roadmap

| Versión | Objetivo |
| --- | --- |
| `MVP v1 - Funcional` | Registro, login, catálogo, carrito visual, base de pedidos y gestión admin inicial |
| `v2 - Aplicación completa y estilizada` | Mejorar interfaz, validaciones, tests, autenticación, pedidos y estabilidad |
| `v3 - Diseñador de planos 3D` | Añadir editor visual, piezas modulares, presupuesto y guardado de proyectos |

## Licencia

Este proyecto está bajo licencia MIT. Consulta el archivo [`LICENSE`](LICENSE) para más detalles.

---
## Contexto académico

Proyecto realizado como reto DAW1, defendible y alineado con buenas prácticas profesionales. Documentación y código armonizados para facilitar la revisión, ampliación y defensa en entorno académico y profesional.

## Contexto Academico

SquareStruct se desarrolla dentro del ciclo de Desarrollo de Aplicaciones Web.

La documentacion esta pensada para que el proyecto pueda entenderse, mantenerse y defenderse en clase: explica que entra en `MVP v1`, que queda para `v2` y `v3`, como se arranca, como se valida y como podria evolucionar.
