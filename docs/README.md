# Documentacion de SquareStruct

Esta carpeta reune la documentacion del proyecto. Esta organizada para consultar rapido que hace la aplicacion, como esta construida, como se prueba y como se puede explicar en una presentacion o tutoria.

## Orden recomendado de lectura

1. [`01-proyecto/vision-general.md`](01-proyecto/vision-general.md): explica la idea general del proyecto.
2. [`01-proyecto/enfoque-saas-y-evolucion.md`](01-proyecto/enfoque-saas-y-evolucion.md): explica el enfoque SaaS y su evolucion futura.
3. [`02-mvp/metodologia-mvp.md`](02-mvp/metodologia-mvp.md): explica que incluye la primera version funcional.
4. [`02-mvp/decisiones-tecnicas-mvp.md`](02-mvp/decisiones-tecnicas-mvp.md): justifica las decisiones tecnicas principales.
5. [`03-arquitectura/backend-estructura.md`](03-arquitectura/backend-estructura.md): explica la organizacion del backend.
6. [`03-arquitectura/backend-autenticacion.md`](03-arquitectura/backend-autenticacion.md): explica registro, login, JWT, roles y rutas protegidas.
7. [`03-arquitectura/backend-flujo-peticiones.md`](03-arquitectura/backend-flujo-peticiones.md): explica como viaja una peticion por rutas, middlewares, controladores y base de datos.
8. [`03-arquitectura/tecnologias-backend.md`](03-arquitectura/tecnologias-backend.md): resume las tecnologias usadas en el backend y por que se usan.
9. [`03-arquitectura/base-de-datos.md`](03-arquitectura/base-de-datos.md): resume la base de datos.
10. [`04-api/endpoints.md`](04-api/endpoints.md): resume los endpoints principales.
11. [`05-testing/postman-mvp-ejemplos.md`](05-testing/postman-mvp-ejemplos.md): explica como probar el backend con Postman.
12. [`05-testing/backend-tests.md`](05-testing/backend-tests.md): documenta los tests actuales del backend.
13. [`03-arquitectura/frontend-estructura.md`](03-arquitectura/frontend-estructura.md): explica la organizacion real del frontend, sus paginas, componentes, servicios y CSS.
14. [`03-arquitectura/tecnologias-frontend.md`](03-arquitectura/tecnologias-frontend.md): resume las tecnologias usadas en el frontend y por que se usan.
15. [`05-testing/frontend-lint-build.md`](05-testing/frontend-lint-build.md): explica como revisar el frontend con ESLint, build y comprobacion manual.
16. [`06-debug/generar-hash-bcrypt.md`](06-debug/generar-hash-bcrypt.md): explica como crear hashes bcrypt para usuarios de prueba.
17. [`07-recursos/resumen-frontend.md`](07-recursos/resumen-frontend.md): chuleta rapida para explicar el frontend.
18. [`00-workflow/`](00-workflow/): recoge normas de ramas, commits, issues y milestones.

## Documentacion backend
La documentacion del backend esta repartida entre la guia practica del servidor, la arquitectura, la API, la base de datos, las pruebas y los documentos de depuracion:

| Documento | Uso |
| --- | --- |
| [`../backend/README.md`](../backend/README.md) | Guia practica para instalar, configurar, arrancar, probar y entender el backend desde la carpeta `backend`. |
| [`03-arquitectura/backend-estructura.md`](03-arquitectura/backend-estructura.md) | Explica la organizacion por capas: rutas, controladores, servicios, middlewares, utils y base de datos. |
| [`03-arquitectura/backend-autenticacion.md`](03-arquitectura/backend-autenticacion.md) | Explica registro, login, bcrypt, JWT, roles y rutas publicas o protegidas. |
| [`03-arquitectura/backend-flujo-peticiones.md`](03-arquitectura/backend-flujo-peticiones.md) | Explica el recorrido de una peticion desde el frontend hasta la respuesta JSON. |
| [`03-arquitectura/tecnologias-backend.md`](03-arquitectura/tecnologias-backend.md) | Resume Node.js, Express, MySQL, mysql2, bcrypt, JWT, dotenv, CORS, Jest, Supertest y Nodemon. |
| [`04-api/endpoints.md`](04-api/endpoints.md) | Resume los endpoints REST principales del backend. |
| [`03-arquitectura/base-de-datos.md`](03-arquitectura/base-de-datos.md) | Resume el modelo de base de datos del proyecto. |
| [`03-arquitectura/modelo-datos-detallado.md`](03-arquitectura/modelo-datos-detallado.md) | Detalla entidades, relaciones y reglas del modelo de datos. |
| [`../backend/db/schema.sql`](../backend/db/schema.sql) | Script SQL que crea las tablas, relaciones, indices y restricciones. |
| [`../backend/db/seeds.sql`](../backend/db/seeds.sql) | Datos iniciales para desarrollo, pruebas y demo. |
| [`../backend/db/consultas.md`](../backend/db/consultas.md) | Consultas SQL utiles para comprobar datos, preparar demos y explicar el modelo. |
| [`05-testing/postman-mvp-ejemplos.md`](05-testing/postman-mvp-ejemplos.md) | Explica como probar el backend con Postman. |
| [`05-testing/backend-tests.md`](05-testing/backend-tests.md) | Documenta los tests unitarios e integracion disponibles. |
| [`06-debug/debug-backend-errores.md`](06-debug/debug-backend-errores.md) | Recoge errores frecuentes del backend y como diagnosticarlos. |
| [`06-debug/errores-bd-tablas-no-existen.md`](06-debug/errores-bd-tablas-no-existen.md) | Ayuda a resolver problemas cuando MySQL no tiene las tablas esperadas. |
| [`06-debug/generar-hash-bcrypt.md`](06-debug/generar-hash-bcrypt.md) | Explica como crear hashes bcrypt para usuarios de prueba. |
| [`07-recursos/revision-backend-mvp-copilot.md`](07-recursos/revision-backend-mvp-copilot.md) | Revision de apoyo del estado del backend MVP. |

