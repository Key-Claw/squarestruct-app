# Extras y buenas practicas detectadas

## Objetivo

Este documento resume puntos extra que pueden aportar valor en la defensa, separando lo implementado de lo parcial o futuro.

## Extras implementados

| Extra | Estado | Evidencia |
| --- | --- | --- |
| Autenticacion JWT | Cumplido | Login y middleware auth. |
| Hash de contrasenas | Cumplido | bcrypt. |
| Roles `usuario` y `admin` | Cumplido | Middleware admin y rutas protegidas. |
| Escritura de productos solo admin | Cumplido | Rutas POST/PUT/DELETE productos. |
| Cancelacion logica de pedidos | Cumplido | `PATCH /api/pedidos/:id/cancelar`. |
| Fecha de cancelacion | Cumplido | `fechaCancelacion`. |
| Alias `/api/orders` | Cumplido | Compatibilidad con servicios frontend. |
| Tests backend de integracion | Cumplido | `backend/tests/integration/`. |
| Tests frontend iniciales | Cumplido parcial | Vitest y Testing Library. |
| CI con GitHub Actions | Cumplido | `.github/workflows/tests.yml`. |
| Docker Compose dev y completo | Cumplido | `docker/`. |
| Postman MVP y V2 | Cumplido | `backend/postman/`. |
| Documentacion por areas | Cumplido | `docs/`. |
| Guia de defensa | Cumplido | `tecnologias-y-comandos-defensa.md`. |
| Roadmap MVP/V2/V3 | Cumplido | README y docs de proyecto. |

## Extras parciales

| Extra | Estado | Motivo |
| --- | --- | --- |
| Checkout completo desde carrito | Parcial | Hay carrito visual y backend de pedidos, pero falta cierre completo desde UI. |
| Facturacion | Parcial | Vista visual con datos mock. |
| Design | Parcial | Maqueta visual, no herramienta real. |
| Tests frontend amplios | Parcial | Hay base inicial, pero se puede ampliar. |
| Tests Postman | Parcial | Colecciones existen, faltan scripts de test en mas requests. |

## Extras documentados para futuro

| Extra | Estado | Nota |
| --- | --- | --- |
| Disenador 3D | Futuro | Fase V3. |
| Planos guardados | Futuro | Requiere nuevas tablas y endpoints. |
| Presupuesto automatico avanzado | Futuro | Conectado a productos/piezas. |
| AWS | Futuro | Documentado como orientacion, no desplegado. |
| RDS/infra cloud | Futuro | Mejor opcion para produccion real. |

## Puntos fuertes para explicar

- El proyecto esta separado en capas.
- La API no expone la base de datos directamente al frontend.
- El sistema usa JWT y roles.
- La cancelacion de pedidos mantiene trazabilidad.
- Docker facilita reproducir la base de datos.
- GitHub Actions valida automaticamente la rama.
- La documentacion no solo explica uso, tambien arquitectura y defensa.

## Puntos que conviene explicar con honestidad

- No se usa React Router; la navegacion es interna con estado.
- El checkout completo sigue pendiente.
- Facturacion no usa datos reales todavia.
- Design no es 3D funcional todavia.
- CI existe, pero no hay despliegue automatico a produccion.
- `npm audit` del backend requiere revision.

## Frase util

Ademas de cumplir el reto, SquareStruct incorpora buenas practicas de organizacion, seguridad, testing, Docker, CI y documentacion, pero diferencia claramente lo implementado de lo que queda para V3.
