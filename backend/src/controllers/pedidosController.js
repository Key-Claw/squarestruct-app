// Controladores para manejar la lógica de pedidos
import { db } from '../app.js';

export const crearPedido = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { direccionEnvio, metodoPago, productos } = req.body;
    const idUsuario = req.user.idUsuario || req.user.id;

    if (!direccionEnvio || !metodoPago || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        error: 'Datos incompletos para crear el pedido'
      });
    }

    await connection.beginTransaction();

    let total = 0;

    for (const item of productos) {
      const [rows] = await connection.query(
        'SELECT idProducto, precio, stock FROM productos WHERE idProducto = ?',
        [item.idProducto]
      );

      if (rows.length === 0) {
        throw new Error(`Producto no encontrado: ${item.idProducto}`);
      }

      const producto = rows[0];

      if (producto.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para el producto ${item.idProducto}`);
      }

      total += Number(producto.precio) * Number(item.cantidad);
    }

    const [pedidoResult] = await connection.query(
      `INSERT INTO pedidos (total, direccionEnvio, metodoPago, idUsuario)
       VALUES (?, ?, ?, ?)`,
      [total, direccionEnvio, metodoPago, idUsuario]
    );

    const idPedido = pedidoResult.insertId;

    for (const item of productos) {
      const [rows] = await connection.query(
        'SELECT precio FROM productos WHERE idProducto = ?',
        [item.idProducto]
      );

      const precioUnitario = rows[0].precio;

      await connection.query(
        `INSERT INTO pedidoDetalles (idPedido, idProducto, cantidad, precioUnitario)
         VALUES (?, ?, ?, ?)`,
        [idPedido, item.idProducto, item.cantidad, precioUnitario]
      );

      await connection.query(
        `UPDATE productos
         SET stock = stock - ?
         WHERE idProducto = ?`,
        [item.cantidad, item.idProducto]
      );
    }

    await connection.commit();

    res.status(201).json({
      mensaje: 'Pedido creado correctamente',
      idPedido,
      total
    });
  } catch (error) {
    await connection.rollback();

    res.status(500).json({
      error: 'Error al crear el pedido',
      detalle: error.message
    });
  } finally {
    connection.release();
  }
};

export const listarPedidosUsuario = async (req, res) => {
  try {
    const idUsuario = req.user.idUsuario || req.user.id;

    const [pedidos] = await db.query(
      `SELECT idPedido, fecha, total, estado, direccionEnvio, metodoPago
       FROM pedidos
       WHERE idUsuario = ?
       ORDER BY fecha DESC`,
      [idUsuario]
    );

    res.json(pedidos);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener los pedidos'
    });
  }
};