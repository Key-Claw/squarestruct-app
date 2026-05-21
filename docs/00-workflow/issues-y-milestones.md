# Issues, Milestones Y Pull Requests

## Objetivo

Este documento explica como organizar el trabajo del proyecto usando issues, milestones, ramas y Pull Requests. La idea es que cada tarea tenga contexto claro: que se quiere hacer, en que rama se trabaja, cuando se considera terminada y a que fase del proyecto pertenece.

## Milestones Del Proyecto

Los milestones separan el proyecto en fases. Para el estado actual de la documentacion, la fase activa es V3.

| Milestone | Estado | Objetivo |
| --- | --- | --- |
| `MVP v1 - Funcional` | Cerrado | Demostrar el flujo principal: registro, login, catalogo, carrito visual y base administrativa. |
| `V3 - Aplicacion actual` | Activo | Mantener la aplicacion full stack, catalogo, pedidos, facturacion, roles, tests, CI y base del disenador. |
| `Siguiente fase - Planos y presupuesto` | Pendiente | Guardar planos, calcular presupuestos avanzados, preparar pagos y despliegue productivo. |

## Alcance De V3

V3 agrupa el trabajo actual:

- frontend React/Vite con rutas, catalogo, carrito, checkout, cuenta, administracion y base visual del disenador;
- backend Express con autenticacion JWT, roles, productos, usuarios, perfil y pedidos;
- MySQL/MariaDB con schema, seeds y migraciones;
- pruebas automatizadas de backend y frontend;
- GitHub Actions con MySQL de servicio, Jest/Supertest, Vitest, ESLint y build de Vite;
- documentacion alineada con el codigo actual.

## Sistema De Trabajo Con Issues

Cada issue representa una tarea concreta. Debe indicar:

- que problema o mejora resuelve;
- a que milestone pertenece;
- que rama se usara;
- que tareas internas hay que completar;
- cuando se considera terminada.

Ejemplos de reparto:

| Tipo de tarea | Milestone habitual |
| --- | --- |
| Ajuste de API, tests o base de datos actual | `V3 - Aplicacion actual` |
| Ajuste visual, responsive o flujo existente | `V3 - Aplicacion actual` |
| Documentacion tecnica actual | `V3 - Aplicacion actual` |
| Persistencia de planos | `Siguiente fase - Planos y presupuesto` |
| Calculo de presupuesto avanzado | `Siguiente fase - Planos y presupuesto` |
| Pasarela de pago o despliegue productivo | `Siguiente fase - Planos y presupuesto` |

## Progreso Del Proyecto

El progreso se controla relacionando:

```text
milestone -> issue -> rama -> commits -> Pull Request -> merge en dev/main
```

Asi se puede explicar que se ha hecho, que queda pendiente y en que fase del producto esta cada tarea.

## Labels Usadas

Labels principales del proyecto:

- `backend`: API, servidor o logica de negocio.
- `frontend`: interfaz y componentes del cliente.
- `database`: base de datos, schema, seeds o migraciones.
- `documentation`: documentacion.
- `api`: endpoints o comunicacion HTTP.
- `docker`: contenedores, Docker Compose o entorno de despliegue.
- `design`: diseno visual, estilos o maquetacion.
- `testing`: pruebas y configuracion de tests.
- `ci`: integracion continua, workflows o GitHub Actions.
- `security`: autenticacion, permisos o proteccion de datos.
- `refactor`: reorganizacion interna sin cambiar comportamiento.
- `style`: estilos, CSS, Bootstrap o apariencia.
- `ux`: experiencia de usuario, navegacion o interaccion.

## Estructura Recomendada De Una Issue

```md
## Descripcion

Implementar o corregir una parte concreta de la V3.

## Rama de trabajo

feature/area/nombre-tarea

## Rama destino

dev

## Dependencias

- Depende de...

## Tareas

- [ ] Tarea tecnica concreta.
- [ ] Prueba o comprobacion necesaria.
- [ ] Documentacion si aplica.

## Criterios de aceptacion

- [ ] El flujo funciona.
- [ ] Los tests relevantes pasan.
- [ ] La documentacion no contradice el comportamiento real.
```

## Ramas Por Tipo De Tarea

| Tipo | Ejemplo |
| --- | --- |
| Backend | `feature/backend/orders` |
| Frontend | `feature/frontend/catalog` |
| Base de datos | `feature/database/order-status` |
| Documentacion | `docs/update-v3` |
| Correccion | `fix/backend/product-validation` |
| Tests | `test/backend-productos-pedidos` |
| CI | `ci/tests-workflow` |
| Diseno | `feature/design-editor` |

## Relacion Entre Issue Y Pull Request

Cuando se crea un Pull Request, debe enlazar la issue correspondiente:

```md
Closes #35
```

Si el PR no cierra la issue por completo:

```md
Relacionado con #35
```

## Cuando Cerrar Una Issue

Una issue se puede cerrar cuando:

- todas las tareas estan completadas;
- los criterios de aceptacion estan cumplidos;
- el codigo o documentacion se ha integrado en la rama objetivo;
- el Pull Request asociado se ha revisado y mergeado.

## Frase Util Para Presentacion

Organizamos el proyecto por milestones e issues para mostrar una evolucion clara: primero una base funcional, ahora la V3 como aplicacion completa y despues las mejoras de planos, presupuesto y despliegue.
