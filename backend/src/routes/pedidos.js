// Ejemplo de rutas privadas para pedidos (requieren autenticación)
import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import {
  crearPedido,
  listarPedidosUsuario
} from '../controllers/pedidosController.js';

const router = express.Router();

router.get('/', authMiddleware, listarPedidosUsuario);
router.post('/', authMiddleware, crearPedido);

export default router;