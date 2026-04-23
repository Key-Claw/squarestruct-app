# 🛠 Tecnologías del backend

## 🎯 Objetivo

Seleccionar tecnologías robustas, seguras y escalables para el desarrollo de la API de SquareStruct.

---

## ⚙️ Tecnologías utilizadas

### Node.js

Entorno de ejecución para JavaScript en servidor.

### Express.js

Framework para crear APIs REST de forma rápida y estructurada.

### MySQL

Base de datos relacional utilizada para almacenar la información del sistema.

### mysql2

Librería que permite conectar Node.js con MySQL de forma eficiente.

### bcrypt

Permite encriptar contraseñas de forma segura.

### jsonwebtoken (JWT)

Se utiliza para autenticación y autorización mediante tokens.

### dotenv

Gestión de variables de entorno.

### cors

Permite la comunicación segura entre frontend y backend.

---

## 🧪 Testing

### Jest

Framework de testing para JavaScript.

### Supertest

Permite testear endpoints HTTP.

---

## 🧠 Decisiones técnicas

* Se utiliza Express por su simplicidad y gran comunidad.
* Se elige MySQL por su robustez y uso académico.
* JWT permite escalabilidad futura (SPA, apps móviles).
* bcrypt garantiza seguridad en contraseñas.

---

## 🔄 Alternativas consideradas

* MongoDB → descartado por necesidad de relaciones complejas
* NestJS → descartado por complejidad innecesaria para MVP
