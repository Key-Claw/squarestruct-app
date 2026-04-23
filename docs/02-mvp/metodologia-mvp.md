# 🚧 Metodología para el desarrollo de la MVP

## 🎯 Objetivo de la MVP

El objetivo de la MVP (Producto Mínimo Viable) es disponer de una aplicación funcional que permita validar el flujo principal del sistema:

👉 registro → login → consulta de productos → realización de pedido

---

## ⚙️ Funcionalidades incluidas

* Registro de usuarios
* Autenticación mediante JWT
* Consulta de productos
* Gestión básica de pedidos
* API REST funcional

---

## ❌ Funcionalidades excluidas (por ahora)

* Configurador 3D
* Sistema avanzado de presupuestado
* Comparador de proveedores
* Panel administrativo completo

---

## 🧩 Fases de desarrollo

1. **Configuración inicial**

   * Creación del repositorio
   * Instalación de dependencias
   * Configuración de entorno (.env)

2. **Diseño de base de datos**

   * Modelo entidad-relación
   * Modelo relacional
   * Scripts SQL

3. **Desarrollo del backend**

   * Configuración de Express
   * Conexión con MySQL
   * Estructura de carpetas

4. **Autenticación**

   * Registro de usuarios
   * Login con JWT
   * Protección de rutas

5. **CRUD principal**

   * Productos
   * Pedidos

6. **Testing**

   * Pruebas con Postman
   * Validación de endpoints

7. **Documentación**

   * README
   * Documentación técnica en /docs

---

## 🛠 Organización del trabajo

* Uso de GitFlow
* Desarrollo en ramas feature/*
* Uso de Pull Requests
* Gestión mediante GitHub Issues

---

## 🧠 Filosofía de desarrollo

Se sigue un enfoque **MVP-first**, priorizando:

* Funcionalidad antes que perfección
* Iteración rápida
* Escalabilidad futura
