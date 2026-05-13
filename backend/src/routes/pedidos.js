// Ejemplo de rutas privadas para pedidos (requieren autenticación)
import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import {
  crearPedido,
  listarPedidosUsuario,
  obtenerPedidoById,
  cancelarPedido
} from '../controllers/pedidosController.js';

const router = express.Router();

router.get('/', authMiddleware, listarPedidosUsuario);
router.post('/', authMiddleware, crearPedido);
router.get('/:id', authMiddleware, obtenerPedidoById);
router.patch('/:id/cancelar', authMiddleware, cancelarPedido);

export default router;
