# 🛠️ Backend SquareStruct

Este backend implementa la API REST, lógica de negocio y acceso a base de datos para la plataforma SquareStruct.

---

## 📁 Estructura principal

- `db/` — Scripts SQL, seeds, backups y migraciones
- `postman/` — Colecciones para pruebas de API
- `src/` — Código fuente principal
  - `config/` — Configuración centralizada
  - `controllers/` — Lógica de entrada
  - `services/` — Lógica de negocio reutilizable
  - `routes/` — Endpoints
  - `middlewares/` — Autenticación y validaciones
  - `utils/` — Funciones auxiliares
  - `app.js` — Configuración Express
- `tests/` — Pruebas unitarias e integración
- `server.js` — Punto de entrada

---

## 🚀 Inicio rápido

### 1. Requisitos previos

- Node.js instalado en la máquina.
- Docker Desktop o Docker Engine en ejecución.
- Acceso a MySQL solo si quieres cargar la base de datos manualmente.

### 2. Clonar el proyecto y entrar al backend

```bash
git clone https://github.com/Key-Claw/squarestruct-app
cd squarestruct-app/backend
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Crear el archivo de entorno

Este backend usa variables de entorno definidas en `.env.example`.
Copiá ese archivo a `.env` y ajustá los valores según tu entorno local.

Variables importantes:

- `PORT`: puerto del backend. Por defecto `3000`.
- `DB_HOST`: host de MySQL. En local suele ser `localhost`.
- `DB_PORT`: puerto de MySQL. En Docker, `3306`.
- `DB_USER`, `DB_PASSWORD`, `DB_NAME`: credenciales de la base de datos.
- `JWT_SECRET`: clave para firmar tokens JWT.

### 4.1. Orden de carga de las variables de entorno

El backend carga `dotenv` en `server.js` **antes** de importar `src/app.js`.

La razón es simple:

- `server.js` es el punto de entrada real de la aplicación.
- `src/app.js` crea la conexión a MySQL y necesita leer `process.env` desde el primer momento.
- En algunos entornos, como nodemon o VS Code, la carpeta actual de ejecución puede cambiar.
- Cargar `.env` al principio evita que aparezcan valores `undefined` en `DB_USER`, `DB_PASSWORD` o `DB_NAME`.

En la práctica, esto significa que:

- `server.js` prepara el entorno.
- `src/app.js` usa esas variables para crear la conexión y definir las rutas.

Si más adelante se refactoriza la app, se puede centralizar esta carga en un solo archivo, pero debe mantenerse **antes** de cualquier uso de `process.env`.

### 5. Levantar la base de datos en una máquina nueva

Si estás arrancando el proyecto por primera vez, la forma recomendada es usar Docker Compose desde la raíz del repo:

```bash
docker compose -f docker/docker-compose.yml up -d
```

Esto crea el contenedor de MySQL y ejecuta automáticamente `backend/db/schema.sql` y `backend/db/seeds.sql` al inicializar el volumen por primera vez.

Si necesitas reinicializar la base de datos porque ya existe un volumen previo:

```bash
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up -d
```

### 6. Verificar que la base de datos quedó lista

```bash
docker logs squarestruct-mysql
```

Y, si quieres confirmar las tablas:

```bash
docker exec -it squarestruct-mysql mysql -uadmin -p -e "USE squarestruct; SHOW TABLES;"
```

### 7. Arrancar el backend

```bash
npm run dev
```

El servidor queda disponible en `http://localhost:3000`.

Si todo está bien, deberías ver una salida parecida a esta:

```bash
DB_USER: admin DB_PASSWORD: ********
Conexion a base de datos correcta
Servidor backend escuchando en el puerto 3000
```

### 8. Modo producción local

Si no quieres usar nodemon:

```bash
npm start
```

---

## 📚 Documentación global

Toda la documentación ampliada está en la carpeta `/docs`.
