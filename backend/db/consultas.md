# Consultas SquareStruct

## Objetivo

Este archivo recoge consultas utiles para comprobar la base de datos de SquareStruct.

Sirve para validar que los datos son coherentes, explicar el modelo en una presentacion y comprobar la integridad entre usuarios, proveedores, productos, pedidos y detalles de pedido.

## Orden recomendado

```text
1. backend/db/schema.sql
2. backend/db/seeds.sql
3. backend/db/consultas.md
```

## Consultas recomendadas para demo

```text
1, 16, 23, 29, 31, 42, 54, 60, 65, 68, 73 y 74
```

## 1. Select basico, alias y ordenacion

### 1. Catalogo completo con proveedor, material y dimensiones.

```sql
SELECT
  p.idProducto,
  p.nombre,
  p.tipo,
  p.material,
  p.precio,
  p.alto,
  p.ancho,
  p.largo,
  pr.nombreEmpresa AS proveedor,
  pr.categoria AS categoriaProveedor,
  pr.sitioWeb AS sitioWebProveedor
FROM productos p
JOIN proveedores pr ON p.idProveedor = pr.idProveedor
ORDER BY pr.nombreEmpresa, p.tipo, p.nombre;
```

### 2. Productos visibles como bloques.

```sql
SELECT
  idProducto,
  nombre,
  material,
  precio,
  alto,
  ancho,
  largo
FROM productos
WHERE tipo = 'bloque'
ORDER BY material, precio DESC;
```

### 3. Productos visibles como pilares o columnas.

```sql
SELECT
  idProducto,
  nombre,
  material,
  precio,
  alto,
  ancho,
  largo
FROM productos
WHERE tipo = 'pilar'
ORDER BY material, precio DESC;
```

### 4. Usuarios registrados ordenados por fecha de alta.

```sql
SELECT
  idUsuario,
  nombre,
  primerApellido,
  segundoApellido,
  email,
  rol,
  creadoEn
FROM usuarios
ORDER BY creadoEn DESC;
```

### 5. Proveedores validados.

```sql
SELECT
  idProveedor,
  nombreEmpresa,
  categoria,
  telefono,
  sitioWeb,
  validado
FROM proveedores
WHERE validado = TRUE
ORDER BY nombreEmpresa;
```

## 2. Filtros y operadores

### 6. Productos de hormigon.

```sql
SELECT
  idProducto,
  nombre,
  tipo,
  material,
  precio
FROM productos
WHERE material = 'Hormigon'
ORDER BY precio DESC;
```

### 7. Productos de plastico reciclable.

```sql
SELECT
  idProducto,
  nombre,
  tipo,
  material,
  precio
FROM productos
WHERE material = 'Plastico reciclable'
ORDER BY precio DESC;
```

### 8. Productos con precio entre 100 y 1000 euros.

```sql
SELECT
  idProducto,
  nombre,
  tipo,
  material,
  precio
FROM productos
WHERE precio BETWEEN 100 AND 1000
ORDER BY precio;
```

### 9. Productos cuyo nombre contiene la palabra bloque.

```sql
SELECT
  idProducto,
  nombre,
  tipo,
  material,
  precio
FROM productos
WHERE nombre LIKE '%bloque%'
ORDER BY nombre;
```

### 10. Usuarios administradores.

```sql
SELECT
  idUsuario,
  nombre,
  primerApellido,
  email,
  rol
FROM usuarios
WHERE rol = 'admin'
ORDER BY nombre;
```

### 11. Usuarios normales.

```sql
SELECT
  idUsuario,
  nombre,
  primerApellido,
  email,
  rol
FROM usuarios
WHERE rol = 'usuario'
ORDER BY nombre;
```

### 12. Proveedores sin pagina web registrada.

```sql
SELECT
  idProveedor,
  nombreEmpresa,
  categoria,
  sitioWeb
FROM proveedores
WHERE sitioWeb IS NULL;
```

### 13. Proveedores con telefono informado.

```sql
SELECT
  idProveedor,
  nombreEmpresa,
  telefono
FROM proveedores
WHERE telefono IS NOT NULL
ORDER BY nombreEmpresa;
```

### 14. Pedidos pendientes, pagados o enviados.

```sql
SELECT
  idPedido,
  fecha,
  estado,
  total,
  direccionEnvio,
  metodoPago
FROM pedidos
WHERE estado IN ('pendiente', 'pagado', 'enviado')
ORDER BY fecha DESC;
```

