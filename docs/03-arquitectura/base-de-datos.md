# 🗄️ Base de datos - SquareStruct

## 🎯 Objetivo

Diseñar una base de datos relacional que permita gestionar de forma estructurada los elementos principales del sistema:

* Usuarios
* Proveedores
* Productos
* Pedidos
* Detalles de pedido

El modelo está pensado para cubrir la MVP actual y permitir futuras ampliaciones como el configurador modular y el cálculo automático de presupuestos.

---

## 📌 Entidades principales

Las entidades del sistema son:

* **usuarios**: clientes que interactúan con la plataforma
* **proveedores**: empresas que ofrecen productos modulares
* **productos**: bloques o piezas de construcción
* **pedidos**: compras realizadas por los usuarios
* **pedidoDetalles**: relación entre pedidos y productos

---

## 🔗 Relaciones principales

* Un usuario puede realizar múltiples pedidos
* Un pedido pertenece a un único usuario
* Un proveedor puede ofrecer múltiples productos
* Un producto pertenece a un proveedor
* Un pedido puede contener múltiples productos
* Un producto puede aparecer en múltiples pedidos

---

# 🧩 Modelo Entidad / Relación (E/R)

## 📌 Representación

> Modelo conceptual del sistema basado en entidades y relaciones.

![Modelo ER](../assets/modelo-er.png)

---

# 🧱 Modelo Relacional

## 📌 Representación

> Modelo lógico basado en tablas y claves.

![Modelo Relacional](../assets/modelo-relacional.png)

---

# 📊 Modelo Relacional - Tablas

## Usuarios

* idUsuario (PK)
* nombre
* email
* contrasena
* rol
* creadoEn

---

## Proveedores

* idProveedor (PK)
* nombreEmpresa
* telefono
* validado
* creadoEn

---

## Productos

* idProducto (PK)
* nombre
* descripcion
* precio
* tipo
* stock
* idProveedor (FK)
* creadoEn

---

## Pedidos

* idPedido (PK)
* fecha
* total
* estado
* direccionEnvio
* metodoPago
* idUsuario (FK)

---

## PedidoDetalles

* idPedido (FK)
* idProducto (FK)
* cantidad
* precioUnitario

---

# 🔁 Flujo de datos del sistema

1. El usuario se registra
2. Inicia sesión
3. Consulta productos
4. Realiza un pedido
5. Se guardan los datos en pedidos y pedidoDetalles

---

# ⚠️ Reglas de negocio

* Un usuario puede tener múltiples pedidos
* Un pedido debe estar asociado a un usuario
* Un producto pertenece a un proveedor
* Un pedido debe contener al menos un producto
* El stock se actualiza tras cada compra
* No se permite eliminar productos asociados a pedidos

---

# 🧪 Scripts del proyecto

Ubicación:

/backend/db/

* schema.sql → creación de tablas
* seeds.sql → datos de prueba

---

# 🧠 Justificación del diseño

Se ha optado por un modelo relacional porque permite representar de forma clara las relaciones entre usuarios, productos y pedidos.

La tabla **pedidoDetalles** permite resolver la relación muchos a muchos entre pedidos y productos, garantizando integridad referencial.

---

# ✅ Conclusión

El diseño de la base de datos permite cubrir todas las necesidades de la MVP y deja preparada la base para futuras funcionalidades del sistema.
