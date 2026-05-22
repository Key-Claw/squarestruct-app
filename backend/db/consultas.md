# Consultas SquareStruct

## Objetivo

Archivo de consultas SQL para comprobar y validar la base de datos de SquareStruct.

Permite:
- verificar integridad
- comprobar relaciones
- validar datos
- realizar demostraciones técnicas
- apoyar la defensa del proyecto

---

## Orden recomendado

```text
Opción operativa:
1. backend/db/schema.sql
2. backend/db/seeds.sql
3. backend/db/consultas.md

Opción académica:
1. backend/db/script.sql
2. backend/db/consultas.md
```

---

## Consultas recomendadas para demo

```text
1, 6, 16, 23, 29, 31, 41, 42, 54, 60, 65, 68, 73 y 74
```

---

# 1. Catálogo y productos

## 1. Catálogo completo.

```sql
SELECT
  p.idProducto,
  p.nombre,
  p.tipo,
  p.material,
  p.precio,
  pr.nombreEmpresa AS proveedor
FROM productos p
JOIN proveedores pr
ON p.idProveedor = pr.idProveedor
ORDER BY p.nombre;
```

## 2. Productos tipo bloque.

```sql
SELECT *
FROM productos
WHERE tipo = 'bloque';
```

## 3. Productos tipo pilar.

```sql
SELECT *
FROM productos
WHERE tipo = 'pilar';
```

## 4. Productos de hormigón.

```sql
SELECT *
FROM productos
WHERE material = 'Hormigon';
```

## 5. Productos ecológicos.

```sql
SELECT *
FROM productos
WHERE material = 'Plastico reciclable';
```

---

# 2. Usuarios y proveedores

## 6. Usuarios registrados.

```sql
SELECT
  idUsuario,
  nombre,
  email,
  rol
FROM usuarios;
```

## 7. Usuarios administradores.

```sql
SELECT *
FROM usuarios
WHERE rol = 'admin';
```

## 8. Proveedores validados.

```sql
SELECT *
FROM proveedores
WHERE validado = TRUE;
```

---

# 3. Cálculos y estadísticas

## 9. Volumen de productos.

```sql
SELECT
  nombre,
  alto,
  ancho,
  largo,
  (alto * ancho * largo) AS volumenCm3
FROM productos;
```

## 10. Precio medio de productos.

```sql
SELECT
  ROUND(AVG(precio), 2) AS precioMedio
FROM productos;
```

## 11. Productos por material.

```sql
SELECT
  material,
  COUNT(*) AS totalProductos
FROM productos
GROUP BY material;
```

## 12. Productos por tipo.

```sql
SELECT
  tipo,
  COUNT(*) AS totalProductos
FROM productos
GROUP BY tipo;
```

---

# 4. Pedidos y ventas

## 13. Pedidos registrados.

```sql
SELECT *
FROM pedidos;
```

## 14. Pedidos con usuario asociado.

```sql
SELECT
  pe.idPedido,
  u.nombre,
  pe.total,
  pe.estado
FROM pedidos pe
JOIN usuarios u
ON pe.idUsuario = u.idUsuario;
```

## 15. Detalle completo de pedidos.

```sql
SELECT
  pe.idPedido,
  u.nombre AS usuario,
  p.nombre AS producto,
  pd.cantidad,
  pd.precioUnitario
FROM pedidoDetalles pd
JOIN pedidos pe ON pd.idPedido = pe.idPedido
JOIN usuarios u ON pe.idUsuario = u.idUsuario
JOIN productos p ON pd.idProducto = p.idProducto;
```

## 16. Facturación total.

```sql
SELECT
  COALESCE(SUM(total), 0) AS facturacionTotal
FROM pedidos;
```

## 17. Productos más vendidos.

```sql
SELECT
  p.nombre,
  SUM(pd.cantidad) AS unidadesVendidas
FROM pedidoDetalles pd
JOIN productos p
ON pd.idProducto = p.idProducto
GROUP BY p.nombre
ORDER BY unidadesVendidas DESC;
```

---

# 5. Integridad y comprobaciones

## 18. Comprobar emails duplicados.

```sql
SELECT
  email,
  COUNT(*) AS vecesRepetido
FROM usuarios
GROUP BY email
HAVING COUNT(*) > 1;
```

## 19. Comprobar pedidos sin detalles.

```sql
SELECT
  pe.idPedido
FROM pedidos pe
LEFT JOIN pedidoDetalles pd
ON pe.idPedido = pd.idPedido
WHERE pd.idPedido IS NULL;
```

## 20. Verificar totales de pedidos.

```sql
SELECT
  pe.idPedido,
  pe.total AS totalGuardado,
  SUM(pd.cantidad * pd.precioUnitario) AS totalCalculado
FROM pedidos pe
JOIN pedidoDetalles pd
ON pe.idPedido = pd.idPedido
GROUP BY pe.idPedido;
```

---

# 6. Panel administrador

## 21. Resumen general.

```sql
SELECT
  (SELECT COUNT(*) FROM usuarios) AS totalUsuarios,
  (SELECT COUNT(*) FROM proveedores) AS totalProveedores,
  (SELECT COUNT(*) FROM productos) AS totalProductos,
  (SELECT COUNT(*) FROM pedidos) AS totalPedidos;
```

## 22. Facturación por usuario.

```sql
SELECT
  u.nombre,
  COALESCE(SUM(pe.total), 0) AS facturacion
FROM usuarios u
LEFT JOIN pedidos pe
ON u.idUsuario = pe.idUsuario
GROUP BY u.nombre
ORDER BY facturacion DESC;
```

---

# 7. Diseño 3D y presupuestos

## 23. Presupuesto simulado.

```sql
SELECT
  nombre,
  precio,
  10 AS cantidad,
  ROUND(precio * 10, 2) AS subtotal
FROM productos;
```

## 24. Volumen total utilizado.

```sql
SELECT
  p.nombre,
  SUM(pd.cantidad * p.alto * p.ancho * p.largo) AS volumenTotalCm3
FROM pedidoDetalles pd
JOIN productos p
ON pd.idProducto = p.idProducto
GROUP BY p.nombre;
```

---

# 8. Propuesta conceptual v3 - Planos

> Nota: las siguientes consultas solo funcionan utilizando `script.sql`.
> La tabla `planos` forma parte de una propuesta conceptual v3 y actualmente no está integrada en backend, frontend ni API REST.

## 25. Consultar planos registrados.

```sql
SELECT
  idPlano,
  nombre,
  metrosCuadrados,
  precioEstimado
FROM planos;
```

## 26. Planos asociados a usuarios.

```sql
SELECT
  pl.nombre AS plano,
  u.nombre AS usuario,
  pl.precioEstimado
FROM planos pl
JOIN usuarios u
ON pl.idUsuario = u.idUsuario;
```

## 27. Precio medio de planos.

```sql
SELECT
  ROUND(AVG(precioEstimado), 2) AS precioMedio
FROM planos;
```