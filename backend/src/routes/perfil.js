// Ejemplo de ruta privada para usuario autenticado
import express from 'express';
import { autenticarJWT } from '../middlewares/auth.js';

const router = express.Router();

// Ruta protegida: obtener perfil del usuario autenticado
router.get('/', autenticarJWT, (req, res) => {
  res.json({ usuario: req.user });
});

export default router;
