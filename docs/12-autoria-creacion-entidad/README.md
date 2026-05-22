# Autoria Y Creacion De Una Entidad

Esta seccion explica como se podria crear una entidad nueva siguiendo el estilo actual del proyecto.

## Objetivo

No es una arquitectura empresarial. Es una guia sencilla para DAW1: si manana se anade una entidad, debe seguir el mismo camino que usuarios, productos o pedidos.

## Pasos Recomendados

1. Definir la tabla en `backend/db/schema.sql`.
2. Anadir datos de ejemplo en `backend/db/seeds.sql` si hacen falta.
3. Crear rutas en `backend/src/routes/`.
4. Crear controlador en `backend/src/controllers/`.
5. Proteger acciones con `auth` o `admin` si corresponde.
6. Anadir servicio frontend en `frontend/src/services/`.
7. Conectar pagina o componente React.
8. Documentar endpoints en `docs/04-api/endpoints.md`.
9. Anadir tests si la entidad afecta a comportamiento importante.
10. Actualizar Postman V3.

## Ejemplo Defendible

La futura entidad `planos` podria guardar disenios creados por usuarios. Ya existe documentacion inicial en `10-implementacion-3d/futura-entidad-plano.md`.

## Como Defenderlo

Lo importante es demostrar que conocemos el recorrido completo: base de datos, API, frontend, tests y documentacion.
