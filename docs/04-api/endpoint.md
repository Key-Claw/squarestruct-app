# API REST

## Objetivo

La API REST permite que el frontend se comunique con el backend.

El frontend envía peticiones HTTP y el backend responde con datos en formato JSON.

## URL base

En desarrollo local:

```text
http://localhost:3000
```

Prefijo general:

```text
/api
```

## Convenciones

- Los recursos se nombran en plural: `usuarios`, `productos`, `pedidos`.
- Se usan métodos HTTP estándar.
- Las respuestas se devuelven en JSON.
- Las rutas privadas usan JWT.

## Métodos HTTP usados

| Método | Uso |
| --- | --- |
| `GET` | Consultar datos. |
| `POST` | Crear datos o iniciar una acción. |
| `PUT` / `PATCH` | Actualizar datos, si se añade más adelante. |
| `DELETE` | Eliminar datos, si se añade más adelante. |

## Endpoints principales del MVP

| Método | Endpoint | Función |
| --- | --- | --- |
| `POST` | `/api/usuarios/register` | Registrar un usuario. |
| `POST` | `/api/usuarios/login` | Iniciar sesión y obtener token JWT. |
| `GET` | `/api/productos` | Consultar productos. |
| `POST` | `/api/pedidos` | Crear un pedido. |
| `GET` | `/api/perfil` | Consultar datos del usuario autenticado. |

## Seguridad

El login devuelve un token JWT.

Ese token se envía en rutas protegidas usando el header:

```text
Authorization: Bearer <TOKEN>
```

## Ejemplo de producto

```json
{
  "idProducto": 1,
  "nombre": "Bloque modular",
  "descripcion": "Bloque para construcción modular",
  "precio": 25.5,
  "tipo": "bloque",
  "stock": 100
}
```

## Ejemplo de error

```json
{
  "error": "Token no proporcionado"
}
```

## Idea clave para explicar

La API es el puente entre frontend y base de datos. El frontend no consulta MySQL directamente: siempre pasa por el backend.
