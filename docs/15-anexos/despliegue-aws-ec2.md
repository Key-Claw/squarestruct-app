# Despliegue AWS EC2 Con Docker

Esta guia explica como desplegar SquareStruct V3 en una instancia AWS EC2 usando Docker Compose. Esta pensada para una demo academica DAW1: clara, realista y sin infraestructura innecesaria.

## Alcance Real

- Rama auditada: `feat/review-v3`.
- Frontend: React + Vite.
- Backend: Node.js + Express.
- Base de datos: MySQL 8.4 en Docker.
- Orquestacion: Docker Compose.
- Despliegue objetivo: una sola EC2 con tres contenedores.

No se introduce Nginx, RDS, S3, CloudFront, balanceadores ni Kubernetes. Son opciones validas en proyectos mayores, pero no son necesarias para defender este proyecto.

## Estructura Docker Del Proyecto

| Archivo | Uso |
| --- | --- |
| `docker/docker-compose-dev.yml` | Desarrollo local recomendado: solo levanta MySQL. |
| `docker/docker-compose.yml` | Entorno completo: MySQL, backend y frontend en contenedores. |
| `backend/Dockerfile` | Construye el backend con Node y ejecuta `npm start`. |
| `frontend/Dockerfile` | Construye el frontend con Node y ejecuta Vite con `--host 0.0.0.0`. |
| `backend/db/schema.sql` | Crea tablas al iniciar MySQL con volumen vacio. |
| `backend/db/seeds.sql` | Inserta datos iniciales al iniciar MySQL con volumen vacio. |

## Contenedores Del Compose Completo

El despliegue usa `docker/docker-compose.yml`.

| Servicio | Contenedor | Puerto interno | Puerto publicado | Funcion |
| --- | --- | --- | --- | --- |
| MySQL | `squarestruct-mysql` | `3306` | `3307` | Base de datos. |
| Backend | `squarestruct-backend` | `3000` | `3001` | API REST Express. |
| Frontend | `squarestruct-frontend` | `5173` | `5174` | App React servida por Vite. |

Dentro de Docker, el backend se conecta a MySQL con:

```text
DB_HOST=mysql
DB_PORT=3306
```

No se usa `localhost` dentro del backend porque `localhost` apuntaria al propio contenedor del backend, no al contenedor de MySQL.

## Variables De Entorno Reales

### Backend

En `docker/docker-compose.yml`:

```text
PORT=3000
DB_HOST=mysql
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=20doblajepuro37
DB_NAME=squarestruct
JWT_SECRET=cambia_esta_clave_en_local
NODE_ENV=development
```

Para una demo publica conviene cambiar `JWT_SECRET` y las contrasenas antes de exponer la instancia.

### Frontend

En local el compose usa:

```text
VITE_API_URL=http://localhost:3001/api
```

En AWS EC2 esto debe cambiarse a:

```text
VITE_API_URL=http://IP_PUBLICA_EC2:3001/api
```

Si se deja `localhost`, el navegador del visitante intentara llamar a su propio ordenador, no al backend de la EC2.

## Por Que Docker

Docker permite que MySQL, backend y frontend arranquen igual en cualquier maquina. Para DAW1 es defendible porque:

- evita instalar MySQL y Node manualmente en cada entorno;
- facilita reiniciar la base de datos con schema y seeds;
- separa servicios;
- permite probar el entorno completo con un solo comando.

## Por Que EC2

EC2 es una forma sencilla de demostrar un despliegue real en la nube. No es la solucion mas avanzada, pero para una defensa academica permite explicar:

- servidor Linux;
- SSH;
- puertos;
- Docker;
- contenedores;
- acceso publico desde navegador y movil.

## Por Que HashRouter

El frontend usa `HashRouter`. Esto ayuda en despliegues sencillos porque las rutas quedan despues de `#`, por ejemplo:

```text
http://IP_PUBLICA_EC2:5174/#/catalog
```

Asi, si se recarga una pagina interna, el servidor solo recibe `/` y React se encarga de interpretar la ruta. Esto evita errores tipicos de SPA cuando no hay Nginx configurado para redirigir todas las rutas a `index.html`.

## Por Que Frontend Y Backend Separados

La separacion permite:

