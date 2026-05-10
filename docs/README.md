# Documentacion de SquareStruct

Esta carpeta reune la documentacion del proyecto. Esta organizada para consultar rapido que hace la aplicacion, como esta construida, como se prueba y como se puede explicar en una presentacion o tutoria.

## Orden recomendado de lectura

1. `01-proyecto/vision-general.md`: explica la idea general del proyecto.
2. `01-proyecto/enfoque-saas-y-evolucion.md`: explica el enfoque SaaS y su evolucion futura.
3. `02-mvp/metodologia-mvp.md`: explica que incluye la primera version funcional.
4. `02-mvp/decisiones-tecnicas-mvp.md`: justifica las decisiones tecnicas principales.
5. `03-arquitectura/backend-estructura.md`: explica la organizacion del backend.
6. `03-arquitectura/frontend-estructura.md`: explica la organizacion real del frontend, sus paginas, componentes, servicios y CSS.
7. `03-arquitectura/tecnologias-frontend.md`: resume las tecnologias usadas en el frontend y por que se usan.
8. `03-arquitectura/base-de-datos.md`: resume la base de datos.
9. `04-api/endpoints.md`: resume los endpoints principales.
10. `05-testing/postman-mvp-ejemplos.md`: explica como probar el backend con Postman.
11. `05-testing/backend-tests.md`: documenta los tests actuales del backend.
12. `05-testing/frontend-lint-build.md`: explica como revisar el frontend con ESLint, build y comprobacion manual.
13. `06-debug/generar-hash-bcrypt.md`: explica como crear hashes bcrypt para usuarios de prueba.
14. `07-recursos/resumen-frontend.md`: chuleta rapida para explicar el frontend.
15. `00-workflow/`: recoge normas de ramas, commits, issues y milestones.

## Documentacion frontend actualizada

La documentacion del frontend esta repartida en dos niveles:

| Documento | Uso |
| --- | --- |
| `../frontend/README.md` | Guia practica para instalar, arrancar, validar y entender el frontend desde la carpeta `frontend`. |
| `03-arquitectura/frontend-estructura.md` | Explicacion profunda de estructura, paginas, componentes, servicios, CSS, responsive y estado del MVP. |
| `03-arquitectura/tecnologias-frontend.md` | Explica React, Vite, JavaScript, Bootstrap, CSS modularizado y ESLint. |
| `05-testing/frontend-lint-build.md` | Explica que son `lint` y `build`, como ejecutarlos y que revisar antes de entregar. |
| `07-recursos/resumen-frontend.md` | Resumen corto para defensa o repaso rapido. |

## Para preparar la presentacion

Una forma sencilla de explicar el proyecto es seguir este orden:

1. Problema: construir una vivienda modular es dificil de visualizar y presupuestar.
2. Solucion: una plataforma web que conecta usuarios, productos y pedidos.
3. MVP: registro, login, catalogo, carrito visual, base de pedidos y gestion admin.
4. Enfoque SaaS: MVP web que prepara una futura plataforma con disenador 3D.
5. Arquitectura: frontend en React, backend en Express y base de datos MySQL.
6. Frontend: paginas, componentes, servicios, CSS modularizado y comunicacion con `/api`.
7. Backend: rutas, controladores, middlewares, JWT y base de datos.
8. Demostracion: abrir la web, iniciar sesion, consultar productos, anadir al carrito y mostrar gestion admin si aplica.
9. Calidad: explicar tests del backend, Postman, `npm run lint` y `npm run build`.
10. Roadmap: explicar `MVP v1`, `v2` y `v3`.

## Roadmap resumido

| Version | Objetivo |
| --- | --- |
| `MVP v1 - Funcional` | Demostrar el flujo basico: registro, login, catalogo, carrito/pedidos base y vistas admin. |
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

`docs/` explica el proyecto completo y `frontend/README.md` funciona como guia practica del cliente React. Si una persona nueva entra al proyecto, puede leer primero este README y despues ir al documento especifico que necesite.
