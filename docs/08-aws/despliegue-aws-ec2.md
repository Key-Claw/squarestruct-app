# Despliegue En AWS EC2

Este documento explica, paso a paso, cómo desplegar SquareStruct en una sola instancia EC2 de AWS usando la rama `dev` como referencia funcional y la issue #62 como contexto de despliegue.

La guía está adaptada al estado real del repositorio y a su configuración actual:

- frontend React + Vite;
- backend Express;
- base de datos MySQL 8.4 en Docker;
- Docker Compose como forma principal de despliegue;
- acceso público por puertos concretos, no mediante Nginx ni un balanceador externo.

## Qué Se Despliega

SquareStruct no se despliega como un monolito clásico. En el estado actual del proyecto, la publicación real en EC2 queda montada así:

| Servicio | Contenedor | Puerto interno | Puerto en EC2 | Acceso |
| --- | --- | --- | --- | --- |
| Frontend | `squarestruct-frontend` | `5173` | `5174` | Público |
| Backend | `squarestruct-backend` | `3000` | `3001` | Público |
| MySQL | `squarestruct-mysql` | `3306` | `3307` | Interno en la EC2 |

Puntos clave del código actual:

- el backend arranca con `server.js` y escucha en `PORT=3000` dentro del contenedor;
- el frontend se ejecuta con `npm run dev` dentro del contenedor, así que Vite sirve la app en modo desarrollo;
- la base de datos se inicializa con `backend/db/schema.sql` y `backend/db/seeds.sql`;
- `frontend/src/services/api.js` usa `VITE_API_URL` si existe, o `/api` como respaldo;
- `docker/docker-compose.yml` es la referencia del despliegue completo.

## Lo Que No Hace Falta

Para este despliegue con Docker Compose no necesitas instalar en la EC2:

- Node.js en el host;
- MySQL/MariaDB en el host;
- PM2;
- Nginx;
- Apache;
- RDS;
- S3 o CloudFront.

Todo lo necesario vive dentro de los contenedores.

## Requisitos Previos

Antes de empezar, necesitas:

- una cuenta de AWS activa;
- una clave SSH `.pem` para la instancia;
- acceso al repositorio `https://github.com/Key-Claw/squarestruct-app`;
- una instancia EC2 Linux, preferiblemente Ubuntu LTS;
- un grupo de seguridad con los puertos correctos.

### Puertos Del Security Group

Abre estos puertos de entrada en la EC2:

- `22` para SSH;
- `3001` para el backend;
- `5174` para el frontend.

Opcionalmente, si necesitas conectarte desde fuera a MySQL para depuración, abre también el puerto de host `3307`. No es necesario para el funcionamiento normal de la app y no conviene dejarlo abierto al mundo si no hace falta.

No hace falta abrir `80` y `443` mientras el proyecto se publique con la configuración actual, porque el repositorio no trae un proxy inverso ni un servidor web adicional.

## Crear La EC2

La configuración recomendada para la práctica es:

- sistema operativo: Ubuntu LTS;
- tipo de instancia: `t3.micro` o similar si quieres mantenerte cerca de la capa gratuita;
- almacenamiento: el suficiente para Docker, imágenes y volumen de MySQL;
- par de claves: descarga la `.pem` al crear la instancia.

Cuando lances la instancia, asigna el Security Group con los puertos anteriores.

## Conexión SSH

### Desde Linux O macOS

```bash
chmod 400 tu-clave.pem
ssh -i "tu-clave.pem" ubuntu@IP_PUBLICA_EC2
```

### Desde Windows

Si conectas desde Windows con PowerShell o Windows Terminal, puedes usar directamente:

```powershell
ssh -i C:\ruta\tu-clave.pem ubuntu@IP_PUBLICA_EC2
```

Si OpenSSH te da problemas de permisos con la clave, ajusta los permisos del archivo `.pem` o usa WSL. El objetivo es el mismo: poder entrar por SSH a la EC2.

## Instalar Docker En La EC2

La guía base de la profesora sirve, pero para este proyecto la recomendación más limpia es usar Ubuntu LTS y Docker Compose v2.

