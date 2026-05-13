# Checklist de cumplimiento del reto

## Referencia

Este checklist se contrasta con:

- [reto-1daw-transcripcion.md](reto-1daw-transcripcion.md)

## Estados usados

| Estado | Significado |
| --- | --- |
| Cumplido | Existe implementacion y evidencia clara. |
| Parcial | Existe base o maqueta, pero no esta completo. |
| Documentado futuro | Esta planteado para fases futuras. |
| Pendiente | No esta hecho o requiere revision. |

## Checklist

| Requisito | Estado | Evidencia / nota |
| --- | --- | --- |
| Backend API REST funcional | Cumplido | Express, rutas, controladores y middlewares. |
| Base de datos relacional | Cumplido | MySQL, `schema.sql`, `seeds.sql`, migraciones. |
| Frontend funcional | Cumplido | React, Vite, paginas, componentes y servicios. |
| Consumo de API desde frontend | Cumplido | `frontend/src/services/api.js`. |
| Registro y login | Cumplido | Endpoints de usuarios, formularios y JWT. |
| Rutas protegidas | Cumplido | `authMiddleware`, `adminMiddleware`, control de sesion. |
| Navegacion SPA | Cumplido | Navegacion interna por estado en `App.jsx`; no usa React Router. |
| Catalogo | Cumplido | `Catalogo.jsx`, servicios y fallback demo. |
| Carrito visual | Cumplido | `CartPanel.jsx`. |
| Checkout completo | Parcial | Backend y servicios preparados; flujo visual completo pendiente. |
| Pedidos backend | Cumplido | Crear, listar, detalle y cancelacion logica. |
| Panel admin usuarios | Cumplido | `Usuarios.jsx` y rutas admin. |
| Escritura admin de productos | Cumplido | POST/PUT/DELETE productos protegidos. |
| Facturacion real | Parcial | Vista visual con datos de maqueta. |
| Disenador 3D real | Documentado futuro | `Design.jsx` es maqueta visual. |
| Docker backend/frontend | Cumplido | Dockerfiles y compose completo. |
| Docker para desarrollo | Cumplido | `docker-compose-dev.yml` levanta MySQL. |
| Scripts SQL | Cumplido | Schema, seeds, migraciones y consultas. |
| Tests backend | Cumplido | Jest y Supertest. |
| Tests frontend | Parcial | Vitest y Testing Library con cobertura inicial. |
| Lint frontend | Cumplido | ESLint configurado. |
| Build frontend | Cumplido | Vite build. |
| GitHub Actions | Cumplido | Backend tests, frontend tests, lint y build. |
| Postman | Cumplido | Colecciones MVP y V2. |
| Tests Postman completos | Pendiente | Faltan tests en varios requests. |
| Documentacion tecnica | Cumplido | README y docs por areas. |
| Seguridad basica | Cumplido | bcrypt, JWT, roles, variables de entorno. |
| Auditoria de dependencias backend | Pendiente | `npm audit` detecta 2 high. |
| Auditoria de dependencias frontend | Cumplido | 0 high detectadas en revision. |
| Backups reales | Documentado futuro | Carpeta y guia existen; no subir datos reales al repo. |
| AWS | Documentado futuro | Orientacion documentada; no desplegado. |

## Lectura para defensa

El proyecto cumple la parte principal del reto: backend, frontend, base de datos, Docker, tests, Postman y documentacion.

Los puntos parciales no son fallos si se explican bien: forman parte de V3 o de mejoras posteriores.
