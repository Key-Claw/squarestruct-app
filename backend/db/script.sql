-- =========================================================
-- SCRIPT.SQL
-- SquareStruct v3
-- Script académico completo para MariaDB / MySQL
-- DAW1 - Base de Datos
-- =========================================================

-- =========================================================
-- IMPORTANTE
-- =========================================================
-- Este script.sql se utiliza únicamente con fines
-- académicos para la asignatura de Base de Datos.
--
-- La tabla "planos" forma parte de una propuesta
-- conceptual de evolución v3 y no está integrada
-- actualmente en backend, frontend ni API REST.
-- =========================================================

CREATE DATABASE IF NOT EXISTS squarestruct_v3
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE squarestruct_v3;

START TRANSACTION;

-- =========================================================
-- 1. CONTINGENCIA
-- =========================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS pedidoDetalles;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS planos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS proveedores;
DROP TABLE IF EXISTS usuarios;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================
-- 2. CREACIÓN DE TABLAS
-- =========================================================

CREATE TABLE usuarios (
    idUsuario INT AUTO_INCREMENT,
    nombre VARCHAR(120) NOT NULL,
    primerApellido VARCHAR(80) NOT NULL,
    segundoApellido VARCHAR(80),
    email VARCHAR(150) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'usuario',
    creadoEn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pkUsuarios PRIMARY KEY (idUsuario),

    CONSTRAINT uqUsuariosEmail UNIQUE (email),

    CONSTRAINT chkUsuariosRol CHECK (
        rol IN ('usuario', 'admin')
    )
) ENGINE=InnoDB;

CREATE TABLE proveedores (
    idProveedor INT AUTO_INCREMENT,
    nombreEmpresa VARCHAR(160) NOT NULL,
    telefono VARCHAR(30),
    sitioWeb VARCHAR(255),
    categoria VARCHAR(80) NOT NULL,
    validado BOOLEAN NOT NULL DEFAULT FALSE,
    creadoEn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pkProveedores PRIMARY KEY (idProveedor)
) ENGINE=InnoDB;

CREATE TABLE productos (
    idProducto INT AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(500),
    precio DECIMAL(12,2) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    material VARCHAR(80) NOT NULL,
    alto DECIMAL(10,2) NOT NULL,
    ancho DECIMAL(10,2) NOT NULL,
    largo DECIMAL(10,2) NOT NULL,
    idProveedor INT NOT NULL,

    CONSTRAINT pkProductos PRIMARY KEY (idProducto),

    CONSTRAINT chkProductosPrecio CHECK (
        precio >= 0
    ),

    CONSTRAINT chkProductosTipo CHECK (
        tipo IN ('bloque', 'pilar')
    ),

    CONSTRAINT chkProductosMaterial CHECK (
        material IN ('Plastico reciclable', 'Hormigon')
    ),

    CONSTRAINT chkProductosAlto CHECK (
        alto > 0
    ),

    CONSTRAINT chkProductosAncho CHECK (
        ancho > 0
    ),

    CONSTRAINT chkProductosLargo CHECK (
        largo > 0
    )
) ENGINE=InnoDB;

CREATE TABLE planos (
    idPlano INT AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(500),
    metrosCuadrados DECIMAL(10,2) NOT NULL,
    precioEstimado DECIMAL(12,2) NOT NULL DEFAULT 0,
    datosJSON LONGTEXT NOT NULL,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    idUsuario INT NOT NULL,

    CONSTRAINT pkPlanos PRIMARY KEY (idPlano),

    CONSTRAINT chkPlanosMetros CHECK (
        metrosCuadrados > 0
    ),

    CONSTRAINT chkPlanosPrecio CHECK (
        precioEstimado >= 0
    )
) ENGINE=InnoDB;

CREATE TABLE pedidos (
    idPedido INT AUTO_INCREMENT,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    fechaCancelacion DATETIME NULL,
    direccionEnvio VARCHAR(250) NOT NULL,
    metodoPago VARCHAR(30) NOT NULL,
    idUsuario INT NOT NULL,

    CONSTRAINT pkPedidos PRIMARY KEY (idPedido),

    CONSTRAINT chkPedidosTotal CHECK (
        total >= 0
    ),

    CONSTRAINT chkPedidosEstado CHECK (
        estado IN (
            'pendiente',
            'aceptado',
            'denegado',
            'pagado',
            'enviado',
            'entregado',
            'cancelado'
        )
    ),

    CONSTRAINT chkPedidosMetodoPago CHECK (
        metodoPago IN (
            'tarjeta',
            'transferencia',
            'paypal',
            'efectivo'
        )
    )
) ENGINE=InnoDB;

CREATE TABLE pedidoDetalles (
    idPedido INT NOT NULL,
    idProducto INT NOT NULL,
    cantidad INT NOT NULL,
    precioUnitario DECIMAL(12,2) NOT NULL,

    CONSTRAINT pkPedidoDetalles PRIMARY KEY (
        idPedido,
        idProducto
    ),

    CONSTRAINT chkPedidoDetallesCantidad CHECK (
        cantidad > 0
    ),

    CONSTRAINT chkPedidoDetallesPrecio CHECK (
        precioUnitario >= 0
    )
) ENGINE=InnoDB;

-- =========================================================
-- 3. CLAVES FORÁNEAS
-- =========================================================

ALTER TABLE productos
ADD CONSTRAINT fkProductosProveedores
FOREIGN KEY (idProveedor)
REFERENCES proveedores(idProveedor)
ON UPDATE CASCADE
ON DELETE RESTRICT;

ALTER TABLE planos
ADD CONSTRAINT fkPlanosUsuarios
FOREIGN KEY (idUsuario)
REFERENCES usuarios(idUsuario)
ON UPDATE CASCADE
ON DELETE CASCADE;

