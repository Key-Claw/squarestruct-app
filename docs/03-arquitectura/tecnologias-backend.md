# Tecnologías del backend

## Objetivo

El backend usa tecnologías sencillas y conocidas para construir una API REST funcional, segura y fácil de explicar en un entorno académico.

## Tecnologías utilizadas

| Tecnología | Uso en el proyecto |
| --- | --- |
| Node.js | Permite ejecutar JavaScript en el servidor. |
| Express | Crea la API REST y gestiona rutas HTTP. |
| MySQL | Guarda los datos del proyecto. |
| mysql2 | Conecta Node.js con MySQL. |
| bcrypt | Cifra contraseñas antes de guardarlas. |
| jsonwebtoken | Genera y valida tokens JWT. |
| dotenv | Lee variables de entorno desde `.env`. |
| cors | Permite peticiones entre frontend y backend. |
| Jest | Ejecuta tests automáticos. |
| Supertest | Prueba endpoints HTTP del backend. |
| Nodemon | Reinicia el servidor durante el desarrollo. |

## Por qué se eligieron

- Express es directo y adecuado para una API REST de MVP.
- MySQL encaja bien porque hay relaciones entre usuarios, productos y pedidos.
- JWT permite mantener sesiones sin guardar estado en el servidor.
- bcrypt mejora la seguridad de las contraseñas.
- Jest y Supertest permiten comprobar que partes del backend funcionan.

## Alternativas consideradas

| Alternativa | Motivo para no usarla ahora |
| --- | --- |
| MongoDB | El proyecto necesita relaciones claras entre tablas. |
| NestJS | Añade más estructura, pero también más complejidad para un MVP. |
| TypeScript | Puede ser útil más adelante, pero JavaScript simplifica el arranque inicial. |

## Idea clave para explicar

El backend usa Node.js y Express para crear la API, MySQL para guardar datos y JWT/bcrypt para la parte de seguridad.
