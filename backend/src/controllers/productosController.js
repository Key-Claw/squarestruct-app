// Controlador para productos
import { db } from '../app.js';

export const getProductos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos', detalle: error.message });
  }
};

export const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM productos WHERE idProducto = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto', detalle: error.message });
  }
};

export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, tipo, stock, idProveedor } = req.body;

    if (!nombre || precio === undefined || stock === undefined || !idProveedor) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios'
      });
    }

    const [result] = await db.query(
      `INSERT INTO productos 
       (nombre, descripcion, precio, tipo, stock, idProveedor)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion || null, precio, tipo || null, stock, idProveedor]
    );

    res.status(201).json({
      mensaje: 'Producto creado correctamente',
      idProducto: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al crear el producto',
      detalle: error.message
    });
  }
};

export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, tipo, stock, idProveedor } = req.body;

    const [result] = await db.query(
      `UPDATE productos
       SET nombre = ?, descripcion = ?, precio = ?, tipo = ?, stock = ?, idProveedor = ?
       WHERE idProducto = ?`,
      [nombre, descripcion || null, precio, tipo || null, stock, idProveedor, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto actualizado correctamente' });
  } catch (error) {
    res.status(500).json({
      error: 'Error al actualizar el producto',
      detalle: error.message
    });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM productos WHERE idProducto = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(409).json({
      error: 'No se puede eliminar el producto porque está asociado a un pedido',
      detalle: error.message
    });
  }
};