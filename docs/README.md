# Documentacion De SquareStruct V3

Esta carpeta contiene la documentacion tecnica viva de SquareStruct. El proyecto es un trabajo final de curso de **DAW1 realizado por 2 estudiantes**, por eso la documentacion busca ser clara, defendible y realista.

La fuente principal siempre es el codigo actual de la rama activa. La MVP se conserva como contexto historico, pero la version que se defiende ahora es la **V3**.

## Lectura Recomendada Para La Defensa

1. [`01-proyecto/vision-general.md`](01-proyecto/vision-general.md): que es SquareStruct y que alcance tiene V3.
2. [`14-defensa-presentacion/guia-defensa-daw1.md`](14-defensa-presentacion/guia-defensa-daw1.md): guion para estudiar y exponer.
3. [`14-defensa-presentacion/revision-final-defensa.md`](14-defensa-presentacion/revision-final-defensa.md): revision global, preguntas probables, limites y guion corto.
4. [`13-documentacion-codigo/inventario-codigo-daw1.md`](13-documentacion-codigo/inventario-codigo-daw1.md): mapa de archivos importantes.
5. [`09-flujos-codigo/README.md`](09-flujos-codigo/README.md): recorridos reales del codigo.
6. [`03-arquitectura/backend-estructura.md`](03-arquitectura/backend-estructura.md): backend Express, rutas, controladores y middlewares.
7. [`03-arquitectura/frontend-estructura.md`](03-arquitectura/frontend-estructura.md): frontend React, paginas, componentes, servicios y estado.
8. [`03-arquitectura/base-de-datos.md`](03-arquitectura/base-de-datos.md): modelo relacional actual.
9. [`04-api/endpoints.md`](04-api/endpoints.md): contrato REST de la API.
10. [`05-testing/ci-github-actions.md`](05-testing/ci-github-actions.md): tests y CI.
11. [`08-historico-versiones/comparativa-v2-v3.md`](08-historico-versiones/comparativa-v2-v3.md): comparativa entre V2 y V3.
12. [`08-historico-versiones/problemas-limitaciones-mejoras.md`](08-historico-versiones/problemas-limitaciones-mejoras.md): problemas reales, limites y mejoras futuras.
13. [`15-anexos/devops-docker.md`](15-anexos/devops-docker.md): Docker, puertos, variables y persistencia.
14. [`15-anexos/despliegue-aws-ec2.md`](15-anexos/despliegue-aws-ec2.md): despliegue AWS EC2 paso a paso.
15. [`15-anexos/auditoria-documental.md`](15-anexos/auditoria-documental.md): auditoria y reorganizacion documental.

## Mapa Documental

| Carpeta | Para que sirve | Como defenderla |
| --- | --- | --- |
| `00-workflow/` | Explica GitFlow, commits, issues, milestones y PRs. | Demuestra organizacion de trabajo en equipo. |
| `01-proyecto/` | Define vision, alcance y evolucion de SquareStruct. | Situa el problema y la version actual. |
| `02-mvp/` | Conserva decisiones de la primera version funcional. | Sirve para explicar evolucion, no estado actual. |
| `03-arquitectura/` | Documenta frontend, backend, auth, BD y tecnologias. | Permite explicar como se separan capas y responsabilidades. |
| `04-api/` | Lista endpoints REST reales. | Une frontend, backend y Postman. |
| `05-testing/` | Reune tests, lint, build, Postman y CI. | Prueba que el proyecto se valida automaticamente. |
| `06-debug/` | Recoge errores comunes y soluciones. | Muestra capacidad de diagnostico. |
| `07-recursos/` | Guarda recursos auxiliares no principales. | Apoyo rapido, no guion central. |
| `08-historico-versiones/` | Resume versiones, ramas y releases. | Explica progreso del proyecto. |
| `09-flujos-codigo/` | Describe flujos completos del codigo. | Ayuda a responder "que pasa cuando...". |
| `10-implementacion-3d/` | Documenta el disenador 2D/3D y sus limites actuales. | Aclara que hay visualizacion y borrador local, no persistencia en BD. |
| `11-guia-edicion-frontend/` | Orienta cambios seguros en React/CSS. | Evita romper responsive y componentes. |
| `12-autoria-creacion-entidad/` | Guia para crear una entidad sencilla de forma coherente. | Sirve para defender como se ampliaria el proyecto. |
| `13-documentacion-codigo/` | Inventario de archivos y responsabilidades. | Mapa para estudiar el codigo antes de exponer. |
| `14-defensa-presentacion/` | Guion, tecnologias y comandos para la presentacion. | Material principal de estudio. |
| `15-anexos/` | Auditorias, despliegue y material secundario. | Se consulta si preguntan por detalles extra. |

## Estado Real De V3

V3 incluye autenticacion JWT, roles `usuario` y `admin`, catalogo conectado a backend, filtros, carrito, checkout, pedidos, facturas de usuario, paneles admin, escritura protegida de productos, cancelacion logica de pedidos, disenador 2D/3D con borrador local, Docker, Postman V3, tests y GitHub Actions.

El disenador permite construir y exportar un plano, pero actualmente no existe tabla `planos` en MySQL. Esa limitacion esta documentada para poder defenderla con honestidad.

## Criterio De Coherencia

Si dos documentos se contradicen, se prioriza este orden:

1. codigo actual;
2. tests actuales;
3. coleccion Postman V3;
4. documentacion V3;
5. documentacion MVP o historica.

## Documentacion Pendiente

- Anadir capturas finales de la demo si el profesorado las pide.
- Completar historico con issues y PRs reales cuando se consulte GitHub desde una herramienta disponible.
- Decidir si Postman se ejecutara tambien con Newman en CI.
- Actualizar el anexo de AWS solo si se realiza un despliegue real.
