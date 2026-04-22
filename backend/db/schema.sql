BEGIN;	-- BEGIN inicia una transacción: todos los cambios hechos entre BEGIN y COMMIT se aplican juntos.

DROP TABLE IF EXISTS "pedidoDetalles";
DROP TABLE IF EXISTS "pedidos";
DROP TABLE IF EXISTS "productos";
DROP TABLE IF EXISTS "proveedores";
DROP TABLE IF EXISTS "usuarios";

CREATE TABLE "usuarios" (
	"idUsuario" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"nombre" VARCHAR(120) NOT NULL,
	"email" VARCHAR(150) NOT NULL UNIQUE,
	"contrasena" VARCHAR(255) NOT NULL,
	"rol" VARCHAR(20) NOT NULL DEFAULT 'cliente',
	"creadoEn" TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT "chkUsuarioRol" CHECK ("rol" IN ('cliente', 'admin'))
);

CREATE TABLE "proveedores" (
	"idProveedor" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"nombreEmpresa" VARCHAR(160) NOT NULL,
	"telefono" VARCHAR(30),
	"validado" BOOLEAN NOT NULL DEFAULT FALSE,
	"creadoEn" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "productos" (
	"idProducto" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"nombre" VARCHAR(150) NOT NULL,
	"descripcion" TEXT,
	"precio" NUMERIC(12, 2) NOT NULL,
	"tipo" VARCHAR(60),
	"stock" INTEGER NOT NULL DEFAULT 0,
	"idProveedor" INTEGER NOT NULL,
	"creadoEn" TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT "chkProductoPrecio" CHECK ("precio" >= 0),
	CONSTRAINT "chkProductoStock" CHECK ("stock" >= 0),
	CONSTRAINT "fkProductosProveedores"
		FOREIGN KEY ("idProveedor")
		REFERENCES "proveedores" ("idProveedor")
		ON UPDATE CASCADE
		ON DELETE RESTRICT
);

CREATE TABLE "pedidos" (
	"idPedido" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	"fecha" TIMESTAMP NOT NULL DEFAULT NOW(),
	"total" NUMERIC(12, 2) NOT NULL DEFAULT 0,
	"estado" VARCHAR(30) NOT NULL DEFAULT 'pendiente',
	"direccionEnvio" TEXT NOT NULL,
	"metodoPago" VARCHAR(30) NOT NULL,
	"idUsuario" INTEGER NOT NULL,
	CONSTRAINT "chkPedidoTotal" CHECK ("total" >= 0),
	CONSTRAINT "chkPedidoEstado" CHECK ("estado" IN ('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado')),
	CONSTRAINT "chkPedidoMetodoPago" CHECK ("metodoPago" IN ('tarjeta', 'transferencia', 'paypal', 'efectivo')),
	CONSTRAINT "fkPedidosUsuarios"
		FOREIGN KEY ("idUsuario")
		REFERENCES "usuarios" ("idUsuario")
		ON UPDATE CASCADE
		ON DELETE RESTRICT
);

CREATE TABLE "pedidoDetalles" (
	"idPedido" INTEGER NOT NULL,
	"idProducto" INTEGER NOT NULL,
	"cantidad" INTEGER NOT NULL,
	"precioUnitario" NUMERIC(12, 2) NOT NULL,
	PRIMARY KEY ("idPedido", "idProducto"),
	CONSTRAINT "chkDetalleCantidad" CHECK ("cantidad" > 0),
	CONSTRAINT "chkDetallePrecio" CHECK ("precioUnitario" >= 0),
	CONSTRAINT "fkDetallesPedidos"
		FOREIGN KEY ("idPedido")
		REFERENCES "pedidos" ("idPedido")
		ON UPDATE CASCADE
		ON DELETE CASCADE,
	CONSTRAINT "fkDetallesProductos"
		FOREIGN KEY ("idProducto")
		REFERENCES "productos" ("idProducto")
		ON UPDATE CASCADE
		ON DELETE RESTRICT
);

-- Indices para optimizar consultas por llaves foraneas

CREATE INDEX "idxProductosIdProveedor" ON "productos" ("idProveedor");
CREATE INDEX "idxPedidosIdUsuario" ON "pedidos" ("idUsuario");
CREATE INDEX "idxDetallesIdProducto" ON "pedidoDetalles" ("idProducto");

COMMIT; -- COMMIT finaliza la transacción y guarda todos los cambios realizados desde BEGIN.