- probar la API con Postman o Jest;
- probar el frontend con Vitest;
- cambiar la URL de API con `VITE_API_URL`;
- mantener responsabilidades claras: React renderiza, Express procesa, MySQL guarda.

## Crear La Instancia EC2

Configuracion recomendada:

| Campo | Valor recomendado |
| --- | --- |
| Sistema operativo | Ubuntu LTS |
| Tipo | `t3.micro` o similar para demo |
| Disco | 20 GB o mas si se guardaran imagenes y volumenes Docker |
| Acceso | Par de claves `.pem` |
| Red | Security Group con puertos controlados |

## Security Group

Puertos de entrada recomendados:

| Puerto | Uso | Origen recomendado |
| --- | --- | --- |
| `22` | SSH | Tu IP publica, no todo internet. |
| `5174` | Frontend HTTP | `0.0.0.0/0` para demo publica. |
| `3001` | Backend HTTP | `0.0.0.0/0` para demo simple; idealmente restringido si hay proxy. |
| `3307` | MySQL externo | Cerrado por defecto. Abrir solo para depuracion puntual. |
| `80` | HTTP estandar | No se usa con la configuracion actual. |
| `443` | HTTPS | No se usa sin proxy/certificado. |

### HTTPS

El proyecto actual no trae Nginx, Caddy ni certificados. Por tanto, la demo directa funciona por HTTP en `5174` y `3001`.

Para HTTPS haria falta anadir un proxy inverso y certificados, pero eso seria una mejora futura, no requisito del despliegue actual.

## Conexion SSH

Desde Linux o macOS:

```bash
chmod 400 tu-clave.pem
ssh -i "tu-clave.pem" ubuntu@IP_PUBLICA_EC2
```

Desde Windows PowerShell:

```powershell
ssh -i C:\ruta\tu-clave.pem ubuntu@IP_PUBLICA_EC2
```

## Instalar Docker Y Compose En Ubuntu

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install docker.io docker-compose-v2 git -y
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ubuntu
```

Cierra la sesion SSH y vuelve a entrar para que el usuario `ubuntu` pueda usar Docker sin `sudo`.

Comprobacion:

```bash
docker --version
docker compose version
```

## Clonar El Repositorio

Para trabajar exclusivamente sobre la rama activa documentada:

```bash
git clone -b feat/review-v3 https://github.com/Key-Claw/squarestruct-app.git
cd squarestruct-app
```

Si la rama ya estuviera integrada en otra rama final, se podria cambiar el nombre de rama, pero la guia actual documenta `feat/review-v3`.

## Ajustar La URL Del Backend Para EC2

Edita el compose:

```bash
nano docker/docker-compose.yml
```

Busca:

```text
VITE_API_URL: http://localhost:3001/api
```

Cambia a:

```text
VITE_API_URL: http://IP_PUBLICA_EC2:3001/api
```

Guarda el archivo. Este cambio es necesario porque el frontend se ejecutara en el navegador del usuario.

## Levantar Contenedores

Desde la raiz del repositorio:

```bash
docker compose -f docker/docker-compose.yml up -d --build
```

Que ocurre:

1. Docker descarga MySQL 8.4 si no existe.
2. Construye la imagen del backend.
3. Construye la imagen del frontend.
4. MySQL arranca y carga `schema.sql` y `seeds.sql` si el volumen esta vacio.
5. El backend espera a que MySQL este sano.
6. El frontend arranca despues del backend.

## Comprobaciones

Estado de contenedores:

```bash
docker compose -f docker/docker-compose.yml ps
```

Logs:

```bash
docker compose -f docker/docker-compose.yml logs mysql
docker compose -f docker/docker-compose.yml logs backend
docker compose -f docker/docker-compose.yml logs frontend
```

Backend:

```text
http://IP_PUBLICA_EC2:3001/api/health
http://IP_PUBLICA_EC2:3001/api/db-status
```

Frontend:

```text
http://IP_PUBLICA_EC2:5174
```

Rutas SPA:

```text
http://IP_PUBLICA_EC2:5174/#/catalog
http://IP_PUBLICA_EC2:5174/#/design
http://IP_PUBLICA_EC2:5174/#/setings/profile
```

## Acceso Desde Movil

Para probar desde movil:

1. Abre `http://IP_PUBLICA_EC2:5174` en el navegador del movil.
2. Asegurate de que el Security Group permite entrada al puerto `5174`.
3. Comprueba que el backend responde desde el movil en `http://IP_PUBLICA_EC2:3001/api/health`.
4. Si el frontend carga pero login/catalogo fallan, revisa `VITE_API_URL`.

