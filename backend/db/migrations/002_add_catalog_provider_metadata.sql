-- Alinea proveedores con el catalogo del frontend.

ALTER TABLE proveedores
ADD COLUMN sitioWeb VARCHAR(255) AFTER telefono,
ADD COLUMN categoria VARCHAR(80) NOT NULL DEFAULT 'General' AFTER sitioWeb;
