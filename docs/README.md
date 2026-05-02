# Documentación de SquareStruct

Esta carpeta reúne la documentación del proyecto. Está organizada para poder consultar rápido qué hace la aplicación, cómo está construida y cómo se puede explicar en una presentación.

## Orden recomendado de lectura

1. `01-proyecto/vision-general.md`: explica la idea del proyecto.
2. `02-mvp/metodologia-mvp.md`: explica qué incluye la primera versión funcional.
3. `03-arquitectura/`: muestra cómo se organizan backend, frontend y base de datos.
4. `04-api/endpoint.md`: resume los endpoints principales.
5. `05-testing/postman-mvp-ejemplos.md`: explica cómo probar el flujo principal.
6. `00-workflow/`: recoge las normas de ramas y commits.

## Para preparar la presentación

Una forma sencilla de explicar el proyecto es seguir este orden:

1. Problema: construir una vivienda modular es difícil de visualizar y presupuestar.
2. Solución: una plataforma web que conecta usuarios, productos y pedidos.
3. MVP: registro, login, catálogo y pedidos.
4. Arquitectura: frontend en React, backend en Express y base de datos MySQL.
5. Demostración: abrir la web, iniciar sesión, consultar productos y explicar la API.

## Carpetas

```text
docs/
  00-workflow/       Git Flow y commits
  01-proyecto/       Idea general del proyecto
  02-mvp/            Alcance del MVP
  03-arquitectura/   Backend, frontend y base de datos
  04-api/            Endpoints REST
  05-testing/        Pruebas con Postman
  06-debug/          Errores frecuentes
  07-recursos/       Documentos de apoyo
```
