// Controlador para productos
import { db } from '../app.js';
import { getLocaleFromRequest, getLocalizedMessage, localizeProduct } from '../utils/localization.js';

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
    const locale = getLocaleFromRequest(req);

    const [rows] = await db.query(`
      SELECT
        p.*,
        pr.nombreEmpresa AS proveedor,
        pr.categoria AS categoriaProveedor,
        pr.sitioWeb AS sitioWebProveedor
      FROM productos p
      JOIN proveedores pr ON p.idProveedor = pr.idProveedor
    `);
    res.json(rows.map(normalizarProducto).map((producto) => localizeProduct(producto, locale)));
  } catch (error) {
    res.status(500).json({
      error: getLocalizedMessage(getLocaleFromRequest(req), {
        es: 'Error al obtener productos',
        en: 'Error while fetching products'
      }),
      detalle: error.message
    });
  }
};

export const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const locale = getLocaleFromRequest(req);

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

    res.json(localizeProduct(normalizarProducto(rows[0]), locale));
  } catch (error) {
    res.status(500).json({
      error: getLocalizedMessage(getLocaleFromRequest(req), {
        es: 'Error al obtener el producto',
        en: 'Error while fetching the product'
      }),
      detalle: error.message
    });
  }
};

export const crearProducto = async (req, res) => {
  try {
    const locale = getLocaleFromRequest(req);
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
      mensaje: getLocalizedMessage(locale, {
        es: 'Producto creado correctamente',
        en: 'Product created successfully'
      }),
      idProducto: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      error: getLocalizedMessage(getLocaleFromRequest(req), {
        es: 'Error al crear el producto',
        en: 'Error while creating the product'
      }),
      detalle: error.message
    });
  }
};

export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const locale = getLocaleFromRequest(req);
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

    res.json({
      mensaje: getLocalizedMessage(locale, {
        es: 'Producto actualizado correctamente',
        en: 'Product updated successfully'
      })
    });
  } catch (error) {
    res.status(500).json({
      error: getLocalizedMessage(getLocaleFromRequest(req), {
        es: 'Error al actualizar el producto',
        en: 'Error while updating the product'
      }),
      detalle: error.message
    });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const locale = getLocaleFromRequest(req);

    const [result] = await db.query(
      'DELETE FROM productos WHERE idProducto = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({
      mensaje: getLocalizedMessage(locale, {
        es: 'Producto eliminado correctamente',
        en: 'Product deleted successfully'
      })
    });
  } catch (error) {
    res.status(409).json({
      error: getLocalizedMessage(getLocaleFromRequest(req), {
        es: 'No se puede eliminar el producto porque está asociado a un pedido',
        en: 'The product cannot be deleted because it is linked to an order'
      }),
      detalle: error.message
    });
  }
};
