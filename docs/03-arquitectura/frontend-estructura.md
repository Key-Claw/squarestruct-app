# 🖥️ Estructura inicial del frontend

## 🎯 Objetivo

Crear la base inicial del frontend de SquareStruct utilizando React con Vite y Bootstrap, dejando preparada una estructura limpia y funcional para comenzar el desarrollo de la MVP.

---

## ⚙️ Tecnología utilizada

* React
* Vite
* JavaScript
* Bootstrap

---

## 🚀 Creación del proyecto

Desde la carpeta `frontend/` se ejecutó el comando:

```bash
npm create vite@latest .
```

Este comando crea un proyecto frontend usando Vite dentro de la carpeta actual.

Durante la configuración se seleccionó:

* Framework: React
* Variant: JavaScript

---

## 📦 Instalación de dependencias

Una vez creado el proyecto, se instalaron las dependencias necesarias:

```bash
npm install
```

Este comando genera la carpeta `node_modules/` y prepara el proyecto para poder ejecutarse correctamente.

---

## ▶️ Ejecución del servidor de desarrollo

Para comprobar que el frontend funciona correctamente, se ejecutó:

```bash
npm run dev
```

Vite levantó el servidor local en:

```bash
http://localhost:5173/
```

Esto permitió visualizar la plantilla inicial de React en el navegador.

---

## 🎨 Integración de Bootstrap

Para poder utilizar estilos y componentes visuales de Bootstrap, se instaló la dependencia:

```bash
npm install bootstrap
```

Después, se importó Bootstrap en el archivo principal del frontend:

```javascript
import 'bootstrap/dist/css/bootstrap.min.css'
```

Archivo donde se añadió:

```bash
src/main.jsx
```

También se dejó comentada la importación del JavaScript de Bootstrap para usarla más adelante si fueran necesarios componentes como modales, dropdowns o tooltips:

```javascript
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'
```

---

## 📁 Estructura actual del frontend

La estructura inicial del frontend queda así:

```bash
frontend/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.js
```

---

## 🧠 Explicación de la estructura

### node_modules/

Contiene las dependencias instaladas del proyecto. No se modifica manualmente y no debe subirse al repositorio.

---

### public/

Carpeta destinada a recursos públicos estáticos que pueden ser servidos directamente por la aplicación.

---

### src/

Carpeta principal del código fuente del frontend.

---

### src/assets/

Carpeta destinada a imágenes, iconos y otros recursos visuales utilizados por la aplicación.

---

### src/App.jsx

Componente principal de la aplicación React. Desde aquí se irá construyendo la interfaz inicial del proyecto.

---

### src/main.jsx

Punto de entrada de React. Este archivo monta la aplicación dentro del elemento `root` del `index.html`.

Además, aquí se ha importado Bootstrap para que sus estilos estén disponibles en toda la aplicación.

---

### src/index.css

Archivo de estilos globales del proyecto.

---

### src/App.css

Archivo de estilos específicos del componente App.

---

### package.json

Archivo de configuración del frontend. Contiene scripts, dependencias y datos básicos del proyecto.

---

### vite.config.js

Archivo de configuración de Vite.

---

## ✅ Estado actual

Actualmente el frontend está correctamente creado, con React funcionando mediante Vite y Bootstrap instalado.

La aplicación puede ejecutarse con:

```bash
npm run dev
```

Y visualizarse desde:

```bash
http://localhost:5173/
```

---

## 🔜 Próximo paso

El siguiente paso será limpiar la plantilla inicial de Vite y empezar a crear la estructura real del frontend de la MVP:

```bash
src/
├── components/
├── pages/
├── services/
├── styles/
├── assets/
├── App.jsx
└── main.jsx
```

Esto permitirá separar mejor la aplicación en componentes reutilizables, páginas principales y servicios de conexión con el backend.
