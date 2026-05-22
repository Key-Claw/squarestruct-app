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
INSERT INTO proveedores (idProveedor, nombreEmpresa, telefono, sitioWeb, categoria, validado)
VALUES
  (1, 'Plasticos renovables ByFusion', '+18332925625', 'https://byfusion.com/', 'Plasticos renovables', TRUE),
  (2, 'Hormigon Forpol Group', '+34977881287', 'https://www.forpol.es/prefabricados-hormigon/bloques-de-hormigon-forpolbloc/', 'Hormigon', TRUE);

-- Hash bcrypt de la contrasena temporal de ejemplo para usuarios seed. Cambiar antes de desplegar en AWS.
-- Usuario admin de demo: admin@sqst.com / Hola123!
INSERT INTO usuarios (idUsuario, nombre, primerApellido, segundoApellido, email, contrasena, rol)
VALUES
  (1, 'Admin', 'SquareStruct', NULL, 'admin@sqst.com', '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm', 'admin'),
  (2, 'Juan', 'Perez', 'Guarnizo', 'perez@gmail.com', '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm', 'usuario'),
  (3, 'Ana', 'Gomez', NULL, 'gomez@email.com', '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm', 'usuario'),
  (4, 'Carlos', 'Martinez', 'Lopez', 'martinez@gmail.com', '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm', 'usuario'),
  (5, 'Lucia', 'Fernandez', NULL, 'fernandez@gmail.com', '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm', 'usuario'),
  (6, 'Miguel', 'Sanchez', 'Ruiz', 'sanchez@gmail.com', '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm', 'usuario'),
  (7, 'Elena', 'Torres', NULL, 'torres@gmail.com', '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm', 'usuario'),
  (8, 'David', 'Ramirez', 'Moreno', 'ramirez@gmail.com', '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm', 'usuario'),
  (9, 'Sara', 'Navarro', NULL, 'navarro@gmail.com', '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm', 'usuario'),
  (10, 'Javier', 'Ortega', 'Gil', 'ortega@gmail.com', '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm', 'usuario'),
  (11, 'Paula', 'Castro', NULL, 'castro@gmail.com', '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm', 'usuario'),
  (12, 'Raul', 'Mendez', 'Vega', 'mendez@gmail.com', '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm', 'usuario'),
  (13, 'Claudia', 'Herrera', NULL, 'herrera@gmail.com', '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm', 'usuario'),
  (14, 'Alberto', 'Cano', 'Serrano', 'cano@gmail.com', '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm', 'usuario'),
  (15, 'Marta', 'Iglesias', NULL, 'iglesias@gmail.com', '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm', 'usuario'),
  (16, 'Sergio', 'Delgado', 'Nieto', 'delgado@gmail.com', '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm', 'usuario'),
  (17, 'Andrea', 'Reyes', NULL, 'reyes@gmail.com', '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm', 'admin'),
  (18, 'Fernando', 'Vidal', 'Prieto', 'vidal@gmail.com', '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm', 'usuario'),
  (19, 'Natalia', 'Flores', NULL, 'flores@gmail.com', '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm', 'usuario'),
  (20, 'Pablo', 'Romero', 'Saez', 'romero@gmail.com', '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm', 'usuario');

