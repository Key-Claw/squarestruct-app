# Debug de errores en el backend (API)

## Objetivo
Facilitar la depuración de la API mostrando el mensaje real de error en las respuestas del backend durante el desarrollo.

---

## Problema original
Los controladores devolvían solo mensajes genéricos en caso de error, por ejemplo:
```js
res.status(500).json({ error: 'Error al obtener productos' });
```
Esto dificultaba saber la causa real del fallo al hacer peticiones desde Postman o el frontend.

---

## Solución aplicada
Se modificaron todos los controladores para incluir el mensaje real del error en la respuesta, así:
```js
res.status(500).json({ error: 'Error al obtener productos', detalle: error.message });
```
Esto se aplicó en todos los bloques `catch` de los controladores de productos, usuarios y pedidos.

---

## ¿Qué se consigue?
- Cuando ocurre un error (por ejemplo, tabla inexistente, error de SQL, permisos, etc.), la respuesta JSON incluye un campo `detalle` con el mensaje real del error.
- Así, al probar la API en Postman, puedes ver exactamente qué está fallando y solucionarlo rápidamente.

---

## Ejemplo de respuesta tras el cambio
```json
{
  "error": "Error al obtener productos",
  "detalle": "Table 'squarestruct.productos' doesn't exist"
}
```

---

## Recomendación
Deja este sistema de debug en desarrollo. Para producción, puedes ocultar el detalle por seguridad.
