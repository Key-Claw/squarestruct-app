# Flujo De Autenticacion

## Que Es

Es el recorrido de registro, login, mantenimiento de sesion y acceso a rutas privadas.

## Donde Esta

| Parte | Archivo |
| --- | --- |
| Modal y formularios | `frontend/src/components/auth/` |
| Estado global | `frontend/src/App.jsx` |
| Servicio frontend | `frontend/src/services/authService.js` |
| Rutas backend | `backend/src/routes/usuarios.routes.js`, `backend/src/routes/perfil.routes.js` |
| Controladores | `backend/src/controllers/usuarios.controller.js`, `backend/src/controllers/perfil.controller.js` |
| Middlewares | `backend/src/middlewares/auth.js`, `backend/src/middlewares/admin.js` |
| Base de datos | `backend/db/schema.sql`, tabla `usuarios` |

## Como Funciona

1. El usuario abre login o registro desde el frontend.
2. El formulario llama a `authService`.
3. `authService` usa el cliente `api.js` para enviar JSON a `/api/usuarios/login` o `/api/usuarios/register`.
4. El backend valida datos, consulta MySQL y usa `bcrypt` para contrasenas.
5. En login correcto se genera un JWT.
6. El frontend guarda `authToken` y `currentUser` en `localStorage`.
7. Las rutas privadas usan ese estado para permitir o bloquear acceso.
8. Las rutas admin comprueban el rol `admin`.

## Decisiones Tomadas

- JWT permite no guardar sesiones en servidor.
- `bcrypt` evita guardar contrasenas en texto plano.
- Los roles son simples (`usuario` y `admin`) porque el alcance DAW1 no necesita permisos complejos.

## Como Defenderlo

La idea clave es que el frontend no decide permisos importantes por si solo: muestra u oculta pantallas, pero el backend protege las acciones sensibles con middleware.