### 15. Pedidos que no estan cancelados.

```sql
SELECT
  idPedido,
  fecha,
  estado,
  total
FROM pedidos
WHERE estado <> 'cancelado'
ORDER BY fecha DESC;
```

## 3. Columnas calculadas y funciones

### 16. Calcular volumen de cada producto en cm3.

```sql
SELECT
  idProducto,
  nombre,
  tipo,
  material,
  alto,
  ancho,
  largo,
  (alto * ancho * largo) AS volumenCm3
FROM productos
ORDER BY volumenCm3 DESC;
```

### 17. Calcular precio con IVA orientativo del 21%.

```sql
SELECT
  idProducto,
  nombre,
  precio,
  ROUND(precio * 1.21, 2) AS precioConIVA
FROM productos
ORDER BY precioConIVA DESC;
```

### 18. Calcular el 10% del precio de cada producto.

```sql
SELECT
  idProducto,
  nombre,
  precio,
  ROUND(precio * 0.10, 2) AS diezPorCiento
FROM productos
ORDER BY precio DESC;
```

### 19. Crear una etiqueta visual para productos.

```sql
SELECT
  idProducto,
  CONCAT(tipo, ' - ', material, ' - ', nombre) AS etiquetaProducto,
  precio
FROM productos
ORDER BY etiquetaProducto;
```

### 20. Longitud del nombre de cada producto.

```sql
SELECT
  idProducto,
  nombre,
  LENGTH(nombre) AS longitudNombre
FROM productos
ORDER BY longitudNombre DESC;
```

### 21. Fecha de pedido en formato dia/mes/anio.

```sql
SELECT
  idPedido,
  DATE_FORMAT(fecha, '%d/%m/%Y') AS fechaFormateada,
  estado,
  total
FROM pedidos
ORDER BY fecha DESC;
```

### 22. Extraer anio y mes de los pedidos.

```sql
SELECT
  idPedido,
  YEAR(fecha) AS anio,
  MONTH(fecha) AS mes,
  estado,
  total
FROM pedidos
ORDER BY anio DESC, mes DESC;
```

## 4. Funciones agregadas

### 23. Precio minimo, maximo y medio de todos los productos.

```sql
SELECT
  MIN(precio) AS precioMinimo,
  MAX(precio) AS precioMaximo,
  ROUND(AVG(precio), 2) AS precioMedio
FROM productos;
```

### 24. Total de productos registrados.

```sql
SELECT
  COUNT(*) AS totalProductos
FROM productos;
```

### 25. Total de usuarios registrados.

```sql
SELECT
  COUNT(*) AS totalUsuarios
FROM usuarios;
```

### 26. Total de proveedores registrados.

```sql
SELECT
  COUNT(*) AS totalProveedores
FROM proveedores;
```

### 27. Importe total vendido segun pedidos.

```sql
SELECT
  COALESCE(SUM(total), 0) AS totalVendido
FROM pedidos
WHERE estado IN ('pagado', 'enviado', 'entregado');
```

### 28. Pedido mas caro y pedido mas barato.

```sql
SELECT
  MIN(total) AS pedidoMinimo,
  MAX(total) AS pedidoMaximo,
  ROUND(AVG(total), 2) AS pedidoMedio
FROM pedidos;
```

## 5. Agrupaciones

### 29. Productos por material.

```sql
SELECT
  material,
  COUNT(*) AS totalProductos,
  MIN(precio) AS precioMinimo,
  MAX(precio) AS precioMaximo,
  ROUND(AVG(precio), 2) AS precioMedio
FROM productos
GROUP BY material
ORDER BY totalProductos DESC;
```

### 30. Productos por tipo.

```sql
SELECT
  tipo,
  COUNT(*) AS totalProductos,
  ROUND(AVG(precio), 2) AS precioMedio
FROM productos
GROUP BY tipo
ORDER BY totalProductos DESC;
```

### 31. Productos por proveedor y tipo.

```sql
SELECT
  pr.nombreEmpresa AS proveedor,
  pr.categoria AS categoriaProveedor,
  p.tipo,
  p.material,
  COUNT(*) AS totalProductos
FROM productos p
JOIN proveedores pr ON p.idProveedor = pr.idProveedor
GROUP BY pr.nombreEmpresa, pr.categoria, p.tipo, p.material
ORDER BY pr.nombreEmpresa, p.tipo;
```

