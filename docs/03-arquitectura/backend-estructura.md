# 🧱 Estructura del backend

## 🎯 Objetivo

Organizar el backend de forma escalable y mantenible.

---

## 📁 Estructura

* config → configuración centralizada (DB, settings, variables de entorno)
	* config.js → configuración principal del backend (MVP)
* controllers → lógica de entrada (manejo de requests)
* services → lógica de negocio reutilizable
	* productService.js → lógica de productos (MVP)
	* userService.js → lógica de usuarios (MVP)
* routes → endpoints
* middlewares → autenticación y validación
* utils → funciones auxiliares y helpers
	* formatDate.js → formateo de fechas (MVP)
	* generateId.js → generador simple de IDs (MVP)

---


## 🔄 Flujo de una petición (ejemplo MVP)

1. Cliente hace request → `/api/productos`
2. routes recibe la petición
3. controller procesa
4. service ejecuta lógica (ej: llama a `productService.getAllProducts()`)
5. service accede a la base de datos
6. respuesta JSON

---


## 🧠 Arquitectura y ejemplos de uso

Se sigue un patrón:

👉 Controlador → Servicio → Base de datos

Esto permite:

* Separación de responsabilidades
* Escalabilidad

### Ejemplo de uso de service y util en un controlador

```js
// En productosController.js
const productService = require('../services/productService');
const formatDate = require('../utils/formatDate');

exports.getProductos = async (req, res) => {
	const productos = await productService.getAllProducts();
	// Ejemplo de uso de util
	productos.forEach(p => p.fecha = formatDate(p.fecha));
	res.json(productos);
};
```

### Ejemplo de uso de config

```js
// En app.js o server.js
const config = require('./config/config');
console.log('Puerto backend:', config.port);
```
* Código limpio
