# Documentacion DevOps Docker

## Arquitectura Final

```text
Internet
  |
  | puerto 80
  v
nginx proxy
  |-- /      -> frontend nginx interno
  |-- /api/  -> backend Express interno
backend -> mysql interno
```

## Puertos

| Servicio | Puerto interno | Publico |
| --- | --- | --- |
| proxy | `80` | `80` |
| frontend | `80` | no |
| backend | `3000` | no |
| mysql | `3306` | no |

El modo de desarrollo mantiene `5173`, `3000` y `3306` usando `docker-compose-dev.yml`.

## Por Que Asi

- El usuario entra por `http://IP_EC2`.
- El frontend usa `/api`, asi que no depende de la IP de EC2.
- nginx envia `/api` al backend.
- MySQL queda dentro de Docker y no se abre a internet.
- HashRouter evita problemas de rutas SPA.

## Comando Principal

```bash
cp docker/.env.example docker/.env
docker compose -f docker/docker-compose.yml --env-file docker/.env up -d --build
```

## Variables Importantes

```text
VITE_API_URL=
CORS_ORIGIN=
JWT_SECRET=cambiar_en_ec2
DB_PASSWORD=cambiar_en_ec2
MYSQL_ROOT_PASSWORD=cambiar_en_ec2
```

`VITE_API_URL` queda vacio para que el cliente use `/api`.

## Comprobaciones

```bash
docker compose -f docker/docker-compose.yml --env-file docker/.env ps
curl http://localhost/api/health
curl http://localhost/api/db-status
```

## Como Defenderlo

La aplicacion sigue separada por capas, pero publicamente solo existe una entrada: nginx. Esto reduce CORS, simplifica la URL y evita exponer puertos sensibles.