### 32. Pedidos por estado.

```sql
SELECT
  estado,
  COUNT(*) AS totalPedidos,
  COALESCE(SUM(total), 0) AS importeTotal
FROM pedidos
GROUP BY estado
ORDER BY totalPedidos DESC;
```

### 33. Pedidos por metodo de pago.

```sql
SELECT
  metodoPago,
  COUNT(*) AS totalPedidos,
  COALESCE(SUM(total), 0) AS importeTotal
FROM pedidos
GROUP BY metodoPago
ORDER BY importeTotal DESC;
```

### 34. Usuarios por rol.

```sql
SELECT
  rol,
  COUNT(*) AS totalUsuarios
FROM usuarios
GROUP BY rol
ORDER BY totalUsuarios DESC;
```

### 35. Pedidos por mes y anio.

```sql
SELECT
  YEAR(fecha) AS anio,
  MONTH(fecha) AS mes,
  COUNT(*) AS totalPedidos,
  COALESCE(SUM(total), 0) AS importeTotal
FROM pedidos
GROUP BY YEAR(fecha), MONTH(fecha)
ORDER BY anio DESC, mes DESC;
```

## 6. Filtros sobre agrupaciones

### 36. Materiales con mas de un producto.

```sql
SELECT
  material,
  COUNT(*) AS totalProductos
FROM productos
GROUP BY material
HAVING COUNT(*) > 1
ORDER BY totalProductos DESC;
```

### 37. Proveedores con mas de un producto.

```sql
SELECT
  pr.nombreEmpresa AS proveedor,
  COUNT(p.idProducto) AS totalProductos
FROM proveedores pr
JOIN productos p ON pr.idProveedor = p.idProveedor
GROUP BY pr.nombreEmpresa
HAVING COUNT(p.idProducto) > 1
ORDER BY totalProductos DESC;
```

### 38. Tipos de producto cuyo precio medio supera 100 euros.

```sql
SELECT
  tipo,
  ROUND(AVG(precio), 2) AS precioMedio
FROM productos
GROUP BY tipo
HAVING AVG(precio) > 100
ORDER BY precioMedio DESC;
```

### 39. Usuarios con mas de un pedido.

```sql
SELECT
  u.idUsuario,
  u.nombre,
  u.primerApellido,
  COUNT(pe.idPedido) AS totalPedidos
FROM usuarios u
JOIN pedidos pe ON u.idUsuario = pe.idUsuario
GROUP BY u.idUsuario, u.nombre, u.primerApellido
HAVING COUNT(pe.idPedido) > 1
ORDER BY totalPedidos DESC;
```

### 40. Proveedores cuyo catalogo supera 1000 euros de valor total.

```sql
SELECT
  pr.nombreEmpresa AS proveedor,
  SUM(p.precio) AS valorCatalogo
FROM proveedores pr
JOIN productos p ON pr.idProveedor = p.idProveedor
GROUP BY pr.nombreEmpresa
HAVING SUM(p.precio) > 1000
ORDER BY valorCatalogo DESC;
```

## 7. Relaciones con JOIN

### 41. Pedidos con usuario.

```sql
SELECT
  pe.idPedido,
  pe.fecha,
  pe.estado,
  pe.total,
  u.nombre AS usuario,
  u.email,
  pe.direccionEnvio,
  pe.metodoPago
FROM pedidos pe
JOIN usuarios u ON pe.idUsuario = u.idUsuario
ORDER BY pe.fecha DESC;
```

### 42. Detalle completo de pedidos.

```sql
SELECT
  pe.idPedido,
  pe.fecha,
  u.nombre AS usuario,
  p.nombre AS producto,
  p.tipo,
  p.material,
  pr.nombreEmpresa AS proveedor,
  pd.cantidad,
  pd.precioUnitario,
  (pd.cantidad * pd.precioUnitario) AS subtotal
FROM pedidoDetalles pd
JOIN pedidos pe ON pd.idPedido = pe.idPedido
JOIN usuarios u ON pe.idUsuario = u.idUsuario
JOIN productos p ON pd.idProducto = p.idProducto
JOIN proveedores pr ON p.idProveedor = pr.idProveedor
ORDER BY pe.idPedido, p.nombre;
```

