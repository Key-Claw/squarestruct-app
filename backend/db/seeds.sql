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
INSERT INTO proveedores (nombreEmpresa, telefono, sitioWeb, categoria, validado)
VALUES
  ('Plasticos renovables ByFusion', '+18332925625', 'https://byfusion.com/', 'Plasticos renovables', TRUE),
  ('Hormigon Forpol Group', '+34977881287', 'https://www.forpol.es/prefabricados-hormigon/bloques-de-hormigon-forpolbloc/', 'Hormigon', TRUE);

-- Usuarios RECORDAR QUE CUANDO SUBAMOS A AWS HAY QUE CAMBIAR LOS HASH DE LAS CONTRASEÑAS POR LOS REALES GENERADOS CON BCRYPT
INSERT INTO usuarios (nombre, primerApellido, segundoApellido, email, contrasena, rol)
VALUES
  ('Admin', 'SquareStruct', NULL, 'admin@squarestruct.com', '$2b$10$hashadmin', 'admin'),
  ('Juan', 'Perez', 'Guarnizo', 'juan.perez@email.com', '$2b$10$hashjuan', 'usuario'),
  ('Ana', 'Gomez', NULL, 'ana.gomez@email.com', '$2b$10$hashana', 'usuario'),
  ('Carlos', 'Martinez', 'Lopez', 'carlos.martinez@email.com', '$2b$10$hashcarlos', 'usuario'),
  ('Lucia', 'Fernandez', NULL, 'lucia.fernandez@email.com', '$2b$10$hashlucia', 'usuario'),
  ('Miguel', 'Sanchez', 'Ruiz', 'miguel.sanchez@email.com', '$2b$10$hashmiguel', 'usuario'),
  ('Elena', 'Torres', NULL, 'elena.torres@email.com', '$2b$10$hashelena', 'usuario'),
  ('David', 'Ramirez', 'Moreno', 'david.ramirez@email.com', '$2b$10$hashdavid', 'usuario'),
  ('Sara', 'Navarro', NULL, 'sara.navarro@email.com', '$2b$10$hashsara', 'usuario'),
  ('Javier', 'Ortega', 'Gil', 'javier.ortega@email.com', '$2b$10$hashjavier', 'usuario'),
  ('Paula', 'Castro', NULL, 'paula.castro@email.com', '$2b$10$hashpaula', 'usuario'),
  ('Raul', 'Mendez', 'Vega', 'raul.mendez@email.com', '$2b$10$hashraul', 'usuario'),
  ('Claudia', 'Herrera', NULL, 'claudia.herrera@email.com', '$2b$10$hashclaudia', 'usuario'),
  ('Alberto', 'Cano', 'Serrano', 'alberto.cano@email.com', '$2b$10$hashalberto', 'usuario'),
  ('Marta', 'Iglesias', NULL, 'marta.iglesias@email.com', '$2b$10$hashmarta', 'usuario'),
  ('Sergio', 'Delgado', 'Nieto', 'sergio.delgado@email.com', '$2b$10$hashsergio', 'usuario'),
  ('Andrea', 'Reyes', NULL, 'andrea.reyes@email.com', '$2b$10$hashandrea', 'usuario'),
  ('Fernando', 'Vidal', 'Prieto', 'fernando.vidal@email.com', '$2b$10$hashfernando', 'usuario'),
  ('Natalia', 'Flores', NULL, 'natalia.flores@email.com', '$2b$10$hashnatalia', 'usuario'),
  ('Pablo', 'Romero', 'Saez', 'pablo.romero@email.com', '$2b$10$hashpablo', 'usuario');

