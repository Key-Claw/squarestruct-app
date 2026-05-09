# Issues, milestones y Pull Requests

## Objetivo

Este documento explica cómo organizar el trabajo del proyecto usando issues, milestones, ramas y Pull Requests.

La idea es que cualquier tarea tenga un contexto claro: qué se quiere hacer, en qué rama se trabaja, cuándo se considera terminada y a qué versión del proyecto pertenece.

## Milestones del proyecto

Los milestones se usan para separar el proyecto en fases. Cada milestone agrupa issues relacionadas con una versión concreta del producto.

En GitHub se trabaja con tres milestones principales:

| Milestone | Progreso | Issues | Fecha objetivo | Objetivo |
| --- | --- | --- | --- | --- |
| `MVP v1 - Funcional` | 86% | 25 cerradas / 4 abiertas | 9 mayo 2026 | Demostrar el flujo principal del proyecto. |
| `v2 - Aplicación completa y estilizada` | 0% | 0 cerradas / 7 abiertas | 12 mayo 2026 | Mejorar estabilidad, interfaz, autenticación y validaciones. |
| `v3 - Diseñador de planos 3D` | 0% | 0 cerradas / 5 abiertas | 10 mayo 2026 | Añadir la funcionalidad diferencial de diseño modular. |

El progreso de cada milestone se mide con las issues cerradas y abiertas. Esto permite ver de forma visual cuánto trabajo queda para completar cada fase.

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

Este milestone es el foco actual del proyecto. Las issues de esta fase deben estar orientadas a conseguir una demo completa y explicable.

### v2 - Aplicación completa y estilizada

Versión más estable, usable y presentable.

Incluye:

- Mejoras visuales.
- Flujo de autenticación más completo.
- Validaciones más robustas.
- Tests de backend y frontend.
- Integración continua.
- Comprobación de base de datos limpia con Docker.

Este milestone queda como evolución posterior al MVP. No debe bloquear la entrega de la primera versión funcional.

### v3 - Diseñador de planos 3D

Versión futura centrada en la funcionalidad diferencial del proyecto.

Incluye:

- Editor visual de planos.
- Bloques modulares arrastrables.
- Cálculo de presupuesto según bloques usados.
- Guardado de diseños por usuario.
- Visualización 3D.

Este milestone recoge la visión futura del producto. Sirve para demostrar que el proyecto puede crecer más allá del MVP, pero no forma parte del alcance inmediato.

## Sistema de trabajo con issues

Cada issue representa una tarea concreta del proyecto.

La issue debe indicar:

- qué problema o mejora resuelve;
- a qué milestone pertenece;
- qué rama se usará;
- qué tareas internas hay que completar;
- cuándo se considera terminada.

Ejemplo de reparto:

| Tipo de tarea | Milestone habitual |
| --- | --- |
| Base de datos inicial | `MVP v1 - Funcional` |
| Registro, login y JWT | `MVP v1 - Funcional` |
| Catálogo y pedidos básicos | `MVP v1 - Funcional` |
| Mejoras visuales avanzadas | `v2 - Aplicación completa y estilizada` |
| Tests más completos | `v2 - Aplicación completa y estilizada` |
| Editor visual de planos | `v3 - Diseñador de planos 3D` |
| Cálculo de presupuesto 3D | `v3 - Diseñador de planos 3D` |

## Progreso del proyecto

El progreso no se controla solo por commits. Se controla relacionando:

```text
milestone -> issue -> rama -> commits -> Pull Request -> merge en dev
```

De esta forma se puede explicar qué se ha hecho, qué queda pendiente y en qué fase del producto está cada tarea.

En la presentación se puede mostrar la pantalla de milestones de GitHub para justificar visualmente la planificación:

- `MVP v1 - Funcional`: tareas principales del MVP.
- `v2 - Aplicación completa y estilizada`: mejoras posteriores.
- `v3 - Diseñador de planos 3D`: evolución futura.

## Labels usadas

Las labels sirven para clasificar issues y Pull Requests por tipo de trabajo.

En el repositorio se usan labels de GitHub por defecto y labels propias del proyecto.

Labels principales del proyecto:

- `backend`: tareas de API, servidor o lógica de negocio.
- `frontend`: tareas de interfaz y componentes del cliente.
- `database`: tareas de base de datos.
- `documentation`: documentación.
- `api`: endpoints o comunicación HTTP.
- `docker`: Docker, contenedores, Docker Compose o entorno de despliegue.
- `design`: diseño visual, estilos, maquetación o apariencia.
- `mvp`: tareas necesarias para completar la primera versión funcional.
- `post-mvp`: mejora prevista para después del MVP inicial.

Labels de calidad, seguridad y mantenimiento:

- `testing`: pruebas y configuración de tests.
- `ci`: integración continua, workflows, testing automático o GitHub Actions.
- `security`: seguridad, autenticación, permisos o protección de datos.
- `refactor`: reorganización, limpieza o mejora interna sin añadir funcionalidades.
- `style`: cambios de estilos, CSS, Bootstrap o diseño visual.
- `ux`: mejoras de experiencia de usuario, navegación, accesibilidad o interacción.

Labels generales:

- `bug`: algo no funciona correctamente.
- `enhancement`: mejora o nueva funcionalidad.
- `duplicate`: issue o Pull Request repetido.
- `invalid`: issue que no aplica o no es válida.
- `question`: duda o punto pendiente de aclarar.
- `wontfix`: tarea que se decide no realizar.

La idea es que una issue pueda combinar varias labels. Por ejemplo, una tarea para crear endpoints de pedidos podría llevar:

```text
backend
api
database
```

Una tarea para documentar Docker podría llevar:

```text
documentation
docker
```

## Estructura recomendada de una issue

Las issues se escriben con una estructura parecida a esta:

```md
## Descripción

Implementar la creación básica de pedidos para permitir completar el flujo principal del MVP: registro, login, catálogo y pedido.

## Rama de trabajo

feature/backend/orders

## Rama destino

dev

## Pull Request

Relacionado con PR #19 o PR #20 si aplica.

## Dependencias

- Depende de la autenticación JWT (login/register).
- Depende de la estructura de base de datos (pedidos y pedidoDetalles).
- Depende de endpoints de productos.

## Tareas

- [x] Crear endpoint POST /api/orders para generar un pedido.
- [x] Asociar el pedido al usuario autenticado (JWT).
- [x] Implementar lógica para guardar productos en pedidoDetalles.
- [x] Validar que los productos existen antes de añadirlos al pedido.
- [x] Calcular total del pedido.
- [x] Probar endpoint con Postman.
- [x] Manejar errores básicos (usuario no autenticado, productos inválidos, etc.).
- [x] (Opcional) Conectar con frontend (carrito).

## Criterios de aceptación

- [ ] Un usuario autenticado puede crear un pedido.
- [ ] El pedido se guarda correctamente en la base de datos.
- [ ] Los productos asociados al pedido quedan registrados.
- [ ] El endpoint responde correctamente (200 / 201).
- [ ] Se puede demostrar el flujo completo del MVP:
      registro -> login -> catálogo -> pedido.
```

La diferencia entre tareas y criterios de aceptación es importante:

- Las tareas indican el trabajo técnico que hay que hacer.
- Los criterios de aceptación indican cómo se comprueba que la issue está terminada.

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