### 43. Proveedores registrados y productos asociados.

```sql
SELECT
  pr.idProveedor,
  pr.nombreEmpresa,
  pr.categoria,
  pr.telefono,
  pr.sitioWeb,
  pr.validado,
  COUNT(p.idProducto) AS totalProductos
FROM proveedores pr
LEFT JOIN productos p ON pr.idProveedor = p.idProveedor
GROUP BY pr.idProveedor, pr.nombreEmpresa, pr.categoria, pr.telefono, pr.sitioWeb, pr.validado
ORDER BY pr.nombreEmpresa;
```

### 44. Usuarios y sus pedidos, incluyendo usuarios sin pedidos.

```sql
SELECT
  u.idUsuario,
  u.nombre,
  u.primerApellido,
  u.email,
  COUNT(pe.idPedido) AS totalPedidos,
  COALESCE(SUM(pe.total), 0) AS importeTotal
FROM usuarios u
LEFT JOIN pedidos pe ON u.idUsuario = pe.idUsuario
GROUP BY u.idUsuario, u.nombre, u.primerApellido, u.email
ORDER BY importeTotal DESC;
```

### 45. Productos que nunca han sido pedidos.

```sql
SELECT
  p.idProducto,
  p.nombre,
  p.tipo,
  p.material,
  p.precio
FROM productos p
LEFT JOIN pedidoDetalles pd ON p.idProducto = pd.idProducto
WHERE pd.idProducto IS NULL
ORDER BY p.nombre;
```

### 46. Proveedores sin productos.

```sql
SELECT
  pr.idProveedor,
  pr.nombreEmpresa,
  pr.categoria
FROM proveedores pr
LEFT JOIN productos p ON pr.idProveedor = p.idProveedor
WHERE p.idProducto IS NULL
ORDER BY pr.nombreEmpresa;
```

## 8. Subconsultas

### 47. Productos con precio superior al precio medio.

```sql
SELECT
  idProducto,
  nombre,
  tipo,
  material,
  precio
FROM productos
WHERE precio > (
  SELECT AVG(precio)
  FROM productos
)
ORDER BY precio DESC;
```

### 48. Producto o productos mas caros.

```sql
SELECT
  idProducto,
  nombre,
  tipo,
  material,
  precio
FROM productos
WHERE precio = (
  SELECT MAX(precio)
  FROM productos
);
```

### 49. Usuarios que han realizado algun pedido.

```sql
SELECT
  idUsuario,
  nombre,
  primerApellido,
  email
FROM usuarios
WHERE idUsuario IN (
  SELECT idUsuario
  FROM pedidos
);
```

### 50. Usuarios que no han realizado ningun pedido.

```sql
SELECT
  idUsuario,
  nombre,
  primerApellido,
  email
FROM usuarios
WHERE idUsuario NOT IN (
  SELECT idUsuario
  FROM pedidos
);
```

### 51. Productos del proveedor con mas productos.

```sql
SELECT
  p.idProducto,
  p.nombre,
  p.tipo,
  p.material,
  p.precio,
  p.idProveedor
FROM productos p
WHERE p.idProveedor = (
  SELECT idProveedor
  FROM productos
  GROUP BY idProveedor
  ORDER BY COUNT(*) DESC
  LIMIT 1
);
```

### 52. Pedidos cuyo total es mayor que la media de todos los pedidos.

```sql
SELECT
  idPedido,
  fecha,
  estado,
  total
FROM pedidos
WHERE total > (
  SELECT AVG(total)
  FROM pedidos
)
ORDER BY total DESC;
```

### 53. Proveedores que tienen productos mas caros que la media general.

```sql
SELECT
  pr.idProveedor,
  pr.nombreEmpresa,
  pr.categoria
FROM proveedores pr
WHERE pr.idProveedor IN (
  SELECT p.idProveedor
  FROM productos p
  WHERE p.precio > (
    SELECT AVG(precio)
    FROM productos
  )
)
ORDER BY pr.nombreEmpresa;
```

## 9. Comprobacion de integridad

### 54. Comprobar si el total guardado de cada pedido cuadra con sus detalles.

