// Rutas privadas para pedidos (requieren autenticación)
// Algunas rutas también requieren rol de administrador para la gestión de órdenes
import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import adminMiddleware from '../middlewares/admin.js';
import {
  crearPedido,
  listarPedidosUsuario,
  obtenerPedidoById,
  cancelarPedido,
  listarPedidosPendientes,
  actualizarEstadoPedido
} from '../controllers/pedidosController.js';

const router = express.Router();

// ============================================================================
// RUTAS DE USUARIO (requieren autenticación)
// ============================================================================

// GET /api/pedidos - Listar pedidos del usuario autenticado
router.get('/', authMiddleware, listarPedidosUsuario);

// POST /api/pedidos - Crear un nuevo pedido
router.post('/', authMiddleware, crearPedido);

// GET /api/pedidos/:id - Obtener detalles de un pedido específico
router.get('/:id', authMiddleware, obtenerPedidoById);

// PATCH /api/pedidos/:id/cancelar - Cancelar un pedido del usuario
router.patch('/:id/cancelar', authMiddleware, cancelarPedido);

// ============================================================================
// RUTAS DE ADMINISTRADOR (requieren autenticación + rol admin)
// ============================================================================

// GET /api/pedidos/admin/pendientes - Listar todos los pedidos pendientes (solo admin)
// Se coloca antes de las rutas con parámetro para evitar conflictos de enrutamiento
router.get('/admin/pendientes', authMiddleware, adminMiddleware, listarPedidosPendientes);

// PATCH /api/pedidos/:id/estado - Actualizar estado de un pedido (aceptar/denegar, solo admin)
router.patch('/:id/estado', authMiddleware, adminMiddleware, actualizarEstadoPedido);

export default router;
