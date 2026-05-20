-- Anade trazabilidad para la cancelacion logica de pedidos.

ALTER TABLE pedidos
MODIFY estado VARCHAR(30) NOT NULL DEFAULT 'pendiente';

ALTER TABLE pedidos
ADD COLUMN fechaCancelacion DATETIME NULL AFTER estado;
