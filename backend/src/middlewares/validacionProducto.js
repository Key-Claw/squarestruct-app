// Middleware de validacion para creacion y edicion de productos.
export const validarProducto = (req, res, next) => {
  const { nombre, descripcion, precio, tipo, material, alto, ancho, largo, idProveedor } = req.body;

  if (!nombre || typeof nombre !== 'string' || nombre.length < 2) {
    return res.status(400).json({ error: 'Nombre de producto invalido' });
  }

  if (descripcion && typeof descripcion !== 'string') {
    return res.status(400).json({ error: 'Descripcion invalida' });
  }

  if (typeof precio !== 'number' || precio < 0) {
    return res.status(400).json({ error: 'Precio invalido' });
  }

  if (!['bloque', 'pilar'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo invalido' });
  }

  if (!['Plastico reciclable', 'Hormigon'].includes(material)) {
    return res.status(400).json({ error: 'Material invalido' });
  }

  if (typeof alto !== 'number' || alto <= 0) {
    return res.status(400).json({ error: 'Alto invalido' });
  }

  if (typeof ancho !== 'number' || ancho <= 0) {
    return res.status(400).json({ error: 'Ancho invalido' });
  }

  if (typeof largo !== 'number' || largo <= 0) {
    return res.status(400).json({ error: 'Largo invalido' });
  }

  if (!idProveedor || typeof idProveedor !== 'number') {
    return res.status(400).json({ error: 'Proveedor invalido' });
  }

  next();
};
