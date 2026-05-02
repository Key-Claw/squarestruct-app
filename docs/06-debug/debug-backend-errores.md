# Debug de errores en el backend

## Objetivo

Este documento explica cómo mostrar errores útiles durante el desarrollo del backend.

Cuando estamos programando, es importante saber por qué falla una petición. Por eso, en desarrollo se puede devolver un campo `detalle` con el mensaje real del error.

## Problema

Antes, algunos controladores devolvían mensajes muy generales:

```js
res.status(500).json({ error: 'Error al obtener productos' });
```

Ese mensaje indica que algo falló, pero no explica la causa.

Por ejemplo, el problema real podía ser:

- Una tabla no existe.
- La conexión a MySQL falla.
- Falta una variable de entorno.
- La consulta SQL está mal.

## Solución aplicada

En los bloques `catch`, se añade el detalle del error:

```js
res.status(500).json({
  error: 'Error al obtener productos',
  detalle: error.message
});
```

Ejemplo de respuesta:

```json
{
  "error": "Error al obtener productos",
  "detalle": "Table 'squarestruct.productos' doesn't exist"
}
```

## Ventaja

Esto ayuda a depurar más rápido porque Postman o el frontend muestran la causa real del fallo.

## Importante

Este tipo de detalle es útil en desarrollo, pero no debería mostrarse igual en producción.

En producción, enseñar errores internos puede dar información sensible sobre la base de datos o el servidor.

## Idea clave para explicar

Durante el desarrollo mostramos más información para encontrar errores rápido, pero en producción conviene ocultar detalles internos por seguridad.
