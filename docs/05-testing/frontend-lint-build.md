# Verificacion del frontend con lint y build

## Objetivo

Este documento explica como revisamos el frontend antes de dar por buenos los cambios.

Usamos dos comandos:

```bash
npm run lint
npm run build
```

Ambos se ejecutan desde la carpeta `frontend/`.

## Que es lint

`lint` es una revision automatica del codigo.

En este proyecto usamos ESLint. ESLint revisa archivos JavaScript y React para detectar problemas antes de ejecutar o subir el codigo.

No es una prueba funcional de la web. Es una revision de calidad del codigo.

## Para que usamos ESLint

Lo usamos para detectar:

- Variables declaradas pero no usadas.
- Errores capturados con `catch` que luego no se utilizan.
- Malas practicas con hooks de React.
- Codigo innecesario.
- Posibles problemas de mantenimiento.

## Comando

```bash
cd frontend
npm run lint
```

Si el comando termina sin errores, el codigo pasa la revision de ESLint.

## Diferencia entre lint y build

| Comando | Para que sirve |
| --- | --- |
| `npm run lint` | Revisa la calidad del codigo y posibles malas practicas. |
| `npm run build` | Comprueba que la aplicacion puede compilar para produccion. |

Un proyecto puede compilar con `build` y aun asi tener errores de `lint`.

Por eso usamos los dos.

## Uso recomendado

Antes de crear una pull request o antes de presentar una parte del frontend:

```bash
cd frontend
npm run lint
npm run build
```

## Resultado esperado

Para considerar el frontend correcto:

- `npm run lint` debe terminar sin errores.
- `npm run build` debe compilar correctamente.
- La web debe poder abrirse en `http://localhost:5173` durante desarrollo.

## Idea clave para explicar

ESLint ayuda a demostrar que el codigo no solo funciona, sino que tambien esta escrito de forma mas limpia y mantenible.
