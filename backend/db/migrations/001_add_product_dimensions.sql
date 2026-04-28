-- Migración 001
-- Añade tipo limitado y dimensiones 3D a productos

ALTER TABLE productos
MODIFY tipo ENUM('bloque', 'pilar') NOT NULL;

ALTER TABLE productos
ADD COLUMN alto DECIMAL(10, 2) NOT NULL AFTER stock,
ADD COLUMN ancho DECIMAL(10, 2) NOT NULL AFTER alto,
ADD COLUMN largo DECIMAL(10, 2) NOT NULL AFTER ancho;

ALTER TABLE productos
ADD CONSTRAINT chkProductoAlto CHECK (alto > 0),
ADD CONSTRAINT chkProductoAncho CHECK (ancho > 0),
ADD CONSTRAINT chkProductoLargo CHECK (largo > 0);