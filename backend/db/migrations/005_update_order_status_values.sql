-- Permite que el flujo de facturacion use los estados aprobacion/rechazo
-- sin romper las bases ya creadas con la constraint anterior.

ALTER TABLE pedidos
DROP CHECK chkPedidoEstado;

ALTER TABLE pedidos
ADD CONSTRAINT chkPedidoEstado
CHECK (estado IN ('pendiente', 'aceptado', 'denegado', 'pagado', 'enviado', 'entregado', 'cancelado'));