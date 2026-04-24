// Rutas de usuarios
import express from 'express';
import { registerUsuario, loginUsuario } from '../controllers/usuariosController.js';
import { validarRegistro, validarLogin } from '../middlewares/validacion.js';

const router = express.Router();

// Registro de usuario
router.post('/register', validarRegistro, registerUsuario);

// Login de usuario
router.post('/login', validarLogin, loginUsuario);

export default router;