-- Productos
INSERT INTO productos (nombre, descripcion, precio, tipo, material, alto, ancho, largo, idProveedor)
VALUES
  ('Bloque EcoBase', 'Bloque ligero de plastico reciclable para primeras hiladas y tramos medios de muro modular.', 42.50, 'bloque', 'Plastico reciclable', 22.70, 19.70, 39.40, 1),
  ('Bloque EcoPlano', 'Bloque de plastico reciclable con superficie plana para remates superiores y zonas bajo huecos.', 41.00, 'bloque', 'Plastico reciclable', 20.30, 19.70, 39.40, 1),
  ('Bloque EcoUnion', 'Bloque de plastico reciclable para encuentros, huecos de ventana y transiciones escalonadas.', 44.00, 'bloque', 'Plastico reciclable', 22.70, 19.70, 39.40, 1),
  ('Columna EcoStruct 120', 'Columna modular de plastico reciclable para muros, particiones y cerramientos ligeros.', 180.00, 'pilar', 'Plastico reciclable', 120.00, 39.40, 39.40, 1),
  ('Columna EcoStruct 180', 'Columna alta de plastico reciclable para puntos de refuerzo en cerramientos modulares.', 258.00, 'pilar', 'Plastico reciclable', 180.00, 39.40, 39.40, 1),
  ('Columna EcoCorner', 'Pilar de plastico reciclable pensado para esquinas, encuentros y cambios de direccion.', 195.00, 'pilar', 'Plastico reciclable', 120.00, 39.40, 39.40, 1),
  ('Columna EcoLine', 'Pilar lineal de plastico reciclable para apoyo intermedio en tramos largos de muro.', 168.00, 'pilar', 'Plastico reciclable', 100.00, 39.40, 39.40, 1),
  ('Bloque H80 Max', 'Bloque de hormigon de gran formato para muros de contencion de tierras y cargas exigentes.', 152.00, 'bloque', 'Hormigon', 80.00, 80.00, 160.00, 2),
  ('Bloque H80 Largo', 'Bloque de hormigon para contencion, cauces y escolleras con montaje mecanico rapido.', 118.00, 'bloque', 'Hormigon', 80.00, 80.00, 120.00, 2),
  ('Bloque H80 Cubo', 'Bloque cubico de hormigon para muros robustos y soluciones temporales o permanentes.', 86.00, 'bloque', 'Hormigon', 80.00, 80.00, 80.00, 2),
  ('Bloque H80 Medio', 'Medio bloque de hormigon para ajustes de longitud en muros de contencion.', 52.00, 'bloque', 'Hormigon', 80.00, 80.00, 40.00, 2),
  ('Pilar H80 Refuerzo', 'Pilar de hormigon pesado para refuerzo vertical en muros de contencion y zonas de carga.', 210.00, 'pilar', 'Hormigon', 160.00, 80.00, 80.00, 2),
  ('Pilar H80 Esquina', 'Pilar de hormigon para esquinas de muros robustos y encuentros entre tramos H80.', 188.00, 'pilar', 'Hormigon', 120.00, 80.00, 80.00, 2),
  ('Bloque H60 Max', 'Bloque de hormigon para separadores de aridos, desechos y materiales a granel.', 168.00, 'bloque', 'Hormigon', 60.00, 60.00, 240.00, 2),
  ('Bloque H60 Largo', 'Bloque de hormigon para separaciones interiores de gran longitud en naves y patios industriales.', 132.00, 'bloque', 'Hormigon', 60.00, 60.00, 180.00, 2),
  ('Bloque H60 Medio', 'Bloque de hormigon para separadores de materiales y cerramientos industriales ligeros.', 92.00, 'bloque', 'Hormigon', 60.00, 60.00, 120.00, 2),
  ('Bloque H60 Cubo', 'Bloque cubico de hormigon para remates, arranques y cambios de modulacion.', 55.00, 'bloque', 'Hormigon', 60.00, 60.00, 60.00, 2),
  ('Pilar H60 Modular', 'Pilar de hormigon para apoyo intermedio en separadores de materiales y muros industriales.', 148.00, 'pilar', 'Hormigon', 120.00, 60.00, 60.00, 2),
  ('Pilar H60 Terminal', 'Pilar de hormigon para remates terminales en muros y separadores de formato H60.', 126.00, 'pilar', 'Hormigon', 90.00, 60.00, 60.00, 2),
  ('Bloque H40 Cerramiento', 'Bloque de hormigon para vallas y cerramientos perimetrales sin contencion de tierras.', 112.00, 'bloque', 'Hormigon', 80.00, 40.00, 160.00, 2),
  ('Bloque H40 Largo', 'Bloque de hormigon para cerramientos perimetrales desmontables y soluciones temporales.', 84.00, 'bloque', 'Hormigon', 80.00, 40.00, 120.00, 2),
  ('Bloque H40 Medio', 'Bloque de hormigon para vallas, delimitaciones y remates de cerramiento.', 58.00, 'bloque', 'Hormigon', 80.00, 40.00, 80.00, 2),
  ('Bloque H40 Ajuste', 'Medio bloque de hormigon para ajustes de longitud en cerramientos perimetrales.', 36.00, 'bloque', 'Hormigon', 80.00, 40.00, 40.00, 2),
  ('Pilar H40 Cerramiento', 'Pilar de hormigon para esquinas y remates en vallas y cerramientos perimetrales.', 98.00, 'pilar', 'Hormigon', 120.00, 40.00, 80.00, 2),
  ('Pilar H40 Ligero', 'Pilar de hormigon compacto para apoyos de cerramientos bajos y delimitaciones temporales.', 72.00, 'pilar', 'Hormigon', 80.00, 40.00, 40.00, 2);
-- Pedidos
INSERT INTO pedidos (fecha, total, estado, direccionEnvio, metodoPago, idUsuario)
VALUES
  ('2026-04-20 10:00:00', 1118.00, 'pagado', 'Calle Falsa 123, Madrid', 'tarjeta', 2),
  ('2026-04-21 12:30:00', 912.00, 'pendiente', 'Av. Central 456, Barcelona', 'paypal', 3);

-- PedidoDetalles
INSERT INTO pedidoDetalles (idPedido, idProducto, cantidad, precioUnitario)
VALUES
  (1, 1, 12, 42.50),
  (1, 8, 4, 152.00),
  (2, 14, 3, 168.00),
  (2, 20, 3, 112.00),
  (2, 23, 2, 36.00);
