# Auditoria Documental

## Contexto

- Fecha de revision: 2026-05-22.
- Rama activa: `feat/review-v3`.
- Proyecto: SquareStruct V3, trabajo final de curso DAW1 realizado por 2 estudiantes.

## Alcance Revisado

Se reviso la estructura documental, carpetas principales, backend, frontend, Docker, Postman, workflows de GitHub Actions, tags locales y ramas visibles en el repositorio local.

No se modifico codigo funcional, estilos, rutas, responsive, Docker ni integracion.

## Limitaciones

La herramienta `gh` no estaba disponible en el entorno local, por lo que issues y PRs remotos no se consultaron en vivo. La auditoria de ramas, releases y PRs se basa en informacion local: ramas, tags y mensajes de merge disponibles en Git.

## Hallazgos

| Hallazgo | Accion |
| --- | --- |
| Defensa y comandos estaban mezclados en `07-recursos/`. | Se movieron a `14-defensa-presentacion/`. |
| Inventario de codigo estaba en recursos. | Se movio a `13-documentacion-codigo/`. |
| Documento de futura entidad `plano` estaba en arquitectura general. | Se movio a `10-implementacion-3d/`. |
| AWS tenia carpeta propia `08-aws`, fuera del mapa solicitado. | Se movio a `15-anexos/`. |
| Faltaban secciones para historico, flujos, 3D, edicion frontend, entidad, codigo, defensa y anexos. | Se crearon carpetas e indices. |
| El indice general no reflejaba la nueva organizacion. | Se reescribio `docs/README.md`. |

## Decisiones Tomadas

- Mantener el nivel DAW1: explicaciones claras, sin sobreingenieria.
- Separar documentacion principal de anexos.
- Priorizar V3 y conservar MVP solo como historico.
- Documentar limites reales, especialmente que los planos no se guardan aun en MySQL.
- Crear flujos de codigo para estudiar recorridos completos, no archivos aislados.

## Documentacion Pendiente

- Completar historico con datos exactos de issues y PRs si se habilita acceso a GitHub.
- Anadir evidencias de demo final si se necesitan para la exposicion.
- Decidir si Postman V3 se ejecutara con Newman en CI.
- Actualizar el anexo AWS solo si se despliega realmente.

## Propuesta De Mantenimiento

Cada cambio importante deberia actualizar:

1. documento de arquitectura si cambia estructura;
2. endpoints si cambia API;
3. testing si cambia CI o comandos;
4. flujos de codigo si cambia una funcionalidad principal;
5. defensa si cambia lo que se va a presentar.
