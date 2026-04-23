# 🧱 Estructura del backend

## 🎯 Objetivo

Organizar el backend de forma escalable y mantenible.

---

## 📁 Estructura

* config → configuración
* controllers → lógica de entrada
* services → lógica de negocio
* routes → endpoints
* middlewares → autenticación y validación
* utils → funciones auxiliares

---

## 🔄 Flujo de una petición

1. Cliente hace request → /api/productos
2. routes recibe la petición
3. controller procesa
4. service ejecuta lógica
5. consulta a base de datos
6. respuesta JSON

---

## 🧠 Arquitectura

Se sigue un patrón:

👉 Controlador → Servicio → Base de datos

Esto permite:

* Separación de responsabilidades
* Escalabilidad
* Código limpio
