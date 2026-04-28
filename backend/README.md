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

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Configura `.env` (ver ejemplo en `.env.example`)
3. Inicializa la base de datos (ver docs/README-backups.md)
4. Arranca el backend:
   ```bash
   npm run dev
   ```

---

## 📚 Documentación global

Toda la documentación ampliada está en la carpeta `/docs`.
