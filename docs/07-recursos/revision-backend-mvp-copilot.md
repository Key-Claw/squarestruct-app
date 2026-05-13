# Revision del backend y estado V2

## Objetivo

Este documento resume una revision tecnica del backend de SquareStruct.

El documento nacio como revision del MVP, pero se mantiene actualizado para reflejar el estado de V2.

## Alcance

Se revisan principalmente:

- servidor Express;
- rutas;
- controladores;
- middlewares;
- servicios;
- base de datos;
- autenticacion;
- pruebas;
- Docker y comandos de arranque.

No es una revision profunda del diseno visual del frontend.

## Preguntas de revision

La pregunta principal del MVP fue:

```text
El backend permite sostener un MVP funcional?
```

En V2, la pregunta se amplia:

```text
El backend esta suficientemente protegido, probado y documentado para una fase mas completa?
```

Para responder, se revisa si el proyecto tiene:

- arranque reproducible;
- API REST coherente;
- validaciones basicas;
- login con JWT;
- conexion con MySQL;
- estructura clara de carpetas;
- pruebas automaticas;
- colecciones Postman coherentes;
- permisos admin y reglas de pedidos.

## Aspectos positivos

El backend ya tiene una base solida para V2:

- API con Express.
- Conexion con MySQL.
- Registro y login de usuarios.
- Uso de JWT.
- Cifrado de contrasenas con bcrypt.
- Rutas de productos y pedidos.
- Escritura de productos protegida para `admin`.
- Detalle de pedidos.
- Cancelacion logica de pedidos.
- Separacion entre rutas, controladores y middlewares.
- Colecciones de Postman.
- Tests unitarios e integracion.
- Documentacion de arranque.

## Puntos a vigilar

### 1. Consistencia del esquema SQL

`schema.sql` debe poder crear la base de datos desde cero sin depender de una base ya existente.

Esto permite que cualquier persona pueda clonar el proyecto y arrancarlo.

### 2. Seguridad de JWT

La clave JWT debe venir de una variable de entorno real.

No conviene usar valores por defecto inseguros como `secret`, porque pueden ocultar errores de configuracion.

### 3. Validaciones

El backend debe validar datos antes de enviarlos a MySQL.

En V2 ya existen validaciones importantes para usuarios, productos y pedidos.

### 4. Pedidos

El flujo de pedidos debe cuidar transacciones y coherencia.

En V2 se anade cancelacion logica: el pedido no se borra, cambia a `cancelado` y guarda `fechaCancelacion`.

### 5. Variables de entorno

La carga de `.env` debe estar clara para poder explicar el arranque del backend.

### 6. Migraciones

El proyecto tiene `schema.sql` y migraciones.

Hay que evitar que ambos definan cosas contradictorias sobre la misma tabla.

### 7. Dependencias

`npm audit` detecta vulnerabilidades altas en dependencias indirectas del backend. No se aplica `npm audit fix` automaticamente; antes hay que revisar el diff.

## Estado MVP v1

El backend cumplia una parte importante de `MVP v1 - Funcional`:

- permitia trabajar con usuarios;
- tenia autenticacion;
- tenia productos;
- tenia base de pedidos;
- se podia probar con Postman.

## Estado V2

En V2 se han reforzado estos puntos:

- Productos: escritura protegida por rol `admin`.
- Pedidos: creacion, listado, detalle y cancelacion logica.
- Tests: cobertura de auth, perfil, usuarios admin, productos y pedidos.
- Postman: colecciones MVP y V2 sin JWT hardcodeados.
- CI: backend tests y frontend tests/lint/build.
- Documentacion: API, base de datos, testing, Docker y comandos de defensa.

Todavia conviene vigilar:

- base de datos desde cero;
- validaciones;
- seguridad de configuracion;
- integracion completa del checkout desde el carrito;
- vulnerabilidades reportadas por `npm audit` en backend.

## Recomendaciones

1. Verificar que `schema.sql` funciona en una base limpia.
2. Exigir `JWT_SECRET` en `.env`.
3. Mantener validaciones en todas las rutas importantes.
4. Mantener respuestas de error claras para entradas invalidas.
5. Mantener tests de productos y pedidos cuando se toque la API.
6. Mantener documentacion y codigo sincronizados.
7. Revisar `npm audit` antes de cerrar la fase.

## Idea clave para explicar

El backend ya sostiene el flujo de SquareStruct y en V2 esta mas cerca de una aplicacion defendible: tiene permisos, pruebas, trazabilidad de pedidos y documentacion sincronizada.
