// Ejemplo de ruta privada para usuario autenticado
import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import { db } from '../app.js';

const router = express.Router();

// Ruta protegida: devuelve el perfil del usuario autenticado (extraído del JWT)
// Se monta en: /api/perfil
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [usuarios] = await db.query(
      'SELECT idUsuario, nombre, primerApellido, segundoApellido, email, rol, creadoEn FROM usuarios WHERE idUsuario = ?',
      [req.user.idUsuario]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ usuario: usuarios[0] });
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener perfil',
      detalle: error.message
    });
  }
});

export default router;
