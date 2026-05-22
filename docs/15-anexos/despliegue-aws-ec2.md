# Despliegue AWS EC2 Con Docker Y Nginx

Guia realista para desplegar SquareStruct en una EC2 usando Docker Compose, nginx como reverse proxy simple, frontend estatico, backend interno y MySQL interno.

## Arquitectura

```text
http://IP_EC2
   |
   v
nginx proxy :80
   |-- /      -> frontend :80
   |-- /api/  -> backend :3000
backend -> mysql :3306
```

## Security Group

| Puerto | Uso | Recomendacion |
| --- | --- | --- |
| `22` | SSH | Solo tu IP. |
| `80` | Web publica | Abierto a internet. |
| `443` | HTTPS futuro | Preparado, abrir cuando haya certificados. |
| `3000/3001` | Backend | Cerrado. |
| `3306/3307` | MySQL | Cerrado. |
| `5173/5174` | Vite dev | Cerrado. |

## Preparar EC2 Ubuntu

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install docker.io docker-compose-v2 git -y
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ubuntu
```

Cierra SSH y vuelve a entrar.

## Clonar Proyecto

```bash
git clone -b feat/review-v3 https://github.com/Key-Claw/squarestruct-app.git
cd squarestruct-app
```

Si esta rama se integra en `dev` o `main`, cambia `feat/review-v3` por el nombre real de la rama estable que se vaya a desplegar.

## Variables

```bash
cp docker/.env.example docker/.env
nano docker/.env
```

Cambia:

```text
MYSQL_ROOT_PASSWORD
DB_PASSWORD
JWT_SECRET
```

Deja:

```text
VITE_API_URL=
CORS_ORIGIN=
```

Esto hace que React llame a `/api` y nginx lo envie al backend.

## Levantar

```bash
docker compose -f docker/docker-compose.yml --env-file docker/.env up -d --build
```

## Comprobar

```bash
docker compose -f docker/docker-compose.yml --env-file docker/.env ps
curl http://localhost/api/health
curl http://localhost/api/db-status
```

Desde navegador:

```text
http://IP_EC2
http://IP_EC2/#/catalog
http://IP_EC2/#/design
http://IP_EC2/api/health
```

## Actualizar

```bash
git pull
docker compose -f docker/docker-compose.yml --env-file docker/.env up -d --build
```

## Persistencia

Los datos persisten en `squarestruct_mysql_data`.

Para reiniciar sin borrar:

```bash
docker compose -f docker/docker-compose.yml --env-file docker/.env down
docker compose -f docker/docker-compose.yml --env-file docker/.env up -d --build
```

Para reiniciar la base:

```bash
docker compose -f docker/docker-compose.yml --env-file docker/.env down -v
docker compose -f docker/docker-compose.yml --env-file docker/.env up -d --build
```

## Troubleshooting

### El frontend carga pero no hay datos

Revisa que `VITE_API_URL` este vacio y reconstruye.

### `/api/health` no responde

```bash
docker compose -f docker/docker-compose.yml --env-file docker/.env logs proxy
docker compose -f docker/docker-compose.yml --env-file docker/.env logs backend
```

### Backend no conecta con MySQL

Revisa que `DB_HOST=mysql` y que MySQL este sano.

### Cambios de schema/seeds no aparecen

MySQL solo ejecuta scripts iniciales con volumen vacio. Usa `down -v` solo si quieres borrar datos.

### Ruta SPA

Con HashRouter, las rutas correctas llevan `#/`:

```text
http://IP_EC2/#/design
```

## HTTPS Futuro

El compose tiene preparado el puerto `443` comentado. Para activarlo:

1. conseguir certificados;
2. montar certificados en el proxy;
3. anadir bloque `listen 443 ssl` en `docker/nginx/nginx.conf`;
4. descomentar `443:443`.

## Defensa DAW

La decision clave es publicar solo nginx. El backend y MySQL quedan protegidos en la red Docker, el frontend usa `/api` y se evitan problemas de CORS y puertos de desarrollo expuestos.
