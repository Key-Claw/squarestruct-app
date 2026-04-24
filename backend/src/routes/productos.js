// Rutas de productos
import express from 'express';
import { getProductos } from '../controllers/productosController.js';

const router = express.Router();

router.get('/', getProductos);

export default router;
