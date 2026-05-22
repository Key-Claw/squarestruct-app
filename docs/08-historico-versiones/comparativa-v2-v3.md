# Comparativa V2 Vs V3

## Objetivo

Comparar V2 y V3 de forma realista para explicar la evolucion del proyecto en la defensa.

## Cambios Arquitectonicos

| Tema | V2 | V3 |
| --- | --- | --- |
| Separacion de capas | Frontend, backend y DB ya separados. | Se mantiene la separacion y se documentan mejor los flujos. |
| API | Endpoints principales funcionando. | Contrato mas alineado con Postman V3 y documentacion. |
| Frontend | Paginas funcionales. | Mas estado compartido, overlays globales, i18n y disenador. |
| Backend | Express + MySQL + JWT. | Misma arquitectura, sin cambiar tecnologia. |
| CI | GitHub Actions inicial. | Ajustes para backend, frontend, lint y build. |

## Mejoras Visuales

- Pulido de paginas principales.
- Mejor responsive en movil y tablet.
- Mejor interaccion tactil en el disenador.
- Estados de carga, error y vacio mas cuidados.
- Internacionalizacion de textos visibles.

## Mejoras Tecnicas

- Disenador 2D/3D mas completo.
- Integracion de Three.js, React Three Fiber y Drei.
- Cliente API con idioma y token centralizados.
- Tests frontend con Vitest.
- Ajustes de CI para Node, MySQL y dependencias.

## Problemas Que Se Aprendieron

- Una mejora visual puede romper responsive si no se revisa.
- Un test de backend depende mucho de que seeds y schema esten sincronizados.
- CI no es igual que local: hay que preparar MySQL, variables y versiones.
- La documentacion debe moverse con el codigo; si no, se queda obsoleta.

## Resumen Defendible

V2 fue la consolidacion tecnica. V3 es la version de mejora, defensa y experiencia: no cambia la base del proyecto, la hace mas completa, clara y presentable.
