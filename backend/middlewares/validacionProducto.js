// Middleware de validación para creación de productos (ejemplo para futuros endpoints protegidos)
export const validarProducto = (req, res, next) => {
  const { nombre, descripcion, precio, tipo, stock, idProveedor } = req.body;
  if (!nombre || typeof nombre !== 'string' || nombre.length < 2) {
    return res.status(400).json({ error: 'Nombre de producto inválido' });
  }
  if (descripcion && typeof descripcion !== 'string') {
    return res.status(400).json({ error: 'Descripción inválida' });
  }
  if (typeof precio !== 'number' || precio < 0) {
    return res.status(400).json({ error: 'Precio inválido' });
  }
  if (tipo && typeof tipo !== 'string') {
    return res.status(400).json({ error: 'Tipo inválido' });
  }
  if (typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ error: 'Stock inválido' });
  }
  if (!idProveedor || typeof idProveedor !== 'number') {
    return res.status(400).json({ error: 'Proveedor inválido' });
  }
  next();
};
