-- =========================================
-- RESET.SQL
-- Limpieza completa de la base de datos
-- SquareStruct v3
-- =========================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS pedidoDetalles;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS planos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS proveedores;
DROP TABLE IF EXISTS usuarios;

SET FOREIGN_KEY_CHECKS = 1;