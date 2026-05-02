# Revisión del backend MVP

## Objetivo

Este documento resume una revisión técnica del backend de SquareStruct.

La revisión sirve para detectar qué partes están bien encaminadas y qué puntos habría que mejorar antes de considerar el backend como completamente cerrado.

## Alcance

Se revisan principalmente:

- Servidor Express.
- Rutas.
- Controladores.
- Middlewares.
- Servicios.
- Base de datos.
- Autenticación.
- Pruebas.
- Scripts de arranque.

No es una revisión profunda del diseño visual del frontend.

## Criterio de revisión

La pregunta principal fue:

```text
¿El backend permite sostener un MVP funcional?
```

Para responder, se revisó si el proyecto tiene:

- Arranque reproducible.
- API REST coherente.
- Validaciones básicas.
- Login con JWT.
- Conexión con MySQL.
- Estructura clara de carpetas.
- Pruebas iniciales.

## Aspectos positivos

El backend ya tiene una base sólida para el MVP:

- API con Express.
- Conexión con MySQL.
- Registro y login de usuarios.
- Uso de JWT.
- Cifrado de contraseñas con bcrypt.
- Rutas de productos y pedidos.
- Separación entre rutas, controladores y middlewares.
- Colección de Postman.
- Tests iniciales.
- Documentación de arranque.

## Puntos a vigilar

### 1. Consistencia del esquema SQL

El archivo `schema.sql` debe poder crear la base de datos desde cero sin depender de una base ya existente.

Esto es importante para que cualquier persona pueda clonar el proyecto y arrancarlo.

### 2. Seguridad de JWT

La clave JWT debe venir de una variable de entorno real.

No conviene usar valores por defecto inseguros como `secret`, porque pueden ocultar errores de configuración.

### 3. Validaciones

El backend debería validar datos antes de enviarlos a MySQL.

Por ejemplo, si falta un campo obligatorio, es mejor devolver `400 Bad Request` que dejar que falle una consulta SQL.

### 4. Pedidos

El flujo de pedidos debe cuidar bien las transacciones.

Si una parte del pedido falla, la base de datos no debería quedar a medias.

### 5. Variables de entorno

Conviene que la carga de `.env` esté clara y centralizada para que sea fácil explicar el arranque del backend.

### 6. Migraciones

El proyecto tiene `schema.sql` y migraciones.

Hay que evitar que ambos archivos definan cosas contradictorias sobre la misma tabla.

## Estado del MVP

El backend cumple una parte importante del MVP:

- Permite trabajar con usuarios.
- Tiene autenticación.
- Tiene productos.
- Tiene pedidos básicos.
- Se puede probar con Postman.

Pero todavía conviene revisar bien:

- Base de datos desde cero.
- Validaciones.
- Seguridad de configuración.
- Tests de integración.

## Recomendaciones

1. Verificar que `schema.sql` funciona en una base limpia.
2. Exigir `JWT_SECRET` en `.env`.
3. Conectar validaciones en todas las rutas importantes.
4. Mejorar respuestas de error para entradas inválidas.
5. Añadir más tests de productos y pedidos.
6. Mantener documentación y código sincronizados.

## Idea clave para explicar

El backend ya tiene forma de MVP, pero un MVP también debe poder arrancarse, probarse y explicarse de manera clara.
