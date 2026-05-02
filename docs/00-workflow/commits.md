# Convención de commits

## Objetivo

Este documento define cómo escribir commits claros y consistentes en el proyecto.

Un commit debe explicar qué se ha cambiado y en qué parte del proyecto. Esto facilita revisar el historial y preparar Pull Requests.

## Formato

```text
tipo(parte): descripción breve
```

Ejemplo:

```text
feat(backend): crear endpoint de productos
```

## Tipos principales

| Tipo | Uso | Ejemplo |
| --- | --- | --- |
| `feat` | Nueva funcionalidad | `feat(frontend): crear pantalla de login` |
| `fix` | Corrección de errores | `fix(backend): corregir registro de usuario` |
| `docs` | Documentación | `docs(api): documentar endpoints` |
| `refactor` | Reorganización sin cambiar funcionalidad | `refactor(backend): separar servicios` |
| `test` | Pruebas | `test(backend): añadir test de health` |
| `style` | Cambios visuales o formato | `style(frontend): mejorar navbar` |
| `chore` | Mantenimiento | `chore(project): actualizar dependencias` |
| `ci` | Integración continua | `ci(github): añadir workflow de tests` |
| `build` | Configuración de entorno | `build(docker): añadir docker compose` |

## Partes recomendadas

- `backend`
- `frontend`
- `db`
- `api`
- `docs`
- `workflow`
- `testing`
- `docker`
- `github`
- `project`

## Buenas prácticas

- Hacer commits pequeños.
- Evitar mensajes como `cambios varios`.
- Escribir en presente.
- Agrupar cambios relacionados.
- No mezclar documentación, backend y frontend en el mismo commit si no es necesario.

## Ejemplos correctos

```text
feat(backend): crear rutas de productos
fix(frontend): corregir enlace del navbar
docs(workflow): explicar ramas del proyecto
test(backend): añadir prueba de login
```

## Ejemplo incorrecto

```text
cambios varios
```

No es buen mensaje porque no explica qué se ha cambiado ni dónde.

## Commit con descripción larga

Si hace falta explicar más, se puede añadir un segundo mensaje:

```bash
git commit -m "feat(backend): implementar CRUD de productos" -m "Incluye rutas, controlador, servicio y validaciones básicas."
```

## Frase útil para la presentación

Usamos commits con una estructura fija para que el historial del proyecto sea fácil de leer y cada cambio tenga una intención clara.
