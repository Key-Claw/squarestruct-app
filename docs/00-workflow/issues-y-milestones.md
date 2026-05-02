# Issues, milestones y Pull Requests

## Objetivo

Este documento explica cómo organizar el trabajo del proyecto usando issues, milestones, ramas y Pull Requests.

La idea es que cualquier tarea tenga un contexto claro: qué se quiere hacer, en qué rama se trabaja, cuándo se considera terminada y a qué versión del proyecto pertenece.

## Milestones del proyecto

### MVP v1 - Funcional

Primera versión funcional del proyecto.

Incluye:

- Base de datos inicial.
- Backend funcional básico.
- Frontend básico.
- Registro y login.
- Catálogo.
- Pedidos básicos.
- Documentación del estado actual.

### v2 - Aplicación completa y estilizada

Versión más estable, usable y presentable.

Incluye:

- Mejoras visuales.
- Flujo de autenticación más completo.
- Validaciones más robustas.
- Tests de backend y frontend.
- Integración continua.
- Comprobación de base de datos limpia con Docker.

### v3 - Diseñador de planos 3D

Versión futura centrada en la funcionalidad diferencial del proyecto.

Incluye:

- Editor visual de planos.
- Bloques modulares arrastrables.
- Cálculo de presupuesto según bloques usados.
- Guardado de diseños por usuario.
- Visualización 3D.

## Labels recomendadas

Labels principales:

- `backend`: tareas de API, servidor o lógica de negocio.
- `frontend`: tareas de interfaz.
- `database`: tareas de base de datos.
- `documentation`: documentación.
- `testing`: tests.
- `api`: endpoints o comunicación HTTP.
- `bug`: correcciones.
- `enhancement`: mejoras o nuevas funcionalidades.
- `style`: estilos visuales.

Labels útiles si se crean en GitHub:

- `ci`: integración continua.
- `security`: seguridad.
- `docker`: contenedores y entorno.
- `design`: editor de planos y diseño modular.
- `ux`: experiencia de usuario.
- `mvp`: tareas necesarias para la primera versión funcional.
- `post-mvp`: tareas posteriores al MVP.

## Estructura recomendada de una issue

```md
## Descripción

Explicación breve de qué se quiere hacer y por qué.

## Rama de trabajo

`feature/...`

## Rama destino

`dev`

## Pull Request

Pendiente.

## Dependencias

- Ninguna.

## Tareas

- [ ] Tarea 1
- [ ] Tarea 2

## Criterios de aceptación

- [ ] Criterio 1
- [ ] Criterio 2
```

## Ramas por tipo de tarea

| Tipo | Ejemplo |
| --- | --- |
| Backend | `feature/backend/auth-jwt` |
| Frontend | `feature/frontend/catalogo` |
| Base de datos | `feature/backend/db` |
| Documentación | `feature/docs/documentacion-general` |
| Corrección | `fix/backend/product-validation` |
| Tests | `test/backend/productos-pedidos` |
| DevOps | `feature/devops/ci-backend-tests` |
| Diseño futuro | `feature/design/editor-planos` |

## Relación entre issue y Pull Request

Cuando se crea un Pull Request, debe enlazar la issue correspondiente.

Ejemplo:

```md
Closes #35
```

Si el PR no cierra la issue por completo, se puede usar:

```md
Relacionado con #35
```

## Cuándo cerrar una issue

Una issue se puede cerrar cuando:

- Todas las tareas están completadas.
- Los criterios de aceptación están cumplidos.
- El código o documentación se ha integrado en `dev`.
- El Pull Request asociado se ha revisado y mergeado.

## Frase útil para la presentación

Organizamos el proyecto por milestones e issues para mostrar una evolución clara: primero un MVP funcional, después una versión más completa y finalmente el diseñador de planos 3D.