### Ubuntu LTS

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io docker-compose-v2 -y
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ubuntu
```

Después de añadir `ubuntu` al grupo `docker`, cierra la sesión SSH y vuelve a entrar para que el cambio de grupo se aplique.

### Amazon Linux 2023

Si elegiste Amazon Linux en lugar de Ubuntu, los comandos equivalentes son:

```bash
sudo dnf update -y
sudo dnf install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user
```

La lógica del despliegue no cambia; solo cambian los comandos del gestor de paquetes y el usuario inicial.

## Clonar El Repositorio

La issue #62 trabaja contra la rama `dev`, así que en la EC2 conviene desplegar esa rama explícitamente.

```bash
git clone -b dev https://github.com/Key-Claw/squarestruct-app.git
cd squarestruct-app
```

Si ya tenías el repositorio clonado y quieres actualizarlo:

```bash
git checkout dev
git pull origin dev
```

## Revisar La Configuración Antes De Levantar Nada

En el estado actual del repositorio, el despliegue depende de `docker/docker-compose.yml`.

Ese fichero levanta tres servicios:

- MySQL con el esquema y los seeds del backend;
- backend Express construido desde `backend/Dockerfile`;
- frontend Vite construido desde `frontend/Dockerfile`.

### Variables Reales Del Compose

En la configuración actual, los valores relevantes son estos:

- backend:
  - `PORT=3000`
  - `DB_HOST=mysql`
  - `DB_PORT=3306`
  - `DB_USER=admin`
  - `DB_PASSWORD=...`
  - `DB_NAME=squarestruct`
  - `JWT_SECRET=...`
  - `NODE_ENV=development`
- frontend:
  - `VITE_API_URL=http://localhost:3001/api`

### Ajuste Imprescindible Para EC2

Aquí está el punto más importante del despliegue público actual:

- `frontend/src/services/api.js` usa la variable `VITE_API_URL`;
- en `docker/docker-compose.yml` esa variable apunta ahora mismo a `http://localhost:3001/api`;
- si dejas ese valor tal cual en una EC2 pública, el navegador del usuario intentará llamar a su propio `localhost`, no al backend de la instancia.

Por tanto, antes de arrancar la aplicación en EC2 debes cambiar esa URL por una dirección accesible desde el navegador, por ejemplo:

```text
http://IP_PUBLICA_EC2:3001/api
```

Si prefieres usar un dominio o una IP elástica, usa ese valor en lugar de la IP pública temporal.

### Cómo Hacer Ese Cambio

La forma más directa es editar `docker/docker-compose.yml` en la EC2 y sustituir el valor de `VITE_API_URL`.

Ejemplo orientativo:

```bash
nano docker/docker-compose.yml
```

Busca la línea:

```text
VITE_API_URL: http://localhost:3001/api
```

Y cámbiala por:

```text
VITE_API_URL: http://IP_PUBLICA_EC2:3001/api
```

### Nota Sobre Secretos

El compose actual lleva credenciales y secretos embebidos para desarrollo. Antes de dejar la instancia expuesta de forma pública, revisa y sustituye, como mínimo:

- `JWT_SECRET`;
- contraseña de MySQL;
- contraseña de root de MySQL, si la mantienes;
- cualquier otro valor que no quieras publicar tal cual.

Para una demo académica puede ser suficiente con la configuración del proyecto, pero para una exposición pública real conviene endurecer esos valores.

## Arrancar La Aplicación

Desde la raíz del repositorio:

```bash
docker compose -f docker/docker-compose.yml up -d --build
```

Qué hace este comando:

- `--build` recompila las imágenes del backend y del frontend;
- `-d` deja los contenedores en segundo plano;
- MySQL se inicializa con `schema.sql` y `seeds.sql` la primera vez que el volumen está vacío.

## Comprobar Que Todo Está Levantado

```bash
docker compose -f docker/docker-compose.yml ps
```

También puedes revisar los logs si algo falla:

