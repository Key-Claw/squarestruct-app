# Git Flow del proyecto

## Objetivo

Este documento explica cómo se organizan las ramas del repositorio.

La idea es trabajar de forma ordenada: cada cambio se desarrolla en una rama propia y después se integra en `dev` mediante Pull Request.

## Ramas principales

### `main`

Es la rama estable del proyecto.

Debe contener versiones revisadas y funcionales. No se trabaja directamente sobre ella.

### `dev`

Es la rama principal de desarrollo.

Aquí se integran las funcionalidades cuando ya están preparadas. En este proyecto, `dev` representa el estado actual más avanzado.

## Ramas de trabajo

Las ramas de trabajo se crean siempre desde `dev`.

```bash
git checkout dev
git pull origin dev
git checkout -b feature/backend/nombre-tarea
```

## Nomenclatura de ramas

| Tipo de trabajo | Formato | Ejemplo |
| --- | --- | --- |
| Backend | `feature/backend/nombre-tarea` | `feature/backend/mvp` |
| Frontend | `feature/frontend/nombre-tarea` | `feature/frontend/mvp` |
| Base de datos | `feature/db/nombre-tarea` | `feature/db/seeds-demo` |
| DevOps | `feature/devops/nombre-tarea` | `feature/devops/docker` |
| Documentación | `feature/docs/nombre-tarea` | `feature/docs/documentacion-general` |
| Corrección | `fix/parte/nombre-error` | `fix/backend/login` |
| Tests | `test/parte/nombre-tarea` | `test/backend/productos-pedidos` |
| Diseño futuro | `feature/design/nombre-tarea` | `feature/design/editor-planos` |

## Flujo de trabajo recomendado

1. Actualizar `dev`.
2. Crear una rama desde `dev`.
3. Desarrollar la tarea.
4. Hacer commits claros.
5. Subir la rama al remoto.
6. Crear un Pull Request hacia `dev`.
7. Revisar los cambios.
8. Hacer merge en `dev`.

## Comandos habituales

Crear una rama:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/backend/crud-productos
```

Subir una rama:

```bash
git push -u origin feature/backend/crud-productos
```

Actualizar una rama con los cambios de `dev`:

```bash
git checkout dev
git pull origin dev
git checkout feature/backend/crud-productos
git merge dev
```

## Pull Requests

Todo cambio importante debe integrarse mediante Pull Request.

Un Pull Request debería incluir:

- Resumen del trabajo.
- Cambios realizados.
- Issue relacionada, si existe.
- Estado actual de la funcionalidad.
- Rama origen y rama destino.
- Referencia a la issue que cierra o resuelve.

Ejemplo de título:

```text
feat(backend): implementar CRUD de productos
```

Ejemplo de descripción:

```text
Resumen:
Se implementa el CRUD básico de productos.

Cambios:
- Rutas de productos
- Controlador
- Servicio
- Validaciones básicas

Estado:
Funcional para MVP

Issue:
Closes #X
```

## Issues

Las issues sirven para organizar el trabajo antes de crear una rama o un Pull Request.

La plantilla completa de issues, milestones y labels está documentada en:

```text
docs/00-workflow/issues-y-milestones.md
```

En este documento de Git Flow solo se recoge cómo se relacionan las issues con ramas y Pull Requests:

```text
issue -> rama de trabajo -> commits -> Pull Request -> merge en dev
```

Cuando se cree el Pull Request, se recomienda enlazarlo desde la issue y usar `Closes #numero` en la descripción del PR si ese PR termina la tarea.

## Ramas actuales importantes

```text
main
dev
feature/backend/db
feature/backend/mvp
feature/frontend/mvp
feature/docs/documentacion-general
```

## Posible evolución de nombres de ramas

```text
main               → Versión estable y preparada para producción
dev                → Rama principal de desarrollo e integración

feat/db            → Desarrollo y cambios de base de datos
feat/api           → Desarrollo general del backend y API
feat/orders        → Sistema de pedidos, carrito y presupuestos
feat/ui            → Diseño y estructura visual del frontend
feat/login         → Autenticación, usuarios y roles

docs/general       → Documentación y organización del proyecto
hotfix/auth        → Corrección urgente de errores de autenticación
refactor/navbar    → Reorganización y limpieza interna del navbar
test/frontend      → Tests y validaciones del frontend
```

Esta evolución queda documentada como referencia por si se decide simplificar la nomenclatura más adelante. Mientras tanto, el proyecto sigue usando el flujo descrito en las secciones anteriores.

## Frase útil para la presentación

Usamos `dev` como rama de integración y ramas `feature/*`, `fix/*` o `test/*` para separar el trabajo por partes. Cada cambio se relaciona con una issue y se integra mediante Pull Request.
