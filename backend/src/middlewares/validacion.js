// Middleware de validación para registro de usuario
export const validarRegistro = (req, res, next) => {
  const { nombre, email, contrasena } = req.body;
  if (!nombre || typeof nombre !== 'string' || nombre.length < 2) {
    return res.status(400).json({ error: 'Nombre inválido' });
  }
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }
  if (!contrasena || typeof contrasena !== 'string' || contrasena.length < 6) {
    return res.status(400).json({ error: 'Contraseña debe tener al menos 6 caracteres' });
  }
  next();
};

// Middleware de validación para login de usuario
export const validarLogin = (req, res, next) => {
  const { email, contrasena } = req.body;
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }
  if (!contrasena || typeof contrasena !== 'string' || contrasena.length < 6) {
    return res.status(400).json({ error: 'Contraseña debe tener al menos 6 caracteres' });
  }
  next();
};
