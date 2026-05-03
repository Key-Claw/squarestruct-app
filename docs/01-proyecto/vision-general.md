# Visión general del proyecto

## Objetivo

SquareStruct es una aplicación web para construcción modular.

Su objetivo es conectar a usuarios interesados en construir con productos modulares y facilitar un primer flujo de compra o pedido.

En esta primera versión no se intenta construir todo el producto final. Se busca demostrar que la aplicación puede registrar usuarios, iniciar sesión, mostrar productos y gestionar pedidos básicos.

## Problema que resuelve

La construcción modular puede ser difícil de entender para una persona que no conoce el sector.

Algunos problemas habituales son:

- Es complicado visualizar qué piezas hacen falta.
- El presupuesto puede depender de muchos productos y proveedores.
- El usuario no siempre sabe comparar opciones.
- La información suele estar separada en distintas empresas o catálogos.

Esto hace que el proceso sea menos claro y que el usuario tenga dudas antes de tomar una decisión.

## Solución propuesta

SquareStruct propone una plataforma centralizada donde el usuario puede:

- Registrarse e iniciar sesión.
- Consultar productos de construcción modular.
- Ver información básica de cada producto.
- Realizar pedidos.

En una versión futura, la aplicación podría añadir un configurador visual para diseñar viviendas con bloques modulares y calcular el presupuesto automáticamente.

## Tipos de usuario

| Usuario | Función |
| --- | --- |
| Cliente | Consulta productos y realiza pedidos. |
| Proveedor | Publica o gestiona productos modulares. |
| Administrador | Supervisa usuarios, proveedores y datos del sistema. |

En el MVP se prioriza el usuario cliente, porque es el flujo mínimo que permite demostrar la utilidad de la aplicación.

## Funcionalidades del MVP

- Registro de usuarios.
- Login con JWT.
- Catálogo de productos.
- Gestión básica de pedidos.
- API REST para comunicar frontend y backend.

## Roadmap del proyecto

El proyecto se organiza en tres fases principales:

| Versión | Objetivo |
| --- | --- |
| `MVP v1 - Funcional` | Validar el flujo mínimo: registro, login, catálogo y pedidos. |
| `v2 - Aplicación completa y estilizada` | Mejorar la experiencia de usuario, seguridad, validaciones, tests y estabilidad. |
| `v3 - Diseñador de planos 3D` | Implementar la parte más innovadora: diseño de planos modulares y visualización 3D. |

## Evolución futura

Estas funcionalidades no forman parte obligatoria del MVP, pero muestran hacia dónde podría crecer el proyecto:

- Configurador modular visual.
- Editor de planos por bloques.
- Cálculo automático de presupuesto.
- Guardado de diseños de usuario.
- Visualización de estructuras en 3D.
- Comparación entre proveedores.
- Panel completo de administración.
- Recomendaciones de materiales.

## Frase útil para la presentación

SquareStruct es una plataforma web que simplifica la construcción modular: primero permite consultar productos y hacer pedidos, y en el futuro podría ayudar a diseñar viviendas por bloques y calcular presupuestos.
