-- Consultas utiles para comprobar la base de datos de SquareStruct.

-- 1. Catalogo completo con proveedor, material y dimensiones.
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

-- 2. Productos visibles como bloques.
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

-- 3. Productos visibles como pilares o columnas.
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

-- 4. Productos por material.
SELECT
  material,
  COUNT(*) AS totalProductos,
  MIN(precio) AS precioMinimo,
  MAX(precio) AS precioMaximo,
  ROUND(AVG(precio), 2) AS precioMedio
FROM productos
GROUP BY material
ORDER BY totalProductos DESC;

-- 5. Productos por proveedor y tipo.
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

-- 6. Calcular volumen de cada producto en cm3.
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

-- 7. Productos ordenados por precio.
SELECT
  idProducto,
  nombre,
  tipo,
  material,
  precio
FROM productos
ORDER BY precio DESC;

-- 8. Pedidos con usuario.
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

-- 9. Detalle completo de pedidos.
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

-- 10. Comprobar si el total guardado de cada pedido cuadra con sus detalles.
SELECT
  pe.idPedido,
  pe.total AS totalGuardado,
  COALESCE(SUM(pd.cantidad * pd.precioUnitario), 0) AS totalCalculado,
  pe.total - COALESCE(SUM(pd.cantidad * pd.precioUnitario), 0) AS diferencia
FROM pedidos pe
LEFT JOIN pedidoDetalles pd ON pe.idPedido = pd.idPedido
GROUP BY pe.idPedido, pe.total
ORDER BY pe.idPedido;

-- 11. Proveedores registrados y productos asociados.
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

-- 12. Consulta base para la pagina Catalogo.
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
