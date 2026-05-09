# Documentación de SquareStruct

Esta carpeta reúne la documentación del proyecto. Está organizada para poder consultar rápido qué hace la aplicación, cómo está construida y cómo se puede explicar en una presentación.

## Orden recomendado de lectura

1. `01-proyecto/vision-general.md`: explica la idea del proyecto.
2. `02-mvp/metodologia-mvp.md`: explica qué incluye la primera versión funcional.
3. `03-arquitectura/`: muestra cómo se organizan backend, frontend y base de datos.
4. `04-api/endpoint.md`: resume los endpoints principales.
5. `05-testing/postman-mvp-ejemplos.md`: explica cómo probar el flujo principal.
6. `05-testing/frontend-lint-build.md`: explica como revisar el frontend con ESLint y build.
7. `06-debug/generar-hash-bcrypt.md`: explica como crear hashes bcrypt para usuarios de prueba.
8. `00-workflow/`: recoge las normas de ramas, commits, issues y milestones.

## Para preparar la presentación

Una forma sencilla de explicar el proyecto es seguir este orden:

1. Problema: construir una vivienda modular es difícil de visualizar y presupuestar.
2. Solución: una plataforma web que conecta usuarios, productos y pedidos.
3. MVP: registro, login, catálogo y pedidos.
4. Arquitectura: frontend en React, backend en Express y base de datos MySQL.
5. Demostración: abrir la web, iniciar sesión, consultar productos y explicar la API.
6. Calidad del frontend: explicar `npm run lint` y `npm run build`.
7. Roadmap: explicar `MVP v1`, `v2` y `v3`.

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
