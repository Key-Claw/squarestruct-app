// Rutas de productos
import express from 'express';
import { 
  getProductos,
  getProductoById,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productosController.js';
import { validarProducto } from '../middlewares/validacionProducto.js';

const router = express.Router();

router.get('/', getProductos);
router.get('/:id', getProductoById);
router.post('/', validarProducto, crearProducto);
router.put('/:id', validarProducto, actualizarProducto);
router.delete('/:id', eliminarProducto);

export default router;
