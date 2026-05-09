# Decisiones técnicas del MVP

## Objetivo

Este documento explica las decisiones técnicas principales tomadas para construir el MVP de SquareStruct.

La idea no es solo indicar qué tecnologías se han usado, sino justificar por qué encajan con el alcance actual del proyecto.

## Enfoque general

El MVP se centra en validar el flujo mínimo:

```text
registro -> login -> catálogo -> pedido
```

Por eso se han priorizado tecnologías conocidas, fáciles de explicar y suficientes para conectar frontend, backend y base de datos.

## Por qué una API REST

Se eligió una API REST porque separa claramente frontend y backend.

Ventajas para el MVP:

- El frontend puede consumir datos sin conocer MySQL.
- El backend controla validaciones y seguridad.
- Los endpoints se pueden probar con Postman.
- La estructura es fácil de entender en un proyecto de DAW1.

Ejemplo:

```text
GET /api/productos
```

El frontend pide productos y el backend devuelve JSON.

## Por qué Node.js y Express

Node.js permite usar JavaScript también en el servidor.

Express se eligió porque:

- es ligero;
- permite crear rutas rápidamente;
- es fácil de organizar por rutas, controladores y middlewares;
- encaja bien con una API REST de MVP.

Para este proyecto no era necesario un framework más grande, porque habría añadido complejidad antes de validar el flujo básico.

## Por qué MySQL

MySQL encaja con el proyecto porque los datos están relacionados:

- usuarios tienen pedidos;
- pedidos tienen productos;
- productos pertenecen a proveedores;
- un pedido puede tener varios productos.

Estas relaciones se representan mejor con una base de datos relacional.

Además, MySQL permite trabajar conceptos importantes de Bases de Datos:

- claves primarias;
- claves foráneas;
- restricciones;
- índices;
- consultas con `JOIN`;
- agrupaciones y subconsultas.

## Por qué Docker para MySQL

Docker se usa para levantar MySQL en desarrollo local.

Esto ayuda a que todos los miembros puedan usar una base de datos parecida sin instalar y configurar MySQL manualmente en cada equipo.

Ventajas:

- mismo motor de base de datos para todos;
- arranque con un único comando;
- carga automática de `schema.sql` y `seeds.sql`;
- posibilidad de reiniciar el volumen si se quiere reconstruir la base de datos.

## Por qué JWT para autenticación

JWT permite que el backend genere un token cuando el usuario inicia sesión.

Ese token se envía en rutas protegidas:

```http
Authorization: Bearer TOKEN
```

Ventajas para el MVP:

- no hace falta guardar sesiones en el servidor;
- el frontend puede conservar el token;
- las rutas protegidas se validan con middleware;
- es una solución común en APIs REST.

## Por qué bcrypt para contraseñas

Las contraseñas no deben guardarse en texto plano.

Por eso se usa `bcrypt`, que genera un hash antes de guardar la contraseña en MySQL.

Así, aunque alguien consultara la tabla `usuarios`, no vería la contraseña real del usuario.

## Por qué existe `pedidoDetalles`

La tabla `pedidoDetalles` resuelve la relación entre pedidos y productos.

Un pedido puede tener varios productos, y un producto puede aparecer en muchos pedidos.

Por eso no basta con guardar un único `idProducto` dentro de `pedidos`.

Además, `pedidoDetalles` guarda:

- `cantidad`;
- `precioUnitario`.

Guardar `precioUnitario` es importante porque conserva el precio del producto en el momento del pedido, aunque el precio del catálogo cambie más adelante.

## Por qué los productos tienen dimensiones

Los productos tienen:

- `alto`;
- `ancho`;
- `largo`.

Esto no solo sirve para mostrar información del catálogo. También prepara el proyecto para funcionalidades futuras:

- cálculo de volumen;
- presupuesto por piezas;
- compatibilidad entre bloques y pilares;
- diseñador de planos 3D.

## Por qué el plano 3D queda fuera del MVP

El diseñador 3D es una de las ideas más importantes del proyecto, pero también una de las más complejas.

Requiere:

- interfaz visual;
- colocación de piezas;
- guardado de posiciones;
- cálculo de presupuesto;
- representación 2D o 3D;
- una nueva entidad `plano`.

Por eso se deja para una fase posterior. El MVP prepara la base, pero no intenta resolver todo el producto final.

## Por qué documentar consultas SQL

El archivo `backend/db/consultas.md` sirve para demostrar que la base de datos no solo existe, sino que se puede analizar.

Incluye consultas para:

- revisar datos;
- comprobar integridad;
- explicar relaciones;
- preparar una presentación;
- conectar base de datos con frontend, panel admin y futuro diseño 3D.

## Por qué pensar en SaaS desde el MVP

SquareStruct se plantea como una aplicación SaaS porque busca ser un servicio online.

Aunque el MVP se ejecute en local, la arquitectura ya separa:

- frontend;
- backend;
- base de datos;
- autenticación;
- usuarios;
- datos persistentes.

Esa separación facilita una futura subida a AWS o a una infraestructura similar.

## Idea clave para explicar

Las decisiones técnicas del MVP buscan equilibrio: construir algo funcional y comprensible ahora, pero preparado para crecer hacia una plataforma SaaS con diseñador de planos, presupuestos y persistencia de proyectos.
