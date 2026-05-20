# Scripts

## Estado actual

La carpeta `scripts/` queda reservada para futuras utilidades, pero actualmente no hay scripts activos necesarios para arrancar, probar o desplegar SquareStruct.

El flujo oficial del proyecto se basa en comandos documentados de Docker, backend y frontend.

## Comandos oficiales

Desarrollo local recomendado:

```bash
docker compose -f docker/docker-compose-dev.yml up -d
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Validacion:

```bash
cd backend
npm test
```

```bash
cd frontend
npm run test:run
npm run lint
npm run build
```

## Idea clave

Si en el futuro se anade un script auxiliar, debe estar documentado aqui y no sustituir a los comandos principales de `README.md`, `docker/README.md` y `docs/`.
