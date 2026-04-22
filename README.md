# squarestruct-app
Tienda online con backend y frontend conectados que actúa como intermediaria entre empresas de construcción modular y el cliente final. La plataforma permite explorar, personalizar y gestionar viviendas modulares basadas en sistemas de piezas ensamblables.


# estructura de ficheros

GLOBAL:
/ecommerce-app
│
├── backend/
├── frontend/
├── docker/
├── docs/
├── .env
└── README.md


backend/
│
├── db/
│ ├── schema.sql
│ ├── seeds.sql
│ ├── migrations/
│ └── backups/
│
├── postman/
│
├── src/
│ ├── config/
│ ├── controllers/
│ ├── services/
│ ├── routes/
│ ├── middlewares/
│ ├── utils/
│ └── app.js
│
├── tests/
├── package.json
└── server.js

/frontend
│
├── public/
├── src/
│   ├── app/           # rutas (Next 13+)
│   ├── components/    # componentes reutilizables
│   ├── layouts/       # plantillas
│   ├── pages/         # (si usáis pages router)
│   ├── services/      # llamadas a API
│   ├── hooks/         # custom hooks
│   ├── context/       # estado global
│   ├── styles/        # CSS / Bootstrap
│   ├── utils/
│   └── types/
│
├── package.json
└── next.config.js
=======
# 🏗️ SquareStruct App

Tienda online con backend y frontend conectados que actúa como intermediaria entre empresas de construcción modular y el cliente final.  
La plataforma permite explorar, personalizar y gestionar viviendas modulares basadas en sistemas de piezas ensamblables.

---

## 📁 Estructura de ficheros

### 🌐 Global

```bash
/ecommerce-app
│
├── backend/        # API y lógica de negocio
├── frontend/       # Aplicación web (cliente)
├── docker/         # Configuración de contenedores
├── docs/           # Documentación del proyecto
├── .env            # Variables de entorno
└── README.md       # Documentación principal
````

---

### ⚙️ Backend

```bash
/backend
│
├── db/
│   ├── schema.sql      # Definición de la base de datos
│   ├── seeds.sql       # Datos iniciales (test/dev)
│   ├── migrations/     # Versionado de la BD
│   └── backups/        # Copias de seguridad
│
├── postman/            # Colecciones para testear la API
│
├── src/
│   ├── config/         # Configuración (DB, env, etc.)
│   ├── controllers/    # Controladores (entrada de peticiones)
│   ├── services/       # Lógica de negocio
│   ├── routes/         # Definición de endpoints
│   ├── middlewares/    # Interceptores (auth, logs, etc.)
│   ├── utils/          # Funciones auxiliares
│   └── app.js          # Configuración principal de Express
│
├── tests/              # Tests del backend
├── package.json        # Dependencias y scripts
└── server.js           # Punto de arranque del servidor
```

---

### 🎨 Frontend

```bash
/frontend
│
├── public/             # Archivos estáticos (imágenes, favicon, etc.)
│
├── src/
│   ├── app/            # Sistema de rutas (Next.js 13+)
│   ├── components/     # Componentes reutilizables
│   ├── layouts/        # Estructuras base de páginas
│   ├── pages/          # (Opcional) Pages Router clásico
│   ├── services/       # Llamadas a la API
│   ├── hooks/          # Custom React Hooks
│   ├── context/        # Estado global (React Context)
│   ├── styles/         # Estilos (CSS / Bootstrap / Tailwind)
│   ├── utils/          # Funciones auxiliares
│   └── types/          # Tipado (TypeScript)
│
├── package.json        # Dependencias del frontend
└── next.config.js      # Configuración de Next.js
```


## 🛠 Stack tecnológico

| Tecnología | Uso |
|-----------|-----|
| Node.js | Entorno de ejecución |
| Express.js | API REST |
| MySQL | Base de datos |
| mysql2 | Conexión con BD |
| bcrypt | Hash de contraseñas |
| JWT | Autenticación |
| dotenv | Variables de entorno |
| Jest | Testing |
| Supertest | Tests de API |
| Nodemon | Desarrollo |