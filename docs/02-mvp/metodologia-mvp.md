# Metodologia del MVP

## Que significa MVP

MVP significa Producto Minimo Viable.

En este proyecto, `MVP v1 - Funcional` es la primera fase del roadmap de SquareStruct. No incluye todas las ideas futuras, pero permite comprobar que la base tecnica funciona y que el proyecto puede seguir creciendo hacia `v2` y `v3`.

## Flujo principal

El flujo que se quiere validar es:

```text
registro -> login -> consulta de productos -> carrito/base de pedido -> administracion inicial
```

Este recorrido conecta las partes principales del sistema:

- Frontend: interfaz que usa el cliente.
- Backend: API que procesa las peticiones.
- Base de datos: almacena usuarios, productos, proveedores, pedidos y detalles de pedido.
- Administracion: primera gestion de usuarios para el rol `admin`.

## Funcionalidades incluidas

- Registro de usuarios.
- Autenticacion con JWT.
- Consulta de productos reales desde backend.
- Catalogo con busqueda, orden y filtros basicos.
- Carrito visual en cliente.
- Base tecnica de pedidos en backend y servicios frontend.
- Gestion de usuarios para administradores.
- API REST funcional.
- Pruebas manuales con Postman.
- Revision de frontend con lint y build.

## Funcionalidades no incluidas todavia

Estas funcionalidades quedan fuera de `MVP v1` para no aumentar demasiado la complejidad:

- Configurador 3D real.
- Presupuesto automatico avanzado.
- Comparador completo de proveedores.
- Panel administrativo completo.
- Flujo completo de proveedor.
- Checkout completo desde carrito.
- Pasarela de pago real.
- Tests automatizados de frontend.

## Fases de desarrollo

1. Configuracion inicial del repositorio.
2. Diseno de la base de datos.
3. Creacion del backend con Express.
4. Conexion con MySQL.
5. Registro y login de usuarios.
6. Catalogo de productos.
7. Base de pedidos.
8. Frontend en React.
9. Carrito visual y conexion parcial con servicios.
10. Gestion inicial de usuarios admin.
11. Pruebas con Postman y tests automaticos iniciales de backend.
- Base inicial de tests automatizados de frontend.
12. Documentacion del proyecto.

## Organizacion del trabajo

El proyecto usa una forma de trabajo basada en ramas:

- `main`: version estable.
- `dev`: rama principal de desarrollo.
- `feature/*`: ramas para nuevas funcionalidades.
- Pull Requests para integrar cambios.

Esto ayuda a trabajar de forma ordenada y a evitar mezclar cambios sin revisar.

## Criterio de exito del MVP

`MVP v1` se considera valido si:

- El backend arranca correctamente.
- La base de datos tiene las tablas necesarias.
- Un usuario puede registrarse.
- El usuario puede iniciar sesion.
- El frontend puede consultar productos.
- El usuario puede anadir productos a un carrito visual.
- Existe base tecnica para pedidos.
- Un admin puede acceder a gestion de usuarios.
- La documentacion explica que entra en `MVP v1` y que queda para fases siguientes.

## Idea clave para explicar

`MVP v1` no es el proyecto final. Es la primera version que demuestra que la base tecnica funciona: frontend, backend, base de datos, autenticacion, catalogo, carrito visual y administracion inicial. Despues, `v2` y `v3` completaran la aplicacion y el disenador 3D.
