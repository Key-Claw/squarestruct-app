// Ejemplo de ruta privada para usuario autenticado
import express from 'express';
import { autenticarJWT } from '../middlewares/auth.js';

const router = express.Router();

// Ruta protegida: obtener perfil del usuario autenticado
// Nota: Usar '/' aquí es correcto porque en app.js se registra con app.use('/api/perfil', perfilRouter)
// El middleware autenticarJWT valida el JWT antes de ejecutar el handler
router.get('/', autenticarJWT, (req, res) => {
  res.json({ usuario: req.user });
});

export default router;
