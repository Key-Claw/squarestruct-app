# Vision general del proyecto

## Objetivo

SquareStruct es una aplicacion web para construccion modular.

Su objetivo es conectar a usuarios interesados en construir con productos modulares y facilitar un primer flujo de consulta, seleccion y gestion basica.

En `MVP v1 - Funcional` no se intenta construir todo el producto final. Se busca demostrar que la aplicacion puede registrar usuarios, iniciar sesion, mostrar productos reales desde backend, trabajar con un carrito visual y ofrecer una primera administracion de usuarios.

## Problema que resuelve

La construccion modular puede ser dificil de entender para una persona que no conoce el sector.

Algunos problemas habituales son:

- Es complicado visualizar que piezas hacen falta.
- El presupuesto puede depender de muchos productos y proveedores.
- El usuario no siempre sabe comparar opciones.
- La informacion suele estar separada en distintas empresas o catalogos.
- La parte administrativa necesita controlar usuarios, productos y pedidos de forma ordenada.

Esto hace que el proceso sea menos claro y que el usuario tenga dudas antes de tomar una decision.

## Solucion propuesta

SquareStruct propone la base de una futura plataforma SaaS donde el usuario puede:

- Registrarse e iniciar sesion.
- Consultar productos de construccion modular.
- Ver informacion basica de cada producto.
- Anadir productos a un carrito visual.
- Preparar la base para pedidos.
- Acceder a vistas protegidas si tiene rol administrador.
- Gestionar usuarios desde el panel admin.
- Mantener trazabilidad de pedidos mediante estado y cancelacion logica.

En una version futura, la aplicacion podria anadir un configurador visual para disenar viviendas con bloques modulares y calcular el presupuesto automaticamente. Esa herramienta 3D seria la parte mas diferencial del SaaS.

SaaS significa *Software as a Service*: una aplicacion accesible desde el navegador, mantenida en un servidor y pensada para que los usuarios usen el servicio sin instalar el sistema completo en su equipo. En `MVP v1` se construye la base tecnica, y el SaaS completo queda como evolucion futura.

## Tipos de usuario

| Usuario | Funcion |
| --- | --- |
| Cliente | Consulta productos y puede preparar un carrito/pedido. |
| Administrador | Accede a vistas protegidas, gestiona usuarios y puede administrar productos desde la API. |
| Proveedor | Publicaria o gestionaria productos modulares en una fase futura. |

En `MVP v1` se priorizan el flujo de cliente y una primera administracion basica. El rol de proveedor queda como parte de la evolucion futura.

## Funcionalidades del MVP

- Registro de usuarios.
- Login con JWT.
- Catalogo de productos conectado al backend.
- Carrito visual en cliente.
- Base de servicios para pedidos, con detalle y cancelacion logica en backend.
- Gestion de usuarios para administradores.
- Escritura de productos protegida para administradores.
- API REST para comunicar frontend y backend.
- Vistas visuales de apoyo como galeria, Design y facturacion.

## Queda para fases siguientes

Algunas secciones existen como base visual o tecnica, pero no representan todavia una funcionalidad completa. Se desarrollaran o completaran en `v2` o `v3`:

- `Design`: maqueta del futuro disenador de estructuras.
- `Facturacion`: panel visual con datos de ejemplo.
- Pedidos: el backend permite crear, consultar y cancelar logicamente; el checkout completo desde carrito queda para fases siguientes.
- Proveedor: se contempla en la vision del producto, pero no esta desarrollado como flujo propio del MVP.

## Roadmap del proyecto

El proyecto se organiza en tres fases principales:

| Version | Objetivo |
| --- | --- |
| `MVP v1 - Funcional` | Validar el flujo minimo: registro, login, catalogo, carrito/base de pedidos y gestion admin inicial. |
| `v2 - Aplicacion completa y estilizada` | Mejorar la experiencia de usuario, seguridad, validaciones, tests, pedidos y estabilidad. |
| `v3 - Disenador de planos 3D` | Implementar la parte mas innovadora: diseno de planos modulares y visualizacion 3D. |

## Evolucion futura

Estas funcionalidades no forman parte obligatoria de `MVP v1`, pero muestran hacia donde podria crecer el proyecto:

- Configurador modular visual.
- Editor de planos por bloques.
- Calculo automatico de presupuesto.
- Guardado de disenos de usuario.
- Visualizacion de estructuras en 3D.
- Comparacion entre proveedores.
- Panel completo de administracion.
- Flujo completo de proveedores.
- Recomendaciones de materiales.
- Ampliar la cobertura de tests automatizados de frontend.

## Frase util para la presentacion

SquareStruct es una plataforma web que simplifica la construccion modular: en `MVP v1` permite consultar productos, iniciar sesion, preparar un carrito y administrar usuarios; en la revision V2 refuerza permisos, pedidos y validaciones; y en `v3` podria completar facturacion y diseno de viviendas por bloques con calculo de presupuestos.