-- Productos
INSERT INTO productos (idProducto, nombre, descripcion, precio, tipo, material, alto, ancho, largo, idProveedor)
VALUES
  (1, 'Bloque Eco H80 Max', 'Bloque eco modular de gran formato para muros de contencion de tierras y cargas exigentes.', 114.00, 'bloque', 'Plastico reciclable', 20.00, 20.00, 80.00, 1),
  (2, 'Bloque Eco H80 Largo', 'Bloque eco para contencion, cauces y montaje modular rapido.', 88.50, 'bloque', 'Plastico reciclable', 20.00, 20.00, 60.00, 1),
  (3, 'Bloque Eco H80 Cubo', 'Bloque eco de formato base para muros robustos y soluciones temporales o permanentes.', 64.50, 'bloque', 'Plastico reciclable', 20.00, 20.00, 40.00, 1),
  (4, 'Bloque Eco H80 Medio', 'Bloque eco corto para ajustes de longitud en muros modulares.', 39.00, 'bloque', 'Plastico reciclable', 20.00, 20.00, 20.00, 1),
  (5, 'Pilar Eco H80 Refuerzo', 'Pilar eco apilable para refuerzo vertical; dos piezas alcanzan 240 cm.', 157.50, 'pilar', 'Plastico reciclable', 120.00, 40.00, 40.00, 1),
  (6, 'Pilar Eco H80 Esquina', 'Pilar eco apilable para esquinas y encuentros entre tramos modulares.', 141.00, 'pilar', 'Plastico reciclable', 120.00, 40.00, 40.00, 1),
  (7, 'Bloque Eco H60 Max', 'Bloque eco para separadores de aridos, desechos y materiales a granel.', 126.00, 'bloque', 'Plastico reciclable', 20.00, 20.00, 80.00, 1),
  (8, 'Bloque Eco H60 Largo', 'Bloque eco para separaciones interiores de gran longitud en naves y patios industriales.', 99.00, 'bloque', 'Plastico reciclable', 20.00, 20.00, 60.00, 1),
  (9, 'Bloque Eco H60 Medio', 'Bloque eco para separadores de materiales y cerramientos industriales ligeros.', 69.00, 'bloque', 'Plastico reciclable', 20.00, 20.00, 40.00, 1),
  (10, 'Bloque Eco H60 Cubo', 'Bloque eco para remates, arranques y cambios de modulacion.', 41.25, 'bloque', 'Plastico reciclable', 20.00, 20.00, 20.00, 1),
  (11, 'Pilar Eco H60 Modular', 'Pilar eco para apoyo intermedio; tres piezas alcanzan 240 cm.', 111.00, 'pilar', 'Plastico reciclable', 80.00, 40.00, 40.00, 1),
  (12, 'Pilar Eco H60 Terminal', 'Pilar eco para remates terminales; tres piezas alcanzan 240 cm.', 94.50, 'pilar', 'Plastico reciclable', 80.00, 40.00, 40.00, 1),
  (13, 'Bloque Eco H40 Cerramiento', 'Bloque eco para vallas y cerramientos perimetrales sin contencion de tierras.', 84.00, 'bloque', 'Plastico reciclable', 20.00, 20.00, 80.00, 1),
  (14, 'Bloque Eco H40 Largo', 'Bloque eco para cerramientos perimetrales desmontables y soluciones temporales.', 63.00, 'bloque', 'Plastico reciclable', 20.00, 20.00, 60.00, 1),
  (15, 'Bloque Eco H40 Medio', 'Bloque eco para vallas, delimitaciones y remates de cerramiento.', 43.50, 'bloque', 'Plastico reciclable', 20.00, 20.00, 40.00, 1),
  (16, 'Bloque Eco H40 Ajuste', 'Bloque eco para ajustes de longitud en cerramientos perimetrales.', 27.00, 'bloque', 'Plastico reciclable', 20.00, 20.00, 20.00, 1),
  (17, 'Pilar Eco H40 Cerramiento', 'Pilar eco apilable para cerramientos; cuatro piezas alcanzan 240 cm.', 73.50, 'pilar', 'Plastico reciclable', 60.00, 40.00, 40.00, 1),
  (18, 'Pilar Eco H40 Ligero', 'Pilar eco compacto para apoyos bajos y delimitaciones temporales.', 54.00, 'pilar', 'Plastico reciclable', 60.00, 40.00, 40.00, 1),
  (19, 'Bloque H80 Max', 'Bloque de hormigon de gran formato para muros de contencion de tierras y cargas exigentes.', 152.00, 'bloque', 'Hormigon', 20.00, 20.00, 80.00, 2),
  (20, 'Bloque H80 Largo', 'Bloque de hormigon para contencion, cauces y montaje mecanico rapido.', 118.00, 'bloque', 'Hormigon', 20.00, 20.00, 60.00, 2),
  (21, 'Bloque H80 Cubo', 'Bloque de hormigon de formato base para muros robustos y soluciones temporales o permanentes.', 86.00, 'bloque', 'Hormigon', 20.00, 20.00, 40.00, 2),
  (22, 'Bloque H80 Medio', 'Bloque de hormigon corto para ajustes de longitud en muros de contencion.', 52.00, 'bloque', 'Hormigon', 20.00, 20.00, 20.00, 2),
  (23, 'Pilar H80 Refuerzo', 'Pilar de hormigon para refuerzo vertical; dos piezas alcanzan 240 cm.', 210.00, 'pilar', 'Hormigon', 120.00, 40.00, 40.00, 2),
  (24, 'Pilar H80 Esquina', 'Pilar de hormigon para esquinas y encuentros entre tramos H80.', 188.00, 'pilar', 'Hormigon', 120.00, 40.00, 40.00, 2),
  (25, 'Bloque H60 Max', 'Bloque de hormigon para separadores de aridos, desechos y materiales a granel.', 168.00, 'bloque', 'Hormigon', 20.00, 20.00, 80.00, 2),
  (26, 'Bloque H60 Largo', 'Bloque de hormigon para separaciones interiores de gran longitud en naves y patios industriales.', 132.00, 'bloque', 'Hormigon', 20.00, 20.00, 60.00, 2),
  (27, 'Bloque H60 Medio', 'Bloque de hormigon para separadores de materiales y cerramientos industriales ligeros.', 92.00, 'bloque', 'Hormigon', 20.00, 20.00, 40.00, 2),
  (28, 'Bloque H60 Cubo', 'Bloque de hormigon para remates, arranques y cambios de modulacion.', 55.00, 'bloque', 'Hormigon', 20.00, 20.00, 20.00, 2),
  (29, 'Pilar H60 Modular', 'Pilar de hormigon para apoyo intermedio; tres piezas alcanzan 240 cm.', 148.00, 'pilar', 'Hormigon', 80.00, 40.00, 40.00, 2),
  (30, 'Pilar H60 Terminal', 'Pilar de hormigon para remates terminales; tres piezas alcanzan 240 cm.', 126.00, 'pilar', 'Hormigon', 80.00, 40.00, 40.00, 2),
  (31, 'Bloque H40 Cerramiento', 'Bloque de hormigon para vallas y cerramientos perimetrales sin contencion de tierras.', 112.00, 'bloque', 'Hormigon', 20.00, 20.00, 80.00, 2),
  (32, 'Bloque H40 Largo', 'Bloque de hormigon para cerramientos perimetrales desmontables y soluciones temporales.', 84.00, 'bloque', 'Hormigon', 20.00, 20.00, 60.00, 2),
  (33, 'Bloque H40 Medio', 'Bloque de hormigon para vallas, delimitaciones y remates de cerramiento.', 58.00, 'bloque', 'Hormigon', 20.00, 20.00, 40.00, 2),
  (34, 'Bloque H40 Ajuste', 'Bloque de hormigon para ajustes de longitud en cerramientos perimetrales.', 36.00, 'bloque', 'Hormigon', 20.00, 20.00, 20.00, 2),
  (35, 'Pilar H40 Cerramiento', 'Pilar de hormigon para cerramientos; cuatro piezas alcanzan 240 cm.', 98.00, 'pilar', 'Hormigon', 60.00, 40.00, 40.00, 2),
  (36, 'Pilar H40 Ligero', 'Pilar de hormigon compacto para apoyos bajos y delimitaciones temporales.', 72.00, 'pilar', 'Hormigon', 60.00, 40.00, 40.00, 2);
