// Controlador para productos
import { db } from '../app.js';

export const getProductos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};