```sql
SELECT
  pe.idPedido,
  pe.total AS totalGuardado,
  COALESCE(SUM(pd.cantidad * pd.precioUnitario), 0) AS totalCalculado,
  pe.total - COALESCE(SUM(pd.cantidad * pd.precioUnitario), 0) AS diferencia
FROM pedidos pe
LEFT JOIN pedidoDetalles pd ON pe.idPedido = pd.idPedido
GROUP BY pe.idPedido, pe.total
ORDER BY pe.idPedido;
```

### 55. Mostrar solo pedidos cuyo total no cuadra.

```sql
SELECT
  pe.idPedido,
  pe.total AS totalGuardado,
  COALESCE(SUM(pd.cantidad * pd.precioUnitario), 0) AS totalCalculado,
  pe.total - COALESCE(SUM(pd.cantidad * pd.precioUnitario), 0) AS diferencia
FROM pedidos pe
LEFT JOIN pedidoDetalles pd ON pe.idPedido = pd.idPedido
GROUP BY pe.idPedido, pe.total
HAVING diferencia <> 0
ORDER BY pe.idPedido;
```

### 56. Comprobar emails duplicados.

```sql
SELECT
  email,
  COUNT(*) AS vecesRepetido
FROM usuarios
GROUP BY email
HAVING COUNT(*) > 1;
```

### 57. Comprobar productos duplicados por nombre, tipo, material y proveedor.

```sql
SELECT
  nombre,
  tipo,
  material,
  idProveedor,
  COUNT(*) AS vecesRepetido
FROM productos
GROUP BY nombre, tipo, material, idProveedor
HAVING COUNT(*) > 1;
```

### 58. Comprobar pedidos sin detalles.

```sql
SELECT
  pe.idPedido,
  pe.fecha,
  pe.estado,
  pe.total
FROM pedidos pe
LEFT JOIN pedidoDetalles pd ON pe.idPedido = pd.idPedido
WHERE pd.idPedido IS NULL;
```

### 59. Comprobar detalles con cantidad o precio unitario incorrecto.

```sql
SELECT
  idPedido,
  idProducto,
  cantidad,
  precioUnitario
FROM pedidoDetalles
WHERE cantidad <= 0
   OR precioUnitario < 0;
```

## 10. Catalogo y frontend

### 60. Consulta base para la pagina Catalogo.

```sql
SELECT
  p.idProducto,
  p.nombre,
  p.descripcion,
  p.tipo,
  p.material,
  p.precio,
  p.alto,
  p.ancho,
  p.largo,
  pr.nombreEmpresa AS proveedor,
  pr.categoria AS categoriaProveedor,
  pr.sitioWeb AS sitioWebProveedor
FROM productos p
JOIN proveedores pr ON p.idProveedor = pr.idProveedor
ORDER BY p.idProducto DESC;
```

### 61. Consulta para filtros de catalogo por tipo y material.

```sql
SELECT
  p.idProducto,
  p.nombre,
  p.tipo,
  p.material,
  p.precio,
  pr.nombreEmpresa AS proveedor
FROM productos p
JOIN proveedores pr ON p.idProveedor = pr.idProveedor
WHERE p.tipo = 'bloque'
  AND p.material = 'Hormigon'
ORDER BY p.precio DESC;
```

### 62. Consulta para mostrar productos baratos primero.

```sql
SELECT
  idProducto,
  nombre,
  tipo,
  material,
  precio
FROM productos
ORDER BY precio ASC;
```

### 63. Consulta para mostrar productos premium primero.

```sql
SELECT
  idProducto,
  nombre,
  tipo,
  material,
  precio
FROM productos
ORDER BY precio DESC;
```

### 64. Buscador simple por nombre o descripcion.

```sql
SELECT
  idProducto,
  nombre,
  descripcion,
  tipo,
  material,
  precio
FROM productos
WHERE nombre LIKE '%modular%'
   OR descripcion LIKE '%modular%'
ORDER BY nombre;
```

## 11. Panel admin

### 65. Resumen general del panel admin.

```sql
SELECT
  (SELECT COUNT(*) FROM usuarios) AS totalUsuarios,
  (SELECT COUNT(*) FROM proveedores) AS totalProveedores,
  (SELECT COUNT(*) FROM productos) AS totalProductos,
  (SELECT COUNT(*) FROM pedidos) AS totalPedidos,
  (SELECT COALESCE(SUM(total), 0) FROM pedidos) AS facturacionTotal;
```

### 66. Facturacion por usuario.

