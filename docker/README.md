## ♻️ Reinicializar la base de datos tras cambios

Si modificas los scripts de la base de datos (`schema.sql`, `seeds.sql`, etc.), debes reinicializar el volumen de Docker para que los cambios se apliquen:

1. Detén y elimina los contenedores:
	```bash
	docker compose -f docker/docker-compose.yml down
	```
2. Elimina el volumen de datos:
	```bash
	docker volume rm squarestruct_mysql_data
	```
3. Vuelve a levantar los servicios:
	```bash
	docker compose -f docker/docker-compose.yml up -d
	```

Esto recreará la base de datos desde cero con los scripts actualizados.

---
# 🐳 Docker SquareStruct

Contiene la configuración para levantar servicios de infraestructura (MySQL, etc.) usando Docker Compose.

---

## 🚀 Uso rápido

1. Levanta la base de datos:
	```bash
	docker compose -f docker/docker-compose.yml up -d
	```
2. Accede a MySQL en `localhost:3307` (ver credenciales en el compose).
3. Para parar y eliminar:
	```bash
	docker compose -f docker/docker-compose.yml down
	```

---

## 📚 Documentación global

Toda la documentación ampliada está en la carpeta `/docs`.