## Persistencia De Datos

El compose completo usa el volumen:

```text
squarestruct_mysql_data
```

Los datos persisten si se reinician contenedores:

```bash
docker compose -f docker/docker-compose.yml down
docker compose -f docker/docker-compose.yml up -d --build
```

Los datos se borran si se elimina el volumen:

```bash
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up -d --build
```

Usar `down -v` solo cuando se quiera reiniciar la base de datos desde cero.

## Actualizar La Aplicacion

```bash
git pull
docker compose -f docker/docker-compose.yml up -d --build
```

Si se cambia `VITE_API_URL`, reconstruye el frontend porque Vite lee variables `VITE_` durante el arranque/build del contenedor.

## Troubleshooting

### El frontend carga, pero no hay datos

Posible causa: `VITE_API_URL` sigue en `localhost`.

Solucion: cambiarlo a `http://IP_PUBLICA_EC2:3001/api` y reconstruir.

### No abre el frontend desde navegador

Revisar:

- contenedor `squarestruct-frontend`;
- puerto `5174` en Security Group;
- firewall de la instancia;
- logs de frontend.

### `/api/health` no responde

Revisar:

- contenedor `squarestruct-backend`;
- puerto `3001` en Security Group;
- logs de backend;
- variable `PORT`.

### Backend no conecta con MySQL

Revisar:

- `DB_HOST=mysql`;
- estado del contenedor MySQL;
- healthcheck;
- logs de MySQL;
- que el volumen no tenga datos antiguos incompatibles.

### Los cambios de `schema.sql` o `seeds.sql` no aparecen

MySQL solo ejecuta los scripts iniciales cuando el volumen esta vacio. Para recargar desde cero:

```bash
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up -d --build
```

### Rutas internas dan error al recargar

Con `HashRouter`, las rutas deben llevar `#/`. Ejemplo correcto:

```text
http://IP_PUBLICA_EC2:5174/#/design
```

Si se usara BrowserRouter haria falta configurar el servidor, pero este proyecto usa HashRouter precisamente para evitar ese problema en despliegues sencillos.

### MySQL expuesto publicamente

No abrir `3307` salvo que sea imprescindible. La app funciona sin exponer MySQL porque backend y MySQL se comunican dentro de la red Docker.

## Riesgos Comunes

- Dejar contrasenas y `JWT_SECRET` de desarrollo en una demo publica.
- Abrir SSH a `0.0.0.0/0`.
- Abrir MySQL a todo internet.
- Olvidar cambiar `VITE_API_URL`.
- Borrar el volumen con `down -v` y perder datos.
- Pensar que HTTP y HTTPS son lo mismo: esta guia usa HTTP.

## Resumen Rapido

```bash
ssh -i "tu-clave.pem" ubuntu@IP_PUBLICA_EC2

sudo apt update
sudo apt upgrade -y
sudo apt install docker.io docker-compose-v2 git -y
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ubuntu

# cerrar sesion y volver a entrar

git clone -b feat/review-v3 https://github.com/Key-Claw/squarestruct-app.git
cd squarestruct-app

nano docker/docker-compose.yml
# Cambiar VITE_API_URL a http://IP_PUBLICA_EC2:3001/api

docker compose -f docker/docker-compose.yml up -d --build
docker compose -f docker/docker-compose.yml ps
```

URLs finales:

```text
Frontend: http://IP_PUBLICA_EC2:5174
Backend:  http://IP_PUBLICA_EC2:3001/api/health
DB check: http://IP_PUBLICA_EC2:3001/api/db-status
```

## Como Defenderlo

La idea principal es que EC2 aporta la maquina, Docker Compose levanta los servicios y SquareStruct mantiene separadas sus capas. Es un despliegue sencillo, suficiente para DAW1 y coherente con el codigo real.
