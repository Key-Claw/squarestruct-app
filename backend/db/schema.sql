-- Inicia una transaccion ACID. Todo lo entre START TRANSACTION y COMMIT
-- se ejecuta como una unidad: o se completa todo o no se guarda nada.
-- Esto garantiza consistencia si hay errores durante la ejecucion del script.
START TRANSACTION;

DROP TABLE IF EXISTS pedidoDetalles;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS proveedores;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  idUsuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  primerApellido VARCHAR(80) NOT NULL,
  segundoApellido VARCHAR(80),
  email VARCHAR(150) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'usuario',
  creadoEn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Fecha de insercion en la base de datos
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
) ENGINE=InnoDB; -- Fecha de insercion en la base de datos

CREATE TABLE productos (
  idProducto INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion VARCHAR(500),
  precio DECIMAL(12, 2) NOT NULL,
  tipo ENUM('bloque', 'pilar') NOT NULL, -- Tipo de producto para futuras funcionalidades especificas
  material VARCHAR(80) NOT NULL,
  alto DECIMAL(10, 2) NOT NULL,
  ancho DECIMAL(10, 2) NOT NULL,
  largo DECIMAL(10, 2) NOT NULL,
  idProveedor INT NOT NULL, 

-- Validaciones para dimensiones, asegurando que sean positivas
  CONSTRAINT chkProductoPrecio CHECK (precio >= 0),
  CONSTRAINT chkProductoMaterial CHECK (material IN ('Plastico reciclable', 'Hormigon')),
  CONSTRAINT chkProductoAlto CHECK (alto > 0),
  CONSTRAINT chkProductoAncho CHECK (ancho > 0),
  CONSTRAINT chkProductoLargo CHECK (largo > 0),

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
  fechaCancelacion DATETIME NULL,
  direccionEnvio VARCHAR(250) NOT NULL,
  metodoPago VARCHAR(30) NOT NULL,
  idUsuario INT NOT NULL,
  CONSTRAINT chkPedidoTotal CHECK (total >= 0),
  CONSTRAINT chkPedidoEstado CHECK (estado IN ('pendiente', 'aceptado', 'denegado', 'pagado', 'enviado', 'entregado', 'cancelado')),
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

-- Indices para optimizar las consultas que usan FOREIGN KEYS en WHERE o JOIN
-- Mejora el rendimiento de busquedas como: productos por idProveedor, pedidos por idUsuario, etc.
CREATE INDEX idxProductosIdProveedor ON productos (idProveedor);
CREATE INDEX idxPedidosIdUsuario ON pedidos (idUsuario);
CREATE INDEX idxDetallesIdProducto ON pedidoDetalles (idProducto);

-- COMMIT finaliza la transaccion y guarda TODOS los cambios realizados desde BEGIN
-- Si llega aqui sin errores, la BD quedara con todas las tablas e indices creados.
COMMIT;



-- =========================================================
-- PROPUESTA - SCHEMA PLANOS
-- =========================================================
-- Estructura conceptual relacionada con el editor
-- 2D/3D de SquareStruct v3.
--
-- Actualmente NO integrada en:
-- - backend
-- - frontend
-- - API REST
-- - schema.sql operativo
-- - seeds.sql operativo
--
-- Su implementación real queda prevista para
-- futuras actualizaciones del proyecto.
-- =========================================================

/*

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

ALTER TABLE planos
ADD CONSTRAINT fkPlanosUsuarios
FOREIGN KEY (idUsuario)
REFERENCES usuarios(idUsuario)
ON UPDATE CASCADE
ON DELETE CASCADE;

CREATE INDEX idxPlanosIdUsuario
ON planos(idUsuario);

*/