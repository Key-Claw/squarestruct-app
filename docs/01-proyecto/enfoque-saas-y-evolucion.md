# Enfoque SaaS y evolucion futura

## Objetivo

Este documento explica por que SquareStruct se plantea como un futuro SaaS, como `MVP v1 - Funcional` preparo la base y como la fase actual `v2 - Aplicacion completa y estilizada` refuerza esa evolucion.

SaaS significa *Software as a Service*. Es decir, una aplicacion que el usuario utiliza desde el navegador, mientras la logica, los datos y la infraestructura viven en servidores.

## Que significa SaaS

Un SaaS no se instala como un programa tradicional en cada ordenador.

La idea es:

```text
usuario -> navegador -> aplicacion web -> backend -> base de datos
```

El usuario solo necesita acceder a la web. El mantenimiento, los datos, la seguridad y la evolucion del sistema se gestionan desde la parte tecnica del proyecto.

## Como se aplica a SquareStruct

SquareStruct se plantea como una futura plataforma SaaS para construccion modular.

`MVP v1 - Funcional` no era el SaaS completo: fue la base funcional que permitio demostrar el flujo principal y preparar la futura herramienta diferencial. La fase actual es `v2 - Aplicacion completa y estilizada`, centrada en mejorar estabilidad, permisos, validaciones, documentacion y pedidos.

Desde `MVP v1` y durante la revision V2, el enfoque SaaS se ve en estas decisiones:

- El usuario accede desde una interfaz web.
- El frontend consume una API REST.
- El backend centraliza la logica de negocio.
- La base de datos guarda usuarios, productos, proveedores, pedidos y detalles de pedido.
- La autenticacion se realiza con tokens JWT.
- Hay una primera separacion entre usuario normal y administrador.
- La escritura de productos queda protegida para administradores.
- Los pedidos mantienen historial mediante estado y cancelacion logica.
- El sistema puede crecer hacia un panel de administracion completo y un futuro disenador 3D.

## SaaS actual frente a SaaS futuro

En la fase actual, SquareStruct funciona como una version V2 con enfoque SaaS: parte del MVP ya construido y refuerza seguridad, validaciones, trazabilidad y calidad.

El valor SaaS completo llegara con la implementacion futura del disenador 3D y la gestion completa de pedidos/proyectos, porque permitira ofrecer un servicio mas potente desde el navegador:

- disenar planos modulares;
- colocar bloques y pilares;
- guardar disenos por usuario;
- calcular presupuestos;
- recuperar proyectos guardados;
- convertir un diseno o carrito en pedido;
- gestionar facturacion y administracion con datos reales.

Por eso es mas preciso explicar el proyecto asi:

```text
SquareStruct ya supero la fase MVP v1 y esta en V2: una version de estabilizacion y mejora con enfoque SaaS que prepara una futura plataforma para diseno, presupuesto y gestion de construccion modular.
```

## Pasos seguidos en el MVP

El desarrollo se ha planteado por capas:

1. Definir la idea del proyecto y el flujo minimo.
2. Disenar la base de datos relacional.
3. Crear el backend con Express.
4. Conectar el backend con MySQL.
5. Anadir registro, login y JWT.
6. Crear endpoints para productos, usuarios y pedidos.
7. Conectar el frontend con la API.
8. Crear catalogo conectado y carrito visual.
9. Anadir una primera gestion de usuarios admin.
10. Proteger operaciones administrativas de productos.
11. Anadir detalle y cancelacion logica de pedidos.
12. Anadir pruebas manuales y tests automaticos.
13. Documentar arquitectura, comandos y decisiones tecnicas.

## Que aporta este enfoque

El enfoque SaaS permite que SquareStruct no sea solo una pagina informativa.

La aplicacion puede evolucionar hacia un servicio completo donde cada usuario tenga:

- cuenta propia;
- pedidos;
- disenos guardados;
- presupuestos;
- historial de proyectos;
- acceso desde distintos dispositivos.

Tambien permite que el administrador gestione informacion del sistema desde vistas protegidas.

## Relacion con AWS

Aunque el MVP se ejecuta en local, esta pensado para poder levantarse en infraestructura cloud.

En AWS, una arquitectura futura podria separar:

- frontend desplegado como aplicacion web;
- backend como servicio Node.js;
- base de datos MySQL gestionada con Amazon RDS;
- variables de entorno y secretos fuera del codigo;
- backups y persistencia de datos.

## Idea clave para explicar

SquareStruct todavia no es el SaaS completo, pero `MVP v1` construye su base: usuarios, autenticacion, catalogo, carrito visual, base de pedidos, gestion admin inicial, backend y base de datos. La revision V2 refuerza permisos, pruebas y trazabilidad de pedidos. La evolucion SaaS fuerte llegara con `v3`: checkout completo desde carrito, facturacion real, disenador 3D, guardado de planos y calculo de presupuestos desde el navegador.
