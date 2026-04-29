# 🏗️ SquareStruct App

Aplicación web con backend y frontend conectados que actúa como intermediaria entre empresas de construcción modular y el cliente final.

La plataforma permite explorar productos, gestionar pedidos y sienta las bases para la creación de soluciones de vivienda mediante sistemas de **construcción modular por bloques**.

---

## 🎯 Estado del proyecto

El proyecto se encuentra actualmente en fase:

👉 **MVP (Producto Mínimo Viable)**

### Funcionalidades actuales

* Registro de usuarios
* Autenticación mediante JWT
* Consulta de productos
* Gestión básica de pedidos
* API REST funcional

---

## 🚀 Evolución prevista

El sistema está diseñado para evolucionar hacia:

* Diseño de configuraciones de vivienda mediante bloques modulares
* Cálculo automático de presupuesto
* Visualización de estructuras personalizadas
* Comparación entre proveedores

---

## 📁 Estructura de ficheros

### 🌐 Global

Contiene la organización general del proyecto, separando backend, frontend y documentación.

```bash
/ecommerce-app
│
├── backend/        # API y lógica de negocio
├── frontend/       # Aplicación web (cliente)
├── docker/         # Configuración de contenedores (ver docker/README.md)
├── docs/           # Documentación del proyecto
├── .env            # Variables de entorno
└── README.md
```

---

### ⚙️ Backend

Contiene la API REST y toda la lógica de negocio de la aplicación.
Se encarga de gestionar las peticiones del cliente, interactuar con la base de datos y devolver respuestas estructuradas.

```bash
/backend
│
├── db/                # Scripts y gestión de base de datos
│   ├── schema.sql     # Definición de tablas
│   ├── seeds.sql      # Datos iniciales
│   ├── migrations/    # Versionado de la BD
│   └── backups/       # Copias de seguridad
│
├── postman/           # Colecciones para pruebas de API
│
├── src/
│   ├── config/        # Configuración (DB, env)
│   ├── controllers/   # Gestión de peticiones HTTP
│   ├── services/      # Lógica de negocio reutilizable
│   │   ├── productService.js # Servicio MVP productos
│   │   └── userService.js    # Servicio MVP usuarios
│   ├── routes/        # Definición de endpoints
│   ├── middlewares/   # Autenticación y validaciones
│   ├── utils/         # Funciones auxiliares
│   │   ├── formatDate.js # Formateo de fechas (MVP)
│   │   └── generateId.js  # Generador simple de IDs (MVP)
│   └── app.js         # Configuración de Express
│
├── tests/             # Tests del backend
├── package.json
└── server.js          # Punto de entrada
```

---

### 🎨 Frontend

Contiene la aplicación cliente encargada de la interfaz de usuario.
Se comunica con el backend mediante peticiones HTTP y permite al usuario interactuar con el sistema.

```bash
/frontend
│
├── public/
│
├── src/
│   ├── app/           # Sistema de rutas (Next.js)
│   ├── components/    # Componentes reutilizables
│   ├── layouts/       # Estructura base
│   ├── pages/         # Pages Router (opcional)
│   ├── services/      # Llamadas a la API
│   ├── hooks/         # Hooks personalizados
│   ├── context/       # Estado global
│   ├── styles/        # Estilos
│   ├── utils/         # Funciones auxiliares
│   └── types/         # Tipado
│
├── package.json
└── next.config.js
```

---

## 🔄 Comunicación Frontend - Backend

El frontend se comunica con el backend mediante peticiones HTTP a la API REST.

El backend procesa la lógica de negocio, accede a la base de datos y devuelve respuestas en formato JSON que el frontend utiliza para renderizar la interfaz.

---

## 📚 Documentación

La documentación completa del proyecto se encuentra en `/docs`:


- **Proyecto** → `docs/01-proyecto/vision-general.md`
- **MVP** → `docs/02-mvp/metodologia-mvp.md`
- **Arquitectura** → `docs/03-arquitectura/`
	- [Estructura backend](docs/03-arquitectura/backend-estructura.md)
	- [Base de datos](docs/03-arquitectura/base-de-datos.md)
	- [Tecnologías backend](docs/03-arquitectura/tecnologias-backend.md)
	- [Estructura frontend](docs/03-arquitectura/frontend-estructura.md)
	- [Tecnologías frontend](docs/03-arquitectura/tecnologias-frontend.md)
- **API** → `docs/04-api/endpoint.md`
- **Testing** → `docs/05-testing/postman-mvp-ejemplos.md`
- **Docker** → `docker/README.md`

---

## 🛠 Stack tecnológico (backend)

| Tecnología | Uso                  |
| ---------- | -------------------- |
| Node.js    | Entorno de ejecución |
| Express.js | API REST             |
| MySQL      | Base de datos        |
| mysql2     | Conexión con BD      |
| bcrypt     | Seguridad            |
| JWT        | Autenticación        |
| dotenv     | Variables de entorno |
| Jest       | Testing              |
| Supertest  | Tests                |
| Nodemon    | Desarrollo           |

---



## ♻️ Reinicializar la base de datos tras cambios

Si modificas los scripts de la base de datos (`schema.sql`, `seeds.sql`, etc.), debes reinicializar el volumen de Docker para que los cambios se apliquen:

1. Detén y elimina los contenedores:
	```bash
	docker compose -f docker/docker-compose.yml down
	```
2. Elimina el volumen de datos:
	```bash
	docker volume rm squarestruct_mysql_data
	```
3. Vuelve a levantar los servicios:
	```bash
	docker compose -f docker/docker-compose.yml up -d
	```

Esto recreará la base de datos desde cero con los scripts actualizados.

---

## 🚀 Inicialización completa del entorno backend

### 1. Instalar y arrancar MySQL

Si no tienes MySQL instalado:

- Descarga e instala desde [MySQL Community Downloads](https://dev.mysql.com/downloads/installer/).
- Asegúrate de que el servicio MySQL esté en ejecución.

Puedes iniciar el servicio manualmente (Windows):

```powershell
net start mysql
```
O desde el panel de servicios de Windows.

---

### 2. Clonar repositorio

```bash
git clone https://github.com/Key-Claw/squarestruct-app
cd squarestruct-app/backend
```

---

### 3. Instalar dependencias Node.js

```bash
npm install
```

---

### 4. Configurar entorno

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de base de datos (usuario, contraseña, nombre de la base de datos).

---

### 5. Inicializar la base de datos MySQL

Ejecuta los siguientes comandos para crear la estructura y poblar la base de datos:

```bash
mysql -u <usuario> -p < db/schema.sql
mysql -u <usuario> -p < db/seeds.sql
```

Reemplaza `<usuario>` por tu usuario de MySQL. Si usas XAMPP o similar, el usuario suele ser `root`.

---

### 6. Ejecutar el servidor backend

```bash
npm run dev
```

El servidor estará disponible en:

```
http://localhost:3000
```

---

## 🔁 Flujo básico del sistema

1. El usuario se registra
2. Inicia sesión
3. Consulta productos
4. Realiza un pedido

---

## 🧠 Enfoque del desarrollo

El proyecto sigue un enfoque **MVP-first**, priorizando:

* Implementación funcional
* Iteración progresiva
* Escalabilidad futura

---

## 👨‍💻 Gestión del proyecto

* GitFlow
* Ramas `feature/*`
* Pull Requests
* Issues

---

## 📌 Contexto académico

Proyecto desarrollado en el ciclo DAW (Desarrollo de Aplicaciones Web).
