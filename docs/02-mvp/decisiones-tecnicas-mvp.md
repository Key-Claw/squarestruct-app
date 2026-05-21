# Decisiones tecnicas del MVP

## Objetivo

Este documento explica las decisiones tecnicas principales tomadas para construir el MVP de SquareStruct.

La idea no es solo indicar que tecnologias se han usado, sino justificar por que encajan con el alcance actual del proyecto.

## Enfoque general

El MVP se centra en validar el flujo minimo:

```text
registro -> login -> catalogo -> carrito/base de pedido -> administracion inicial
```

Por eso se han priorizado tecnologias conocidas, faciles de explicar y suficientes para conectar frontend, backend y base de datos.

## Por que una API REST

Se eligio una API REST porque separa claramente frontend y backend.

Ventajas para el MVP:

- El frontend puede consumir datos sin conocer MySQL.
- El backend controla validaciones y seguridad.
- Los endpoints se pueden probar con Postman.
- La estructura es facil de entender y mantener para una primera version funcional.

Ejemplo:

```text
GET /api/productos
```

El frontend pide productos y el backend devuelve JSON.

## Por que Node.js y Express

Node.js permite usar JavaScript tambien en el servidor.

Express se eligio porque:

- es ligero;
- permite crear rutas rapidamente;
- es facil de organizar por rutas, controladores y middlewares;
- encaja bien con una API REST de MVP.

Para este proyecto no era necesario un framework mas grande, porque habria anadido complejidad antes de validar el flujo basico.

## Por que MySQL

MySQL encaja con el proyecto porque los datos estan relacionados:

- usuarios tienen pedidos;
- pedidos tienen productos;
- productos pertenecen a proveedores;
- un pedido puede tener varios productos.

Estas relaciones se representan mejor con una base de datos relacional.

Ademas, MySQL permite trabajar conceptos importantes de Bases de Datos:

- claves primarias;
- claves foraneas;
- restricciones;
- indices;
- consultas con `JOIN`;
- agrupaciones y subconsultas.

## Por que Docker para MySQL

Docker se usa para levantar MySQL en desarrollo local.

Esto ayuda a que todos los miembros puedan usar una base de datos parecida sin instalar y configurar MySQL manualmente en cada equipo.

Ventajas:

- mismo motor de base de datos para todos;
- arranque con un unico comando;
- carga automatica de `schema.sql` y `seeds.sql`;
- posibilidad de reiniciar el volumen si se quiere reconstruir la base de datos.

## Por que JWT para autenticacion

JWT permite que el backend genere un token cuando el usuario inicia sesion.

Ese token se envia en rutas protegidas:

```http
Authorization: Bearer TOKEN
```

Ventajas para el MVP:

- no hace falta guardar sesiones en el servidor;
- el frontend puede conservar el token;
- las rutas protegidas se validan con middleware;
- permite distinguir usuarios normales y administradores;
- es una solucion comun en APIs REST.

## Por que bcrypt para contrasenas

Las contrasenas no deben guardarse en texto plano.

Por eso se usa `bcrypt`, que genera un hash antes de guardar la contrasena en MySQL.

Asi, aunque alguien consultara la tabla `usuarios`, no veria la contrasena real del usuario.

## Por que existe `pedidoDetalles`

La tabla `pedidoDetalles` resuelve la relacion entre pedidos y productos.

Un pedido puede tener varios productos, y un producto puede aparecer en muchos pedidos.

Por eso no basta con guardar un unico `idProducto` dentro de `pedidos`.

Ademas, `pedidoDetalles` guarda:

- `cantidad`;
- `precioUnitario`.

Guardar `precioUnitario` es importante porque conserva el precio del producto en el momento del pedido, aunque el precio del catalogo cambie mas adelante.

En `MVP v1`, la base de datos y el backend ya preparaban pedidos, y el frontend tenia un carrito visual. En V3 el checkout se conecta al backend mediante `Checkout.jsx` y `orderService.js`, creando pedidos reales desde el carrito.

## Por que los productos tienen dimensiones

Los productos tienen:

- `alto`;
- `ancho`;
- `largo`.

Esto no solo sirve para mostrar informacion del catalogo. Tambien prepara el proyecto para funcionalidades futuras:

- calculo de volumen;
- presupuesto por piezas;
- compatibilidad entre bloques y pilares;
- disenador de planos 3D.

## Por que el plano 3D queda fuera de MVP v1

El disenador 3D es una de las ideas mas importantes del proyecto, pero tambien una de las mas complejas.

Requiere:

- interfaz visual;
- colocacion de piezas;
- guardado de posiciones;
- calculo de presupuesto;
- representacion 2D o 3D;
- una nueva entidad `plano`.

Por eso se deja para `v3`. `MVP v1` prepara la base, pero no intenta resolver todo el producto final.

En la V3, `Design.jsx` ya incorpora editor 2D, visualizacion 3D y borrador local en navegador. Lo que sigue pendiente es guardar planos reales en MySQL asociados a usuarios.

## Por que hay gestion admin inicial

Aunque `MVP v1` prioriza el flujo de cliente, se incluye una primera administracion para demostrar vistas protegidas y control por rol.

En esta fase:

- el usuario admin puede acceder a gestion de usuarios;
- puede listar usuarios desde el backend;
- puede cambiar el rol entre `usuario` y `admin`;
- puede crear, actualizar y eliminar productos desde rutas protegidas de la API;
- el acceso se protege con JWT y middleware de admin.

En la MVP no se consideraba todavia un panel administrativo completo. En V3 la gestion de usuarios y la facturacion admin ya usan datos reales, aunque la entidad `plano` y el disenador persistente siguen perteneciendo a una fase posterior.

## Por que documentar consultas SQL

Los documentos y consultas SQL sirven para demostrar que la base de datos no solo existe, sino que se puede analizar.

Incluyen consultas para:

- revisar datos;
- comprobar integridad;
- explicar relaciones;
- preparar una presentacion;
- conectar base de datos con frontend, gestion admin inicial y futuro diseno 3D.

## Por que preparar una aplicacion web desde el MVP

SquareStruct se plantea como una aplicacion web completa porque necesita conectar interfaz, API y datos persistentes desde una base comprensible.

Aunque el MVP se ejecute en local, la arquitectura ya separa:

- frontend;
- backend;
- base de datos;
- autenticacion;
- usuarios;
- datos persistentes.

Esa separacion facilita una futura subida a AWS o a una infraestructura similar.

## Idea clave para explicar

Las decisiones tecnicas del MVP buscan equilibrio: construir algo funcional y comprensible ahora, pero preparado para crecer hacia una aplicacion con disenador de planos, presupuestos y persistencia de proyectos.