ALTER TABLE pedidos
ADD CONSTRAINT fkPedidosUsuarios
FOREIGN KEY (idUsuario)
REFERENCES usuarios(idUsuario)
ON UPDATE CASCADE
ON DELETE RESTRICT;

ALTER TABLE pedidoDetalles
ADD CONSTRAINT fkPedidoDetallesPedidos
FOREIGN KEY (idPedido)
REFERENCES pedidos(idPedido)
ON UPDATE CASCADE
ON DELETE CASCADE;

ALTER TABLE pedidoDetalles
ADD CONSTRAINT fkPedidoDetallesProductos
FOREIGN KEY (idProducto)
REFERENCES productos(idProducto)
ON UPDATE CASCADE
ON DELETE RESTRICT;

-- =========================================================
-- 4. ÍNDICES
-- =========================================================

CREATE INDEX idxProductosIdProveedor
ON productos(idProveedor);

CREATE INDEX idxPlanosIdUsuario
ON planos(idUsuario);

CREATE INDEX idxPedidosIdUsuario
ON pedidos(idUsuario);

CREATE INDEX idxPedidoDetallesIdProducto
ON pedidoDetalles(idProducto);

-- =========================================================
-- 5. INSERCIÓN DE DATOS
-- =========================================================

INSERT INTO usuarios (
    idUsuario,
    nombre,
    primerApellido,
    segundoApellido,
    email,
    contrasena,
    rol
) VALUES
(
    1,
    'Admin',
    'SquareStruct',
    NULL,
    'admin@sqst.com',
    '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm',
    'admin'
),
(
    2,
    'Juan',
    'Perez',
    'Guarnizo',
    'juan.perez@gmail.com',
    '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm',
    'usuario'
),
(
    3,
    'Ana',
    'Gomez',
    NULL,
    'ana.gomez@email.com',
    '$2b$10$VSCt51JCe5d2kYdchOmB.uTTROriNQkZAlBxqTJMtNjA5F.QwjMPm',
    'usuario'
);

INSERT INTO proveedores (
    idProveedor,
    nombreEmpresa,
    telefono,
    sitioWeb,
    categoria,
    validado
) VALUES
(
    1,
    'Plasticos renovables ByFusion',
    '+18332925625',
    'https://byfusion.com/',
    'Plasticos renovables',
    TRUE
),
(
    2,
    'Hormigon Forpol Group',
    '+34977881287',
    'https://www.forpol.es/',
    'Hormigon',
    TRUE
);

INSERT INTO productos (
    idProducto,
    nombre,
    descripcion,
    precio,
    tipo,
    material,
    alto,
    ancho,
    largo,
    idProveedor
) VALUES
(
    1,
    'Bloque Eco H80 Max',
    'Bloque eco modular de gran formato.',
    114.00,
    'bloque',
    'Plastico reciclable',
    20.00,
    20.00,
    80.00,
    1
),
(
    2,
    'Bloque Eco H80 Largo',
    'Bloque eco para montaje modular rapido.',
    88.50,
    'bloque',
    'Plastico reciclable',
    20.00,
    20.00,
    60.00,
    1
),
(
    3,
    'Pilar Eco H80 Refuerzo',
    'Pilar eco apilable para refuerzo vertical.',
    157.50,
    'pilar',
    'Plastico reciclable',
    120.00,
    40.00,
    40.00,
    1
),
(
    4,
    'Bloque H80 Max',
    'Bloque de hormigon de gran formato.',
    152.00,
    'bloque',
    'Hormigon',
    20.00,
    20.00,
    80.00,
    2
),
(
    5,
    'Pilar H80 Refuerzo',
    'Pilar de hormigon para refuerzo vertical.',
    210.00,
    'pilar',
    'Hormigon',
    120.00,
    40.00,
    40.00,
    2
);

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

INSERT INTO pedidos (
    idPedido,
    fecha,
    total,
    estado,
    fechaCancelacion,
    direccionEnvio,
    metodoPago,
    idUsuario
) VALUES
(
    1,
    '2026-04-20 10:00:00',
    202.50,
    'pagado',
    NULL,
    'Calle Falsa 123, Madrid',
    'tarjeta',
    2
),
(
    2,
    '2026-04-21 12:30:00',
    519.50,
    'pendiente',
    NULL,
    'Av. Central 456, Barcelona',
    'paypal',
    3
);

INSERT INTO pedidoDetalles (
    idPedido,
    idProducto,
    cantidad,
    precioUnitario
) VALUES
(1, 1, 1, 114.00),
(1, 2, 1, 88.50),
(2, 3, 1, 157.50),
(2, 4, 1, 152.00),
(2, 5, 1, 210.00);

COMMIT;

-- =========================================================
-- 6. CONSULTAS DE COMPROBACIÓN
-- =========================================================

SELECT * FROM usuarios;
SELECT * FROM proveedores;
SELECT * FROM productos;
SELECT * FROM planos;
SELECT * FROM pedidos;
SELECT * FROM pedidoDetalles;

SELECT
    p.idPedido,
    u.nombre,
    u.email,
    p.total,
    p.estado
FROM pedidos p
JOIN usuarios u
ON p.idUsuario = u.idUsuario;

SELECT
    pd.idPedido,
    pr.nombre AS producto,
    pd.cantidad,
    pd.precioUnitario,
    (pd.cantidad * pd.precioUnitario) AS subtotal
FROM pedidoDetalles pd
JOIN productos pr
ON pd.idProducto = pr.idProducto;

SELECT
    pl.idPlano,
    pl.nombre AS plano,
    u.email AS usuario,
    pl.metrosCuadrados,
    pl.precioEstimado
FROM planos pl
JOIN usuarios u
ON pl.idUsuario = u.idUsuario;