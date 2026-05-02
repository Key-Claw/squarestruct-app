# Metodología del MVP

## Qué significa MVP

MVP significa Producto Mínimo Viable.

En este proyecto, el MVP es la primera versión funcional de SquareStruct. No incluye todas las ideas futuras, pero sí permite comprobar que el flujo principal funciona de principio a fin.

## Flujo principal

El flujo que se quiere validar es:

```text
registro -> login -> consulta de productos -> creación de pedido
```

Este recorrido es importante porque conecta las partes principales del sistema:

- Frontend: interfaz que usa el cliente.
- Backend: API que procesa las peticiones.
- Base de datos: almacena usuarios, productos y pedidos.

## Funcionalidades incluidas

- Registro de usuarios.
- Autenticación con JWT.
- Consulta de productos.
- Gestión básica de pedidos.
- API REST funcional.
- Pruebas manuales con Postman.

## Funcionalidades no incluidas todavía

Estas funcionalidades quedan fuera del MVP para no aumentar demasiado la complejidad:

- Configurador 3D.
- Presupuesto automático avanzado.
- Comparador completo de proveedores.
- Panel administrativo completo.
- Pasarela de pago real.

## Fases de desarrollo

1. Configuración inicial del repositorio.
2. Diseño de la base de datos.
3. Creación del backend con Express.
4. Conexión con MySQL.
5. Registro y login de usuarios.
6. Catálogo de productos.
7. Pedidos.
8. Frontend en React.
9. Pruebas con Postman y tests automáticos iniciales.
10. Documentación del proyecto.

## Organización del trabajo

El proyecto usa una forma de trabajo basada en ramas:

- `main`: versión estable.
- `dev`: rama principal de desarrollo.
- `feature/*`: ramas para nuevas funcionalidades.
- Pull Requests para integrar cambios.

Esto ayuda a trabajar de forma ordenada y a evitar mezclar cambios sin revisar.

## Criterio de éxito del MVP

El MVP se considera válido si:

- El backend arranca correctamente.
- La base de datos tiene las tablas necesarias.
- Un usuario puede registrarse.
- El usuario puede iniciar sesión.
- El frontend puede consultar productos.
- Se puede crear o preparar el flujo de pedido.

## Idea clave para explicar

El MVP no es el proyecto final. Es una primera versión que demuestra que la base técnica funciona y que el proyecto puede seguir creciendo.
