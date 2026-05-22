-- =========================================
-- TOTAL_CODE.SQL
-- Script completo re-ejecutable
-- SquareStruct v3
-- =========================================

-- =========================================
-- RESET
-- =========================================

SSTART TRANSACTION;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS pedidoDetalles;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS planos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS proveedores;
DROP TABLE IF EXISTS usuarios;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE usuarios (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    primerApellido VARCHAR(80) NOT NULL,
    segundoApellido VARCHAR(80),
    email VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'usuario',
    creadoEn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chkUsuarioRol CHECK (rol IN ('usuario', 'admin'))
) ENGINE=InnoDB;

CREATE TABLE proveedores (
    idProveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombreEmpresa VARCHAR(160) NOT NULL,
    telefono VARCHAR(30),
    sitioWeb VARCHAR(255),
    categoria VARCHAR(80) NOT NULL,
    validado BOOLEAN NOT NULL DEFAULT FALSE,
    creadoEn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE productos (
    idProducto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(500),
    precio DECIMAL(12,2) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    material VARCHAR(80) NOT NULL,
    alto DECIMAL(10,2) NOT NULL,
    ancho DECIMAL(10,2) NOT NULL,
    largo DECIMAL(10,2) NOT NULL,
    idProveedor INT NOT NULL,

    CONSTRAINT chkProductoPrecio CHECK (precio >= 0),
    CONSTRAINT chkProductoTipo CHECK (tipo IN ('bloque', 'pilar')),
    CONSTRAINT chkProductoMaterial CHECK (material IN ('Plastico reciclable', 'Hormigon')),
    CONSTRAINT chkProductoAlto CHECK (alto > 0),
    CONSTRAINT chkProductoAncho CHECK (ancho > 0),
    CONSTRAINT chkProductoLargo CHECK (largo > 0),

    CONSTRAINT fkProductosProveedores
        FOREIGN KEY (idProveedor)
        REFERENCES proveedores(idProveedor)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE planos (
    idPlano INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(500),
    metrosCuadrados DECIMAL(10,2) NOT NULL,
    precioEstimado DECIMAL(12,2) NOT NULL DEFAULT 0,
    datosJSON LONGTEXT NOT NULL,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    idUsuario INT NOT NULL,

    CONSTRAINT chkPlanoMetros CHECK (metrosCuadrados > 0),
    CONSTRAINT chkPlanoPrecio CHECK (precioEstimado >= 0),

    CONSTRAINT fkPlanosUsuarios
        FOREIGN KEY (idUsuario)
        REFERENCES usuarios(idUsuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE pedidos (
    idPedido INT AUTO_INCREMENT PRIMARY KEY,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    fechaCancelacion DATETIME NULL,
    direccionEnvio VARCHAR(250) NOT NULL,
    metodoPago VARCHAR(30) NOT NULL,
    idUsuario INT NOT NULL,

    CONSTRAINT chkPedidoTotal CHECK (total >= 0),
    CONSTRAINT chkPedidoEstado CHECK (
        estado IN ('pendiente', 'aceptado', 'denegado', 'pagado', 'enviado', 'entregado', 'cancelado')
    ),
    CONSTRAINT chkPedidoMetodoPago CHECK (
        metodoPago IN ('tarjeta', 'transferencia', 'paypal', 'efectivo')
    ),

    CONSTRAINT fkPedidosUsuarios
        FOREIGN KEY (idUsuario)
        REFERENCES usuarios(idUsuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE pedidoDetalles (
    idPedido INT NOT NULL,
    idProducto INT NOT NULL,
    cantidad INT NOT NULL,
    precioUnitario DECIMAL(12,2) NOT NULL,

    PRIMARY KEY (idPedido, idProducto),

    CONSTRAINT chkDetalleCantidad CHECK (cantidad > 0),
    CONSTRAINT chkDetallePrecio CHECK (precioUnitario >= 0),

    CONSTRAINT fkDetallesPedidos
        FOREIGN KEY (idPedido)
        REFERENCES pedidos(idPedido)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fkDetallesProductos
        FOREIGN KEY (idProducto)
        REFERENCES productos(idProducto)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idxProductosIdProveedor ON productos(idProveedor);
CREATE INDEX idxPedidosIdUsuario ON pedidos(idUsuario);
CREATE INDEX idxDetallesIdProducto ON pedidoDetalles(idProducto);
CREATE INDEX idxPlanosIdUsuario ON planos(idUsuario);

INSERT INTO proveedores (idProveedor, nombreEmpresa, telefono, sitioWeb, categoria, validado) VALUES
(1, 'Plasticos renovables ByFusion', '+18332925625', 'https://byfusion.com/', 'Plasticos renovables', TRUE),
(2, 'Hormigon Forpol Group', '+34977881287', 'https://www.forpol.es/', 'Hormigon', TRUE);

INSERT INTO usuarios (idUsuario, nombre, primerApellido, segundoApellido, email, contrasena, rol) VALUES
(1, 'Admin', 'SquareStruct', NULL, 'admin@squarestruct.com', '$2b$10$uDPwExnvB1b.4fDtKNOKZOx.4BmAODWoLc23EtZZOa6IPljXf3cjW', 'admin'),
(2, 'Juan', 'Perez', 'Guarnizo', 'juan.perez@gmail.com', '$2b$10$uDPwExnvB1b.4fDtKNOKZOx.4BmAODWoLc23EtZZOa6IPljXf3cjW', 'usuario'),
(3, 'Ana', 'Gomez', NULL, 'ana.gomez@email.com', '$2b$10$uDPwExnvB1b.4fDtKNOKZOx.4BmAODWoLc23EtZZOa6IPljXf3cjW', 'usuario');

INSERT INTO productos (idProducto, nombre, descripcion, precio, tipo, material, alto, ancho, largo, idProveedor) VALUES
(1, 'Bloque Eco H80 Max', 'Bloque eco modular de gran formato.', 114.00, 'bloque', 'Plastico reciclable', 20.00, 20.00, 80.00, 1),
(2, 'Bloque Eco H80 Largo', 'Bloque eco para montaje modular rapido.', 88.50, 'bloque', 'Plastico reciclable', 20.00, 20.00, 60.00, 1),
(3, 'Pilar Eco H80 Refuerzo', 'Pilar eco apilable para refuerzo vertical.', 157.50, 'pilar', 'Plastico reciclable', 120.00, 40.00, 40.00, 1),
(4, 'Bloque H80 Max', 'Bloque de hormigon de gran formato.', 152.00, 'bloque', 'Hormigon', 20.00, 20.00, 80.00, 2),
(5, 'Pilar H80 Refuerzo', 'Pilar de hormigon para refuerzo vertical.', 210.00, 'pilar', 'Hormigon', 120.00, 40.00, 40.00, 2);

INSERT INTO planos (idPlano, nombre, descripcion, metrosCuadrados, precioEstimado, datosJSON, idUsuario) VALUES
(1, 'Plano modular inicial', 'Diseño base generado desde el editor 2D/3D.', 85.00, 1540.00, '{"version":"v3","bloques":[]}', 2),
(2, 'Vivienda eco demo', 'Plano de prueba con materiales ecologicos.', 120.00, 2450.00, '{"version":"v3","bloques":[]}', 3);

INSERT INTO pedidos (idPedido, fecha, total, estado, fechaCancelacion, direccionEnvio, metodoPago, idUsuario) VALUES
(1, '2026-04-20 10:00:00', 306.00, 'pagado', NULL, 'Calle Falsa 123, Madrid', 'tarjeta', 2),
(2, '2026-04-21 12:30:00', 523.50, 'pendiente', NULL, 'Av. Central 456, Barcelona', 'paypal', 3);

INSERT INTO pedidoDetalles (idPedido, idProducto, cantidad, precioUnitario) VALUES
(1, 1, 1, 114.00),
(1, 2, 1, 88.50),
(2, 3, 1, 157.50),
(2, 4, 1, 152.00),
(2, 5, 1, 210.00);

COMMIT;