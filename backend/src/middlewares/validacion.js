// Middleware de validacion para registro de usuario.
export const validarRegistro = (req, res, next) => {
  const { nombre, email, contrasena } = req.body;

  if (!nombre || typeof nombre !== 'string' || nombre.length < 2) {
    return res.status(400).json({ error: 'Nombre invalido' });
  }

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'Email invalido' });
  }

  if (!contrasena || typeof contrasena !== 'string' || contrasena.length < 6) {
    return res.status(400).json({ error: 'Contrasena debe tener al menos 6 caracteres' });
  }

  next();
};

// Middleware de validacion para login de usuario.
// Permite el flujo principal por email y el flujo alternativo por nombre + primerApellido.
export const validarLogin = (req, res, next) => {
  const { email, nombre, primerApellido, contrasena } = req.body;
  const hasEmailLogin = email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const hasNameLogin = (
    nombre
    && typeof nombre === 'string'
    && primerApellido
    && typeof primerApellido === 'string'
  );

  if (!hasEmailLogin && !hasNameLogin) {
    return res.status(400).json({ error: 'Email valido o nombre y primer apellido obligatorios' });
  }

  if (!contrasena || typeof contrasena !== 'string' || contrasena.length < 6) {
    return res.status(400).json({ error: 'Contrasena debe tener al menos 6 caracteres' });
  }

  next();
};