```bash
docker compose -f docker/docker-compose.yml logs -f mysql

docker compose -f docker/docker-compose.yml logs -f backend

docker compose -f docker/docker-compose.yml logs -f frontend
```

## Verificación Funcional

Una vez arrancado el stack, comprueba estos puntos desde la EC2 o desde tu navegador local:

### Backend

```text
http://IP_PUBLICA_EC2:3001/api/health
http://IP_PUBLICA_EC2:3001/api/db-status
```

La primera ruta debe responder `OK` y la segunda debe devolver el estado de la base de datos, las tablas y los recuentos.

### Frontend

```text
http://IP_PUBLICA_EC2:5174
```

La app debe cargar con su navegación, catálogo, login y resto de secciones.

### Base De Datos

La base de datos no necesita URL pública para funcionar. Su verificación real es que:

- el contenedor esté activo;
- `db-status` responda correctamente;
- el backend pueda leer usuarios, proveedores, productos, pedidos y detalle de pedidos;
- al reiniciar los contenedores, los datos persistan mientras no borres el volumen.

## Persistencia De Datos

El fichero `docker/docker-compose.yml` usa el volumen:

```text
squarestruct_mysql_data
```

Eso significa que los datos de MySQL persisten entre reinicios normales.

### Reinicio Normal

```bash
docker compose -f docker/docker-compose.yml down
docker compose -f docker/docker-compose.yml up -d --build
```

### Reinicio Limpio

Si quieres borrar la base de datos y volver a cargar esquema y seeds:

```bash
docker compose -f docker/docker-compose.yml down -v
docker compose -f docker/docker-compose.yml up -d --build
```

Usa `down -v` solo cuando quieras reinicializar desde cero.

## Actualizar Una Versión Nueva

Cuando haya cambios en `dev`, el ciclo normal es:

```bash
git pull origin dev
docker compose -f docker/docker-compose.yml up -d --build
```

Si cambiaste variables de entorno o credenciales, conviene bajar primero los contenedores y volver a levantarlos para que Docker recargue la configuración.

## Comandos Útiles De Diagnóstico

### Ver Puertos En Uso En La EC2

```bash
sudo ss -lntp
```

### Entrar En El Contenedor De MySQL

```bash
docker compose -f docker/docker-compose.yml exec mysql mysql -uadmin -p
```

### Consultar Tablas

Dentro del cliente MySQL:

```sql
SHOW TABLES;
SELECT COUNT(*) FROM usuarios;
SELECT COUNT(*) FROM productos;
SELECT COUNT(*) FROM pedidos;
```

### Ver El Estado De Los Contenedores

```bash
docker ps
```

## Qué Esperar Del Proyecto En AWS

Con la configuración actual del repositorio, el resultado esperado es este:

- el frontend queda accesible públicamente en la EC2;
- el backend responde por HTTP en el puerto publicado;
- la base de datos se levanta dentro de Docker y conserva datos en su volumen;
- la app sigue funcionando sin instalar Node ni MySQL en la máquina anfitriona.

## Resumen Rápido

Si solo quieres la secuencia mínima para una demo en EC2, sería esta:

```bash
# 1. SSH a la instancia
ssh -i "tu-clave.pem" ubuntu@IP_PUBLICA_EC2

# 2. Instalar Docker y Compose
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io docker-compose-v2 -y
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ubuntu
# volver a entrar por SSH

# 3. Clonar la rama dev
git clone -b dev https://github.com/Key-Claw/squarestruct-app.git
cd squarestruct-app

# 4. Ajustar VITE_API_URL al backend público de la EC2
# VITE_API_URL=http://IP_PUBLICA_EC2:3001/api

# 5. Levantar servicios
docker compose -f docker/docker-compose.yml up -d --build

# 6. Verificar
docker compose -f docker/docker-compose.yml ps
```

## Nota Final

La rama `dev` y la issue #62 dejan claro que el despliegue objetivo es un entorno completo con frontend, backend y base de datos en una sola EC2. La diferencia importante respecto a un despliegue clásico de producción es que el frontend actual sigue corriendo con Vite en modo desarrollo, así que los puertos públicos reales son `5174` y `3001`.
