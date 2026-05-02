-- Seeds para la base de datos de la tienda online de bloques modulares

-- Limpieza para permitir re-ejecutar este archivo sin errores de duplicados
DELETE FROM pedidoDetalles;
DELETE FROM pedidos;
DELETE FROM productos;
DELETE FROM usuarios;
DELETE FROM proveedores;

ALTER TABLE pedidoDetalles AUTO_INCREMENT = 1;
ALTER TABLE pedidos AUTO_INCREMENT = 1;
ALTER TABLE productos AUTO_INCREMENT = 1;
ALTER TABLE usuarios AUTO_INCREMENT = 1;
ALTER TABLE proveedores AUTO_INCREMENT = 1;

-- Proveedores
INSERT INTO proveedores (nombreEmpresa, telefono, validado)
VALUES
  ('ByFusion', '+13105551234', TRUE);

-- Usuarios
INSERT INTO usuarios (nombre, email, contrasena, rol)
VALUES
  ('Admin', 'admin@squarestruct.com', '$2b$10$hashadmin', 'admin'),
  ('Juan Pérez', 'juan.perez@email.com', '$2b$10$hashjuan', 'cliente'),
  ('Ana Gómez', 'ana.gomez@email.com', '$2b$10$hashana', 'cliente');

-- Productos
INSERT INTO productos (nombre, descripcion, precio, tipo, stock, alto, ancho, largo, idProveedor)
VALUES
  ('Bloque byfusion 300', 'Bloque modular pequeño para ajustes, esquinas y remates de muros.', 24.90, 'bloque', 120, 30, 30, 30, 1),
  ('Bloque byfusion 600', 'Bloque modular estándar para levantar muros de viviendas por piezas ensamblables.', 39.90, 'bloque', 180, 30, 30, 60, 1),
  ('Bloque byfusion 900', 'Bloque modular largo para avanzar más rápido en tramos rectos de pared.', 54.90, 'bloque', 150, 30, 30, 90, 1),
  ('Bloque byfusion esquina', 'Bloque modular para reforzar esquinas y encuentros entre muros.', 44.90, 'bloque', 100, 30, 30, 30, 1),
  ('Bloque byfusion medio', 'Bloque modular intermedio para adaptar medidas y cerrar tramos de pared.', 32.90, 'bloque', 130, 30, 30, 45, 1),
  ('Bloque byfusion remate', 'Bloque modular de remate para ajustes finales en el montaje.', 29.90, 'bloque', 90, 30, 30, 30, 1),
  ('Pilar byfusion 120', 'Pilar modular vertical para refuerzo de esquinas o zonas estructurales bajas.', 69.90, 'pilar', 45, 120, 30, 30, 1),
  ('Pilar byfusion 180', 'Pilar modular vertical para refuerzo de muros y zonas de carga media.', 89.90, 'pilar', 40, 180, 30, 30, 1),
  ('Pilar byfusion 240', 'Pilar modular vertical de altura completa para esquinas, entradas o zonas de mayor carga.', 109.90, 'pilar', 35, 240, 30, 30, 1);

-- Pedidos
INSERT INTO pedidos (fecha, total, estado, direccionEnvio, metodoPago, idUsuario)
VALUES
  ('2026-04-20 10:00:00', 51.00, 'pagado', 'Calle Falsa 123, Madrid', 'tarjeta', 2),
  ('2026-04-21 12:30:00', 40.00, 'pendiente', 'Av. Central 456, Barcelona', 'paypal', 3);

-- PedidoDetalles
INSERT INTO pedidoDetalles (idPedido, idProducto, cantidad, precioUnitario)
VALUES
  (1, 1, 1, 24.90),
  (1, 2, 1, 26.10),
  (2, 3, 1, 40.00);
