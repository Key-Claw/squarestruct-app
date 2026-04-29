# 📦 Frontend SquareStruct

Este documento describe la estructura y configuración del frontend de la aplicación SquareStruct.

---

## ⚛️ Stack principal
- React
- Vite
- JavaScript
- Bootstrap

---

## 📁 Estructura de carpetas

```
frontend/
  public/
  src/
    assets/         # Imágenes y recursos
    components/     # Componentes reutilizables (Navbar, ProductCard...)
    pages/          # Vistas principales (Home, Catalogo, Login...)
    services/       # Lógica de acceso a API (api.js, productService.js...)
    styles/         # Estilos globales y variables
    App.jsx         # Componente raíz
    main.jsx        # Punto de entrada
  package.json
  vite.config.js
```

---

## 🚀 Inicio rápido

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Arranca el frontend:
   ```bash
   npm run dev
   ```
3. Accede a `http://localhost:5173`

---

## 🔗 Comunicación con backend

El frontend consume la API REST del backend en `http://localhost:3000` (ajustable en los servicios de `src/services/`).

---

## 📝 Notas
- El README original de Vite/React se ha movido aquí para referencia.
- Para detalles de arquitectura global, ver el README principal y la carpeta `/docs`.
