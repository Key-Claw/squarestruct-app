# Flujos De Codigo

Esta seccion explica recorridos completos del proyecto. Sirve para estudiar que ocurre desde que el usuario hace una accion en la interfaz hasta que el backend responde o se actualiza el estado.

## Flujos Documentados

- [`flujo-backend.md`](flujo-backend.md): entrada de Express, rutas, middlewares, controladores y MySQL.
- [`flujo-frontend.md`](flujo-frontend.md): arranque React, rutas, estado, renderizado y componentes.
- [`flujo-frontend-backend.md`](flujo-frontend-backend.md): conexion entre React y API REST.
- [`flujo-crud.md`](flujo-crud.md): patron CRUD real en usuarios, productos y pedidos.
- [`flujo-autenticacion.md`](flujo-autenticacion.md): registro, login, JWT y perfil.
- [`flujo-carrito.md`](flujo-carrito.md): anadir productos, cantidades, checkout y limpieza.
- [`flujo-facturacion.md`](flujo-facturacion.md): facturas de usuario y panel admin.
- [`flujo-disenador-2d.md`](flujo-disenador-2d.md): plano 2D, colocacion, validaciones, undo/redo.
- [`flujo-disenador-3d.md`](flujo-disenador-3d.md): visor 3D, escena, camara y piezas.
- [`flujo-entidades.md`](flujo-entidades.md): entidades reales y relacion entre tablas, API y UI.
- [`flujo-pedidos.md`](flujo-pedidos.md): flujo resumido de carrito, checkout, pedido y facturas.
- [`flujo-disenador.md`](flujo-disenador.md): flujo resumido del disenador completo.

## Como Usarlo En La Defensa

Cuando pregunten por una funcionalidad, no conviene recitar todos los archivos. Es mejor explicar el recorrido:

1. componente o pagina del frontend;
2. servicio que llama a la API;
3. ruta del backend;
4. controlador;
5. base de datos o estado local;
6. respuesta y actualizacion visual.
