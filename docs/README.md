# Documentación de SquareStruct

Esta carpeta reúne la documentación del proyecto. Está organizada para poder consultar rápido qué hace la aplicación, cómo está construida y cómo se puede explicar en una presentación.

## Orden recomendado de lectura

1. `01-proyecto/vision-general.md`: explica la idea del proyecto.
2. `01-proyecto/enfoque-saas-y-evolucion.md`: explica el enfoque SaaS y su evolución futura.
3. `02-mvp/metodologia-mvp.md`: explica qué incluye la primera versión funcional.
4. `02-mvp/decisiones-tecnicas-mvp.md`: justifica las decisiones técnicas principales.
5. `03-arquitectura/`: muestra cómo se organizan backend, frontend y base de datos.
6. `04-api/endpoints.md`: resume los endpoints principales.
7. `05-testing/postman-mvp-ejemplos.md`: explica cómo probar el flujo principal.
8. `05-testing/backend-tests.md`: documenta los tests actuales del backend.
9. `05-testing/frontend-lint-build.md`: explica como revisar el frontend con ESLint y build.
10. `06-debug/generar-hash-bcrypt.md`: explica como crear hashes bcrypt para usuarios de prueba.
11. `00-workflow/`: recoge las normas de ramas, commits, issues y milestones.

## Para preparar la presentación

Una forma sencilla de explicar el proyecto es seguir este orden:

1. Problema: construir una vivienda modular es difícil de visualizar y presupuestar.
2. Solución: una plataforma web que conecta usuarios, productos y pedidos.
3. MVP: registro, login, catálogo y pedidos.
4. Enfoque SaaS: MVP web que prepara una futura plataforma SaaS con diseñador 3D.
5. Arquitectura: frontend en React, backend en Express y base de datos MySQL.
6. Demostración: abrir la web, iniciar sesión, consultar productos y explicar la API.
7. Calidad: explicar tests del backend, Postman, `npm run lint` y `npm run build`.
8. Roadmap: explicar `MVP v1`, `v2` y `v3`.

## Roadmap resumido

| Versión | Objetivo |
| --- | --- |
| `MVP v1 - Funcional` | Demostrar el flujo básico: registro, login, catálogo y pedidos. |
| `v2 - Aplicación completa y estilizada` | Mejorar interfaz, validaciones, tests, autenticación y estabilidad. |
| `v3 - Diseñador de planos 3D` | Añadir editor visual, bloques, presupuesto y visualización 3D. |

## Carpetas

```text
docs/
  00-workflow/       Git Flow, commits, issues y milestones
  01-proyecto/       Idea general del proyecto
  02-mvp/            Alcance del MVP
  03-arquitectura/   Backend, frontend y base de datos
  04-api/            Endpoints REST
  05-testing/        Pruebas con Postman
  06-debug/          Errores frecuentes
  07-recursos/       Documentos de apoyo
```
