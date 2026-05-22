# Historico De Versiones

Esta seccion resume la evolucion real del proyecto sin convertirla en una lista excesiva de commits. El objetivo es poder defender como SquareStruct ha ido creciendo desde una MVP hasta V3.

## Estado Actual

- Rama de trabajo auditada: `feat/review-v3`.
- Version defendida: V3.
- Tags locales detectados: `v1.0.0`, `v2.0.0`, `v2.0.1`.
- V3 aparece en el historico mediante ramas y merges como `feat/design-3d`, `feat/ui-final-polish`, `feat/frontend-lenguage` y `feat/review-v3`.

## V1 - MVP Inicial

| Dato | Valor |
| --- | --- |
| Tag local | `v1.0.0` |
| Commit asociado | `264b206` |
| Fecha local | 2026-05-11 |
| Referencia | Merge de documentacion general inicial. |

### Enfoque

La V1 se entiende como la MVP inicial: una version para demostrar que la idea podia funcionar con registro, login, catalogo, carrito visual y primeras pantallas.

### Primeras Decisiones

- Separar `frontend/` y `backend/`.
- Usar React para la interfaz.
- Usar Node y Express para la API.
- Usar MySQL como base relacional.
- Mantener documentacion basica para explicar instalacion y uso.

### Como Defenderla

V1 no era el proyecto final, sino la prueba inicial. Sirvio para validar que la idea de catalogo y construccion modular podia convertirse en una aplicacion web.

## V2 - Consolidacion Tecnica

| Dato | Valor |
| --- | --- |
| Tag local | `v2.0.0` |
| Commit asociado | `eb77c88` |
| Fecha local | 2026-05-12 |
| Referencia | Revision de README con detalles de proyecto e instalacion. |

### Enfoque

V2 consolido el proyecto como full stack: backend, frontend, base de datos, Docker, Postman, GitHub Actions y responsive.

### Cambios Reales

- Autenticacion con JWT.
- Roles `usuario` y `admin`.
- Integracion entre frontend y backend.
- Docker para levantar MySQL y entorno local.
- Postman para probar endpoints.
- GitHub Actions para tests.
- Mejora responsive y estructura de documentacion.

### Problemas Y Aprendizaje

- Mantener sincronizados schema, seeds y tests.
- Ajustar rutas protegidas para no depender solo del frontend.
- Entender diferencias entre entorno local, Docker y CI.
- Documentar endpoints para que Postman y codigo no se separasen.

## V2.0.1 - Hotfix Y Estabilizacion

| Dato | Valor |
| --- | --- |
| Tag local | `v2.0.1` |
| Commit asociado | `37d8739` |
| Fecha local | 2026-05-21 |
| Mensaje tag | Hotfix CI/CD y estabilizacion backend. |

### Enfoque

V2.0.1 fue una version de correccion. El objetivo no era anadir grandes funcionalidades, sino estabilizar auth, tests y CI.

### Problemas Reales

- Tests Jest con handles abiertos o conexiones de base de datos sin cerrar.
- Dependencia de MySQL en CI.
- Datos seed que debian encajar con los tests.
- Ajustes de autenticacion y validaciones.

### Como Defenderla

Es una version importante porque demuestra mantenimiento: cuando algo falla en CI, se corrige el flujo, no solo se ignora el error.

## V3 - Version Actual

### Enfoque

V3 es la version que se defiende ahora. Combina mejoras visuales, responsive, internacionalizacion, UX/UI, documentacion y una evolucion fuerte del disenador.

### Cambios Reales Observados

- Redisenio visual y pulido de paginas principales.
- Disenador 2D con cuadricula, piezas, validaciones, undo/redo y borrador local.
- Integracion de visor 3D con Three.js, React Three Fiber y Drei.
- Mejoras responsive e interaccion tactil del disenador.
- Internacionalizacion con `i18next` y `react-i18next`.
- Cliente API con idioma y JWT centralizados.
- Coleccion Postman V3 y validaciones.
- Documentacion alineada con V3 y con el contexto academico DAW1.

### Limitaciones Actuales

- No existe tabla `planos`; los disenios se guardan en `localStorage`.
- No hay pagos reales; la facturacion es gestion de pedidos y estados.
- No se ha documentado un despliegue productivo como parte obligatoria de V3.
- La auditoria local de issues/PRs depende de Git local porque `gh` no estaba disponible.

## Comparativa Rapida

| Area | V2 | V3 |
| --- | --- | --- |
| Frontend | Interfaz full stack funcional. | Pulido visual, UX/UI, responsive y traducciones. |
| Backend | API REST con auth, productos y pedidos. | Misma base, mejor documentada y validada. |
| Auth | JWT y roles. | JWT y roles mantenidos, con mejor integracion en UI. |
| Pedidos | Checkout y facturacion basica. | Historial, estados, filtros y mejor experiencia admin. |
| Disenador | Base visual o seccion inicial. | Editor 2D/3D con piezas, borrador local y exportacion. |
| Testing | Jest, Postman, CI. | CI ajustado, Vitest frontend, lint/build y Postman V3. |
| Documentacion | Guia de instalacion y arquitectura. | Documentacion reorganizada para defensa DAW1. |

## Como Defender La Evolucion

La frase clave es: SquareStruct no empezo perfecto; evoluciono por fases. Primero se valido la idea, despues se consolido la parte full stack y finalmente se mejoro la experiencia, la documentacion y el disenador.
