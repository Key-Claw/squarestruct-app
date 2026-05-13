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

## Caracteristicas

- **Autenticacion de usuarios**: registro, login, JWT, cierre de sesion y validacion de token.
- **Catalogo conectado al backend**: productos obtenidos desde la API REST, con fallback de productos demo en frontend.
- **Carrito visual**: seleccion de productos, cantidades y calculo de total en cliente.
- **Gestion admin inicial**: vista protegida para listar usuarios, cambiar rol entre `usuario` y `admin` y gestionar escritura de productos desde API.
- **API REST**: backend en Express con rutas para usuarios, productos, perfil, pedidos, cancelacion logica y estado de base de datos.
- **Base de datos relacional**: MySQL con usuarios, proveedores, productos, pedidos, detalles de pedido, estado y fecha de cancelacion.
- **Frontend modularizado**: React, Vite, Bootstrap y CSS separado por dominios en `frontend/src/styles/`.
- **Documentacion tecnica**: explicacion de arquitectura, API, MVP, testing, workflow y recursos de defensa.

---

## Estado del Proyecto

El `MVP v1 - Funcional` es el primer hito del roadmap. Su objetivo es demostrar que la base tecnica funciona:

```text
registro -> login -> catalogo -> carrito/base de pedidos -> gestion admin inicial
```

### Funcional

- Registro e inicio de sesion.
- Catalogo de productos conectado al backend.
- Escritura de productos protegida para usuarios `admin`.
- Carrito visual en frontend.
- Gestion de usuarios para administradores.
- Backend con API REST y conexion a MySQL.
- Pedidos autenticados en backend, consulta de detalle y cancelacion logica.
- Pruebas manuales con Postman MVP y V2.
- Tests backend con Jest/Supertest.
- Tests, lint y build del frontend.

### Queda para fases siguientes

- Checkout completo desde el carrito.
- Facturacion conectada con datos reales.
- Herramienta `Design` como disenador 3D real.
- Panel administrativo completo.
- Ampliar cobertura de tests automatizados de frontend.

---

## Tecnologias

| Parte | Tecnologias |
| --- | --- |
| Frontend | React, Vite, JavaScript, Bootstrap, CSS |
| Backend | Node.js, Express, JWT, bcrypt, dotenv, cors |
| Base de datos | MySQL 8.4, mysql2 |
| Testing y calidad | Jest, Supertest, Vitest, Testing Library, Postman, ESLint |
| Entorno y CI | Docker Compose, GitHub Actions |

---

## Instalacion y Uso

```bash
# Clonar repositorio
git clone https://github.com/Key-Claw/squarestruct-app.git
cd squarestruct-app
```

Instala dependencias de backend y frontend:

```bash
cd backend
npm install

cd ../frontend
npm install
```

---

## Inicializacion del Backend y Base de Datos

### 1. Levantar MySQL con Docker Compose

Desde la raiz del proyecto:

```bash
docker compose -f docker/docker-compose.yml up -d
```

Este comando crea el contenedor MySQL `squarestruct-mysql` y carga:

- `backend/db/schema.sql`
- `backend/db/seeds.sql`

### 2. Arrancar el backend

```bash
cd backend
npm run dev
```

El backend queda disponible en:

```text
http://localhost:3000
```

Endpoints utiles:

```text
GET /api/health
GET /api/db-status
GET /api/productos
POST /api/usuarios/register
POST /api/usuarios/login
```

### 3. Arrancar el frontend

En otra terminal:

```bash
cd frontend
npm run dev
```

El frontend queda disponible en:

```text
http://localhost:5173
```

Vite usa proxy para que las llamadas a `/api` apunten al backend local.

---

## Estructura del Proyecto

```text
squarestruct-app/
  backend/
    db/              Scripts SQL, seeds, migraciones y backups
    postman/         Coleccion Postman del MVP
    src/
      controllers/   Logica de peticiones HTTP
      routes/        Endpoints de la API
      middlewares/   Autenticacion, admin y validaciones
      services/      Logica reutilizable
      config/        Configuracion
      utils/         Funciones auxiliares
      app.js         Configuracion de Express
    tests/           Tests Jest/Supertest
    server.js        Punto de entrada del backend

  frontend/
    public/          Recursos publicos
    src/
      assets/        Imagenes y logotipo
      components/    Navbar, footer, auth, carrito, perfil y catalogo
      data/          Datos demo
      pages/         Home, Catalogo, Galeria, Design, AboutUs, Usuarios...
      services/      api, auth, productos y pedidos
      styles/        CSS separado por dominio
      utils/         Helpers y validadores
      App.jsx        Estado principal y navegacion interna
      main.jsx       Punto de entrada de React

  docker/            Docker Compose para MySQL
  docs/              Documentacion tecnica y de presentacion
  scripts/           Carpeta reservada para scripts auxiliares documentados
```

