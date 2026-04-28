-- Seeds para la base de datos de la tienda online de bloques modulares

-- Proveedores
INSERT INTO proveedores (nombreEmpresa, telefono, validado)
VALUES
  ('Gablok', '+32470123456', TRUE),
  ('ByFusion', '+13105551234', TRUE),
  ('ABC Modular', '+34911222333', FALSE);

-- Usuarios
INSERT INTO usuarios (nombre, email, contrasena, rol)
VALUES
  ('Admin', 'admin@squarestruct.com', '$2b$10$hashadmin', 'admin'),
  ('Juan Pérez', 'juan.perez@email.com', '$2b$10$hashjuan', 'cliente'),
  ('Ana Gómez', 'ana.gomez@email.com', '$2b$10$hashana', 'cliente');

-- Productos
INSERT INTO productos (nombre, descripcion, precio, tipo, stock, alto, ancho, largo, idProveedor)
VALUES
  ('Bloque Gablok 300', 'Bloque modular pequeño para ajustes, esquinas y remates de muros.', 24.90, 'bloque', 120, 30, 30, 30, 1),
  ('Bloque Gablok 600', 'Bloque modular estándar para levantar muros de viviendas por piezas ensamblables.', 39.90, 'bloque', 180, 30, 30, 60, 1),
  ('Bloque Gablok 900', 'Bloque modular largo para avanzar más rápido en tramos rectos de pared.', 54.90, 'bloque', 150, 30, 30, 90, 1),
  ('Bloque Gablok esquina', 'Bloque modular para reforzar esquinas y encuentros entre muros.', 44.90, 'bloque', 100, 30, 30, 30, 1),
  ('Bloque Gablok medio', 'Bloque modular intermedio para adaptar medidas y cerrar tramos de pared.', 32.90, 'bloque', 130, 30, 30, 45, 1),
  ('Bloque Gablok remate', 'Bloque modular de remate para ajustes finales en el montaje.', 29.90, 'bloque', 90, 30, 30, 30, 1),
  ('Pilar Gablok 120', 'Pilar modular vertical para refuerzo de esquinas o zonas estructurales bajas.', 69.90, 'pilar', 45, 120, 30, 30, 1),
  ('Pilar Gablok 180', 'Pilar modular vertical para refuerzo de muros y zonas de carga media.', 89.90, 'pilar', 40, 180, 30, 30, 1),
  ('Pilar Gablok 240', 'Pilar modular vertical de altura completa para esquinas, entradas o zonas de mayor carga.', 109.90, 'pilar', 35, 240, 30, 30, 1);

-- Pedidos
INSERT INTO pedidos (fecha, total, estado, direccionEnvio, metodoPago, idUsuario)
VALUES
  ('2026-04-20 10:00:00', 51.00, 'pagado', 'Calle Falsa 123, Madrid', 'tarjeta', 2),
  ('2026-04-21 12:30:00', 40.00, 'pendiente', 'Av. Central 456, Barcelona', 'paypal', 3);

-- PedidoDetalles
INSERT INTO pedidoDetalles (idPedido, idProducto, cantidad, precioUnitario)
VALUES
  ('2026-04-20 10:00:00', 49.80, 'pagado', 'Calle Falsa 123, Madrid', 'tarjeta', 2),
  ('2026-04-21 12:30:00', 54.90, 'pendiente', 'Av. Central 456, Barcelona', 'paypal', 3);
