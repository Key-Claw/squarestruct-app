# Vision General

SquareStruct es una aplicacion web full stack para construccion modular sostenible. La V2 permite consultar soluciones visuales, navegar por un catalogo de piezas, crear pedidos desde un carrito, revisar facturas y gestionar usuarios/facturacion desde un rol administrador.

## Alcance Actual De V2

V2 esta implementada con:

- frontend React/Vite;
- API REST Express;
- base de datos MySQL/MariaDB;
- autenticacion JWT;
- roles `usuario` y `admin`;
- catalogo conectado al backend;
- carrito y checkout;
- pedidos y facturas;
- panel privado de cuenta;
- administracion de usuarios;
- administracion de facturacion/pedidos;
- Docker Compose;
- GitHub Actions;
- tests automatizados y colecciones Postman.

## Flujo Principal

```text
usuario visita la app
  -> consulta galeria o catalogo
  -> filtra/busca productos
  -> anade productos al carrito
  -> inicia sesion o se registra
  -> completa checkout
  -> se crea un pedido en backend
  -> consulta sus facturas en Mi Cuenta
```

El administrador tiene flujos adicionales:

```text
admin inicia sesion
  -> accede a Mi Cuenta
  -> revisa usuarios
  -> edita roles o datos
  -> consulta historial de facturacion
  -> acepta o deniega pedidos pendientes
```

## MVP Y V2

La MVP fue la primera version funcional. Su objetivo era validar la base: registro, login, catalogo, carrito visual y estructura inicial de administracion.

V2 es la version documentada actualmente. Sobre esa base incorpora integracion real de pedidos desde checkout, facturas, facturacion admin, validaciones, responsive, tests, Docker y CI.

## Funcionalidades Implementadas

| Area | Estado V2 |
| --- | --- |
| Inicio | Pagina de entrada con navegacion hacia areas principales. |
| Galeria | Ideas visuales, filtro por material y modal de imagen. |
| Catalogo | Productos desde API, busqueda, filtros, orden, paginacion y fallback local. |
| Disenador | Interfaz visual provisional con paneles y resumen simulado; no guarda planos reales. |
| Auth | Registro, login, JWT, expiracion local y logout. |
| Cuenta | Perfil editable, facturas y seccion de planos vacia. |
| Carrito | Panel lateral, cantidades, eliminacion y total. |
| Checkout | Crea pedidos autenticados en backend. |
| Usuarios admin | Listado, busqueda, filtro, detalle, edicion y eliminacion/anominizacion. |
| Facturacion admin | Historial real de pedidos, filtros, estadisticas, paginacion y cambio de estado. |
| Productos API | Lectura publica y escritura protegida por admin. |

## Limites Conscientes

- El disenador todavia no es un editor 3D real persistente.
- No existe entidad `plano` en base de datos.
- No hay pasarela de pago real.
- El despliegue AWS esta documentado como orientacion, no como infraestructura productiva cerrada.
- Los servicios backend historicos en `src/services/` no representan el flujo activo.

## Roadmap

| Version | Alcance |
| --- | --- |
| MVP v1 | Primera version funcional: auth, catalogo, carrito visual y base admin. |
| V2 | Estado actual: aplicacion full stack con pedidos, checkout, facturacion, roles, tests y CI. |
| V3 | Disenador 3D persistente, entidad `plano`, presupuesto avanzado y despliegue productivo. |