---

## Comandos de Validacion

### Frontend

```bash
cd frontend
npm run test:run
npm run lint
npm run build
```

### Backend

```bash
cd backend
npm test
```

Tambien se pueden ejecutar pruebas separadas:

```bash
npm run test:unit
npm run test:integration
```

---

## Coleccion Postman

Las colecciones Postman estan en:

```text
backend/postman/squarestruct-mvp.postman_collection.json
backend/postman/squarestruct-v2.postman_collection.json
```

Incluye pruebas manuales para:

- health y estado de base de datos;
- productos publicos y escritura de productos con token admin;
- registro, login y perfil;
- gestion admin de usuarios;
- pedidos con `/api/pedidos`, detalle y cancelacion logica;
- alias `/api/orders`.

La coleccion usa variables como `baseUrl`, `token`, `adminToken`, `idUsuario` e `idProducto`.

---

## Documentacion Ampliada

La documentacion extendida esta en [`docs/`](docs/):

- [`docs/README.md`](docs/README.md): indice general de documentacion.
- [`docs/01-proyecto/vision-general.md`](docs/01-proyecto/vision-general.md): vision del proyecto.
- [`docs/01-proyecto/enfoque-saas-y-evolucion.md`](docs/01-proyecto/enfoque-saas-y-evolucion.md): enfoque SaaS y evolucion.
- [`docs/02-mvp/metodologia-mvp.md`](docs/02-mvp/metodologia-mvp.md): alcance del MVP.
- [`docs/02-mvp/decisiones-tecnicas-mvp.md`](docs/02-mvp/decisiones-tecnicas-mvp.md): decisiones tecnicas.
- [`docs/03-arquitectura/frontend-estructura.md`](docs/03-arquitectura/frontend-estructura.md): estructura del frontend.
- [`docs/03-arquitectura/backend-estructura.md`](docs/03-arquitectura/backend-estructura.md): estructura del backend.
- [`docs/03-arquitectura/base-de-datos.md`](docs/03-arquitectura/base-de-datos.md): modelo de base de datos.
- [`docs/04-api/endpoints.md`](docs/04-api/endpoints.md): endpoints principales.
- [`docs/05-testing/frontend-lint-build.md`](docs/05-testing/frontend-lint-build.md): validacion del frontend.
- [`docs/05-testing/postman-mvp-ejemplos.md`](docs/05-testing/postman-mvp-ejemplos.md): pruebas manuales con Postman.
- [`docs/05-testing/revision-v2-validaciones.md`](docs/05-testing/revision-v2-validaciones.md): validaciones ejecutadas en la revision V2.
- [`docs/07-recursos/tecnologias-y-comandos-defensa.md`](docs/07-recursos/tecnologias-y-comandos-defensa.md): tecnologias, comandos y checklist para defensa.

---

## Roadmap

| Version | Objetivo |
| --- | --- |
| `MVP v1 - Funcional` | Registro, login, catalogo, carrito visual, base de pedidos y gestion admin inicial. |
| `v2 - Aplicacion completa y estilizada` | Mejorar interfaz, validaciones, tests, autenticacion, pedidos y estabilidad. |
| `v3 - Disenador de planos 3D` | Anadir editor visual, piezas modulares, presupuesto y guardado de proyectos. |

---

## Licencia

Este proyecto esta bajo licencia MIT. Consulta el archivo [`LICENSE`](LICENSE) para mas detalles.

---

## Contexto Academico

SquareStruct se desarrolla dentro del ciclo de Desarrollo de Aplicaciones Web.

La documentacion esta pensada para que el proyecto pueda entenderse, mantenerse y defenderse en clase: explica que entra en `MVP v1`, que queda para `v2` y `v3`, como se arranca, como se valida y como podria evolucionar.
