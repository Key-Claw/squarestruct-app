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
| Documentación | `docs/nombre-documento` | `docs/git-flow` |
| Corrección | `fix/parte/nombre-error` | `fix/backend/login` |

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
```

## Ramas actuales importantes

```text
main
dev
feature/backend/db
feature/backend/mvp
feature/frontend/mvp
```

## Frase útil para la presentación

Usamos `dev` como rama de integración y ramas `feature/*` para separar el trabajo por partes. Así el proyecto se mantiene más ordenado y es más fácil revisar cambios.
