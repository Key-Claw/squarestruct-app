import jwt from 'jsonwebtoken';

// Middleware para verificar JWT
export default function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Formato esperado: "Bearer TOKEN"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Token no proporcionado'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
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