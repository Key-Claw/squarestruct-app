# Prompt reutilizable para revisar el estado del proyecto

## Objetivo

Este documento guarda un prompt reutilizable para pedir una revision completa del proyecto SquareStruct.

Sirve como apoyo para futuras revisiones, pero la respuesta generada siempre debe contrastarse con el codigo real y con la documentacion actual.

## Prompt sugerido

```text
Realiza una revision completa del estado actual del proyecto SquareStruct.

Revisa backend, frontend, base de datos, Docker, CI, Postman, seguridad, testing y documentacion.

Contrasta la revision con los requisitos del reto oficial y con la estructura real del repositorio.

No des por cumplido nada sin indicar evidencia concreta. Si algo esta implementado parcialmente, marcalo como parcial. Si algo esta solo documentado como futuro, no lo marques como hecho.

Genera:

1. Resumen ejecutivo.
2. Checklist de cumplimiento.
3. Puntos fuertes.
4. Riesgos o pendientes.
5. Recomendaciones para la siguiente fase.
```

## Reglas para usarlo

- Revisar la respuesta antes de guardarla en `docs/`.
- Corregir rutas relativas.
- Evitar frases absolutas como "todo esta perfecto" si hay pendientes.
- Diferenciar `MVP v1`, `V2` y `V3`.
- Marcar el checkout completo, facturacion real y 3D como pendientes si no estan implementados.

## Idea clave

Copilot puede ayudar a generar una revision, pero la documentacion final debe ser exacta y defendible.