## Documentacion frontend
La documentacion del frontend esta repartida en dos niveles:

| Documento | Uso |
| --- | --- |
| [`../frontend/README.md`](../frontend/README.md) | Guia practica para instalar, arrancar, validar y entender el frontend desde la carpeta `frontend`. |
| [`03-arquitectura/frontend-estructura.md`](03-arquitectura/frontend-estructura.md) | Explicacion profunda de estructura, paginas, componentes, servicios, CSS, responsive y estado del MVP. |
| [`03-arquitectura/tecnologias-frontend.md`](03-arquitectura/tecnologias-frontend.md) | Explica React, Vite, JavaScript, Bootstrap, CSS modularizado y ESLint. |
| [`05-testing/frontend-lint-build.md`](05-testing/frontend-lint-build.md) | Explica que son `lint` y `build`, como ejecutarlos y que revisar antes de entregar. |
| [`07-recursos/resumen-frontend.md`](07-recursos/resumen-frontend.md) | Resumen corto para defensa o repaso rapido. |

## Para preparar la presentacion

Una forma sencilla de explicar el proyecto es seguir este orden:

1. Problema: construir una vivienda modular es dificil de visualizar y presupuestar.
2. Solucion: una plataforma web que conecta usuarios, productos y pedidos.
3. MVP v1: registro, login, catalogo, carrito visual, base de pedidos y gestion admin.
4. Enfoque SaaS: primera version web que prepara una futura plataforma con disenador 3D.
5. Arquitectura: frontend en React, backend en Express y base de datos MySQL.
6. Frontend: paginas, componentes, servicios, CSS modularizado y comunicacion con `/api`.
7. Backend: rutas, controladores, middlewares, JWT y base de datos.
8. Demostracion: abrir la web, iniciar sesion, consultar productos, anadir al carrito y mostrar gestion admin si aplica.
9. Calidad: explicar tests del backend, Postman, `npm run lint` y `npm run build`.
10. Roadmap: explicar `MVP v1`, `v2` y `v3`.

## Roadmap resumido

| Version | Objetivo |
| --- | --- |
| `MVP v1 - Funcional` | Demostrar el flujo basico: registro, login, catalogo, carrito/base de pedidos y vistas admin. |
| `v2 - Aplicacion completa y estilizada` | Mejorar interfaz, validaciones, tests, autenticacion, pedidos y estabilidad. |
| `v3 - Disenador de planos 3D` | Anadir editor visual, bloques, presupuesto y visualizacion 3D. |

## Carpetas

```text
docs/
  00-workflow/       Git Flow, commits, issues y milestones
  01-proyecto/       Idea general del proyecto
  02-mvp/            Alcance del MVP y decisiones tecnicas
  03-arquitectura/   Backend, frontend, tecnologias y base de datos
  04-api/            Endpoints REST
  05-testing/        Postman, tests backend y validacion frontend
  06-debug/          Errores frecuentes y utilidades
  07-recursos/       Resumenes y documentos de apoyo
```

## Idea clave

`docs/` explica el proyecto completo, `frontend/README.md` funciona como guia practica del cliente React y `backend/README.md` funciona como guia practica del servidor Express. Si una persona nueva entra al proyecto, puede leer primero este README y despues ir al documento especifico que necesite.
