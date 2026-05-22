# Problemas, Limitaciones Y Mejoras Futuras

## Problemas Reales

| Problema | Donde afecta | Aprendizaje |
| --- | --- | --- |
| CI con MySQL | Backend tests | Hay que cargar schema y seeds antes de probar integracion. |
| Jest y conexiones abiertas | Backend | La pool de MySQL debe cerrarse al terminar tests. |
| Datos seed y expectativas de tests | Backend/Postman | Los tests deben coincidir con datos reales. |
| Dependencias frontend modernas | Frontend CI | Node y Vite deben estar alineados. |
| Responsive del disenador | Frontend | Las pantallas complejas necesitan ajustes especificos. |
| Textos e idioma | Frontend/API | i18n requiere centralizar idioma y traducciones. |

## Limitaciones Actuales

- No hay tabla `planos`.
- No hay pago real.
- No hay despliegue productivo confirmado como parte obligatoria.
- El catalogo puede tener fallback demo en frontend si falla API.
- El historico remoto de issues/PRs no se pudo consultar desde este entorno.

## Mejoras Futuras

| Mejora | Motivo |
| --- | --- |
| Entidad `planos` | Guardar disenios por usuario en MySQL. |
| Newman en CI | Ejecutar coleccion Postman automaticamente. |
| Mas tests de frontend | Cubrir carrito, checkout y disenador. |
| Mas tests de permisos | Reforzar roles admin/usuario. |
| Despliegue documentado | Preparar demo accesible si se necesita. |
| Presupuesto avanzado | Separar materiales, mano de obra e impuestos. |

## Decisiones Tecnicas

- Mantener Express y MySQL porque son suficientes para DAW1.
- Usar JWT para autenticacion sin sesiones en servidor.
- Usar `HashRouter` para simplificar despliegue estatico.
- Usar `localStorage` para borrador del disenador hasta crear entidad real.
- Mantener Docker para desarrollo y CI para validar automaticamente.

## Como Defenderlo

No hace falta ocultar limitaciones. Es mejor explicarlas como decisiones de alcance: el proyecto funciona en sus flujos principales y deja mejoras futuras realistas.
