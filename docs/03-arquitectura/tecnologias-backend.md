# Tecnologias Del Backend

## Objetivo

El backend usa tecnologias sencillas y conocidas para construir una API REST funcional, segura y facil de mantener.

## Tecnologias Utilizadas

| Tecnologia | Uso en el proyecto |
| --- | --- |
| Node.js | Permite ejecutar JavaScript en el servidor con modulos ES. |
| Express 5 | Crea la API REST y gestiona rutas HTTP. |
| MySQL/MariaDB | Guarda los datos relacionales del proyecto. |
| mysql2/promise | Conecta Node.js con MySQL usando promesas. |
| bcrypt | Hashea contrasenas antes de guardarlas. |
| jsonwebtoken | Genera y valida tokens JWT. |
| dotenv | Lee variables de entorno desde `.env`. |
| cors | Permite peticiones entre frontend y backend. |
| Jest 29 | Ejecuta tests automaticos del backend. |
| Supertest 7 | Prueba endpoints HTTP de Express. |
| Nodemon | Reinicia el servidor durante el desarrollo. |

## Por Que Se Eligieron

- Express es directo y adecuado para una API REST mantenible.
- MySQL encaja bien porque hay relaciones entre usuarios, productos y pedidos.
- JWT permite mantener sesiones sin guardar estado en el servidor.
- bcrypt mejora la seguridad de las contrasenas.
- Jest y Supertest permiten comprobar endpoints reales de backend.

## Alternativas Consideradas

| Alternativa | Motivo para no usarla ahora |
| --- | --- |
| MongoDB | El proyecto necesita relaciones claras entre tablas. |
| NestJS | Anade mas estructura, pero tambien mas complejidad para el alcance actual. |
| TypeScript | Puede ser util mas adelante, pero JavaScript simplifica el desarrollo actual. |

## Idea Clave Para Explicar

El backend usa Node.js y Express para crear la API, MySQL para guardar datos y JWT/bcrypt para la parte de seguridad.
