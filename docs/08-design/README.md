# Documentacion de diseno y sesiones

## Proposito

Esta carpeta recoge la documentacion orientada al area de diseno de SquareStruct y a la preparacion de la exposicion del proyecto.

Aqui se explica lo que se ha ido trabajando, las decisiones que se tomaron y las tecnologias que intervienen en la parte visual y en el futuro disenador 3D.

El objetivo es que dos estudiantes de primero de DAW puedan usar estos apuntes para defender el proyecto de forma clara, ordenada y tecnica sin perder el enfoque practico.

## Resumen de esta sesion

### 1. Organizacion de commits de forma escalable

La primera consulta de la sesion fue como organizar commits de manera escalable usando el patron:

```bash
git add ./ruta
git commit -m "mensaje"
```

La recomendacion que se dio fue separar los commits por bloques logicos, no por cantidad de cambios mezclados. La idea principal fue:

- un commit por funcionalidad o componente cuando el cambio tiene un alcance claro;
- un commit por tipo de cambio cuando la modificacion es independiente;
- un commit que agrupe rutas relacionadas si forman una misma pieza funcional.

Tambien se propuso usar Conventional Commits para que la historia del repositorio sea mas facil de leer y de defender:

- `feat:` para funcionalidades nuevas;
- `fix:` para correcciones;
- `style:` para cambios visuales o de estilo;
- `refactor:` para reorganizacion interna sin cambiar comportamiento;
- `test:` para pruebas;
- `docs:` para documentacion;
- `chore:` para tareas de mantenimiento;
- `db:` para cambios de base de datos.

### 2. Peticion de documentar la sesion

Despues se pidio documentar todo lo realizado durante la sesion.

En esa parte se dejo constancia de que no se han modificado archivos del repositorio ni se ha cambiado codigo durante esta conversacion. La actividad se ha centrado en:

- definir una estrategia de commits escalable;
- estructurar la documentacion para la presentacion;
- explicar como se aplican las tecnologias en el proyecto;
- preparar material de apoyo para exponer el trabajo de forma ordenada.

## Tecnologias utilizadas y aplicacion real en el proyecto

### Frontend

El frontend esta construido con React y Vite.

React se usa para dividir la interfaz en piezas reutilizables y gestionar el estado principal de la aplicacion. En el proyecto se aplica en `App.jsx`, en las paginas y en componentes como la navegacion, el carrito, el modal de autenticacion y el futuro editor de diseno.

Vite se usa como entorno de desarrollo y build. Permite arrancar la aplicacion rapido, recargar al instante y redirigir `/api` hacia el backend durante desarrollo.

JavaScript es el lenguaje principal. Se ha aplicado en la logica de la interfaz, en los servicios de API, en la gestion del estado y en la interaccion con el navegador.

Bootstrap se usa como base visual para estructuras, cards, botones, formularios y rejillas responsive. No define toda la identidad del proyecto, pero acelera el montaje de una interfaz consistente.

El CSS propio se organiza en `src/styles/` para que cada bloque tenga sus estilos separados. Eso facilita mantener la portada, el catalogo, la galeria, el disenador y el resto de pantallas sin un unico archivo gigante.

### Disenador y parte 3D

La parte de diseno es la que da sentido a la evolucion futura del proyecto.

La pagina de diseno trabaja con una estructura basada en piezas, colocaciones y plano. Las ideas aplicadas actualmente son:

- seleccion de bloques, pilares y accesorios;
- colocacion sobre una cuadricula 2D;
- validacion de espacio y apoyo estructural;
- guardado de borradores en `localStorage`;
- vista de resumen con costes estimados;
- sincronizacion entre la vista 2D y la representacion 3D.

El componente `Design3D` usa Three.js para pintar una escena basica con cubos que representan las piezas colocadas. Tambien usa `OrbitControls` para permitir rotacion de la camara y una vista mas comprensible durante la demostracion.

En esta implementacion, `Design3D` recibe `placements`, `board` y `designPieces`. Con esos datos construye la escena 3D a partir del estado real del editor.

React se aplica en este punto con hooks como `useState`, `useMemo`, `useEffect` y `useRef` para manejar el estado del plano, recalcular la vista y conectar la escena 3D con el DOM sin perder rendimiento.

La interaccion de arrastrar y soltar se apoya en el mecanismo nativo de HTML5 Drag and Drop. Eso permite mover piezas desde el panel lateral al plano y recolocarlas dentro del propio tablero.

`localStorage` se usa para guardar el borrador del disenador. Asi la sesion del usuario no se pierde si recarga la pagina o cierra el navegador.

### Backend y persistencia

Aunque esta carpeta se centra en diseno, el proyecto completo se apoya en un backend con Node.js y Express y en una base de datos MySQL.

Estas tecnologias permiten que el frontend consuma datos reales, como productos o usuarios, mediante una API REST. Ademas, la autenticacion se basa en JWT y contrasenias cifradas con bcrypt.

### Calidad y revision

Para mantener el proyecto estable se usan herramientas de validacion como ESLint y Vitest.

ESLint ayuda a detectar errores de estilo y mantenimiento en el codigo. Vitest permite comprobar componentes y logica de forma automatizada cuando haga falta validar el frontend.

## Como se explica en la exposicion

Para exponer este proyecto, la forma mas clara de contarlo es seguir este orden:

1. Problema que resuelve el proyecto.
2. Solucion propuesta por SquareStruct.
3. Reparto de trabajo entre frontend, backend y base de datos.
4. Tecnologia usada en cada capa.
5. Estado actual del MVP.
6. Evolucion de la zona de diseno hacia el futuro editor 3D.
7. Como se guarda el progreso, como se valida y como se puede ampliar.

### Mensaje corto para defender el modulo de diseno

El modulo de diseno no es solo una pantalla decorativa. Es una base funcional para un futuro configurador de planos, porque ya conecta seleccion de piezas, colocacion en rejilla, validacion estructural, guardado local y representacion 3D.

## Decisiones tomadas

- No mezclar commits distintos en una misma confirmacion si representan tareas diferentes.
- Usar mensajes de commit consistentes y faciles de leer.
- Documentar el proyecto pensando en una defensa oral, no solo en lectura tecnica.
- Tratar el disenador como una pieza evolutiva del proyecto, no como una demo aislada.
- Separar la interfaz, la logica y los estilos para mantener el frontend escalable.
- Mantener la vista 3D conectada al estado real del editor para que no quede desconectada de la logica 2D.

## Estado de esta documentacion

Esta documentacion recoge la situacion explicada en la sesion del 14/05/2026 y sirve como base para seguir ampliando la parte de diseno y la preparacion de la presentacion.
