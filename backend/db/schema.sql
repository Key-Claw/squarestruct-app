BEGIN;

DROP TABLE IF EXISTS pedido_detalles;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS proveedores;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
	id_usuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	nombre VARCHAR(120) NOT NULL,
	email VARCHAR(150) NOT NULL UNIQUE,
	contrasena VARCHAR(255) NOT NULL,
	rol VARCHAR(20) NOT NULL DEFAULT 'cliente',
	creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT chk_usuario_rol CHECK (rol IN ('cliente', 'admin'))
);

CREATE TABLE proveedores (
	id_proveedor INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	nombre_empresa VARCHAR(160) NOT NULL,
	telefono VARCHAR(30),
	validado BOOLEAN NOT NULL DEFAULT FALSE,
	creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE productos (
	id_producto INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	nombre VARCHAR(150) NOT NULL,
	descripcion TEXT,
	precio NUMERIC(12, 2) NOT NULL,
	tipo VARCHAR(60),
	stock INTEGER NOT NULL DEFAULT 0,
	id_proveedor INTEGER NOT NULL,
	creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT chk_producto_precio CHECK (precio >= 0),
	CONSTRAINT chk_producto_stock CHECK (stock >= 0),
	CONSTRAINT fk_productos_proveedores
		FOREIGN KEY (id_proveedor)
		REFERENCES proveedores (id_proveedor)
		ON UPDATE CASCADE
		ON DELETE RESTRICT
);

CREATE TABLE pedidos (
	id_pedido INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	fecha TIMESTAMP NOT NULL DEFAULT NOW(),
	total NUMERIC(12, 2) NOT NULL DEFAULT 0,
	estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
	direccion_envio TEXT NOT NULL,
	metodo_pago VARCHAR(30) NOT NULL,
	id_usuario INTEGER NOT NULL,
	CONSTRAINT chk_pedido_total CHECK (total >= 0),
	CONSTRAINT chk_pedido_estado CHECK (estado IN ('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado')),
	CONSTRAINT chk_pedido_metodo_pago CHECK (metodo_pago IN ('tarjeta', 'transferencia', 'paypal', 'efectivo')),
	CONSTRAINT fk_pedidos_usuarios
		FOREIGN KEY (id_usuario)
		REFERENCES usuarios (id_usuario)
		ON UPDATE CASCADE
		ON DELETE RESTRICT
);

CREATE TABLE pedido_detalles (
	id_pedido INTEGER NOT NULL,
	id_producto INTEGER NOT NULL,
	cantidad INTEGER NOT NULL,
	precio_unitario NUMERIC(12, 2) NOT NULL,
	PRIMARY KEY (id_pedido, id_producto),
	CONSTRAINT chk_detalle_cantidad CHECK (cantidad > 0),
	CONSTRAINT chk_detalle_precio CHECK (precio_unitario >= 0),
	CONSTRAINT fk_detalles_pedidos
		FOREIGN KEY (id_pedido)
		REFERENCES pedidos (id_pedido)
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT fk_detalles_productos
		FOREIGN KEY (id_producto)
		REFERENCES productos (id_producto)
		ON UPDATE CASCADE
		ON DELETE RESTRICT
);

-- Indices para optimizar consultas por llaves foraneas
CREATE INDEX idx_productos_id_proveedor ON productos (id_proveedor);
CREATE INDEX idx_pedidos_id_usuario ON pedidos (id_usuario);
CREATE INDEX idx_detalles_id_producto ON pedido_detalles (id_producto);

COMMIT;
