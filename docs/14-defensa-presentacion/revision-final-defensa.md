# Revision Final Y Defensa Tecnica

Este documento resume la revision global de SquareStruct V3 para estudiar la defensa final. Esta escrito pensando en un proyecto academico DAW realizado por 2 estudiantes, sin venderlo como una solucion empresarial ni ocultar sus limites reales.

## Contexto Revisado

- Rama de trabajo documentada: `feat/review-v3`.
- Stack real: React, Vite, Bootstrap, Node.js, Express, MySQL/MariaDB, JWT, Docker Compose, nginx, Jest, Supertest, Vitest, Testing Library y GitHub Actions.
- Objetivo de V3: aplicacion full stack con catalogo, autenticacion, roles, carrito, pedidos, facturas, administracion y disenador 2D/3D.
- Criterio de revision: no cambiar comportamiento visual, responsive, rutas, API, Docker ni Three.js.

## Veredicto General

El proyecto es coherente y defendible para DAW1. La arquitectura separa frontend, backend y base de datos de forma clara. Docker permite levantar el entorno de forma repetible y el despliegue AWS queda preparado mediante un proxy nginx sencillo en el puerto `80`.

La documentacion principal ya explica el codigo real, los flujos importantes, las tecnologias usadas, las limitaciones y las decisiones tecnicas. La defensa debe centrarse en explicar lo construido con honestidad: hay integracion full stack real, pero no hay pagos reales, no hay persistencia de planos 3D en base de datos y HTTPS queda como mejora futura.

## Coherencia Por Area

| Area | Estado | Como defenderlo |
| --- | --- | --- |
| Frontend | React con Vite, Bootstrap, servicios API y rutas con HashRouter. | "El frontend renderiza la interfaz, consume la API y evita problemas de rutas SPA en despliegue con `#/`." |
| Backend | Express con rutas, controladores, middleware JWT y conexion MySQL. | "El backend centraliza reglas, autenticacion, validaciones y acceso a datos." |
| Base de datos | MySQL/MariaDB con usuarios, productos, pedidos y facturas. | "La BD guarda la parte persistente del proyecto; los planos 3D aun son una mejora futura." |
| Autenticacion | JWT con roles `usuario` y `admin`. | "El token identifica al usuario y los roles protegen operaciones administrativas." |
| API | Endpoints REST documentados en `docs/04-api/endpoints.md` y Postman V3. | "Postman sirve para probar la API sin depender del frontend." |
| Testing | Jest/Supertest en backend y Vitest/Testing Library en frontend. | "Los tests validan salud, autenticacion, productos, pedidos y componentes criticos." |
| CI | GitHub Actions ejecuta validaciones de frontend y backend. | "El CI ayuda a detectar errores antes de mezclar cambios." |
| Docker | Compose separa frontend, backend, MySQL y proxy. | "En produccion solo se publica nginx; backend y MySQL quedan internos." |
| 3D | Integracion visual en frontend con librerias 3D. | "El disenador permite construir y exportar, pero la persistencia en BD queda pendiente." |
| Documentacion | Reorganizada por arquitectura, flujos, testing, historico y defensa. | "Cada carpeta responde a una pregunta concreta: que es, donde esta, como funciona y como se defiende." |

## Preguntas Probables Y Respuestas

### Por que React y Vite?

Porque React permite dividir la interfaz en componentes reutilizables y Vite da un entorno de desarrollo rapido y sencillo para un proyecto academico.

### Por que Bootstrap?

Porque aporta una base responsive conocida, rapida de aplicar y defendible para DAW, sin tener que crear un sistema visual completo desde cero.

### Por que Express?

Porque Express es ligero, entendible y suficiente para crear una API REST con rutas separadas, middlewares y controladores.

### Por que MySQL/MariaDB?

Porque encaja con el temario de bases de datos relacionales y permite modelar usuarios, productos, pedidos y facturas con relaciones claras.

### Por que JWT?

Porque permite mantener sesion sin guardar estado en el servidor. El frontend guarda el token y lo envia en las peticiones protegidas.

### Por que Docker?

Porque evita depender de instalaciones manuales distintas en cada ordenador. Con Docker se levanta el mismo entorno de frontend, backend y base de datos.

### Por que nginx en AWS?

Porque EC2 debe exponer una entrada publica clara por el puerto `80`. nginx recibe las peticiones y las reparte: frontend para la interfaz y `/api` para backend.

### Por que MySQL no se expone publicamente?

Porque no hace falta acceder a la base de datos desde internet. Solo el backend debe hablar con MySQL dentro de la red Docker.

### Por que HashRouter?

Porque evita errores de rutas SPA en servidores estaticos. Las rutas quedan como `http://IP/#/design`, y el servidor solo sirve el frontend.

### Que limitacion tiene el disenador 3D?

El disenador existe en frontend y permite trabajar visualmente, pero no tiene todavia una tabla `planos` en MySQL. La persistencia completa seria una mejora futura.

## Fortalezas

- Proyecto full stack real con separacion entre frontend, backend y base de datos.
- Autenticacion con JWT y roles diferenciados.
- Catalogo, carrito, pedidos, facturas y panel de administracion.
- Disenador 2D/3D como evolucion visual de V3.
- Docker y guia de despliegue en AWS EC2.
- Tests y CI documentados.
- Postman V3 para validar la API.
- Documentacion organizada para estudiar y defender.

## Limitaciones Honestas

- No hay pasarela de pago real.
- No hay HTTPS activo todavia; queda preparado como mejora.
- No hay persistencia completa de planos 3D en base de datos.
- Postman no se ejecuta todavia con Newman en CI.
- El despliegue AWS usa EC2 y Docker Compose, no servicios cloud avanzados.
- La seguridad es suficiente para un proyecto academico, pero no para produccion real sin mas revisiones.

## Mejoras Futuras

- Crear entidad `planos` para guardar disenios 2D/3D por usuario.
- Activar HTTPS con certificados reales.
- Anadir backups de base de datos.
- Ejecutar Postman/Newman en GitHub Actions.
- Ampliar tests frontend sobre flujos de compra y admin.
- Revisar si `frontend/next.config.js` sigue siendo necesario o es un resto no usado.

## Guion Corto De Defensa

1. Presentar SquareStruct: aplicacion para catalogo, pedidos y disenio modular.
2. Explicar arquitectura: React en frontend, Express en backend y MySQL como persistencia.
3. Enseñar login y roles: usuario normal frente a administrador.
4. Recorrer un flujo completo: catalogo, carrito, pedido y factura.
5. Mostrar el disenador 2D/3D y aclarar sus limites actuales.
6. Explicar Docker: servicios separados y nginx como entrada publica.
7. Cerrar con tests, CI, problemas encontrados y mejoras futuras.

## Riesgos A Vigilar Antes De Exponer

- No presentar el proyecto como una plataforma comercial por suscripcion.
- No decir que hay pagos reales.
- No decir que los planos 3D se guardan en MySQL si aun no existe esa tabla.
- No abrir puertos de backend o MySQL en AWS.
- No mezclar documentacion historica MVP/V2 con el estado real V3.
- Usar siempre Postman V3 para la demo de API.
- Si se despliega otra rama, actualizar la guia AWS con el nombre de rama correcto.

## Frase Final Defendible

"SquareStruct V3 es un proyecto full stack academico y realista. Hemos separado interfaz, API y base de datos, hemos anadido autenticacion, roles, pedidos, pruebas, Docker y una preparacion de despliegue en AWS. Tambien documentamos claramente lo que funciona y lo que queda como mejora futura."
