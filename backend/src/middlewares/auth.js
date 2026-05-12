import jwt from 'jsonwebtoken';

// Middleware para verificar JWT y añadir el usuario autenticado a req.user
export default function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Formato esperado: "Bearer TOKEN"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Token no proporcionado'
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'JWT_SECRET no esta configurado' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: 'Token inválido'
      });
    }

    // Guardamos el usuario en la request
    req.user = user;

    next();
  });
}