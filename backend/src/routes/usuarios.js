// Rutas de usuarios
import express from 'express';
import { 
  registerUsuario, 
  loginUsuario,
  getUsuarios,
  getUsuarioById,
  actualizarUsuario,
  eliminarUsuario 
} from '../controllers/usuariosController.js';

import { validarRegistro, validarLogin } from '../middlewares/validacion.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/register', validarRegistro, registerUsuario);
router.post('/login', validarLogin, loginUsuario);

// Rutas privadas CRUD usuarios
router.get('/', authMiddleware, getUsuarios);
router.get('/:id', authMiddleware, getUsuarioById);
router.put('/:id', authMiddleware, actualizarUsuario);
router.delete('/:id', authMiddleware, eliminarUsuario);

export default router;
