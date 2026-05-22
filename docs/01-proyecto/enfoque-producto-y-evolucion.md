# Enfoque De Producto Y Evolucion

SquareStruct se plantea como una aplicacion web accesible desde navegador, con frontend y backend separados, autenticacion, base de datos persistente y posibilidad de crecer hacia herramientas de diseno y presupuesto.

## Separacion Por Fases

| Fase | Estado | Papel |
| --- | --- | --- |
| MVP v1 | Cerrada | Valido la base funcional: auth, catalogo, carrito visual y administracion inicial. |
| Version anterior | Cerrada | Consolido la aplicacion full stack con checkout, pedidos, facturas, roles, Docker, CI y documentacion tecnica. |
| V3 | Actual | Evoluciona el producto hacia el disenador, mantiene el flujo completo de catalogo/pedidos y actualiza stack, pruebas y documentacion. |
| Siguiente fase | Pendiente | Persistencia de planos, presupuesto avanzado, pagos y despliegue productivo. |

## Enfoque Tecnico Actual

La V3 ya separa piezas propias de una aplicacion mantenible:

- frontend independiente en React/Vite;
- backend REST en Express;
- base de datos relacional;
- JWT para sesiones sin estado en servidor;
- roles para separar usuario normal y administracion;
- Docker para reproducir entorno;
- CI para validar cambios;
- variables de entorno para configuracion.

El objetivo actual no es orientar el proyecto a un modelo concreto de negocio, sino mantener una aplicacion web clara, comprobable y preparada para seguir ampliando funcionalidades.

## Estado Actual

SquareStruct V3 permite:

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

Las siguientes piezas pertenecen a la evolucion posterior del trabajo actual:

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
