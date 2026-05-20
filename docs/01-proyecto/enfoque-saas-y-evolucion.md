# Enfoque SaaS Y Evolucion

SquareStruct se plantea como una aplicacion web accesible desde navegador, con frontend y backend separados, autenticacion, base de datos persistente y posibilidad de crecer hacia herramientas de diseno y presupuesto.

## Separacion Por Fases

| Fase | Estado | Papel |
| --- | --- | --- |
| MVP v1 | Cerrada | Valido la base funcional: auth, catalogo, carrito visual y administracion inicial. |
| V2 | Actual | Consolida aplicacion full stack con checkout, pedidos, facturas, roles, Docker, CI y documentacion tecnica. |
| V3 | Futura | Incorporara disenador real, planos persistentes, presupuesto avanzado y despliegue productivo. |

## Por Que Tiene Enfoque SaaS

La V2 ya separa piezas propias de una aplicacion mantenible:

- frontend independiente en React/Vite;
- backend REST en Express;
- base de datos relacional;
- JWT para sesiones sin estado en servidor;
- roles para separar usuario normal y administracion;
- Docker para reproducir entorno;
- CI para validar cambios;
- variables de entorno para configuracion.

Esto no convierte automaticamente el proyecto en una plataforma completa, pero prepara una evolucion natural hacia servicio web desplegado.

## Estado Actual

SquareStruct V2 permite:

- navegar por contenido publico;
- registrarse e iniciar sesion;
- consultar catalogo real desde API;
- filtrar y buscar productos;
- anadir productos al carrito;
- completar checkout;
- crear pedidos;
- revisar facturas;
- gestionar usuarios como admin;
- revisar facturacion/pedidos como admin.

## Evolucion Pendiente

Las siguientes piezas pertenecen a V3 o a un despliegue productivo:

- entidad `plano`;
- guardado de disenos por usuario;
- editor 3D real;
- calculo de presupuesto desde piezas colocadas;
- pasarela de pago;
- despliegue AWS cerrado;
- observabilidad, backups y gestion de secretos productiva.

## Relacion Con AWS

La documentacion Docker sirve como base reproducible. Para AWS EC2 podria ejecutarse backend y base de datos en contenedores, aunque para un entorno mas robusto convendria separar:

```text
Frontend -> S3/CloudFront o servidor estatico
Backend  -> EC2, ECS, App Runner u otro servicio
MySQL    -> RDS o contenedor con volumen persistente
```

Antes de desplegar hay que revisar CORS, HTTPS, secretos, puertos, persistencia y usuarios seed.