-- Pedidos
INSERT INTO pedidos (idPedido, fecha, total, estado, fechaCancelacion, direccionEnvio, metodoPago, idUsuario)
VALUES
  (1, '2026-04-20 10:00:00', 306.00, 'pagado', NULL, 'Calle Falsa 123, Madrid', 'tarjeta', 2),
  (2, '2026-04-21 12:30:00', 523.50, 'pendiente', NULL, 'Av. Central 456, Barcelona', 'paypal', 3),
  (3, '2026-04-22 09:15:00', 315.75, 'cancelado', '2026-04-22 11:00:00', 'Paseo Modular 12, Valencia', 'transferencia', 4),
  (4, '2026-04-23 16:45:00', 217.50, 'pagado', NULL, 'Calle Norte 8, Sevilla', 'tarjeta', 5),
  (5, '2026-04-24 08:20:00', 535.50, 'pendiente', NULL, 'Avenida del Puerto 44, Bilbao', 'transferencia', 6),
  (6, '2026-04-25 14:10:00', 566.00, 'enviado', NULL, 'Ronda Verde 19, Zaragoza', 'paypal', 7),
  (7, '2026-04-26 11:35:00', 279.00, 'pagado', NULL, 'Camino Modular 5, Malaga', 'tarjeta', 8),
  (8, '2026-04-27 17:05:00', 470.00, 'cancelado', '2026-04-27 18:30:00', 'Plaza Mayor 2, Valladolid', 'paypal', 9),
  (9, '2026-04-28 09:50:00', 94.00, 'pendiente', NULL, 'Calle Roble 31, Granada', 'transferencia', 10),
  (10, '2026-04-29 13:25:00', 170.00, 'entregado', NULL, 'Avenida Solar 72, Murcia', 'tarjeta', 11);

