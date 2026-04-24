START TRANSACTION;

DROP TABLE IF EXISTS pedidoDetalles;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS proveedores;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  idUsuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'cliente',
  creadoEn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chkUsuarioRol CHECK (rol IN ('cliente', 'admin'))
) ENGINE=InnoDB;

CREATE TABLE proveedores (
  idProveedor INT AUTO_INCREMENT PRIMARY KEY,
  nombreEmpresa VARCHAR(160) NOT NULL,
  telefono VARCHAR(30),
  validado BOOLEAN NOT NULL DEFAULT FALSE,
  creadoEn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE productos (
  idProducto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(12, 2) NOT NULL,
  tipo VARCHAR(60),
  stock INT NOT NULL DEFAULT 0,
  idProveedor INT NOT NULL,
  CONSTRAINT chkProductoPrecio CHECK (precio >= 0),
  CONSTRAINT chkProductoStock CHECK (stock >= 0),
  CONSTRAINT fkProductosProveedores
    FOREIGN KEY (idProveedor)
    REFERENCES proveedores (idProveedor)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE pedidos (
  idPedido INT AUTO_INCREMENT PRIMARY KEY,
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(12, 2) NOT NULL DEFAULT 0,
  estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
  direccionEnvio TEXT NOT NULL,
  metodoPago VARCHAR(30) NOT NULL,
  idUsuario INT NOT NULL,
  CONSTRAINT chkPedidoTotal CHECK (total >= 0),
  CONSTRAINT chkPedidoEstado CHECK (estado IN ('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado')),
  CONSTRAINT chkPedidoMetodoPago CHECK (metodoPago IN ('tarjeta', 'transferencia', 'paypal', 'efectivo')),
  CONSTRAINT fkPedidosUsuarios
    FOREIGN KEY (idUsuario)
    REFERENCES usuarios (idUsuario)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE pedidoDetalles (
  idPedido INT NOT NULL,
  idProducto INT NOT NULL,
  cantidad INT NOT NULL,
  precioUnitario DECIMAL(12, 2) NOT NULL,
  PRIMARY KEY (idPedido, idProducto),
  CONSTRAINT chkDetalleCantidad CHECK (cantidad > 0),
  CONSTRAINT chkDetallePrecio CHECK (precioUnitario >= 0),
  CONSTRAINT fkDetallesPedidos
    FOREIGN KEY (idPedido)
    REFERENCES pedidos (idPedido)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fkDetallesProductos
    FOREIGN KEY (idProducto)
    REFERENCES productos (idProducto)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idxProductosIdProveedor ON productos (idProveedor);
CREATE INDEX idxPedidosIdUsuario ON pedidos (idUsuario);
CREATE INDEX idxDetallesIdProducto ON pedidoDetalles (idProducto);

COMMIT;
