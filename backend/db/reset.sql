-- =========================================
-- RESET.SQL
-- Limpieza completa de la base de datos
-- SquareStruct v3
-- =========================================

-- =========================================================
-- IMPORTANTE
-- =========================================================
-- Este reset.sql se utiliza únicamente con fines
-- académicos para la asignatura de Base de Datos.
--
-- La tabla "planos" forma parte de una propuesta
-- conceptual de evolución v3 y no está integrada
-- actualmente en backend, frontend ni API REST.
-- =========================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS pedidoDetalles;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS planos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS proveedores;
DROP TABLE IF EXISTS usuarios;

SET FOREIGN_KEY_CHECKS = 1;