-- PedidoDetalles
INSERT INTO pedidoDetalles (idPedido, idProducto, cantidad, precioUnitario)
VALUES
  (1, 1, 1, 114.00),
  (1, 2, 1, 88.50),
  (1, 3, 1, 64.50),
  (1, 4, 1, 39.00),
  (2, 5, 1, 157.50),
  (2, 6, 1, 141.00),
  (2, 7, 1, 126.00),
  (2, 8, 1, 99.00),
  (3, 9, 1, 69.00),
  (3, 10, 1, 41.25),
  (3, 11, 1, 111.00),
  (3, 12, 1, 94.50),
  (4, 13, 1, 84.00),
  (4, 14, 1, 63.00),
  (4, 15, 1, 43.50),
  (4, 16, 1, 27.00),
  (5, 17, 1, 73.50),
  (5, 18, 1, 54.00),
  (5, 19, 1, 152.00),
  (5, 20, 1, 118.00),
  (5, 21, 1, 86.00),
  (5, 22, 1, 52.00),
  (6, 23, 1, 210.00),
  (6, 24, 1, 188.00),
  (6, 25, 1, 168.00),
  (7, 26, 1, 132.00),
  (7, 27, 1, 92.00),
  (7, 28, 1, 55.00),
  (8, 29, 1, 148.00),
  (8, 30, 1, 126.00),
  (8, 31, 1, 112.00),
  (8, 32, 1, 84.00),
  (9, 33, 1, 58.00),
  (9, 34, 1, 36.00),
  (10, 35, 1, 98.00),
  (10, 36, 1, 72.00);


-- =========================================================
-- PROPUESTA - SEEDS PLANOS
-- =========================================================
-- Datos de prueba asociados al sistema conceptual
-- de planos/editor 2D/3D de SquareStruct v3.
--
-- Actualmente NO integrado en:
-- - backend
-- - frontend
-- - API REST
-- - schema.sql operativo
-- - seeds.sql operativo
--
-- Su implementación real queda prevista para
-- futuras actualizaciones del proyecto.
-- =========================================================

/*

INSERT INTO planos (
    idPlano,
    nombre,
    descripcion,
    metrosCuadrados,
    precioEstimado,
    datosJSON,
    idUsuario
) VALUES
(
    1,
    'Plano modular inicial',
    'Diseño conceptual del editor 2D/3D.',
    85.00,
    1540.00,
    '{"version":"v3","bloques":[]}',
    2
),
(
    2,
    'Vivienda eco demo',
    'Plano de prueba con materiales ecologicos.',
    120.00,
    2450.00,
    '{"version":"v3","bloques":[]}',
    3
);

*/
