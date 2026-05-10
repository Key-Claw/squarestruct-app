# Enfoque SaaS y evolución futura

## Objetivo

Este documento explica por qué SquareStruct se plantea como un futuro SaaS y cómo el MVP actual prepara esa evolución.

SaaS significa *Software as a Service*. Es decir, una aplicación que el usuario utiliza desde el navegador, mientras la lógica, los datos y la infraestructura viven en servidores.

## Qué significa SaaS

Un SaaS no se instala como un programa tradicional en cada ordenador.

La idea es:

```text
usuario -> navegador -> aplicación web -> backend -> base de datos
```

El usuario solo necesita acceder a la web. El mantenimiento, los datos, la seguridad y la evolución del sistema se gestionan desde la parte técnica del proyecto.

## Cómo se aplica a SquareStruct

SquareStruct se plantea como una futura plataforma SaaS para construcción modular.

El MVP actual todavía no es el SaaS completo. Es la base funcional que permite demostrar el flujo principal y preparar la futura herramienta diferencial: el diseño de planos modulares en 3D.

En el MVP, el enfoque SaaS se empieza a ver en estas decisiones:

- El usuario accede desde una interfaz web.
- El frontend consume una API REST.
- El backend centraliza la lógica de negocio.
- La base de datos guarda usuarios, productos, proveedores y pedidos.
- La autenticación se realiza con tokens JWT.
- El sistema puede crecer hacia un panel de administración y un futuro diseñador 3D.

## SaaS actual frente a SaaS futuro

En la fase actual, SquareStruct funciona como un MVP web con enfoque SaaS.

El valor SaaS completo llegará con la implementación futura del diseñador 3D, porque permitirá ofrecer un servicio más potente desde el navegador:

- diseñar planos modulares;
- colocar bloques y pilares;
- guardar diseños por usuario;
- calcular presupuestos;
- recuperar proyectos guardados;
- convertir un diseño en pedido.

Por eso es más preciso explicar el proyecto así:

```text
SquareStruct es un MVP con enfoque SaaS que prepara una futura plataforma SaaS para diseño, presupuesto y gestión de construcción modular.
```

## Pasos seguidos en el MVP

El desarrollo se ha planteado por capas:

1. Definir la idea del proyecto y el flujo mínimo.
2. Diseñar la base de datos relacional.
3. Crear el backend con Express.
4. Conectar el backend con MySQL.
5. Añadir registro, login y JWT.
6. Crear endpoints para productos y pedidos.
7. Conectar el frontend con la API.
8. Añadir pruebas manuales y tests iniciales.
9. Documentar arquitectura, comandos y decisiones técnicas.

## Qué aporta este enfoque

El enfoque SaaS permite que SquareStruct no sea solo una página informativa.

La aplicación puede evolucionar hacia un servicio completo donde cada usuario tenga:

- cuenta propia;
- pedidos;
- diseños guardados;
- presupuestos;
- historial de proyectos;
- acceso desde distintos dispositivos.

## Relación con AWS

Aunque el MVP se ejecuta en local, está pensado para poder levantarse en infraestructura cloud.

En AWS, una arquitectura futura podría separar:

- frontend desplegado como aplicación web;
- backend como servicio Node.js;
- base de datos MySQL gestionada con Amazon RDS;
- variables de entorno y secretos fuera del código;
- backups y persistencia de datos.

## Idea clave para explicar

SquareStruct todavía no es el SaaS completo, pero el MVP construye su base: usuarios, autenticación, catálogo, pedidos, backend y base de datos. La evolución SaaS fuerte llegará con el diseñador 3D, el guardado de planos y el cálculo de presupuestos desde el navegador.
