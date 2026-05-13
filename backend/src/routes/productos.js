// Rutas de productos
import express from 'express';
import { 
  getProductos,
  getProductoById,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productosController.js';
import adminMiddleware from '../middlewares/admin.js';
import authMiddleware from '../middlewares/auth.js';
import { validarProducto } from '../middlewares/validacionProducto.js';

const router = express.Router();

router.get('/', getProductos);
router.get('/:id', getProductoById);
router.post('/', authMiddleware, adminMiddleware, validarProducto, crearProducto);
router.put('/:id', authMiddleware, adminMiddleware, validarProducto, actualizarProducto);
router.delete('/:id', authMiddleware, adminMiddleware, eliminarProducto);

export default router;
