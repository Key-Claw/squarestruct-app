-- Consultas útiles para comprobar la base de datos de SquareStruct

-- 1. Ver todos los productos con proveedor
SELECT 
  p.idProducto,
  p.nombre,
  p.tipo,
  p.precio,
  p.stock,
  p.alto,
  p.ancho,
  p.largo,
  pr.nombreEmpresa AS proveedor
FROM productos p
JOIN proveedores pr ON p.idProveedor = pr.idProveedor;

-- 2. Ver solo bloques
SELECT *
FROM productos
WHERE tipo = 'bloque';

-- 3. Ver solo pilares
SELECT *
FROM productos
WHERE tipo = 'pilar';

-- 4. Calcular volumen de cada producto en cm3
SELECT 
  nombre,
  tipo,
  alto,
  ancho,
  largo,
  (alto * ancho * largo) AS volumenCm3
FROM productos;

-- 5. Productos con stock bajo
SELECT 
  nombre,
  tipo,
  stock
FROM productos
WHERE stock < 50;

-- 6. Ver pedidos con usuario
SELECT 
  pe.idPedido,
  pe.fecha,
  pe.estado,
  pe.total,
  u.nombre AS cliente,
  pe.direccionEnvio,
  pe.metodoPago
FROM pedidos pe
JOIN usuarios u ON pe.idUsuario = u.idUsuario;

-- 7. Ver detalle completo de pedidos
SELECT 
  pe.idPedido,
  u.nombre AS cliente,
  p.nombre AS producto,
  pd.cantidad,
  pd.precioUnitario,
  (pd.cantidad * pd.precioUnitario) AS subtotal
FROM pedidoDetalles pd
JOIN pedidos pe ON pd.idPedido = pe.idPedido
JOIN usuarios u ON pe.idUsuario = u.idUsuario
JOIN productos p ON pd.idProducto = p.idProducto;

-- 8. Calcular total real de cada pedido según sus detalles
SELECT 
  pe.idPedido,
  pe.total AS totalGuardado,
  SUM(pd.cantidad * pd.precioUnitario) AS totalCalculado
FROM pedidos pe
JOIN pedidoDetalles pd ON pe.idPedido = pd.idPedido
GROUP BY pe.idPedido, pe.total;

-- 9. Productos ordenados por precio
SELECT 
  nombre,
  tipo,
  precio
FROM productos
ORDER BY precio DESC;

-- 10. Número de productos por tipo
SELECT 
  tipo,
  COUNT(*) AS totalProductos
FROM productos
GROUP BY tipo;