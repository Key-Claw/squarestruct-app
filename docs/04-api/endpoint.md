# 🔌 API REST

## 📐 Convenciones

* Prefijo: /api
* Recursos en plural
* Métodos HTTP estándar

---

## 🔐 Seguridad

* Autenticación con JWT
* Rutas protegidas
* Validación de datos

---

## 📦 Endpoints principales

### Registro

POST /api/usuarios/register

### Login

POST /api/usuarios/login

### Productos

GET /api/productos

### Pedidos

POST /api/pedidos

---

## 📤 Ejemplo de respuesta

```json
{
  "idProducto": 1,
  "nombre": "Bloque modular",
  "precio": 25.5
}
```
