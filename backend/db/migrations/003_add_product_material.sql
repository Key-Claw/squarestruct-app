-- Añade el material comercial de cada producto del catalogo.

ALTER TABLE productos
ADD COLUMN material VARCHAR(80) NOT NULL DEFAULT 'Hormigon' AFTER tipo,
ADD CONSTRAINT chkProductoMaterial CHECK (material IN ('Plastico reciclable', 'Hormigon'));