```sql
SELECT
  u.idUsuario,
  u.nombre,
  u.primerApellido,
  u.email,
  COUNT(pe.idPedido) AS totalPedidos,
  COALESCE(SUM(pe.total), 0) AS facturacionUsuario
FROM usuarios u
LEFT JOIN pedidos pe ON u.idUsuario = pe.idUsuario
GROUP BY u.idUsuario, u.nombre, u.primerApellido, u.email
ORDER BY facturacionUsuario DESC;
```

### 67. Facturacion por proveedor.

```sql
SELECT
  pr.idProveedor,
  pr.nombreEmpresa,
  pr.categoria,
  COALESCE(SUM(pd.cantidad * pd.precioUnitario), 0) AS facturacionProveedor
FROM proveedores pr
LEFT JOIN productos p ON pr.idProveedor = p.idProveedor
LEFT JOIN pedidoDetalles pd ON p.idProducto = pd.idProducto
GROUP BY pr.idProveedor, pr.nombreEmpresa, pr.categoria
ORDER BY facturacionProveedor DESC;
```

### 68. Productos mas vendidos por unidades.

```sql
SELECT
  p.idProducto,
  p.nombre,
  p.tipo,
  p.material,
  COALESCE(SUM(pd.cantidad), 0) AS unidadesVendidas
FROM productos p
LEFT JOIN pedidoDetalles pd ON p.idProducto = pd.idProducto
GROUP BY p.idProducto, p.nombre, p.tipo, p.material
ORDER BY unidadesVendidas DESC;
```

### 69. Productos que generan mas facturacion.

```sql
SELECT
  p.idProducto,
  p.nombre,
  p.tipo,
  p.material,
  COALESCE(SUM(pd.cantidad * pd.precioUnitario), 0) AS facturacionProducto
FROM productos p
LEFT JOIN pedidoDetalles pd ON p.idProducto = pd.idProducto
GROUP BY p.idProducto, p.nombre, p.tipo, p.material
ORDER BY facturacionProducto DESC;
```

### 70. Tendencia de compra por mes.

```sql
SELECT
  YEAR(fecha) AS anio,
  MONTH(fecha) AS mes,
  COUNT(*) AS totalPedidos,
  COALESCE(SUM(total), 0) AS facturacionMensual
FROM pedidos
GROUP BY YEAR(fecha), MONTH(fecha)
ORDER BY anio DESC, mes DESC;
```

### 71. Estados de pedido para grafico circular.

```sql
SELECT
  estado,
  COUNT(*) AS totalPedidos
FROM pedidos
GROUP BY estado
ORDER BY totalPedidos DESC;
```

### 72. Metodos de pago mas usados.

```sql
SELECT
  metodoPago,
  COUNT(*) AS totalUsos
FROM pedidos
GROUP BY metodoPago
ORDER BY totalUsos DESC;
```

## 12. Diseno 3D y presupuesto

### 73. Calcular presupuesto de ejemplo usando cantidades manuales.

```sql
SELECT
  p.idProducto,
  p.nombre,
  p.tipo,
  p.material,
  p.precio,
  10 AS cantidadSimulada,
  ROUND(p.precio * 10, 2) AS subtotalSimulado
FROM productos p
ORDER BY subtotalSimulado DESC;
```

### 74. Calcular volumen total de productos usados en pedidos.

```sql
SELECT
  p.nombre,
  p.tipo,
  p.material,
  SUM(pd.cantidad) AS unidades,
  SUM(pd.cantidad * p.alto * p.ancho * p.largo) AS volumenTotalCm3
FROM pedidoDetalles pd
JOIN productos p ON pd.idProducto = p.idProducto
GROUP BY p.nombre, p.tipo, p.material
ORDER BY volumenTotalCm3 DESC;
```

### 75. Calcular coste medio por tipo de pieza.

```sql
SELECT
  tipo,
  ROUND(AVG(precio), 2) AS costeMedio,
  MIN(precio) AS costeMinimo,
  MAX(precio) AS costeMaximo
FROM productos
GROUP BY tipo;
```

### 76. Material mas usado en pedidos.

```sql
SELECT
  p.material,
  SUM(pd.cantidad) AS unidadesVendidas
FROM pedidoDetalles pd
JOIN productos p ON pd.idProducto = p.idProducto
GROUP BY p.material
ORDER BY unidadesVendidas DESC;
```
