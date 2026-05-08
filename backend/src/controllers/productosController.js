// Controlador para productos
import { db } from '../app.js';

/**
 * Corrige texto con mojibake típico de una mala decodificación UTF-8/latin1.
 * @param {string} value - Texto a corregir.
 * @returns {string} Texto corregido o el original.
 */
const normalizarTexto = (value) => {
  if (typeof value !== 'string' || !/[ÃÂ�]/.test(value)) {
    return value;
  }

  try {
    return Buffer.from(value, 'latin1').toString('utf8');
  } catch {
    return value;
  }
};

/**
 * Normaliza un producto antes de devolverlo al frontend.
 * @param {object} producto - Registro de producto obtenido de MySQL.
 * @returns {object} Producto con textos legibles.
 */
const normalizarProducto = (producto) => ({
  ...producto,
  nombre: normalizarTexto(producto.nombre),
  descripcion: normalizarTexto(producto.descripcion),
  tipo: normalizarTexto(producto.tipo),
  material: normalizarTexto(producto.material),
  proveedor: normalizarTexto(producto.proveedor),
  categoriaProveedor: normalizarTexto(producto.categoriaProveedor)
});

export const getProductos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        p.*,
        pr.nombreEmpresa AS proveedor,
        pr.categoria AS categoriaProveedor,
        pr.sitioWeb AS sitioWebProveedor
      FROM productos p
      JOIN proveedores pr ON p.idProveedor = pr.idProveedor
    `);
    res.json(rows.map(normalizarProducto));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos', detalle: error.message });
  }
};

export const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT
        p.*,
        pr.nombreEmpresa AS proveedor,
        pr.categoria AS categoriaProveedor,
        pr.sitioWeb AS sitioWebProveedor
      FROM productos p
      JOIN proveedores pr ON p.idProveedor = pr.idProveedor
      WHERE p.idProducto = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(normalizarProducto(rows[0]));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto', detalle: error.message });
  }
};

export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, tipo, material, alto, ancho, largo, idProveedor } = req.body;

    if (!nombre || precio === undefined || !material || alto === undefined || ancho === undefined || largo === undefined || !idProveedor) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios'
      });
    }

    const [result] = await db.query(
      `INSERT INTO productos 
       (nombre, descripcion, precio, tipo, material, alto, ancho, largo, idProveedor)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion || null, precio, tipo || null, material, alto, ancho, largo, idProveedor]
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
    const { nombre, descripcion, precio, tipo, material, alto, ancho, largo, idProveedor } = req.body;

    const [result] = await db.query(
      `UPDATE productos
       SET nombre = ?, descripcion = ?, precio = ?, tipo = ?, material = ?, alto = ?, ancho = ?, largo = ?, idProveedor = ?
       WHERE idProducto = ?`,
      [nombre, descripcion || null, precio, tipo || null, material, alto, ancho, largo, idProveedor, id]
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
