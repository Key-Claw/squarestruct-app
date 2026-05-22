# Guia De Defensa DAW1

## Objetivo

Esta guia resume como explicar SquareStruct en una exposicion de final de curso de DAW1. No sustituye a la documentacion tecnica completa: sirve como mapa rapido para estudiar, repartir la presentacion y defender decisiones.

## Idea Principal Del Proyecto

SquareStruct es una aplicacion web full stack para construccion modular sostenible.

Permite:

- navegar por una web con inicio, galeria, catalogo, disenador visual y secciones privadas;
- registrarse e iniciar sesion;
- consultar productos desde una API;
- anadir productos al carrito;
- crear pedidos desde checkout;
- ver facturas como usuario;
- gestionar usuarios, productos y pedidos como administrador.

La version actual documentada es V3.

## Como Explicarlo En 1 Minuto

SquareStruct es nuestro proyecto final de DAW1. Hemos creado una aplicacion web completa separando frontend, backend y base de datos. El frontend esta hecho con React y Vite; el backend con Node.js y Express; y la base de datos con MySQL. Implementamos autenticacion con JWT, roles de usuario y administrador, catalogo conectado a base de datos, carrito, checkout, pedidos, facturas, paneles de administracion, editor 2D/3D, Docker para levantar el entorno y tests automaticos con GitHub Actions.

## Stack Que Hay Que Saber Defender

| Parte | Tecnologia | Como defenderla |
| --- | --- | --- |
| Frontend | React | Nos permite dividir la interfaz en componentes reutilizables. |
| Frontend | Vite | Facilita el desarrollo local y genera el build de produccion. |
| Rutas | React Router DOM con HashRouter | Permite navegar entre paginas dentro de una SPA. |
| Estilos | Bootstrap + CSS propio | Bootstrap acelera maquetacion y CSS propio da identidad visual. |
| 3D/Diseno | Three.js, React Three Fiber y Drei | Permiten mostrar el plano modular en una vista 3D. |
| Backend | Node.js + Express | Permiten crear una API REST clara y facil de probar. |
| Base de datos | MySQL/MariaDB | Encaja con usuarios, productos, pedidos y detalles relacionados. |
| Seguridad | JWT + bcrypt | JWT protege rutas privadas y bcrypt evita guardar contrasenas en texto plano. |
| Testing backend | Jest + Supertest | Comprueban endpoints reales de la API. |
| Testing frontend | Vitest + Testing Library | Comprueban que componentes principales renderizan correctamente. |
| Calidad | ESLint | Detecta problemas de codigo antes de integrar cambios. |
| Entorno | Docker Compose | Levanta MySQL de forma reproducible. |
| CI | GitHub Actions | Ejecuta tests, lint y build automaticamente. |

## Flujo Tecnico Principal

```text
Usuario
  -> Frontend React
  -> services/api.js
  -> API Express
  -> Middleware de auth/admin si hace falta
  -> Controlador
  -> MySQL con mysql2/promise
  -> Respuesta JSON
  -> Interfaz actualizada
```

Ejemplo:

```text
Checkout
  -> POST /api/orders
  -> JWT valida el usuario
  -> pedidosController calcula total
  -> inserta pedido y pedidoDetalles
  -> devuelve el pedido creado
```

## Partes Que Conviene Repartir En La Exposicion

| Bloque | Contenido |
| --- | --- |
| Introduccion | Que problema resuelve SquareStruct y que permite hacer. |
| Frontend | Paginas, componentes, rutas, carrito, checkout y area privada. |
| Backend | API REST, rutas, controladores, middlewares, JWT y roles. |
| Base de datos | Tablas, relaciones, claves foraneas y datos seed. |
| Testing y CI | Jest, Supertest, Vitest, ESLint, build y GitHub Actions. |
| Docker | Como se levanta MySQL y por que ayuda en desarrollo. |
| Demo | Registro/login, catalogo, carrito, pedido, factura y panel admin. |
| Cierre | Limites actuales y mejoras futuras: planos persistentes, pagos y despliegue. |

## Preguntas Probables Y Respuestas Cortas

| Pregunta | Respuesta defendible |
| --- | --- |
| Por que React | Porque facilita crear una SPA dividida en componentes y manejar estados como usuario, carrito y modales. |
| Por que Express | Porque es ligero, claro y suficiente para construir una API REST de este alcance. |
| Por que MySQL | Porque el proyecto tiene relaciones claras: usuarios, pedidos, productos y detalles de pedido. |
| Como protegeis rutas privadas | Con JWT en el header `Authorization: Bearer TOKEN` y middlewares en backend. |
| Como diferenciais usuario y admin | El token contiene el rol y el backend usa middleware `admin` en rutas administrativas. |
| Por que bcrypt | Para no guardar contrasenas reales en la base de datos. |
| Que valida el CI | Backend con MySQL, tests Jest/Supertest, tests Vitest, ESLint y build de Vite. |
| Que hace Docker | Levanta MySQL con schema y seeds para tener un entorno repetible. |
| Que queda pendiente | Persistir planos, calcular presupuestos avanzados, pagos reales y despliegue productivo. |

## Como Defender El Disenador

El disenador actual no es solo una imagen estatica: carga bloques y pilares desde `/api/productos`, los transforma en piezas colocables, permite editar en 2D, visualizar en 3D y calcular un presupuesto estimado.

Lo que todavia no esta en la base de datos es la entidad `plano`. Por eso el boton de guardar usa `localStorage` del navegador y tambien se puede exportar un JSON. En una fase posterior se podria guardar ese JSON o una estructura parecida en MySQL asociada al usuario autenticado.

## Demo Recomendada

1. Abrir la home y explicar la navegacion.
2. Ir al catalogo y mostrar productos cargados desde backend.
3. Filtrar o buscar un producto.
4. Anadir productos al carrito.
5. Iniciar sesion o registrar usuario.
6. Completar checkout.
7. Ver factura en Mi Cuenta.
8. Entrar como admin.
9. Mostrar gestion de usuarios o facturacion.
10. Enseñar brevemente tests/CI y estructura del repo.

## Documentos Que Hay Que Estudiar Primero

1. `README.md`
2. `docs/README.md`
3. `docs/01-proyecto/vision-general.md`
4. `docs/03-arquitectura/frontend-estructura.md`
5. `docs/03-arquitectura/backend-estructura.md`
6. `docs/03-arquitectura/base-de-datos.md`
7. `docs/04-api/endpoints.md`
8. `docs/05-testing/ci-github-actions.md`

## Frase Final Para La Defensa

SquareStruct demuestra que sabemos integrar frontend, backend, base de datos, autenticacion, roles, pruebas, Docker y CI en una aplicacion web completa, manteniendo una estructura comprensible y preparada para seguir creciendo.
