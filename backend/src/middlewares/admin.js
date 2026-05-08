// El admin es el unico que puede acceder al get de usuarios

export default function adminMiddleware(req, res, next) {
  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso solo para administradores' });
  }

  next();
}