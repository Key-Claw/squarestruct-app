// Ejemplo de ruta privada para usuario autenticado
import express from 'express';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Ruta protegida: devuelve el perfil del usuario autenticado (extraído del JWT)
// Se monta en: /api/perfil
router.get('/', authMiddleware, (req, res) => {
  res.json({ usuario: req.user });
});

export default router;
