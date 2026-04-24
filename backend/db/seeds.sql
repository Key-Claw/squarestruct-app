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
INSERT INTO productos (nombre, descripcion, precio, tipo, stock, idProveedor)
VALUES
  ('Bloque aislante Gablok', 'Bloque de madera aislante para construcción modular', 25.50, 'aislante', 100, 1),
  ('Bloque reciclado ByFusion', 'Bloque ecológico fabricado con plástico reciclado', 18.75, 'reciclado', 200, 2),
  ('Panel modular estándar', 'Panel para ensamblaje rápido de viviendas', 40.00, 'panel', 50, 3);

-- Pedidos
INSERT INTO pedidos (fecha, total, estado, direccionEnvio, metodoPago, idUsuario)
VALUES
  ('2026-04-20 10:00:00', 51.00, 'pagado', 'Calle Falsa 123, Madrid', 'tarjeta', 2),
  ('2026-04-21 12:30:00', 40.00, 'pendiente', 'Av. Central 456, Barcelona', 'paypal', 3);

-- PedidoDetalles
INSERT INTO pedidoDetalles (idPedido, idProducto, cantidad, precioUnitario)
VALUES
  (1, 1, 2, 25.50),
  (2, 3, 1, 40.00);
