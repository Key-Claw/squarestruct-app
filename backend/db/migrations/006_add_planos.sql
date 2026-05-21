-- Preparacion para la futura entidad planos, pensada para el guardado desde design.
-- El bloque queda comentado para no aplicar cambios hasta que se valide la integracion.

/*
CREATE TABLE planos (
  idPlano INT AUTO_INCREMENT PRIMARY KEY,
  idUsuario INT NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  descripcion VARCHAR(500),
  metrosCuadrados DECIMAL(10, 2) NOT NULL,
  precioEstimado DECIMAL(12, 2) NOT NULL DEFAULT 0,
  datosJSON JSON,
  fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fechaActualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chkPlanoMetrosCuadrados CHECK (metrosCuadrados >= 0),
  CONSTRAINT chkPlanoPrecioEstimado CHECK (precioEstimado >= 0),
  CONSTRAINT fkPlanosUsuarios
    FOREIGN KEY (idUsuario)
    REFERENCES usuarios (idUsuario)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idxPlanosIdUsuario ON planos (idUsuario);
*/