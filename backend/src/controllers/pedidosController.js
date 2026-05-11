// Controladores para manejar la lógica de pedidos
import { db } from '../app.js';

const crearErrorHttp = (status, mensaje) => {
  const error = new Error(mensaje);
  error.status = status;
  return error;
};

export const crearPedido = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { direccionEnvio, metodoPago, productos } = req.body;
    const idUsuario = req.user.idUsuario || req.user.id;

    if (!idUsuario) {
      return res.status(401).json({
        error: 'Usuario no autenticado'
      });
    }

    if (!direccionEnvio || !metodoPago || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        error: 'Datos incompletos para crear el pedido'
      });
    }

    for (const item of productos) {
      if (
        !item ||
        typeof item.idProducto !== 'number' ||
        item.idProducto <= 0 ||
        typeof item.cantidad !== 'number' ||
        item.cantidad <= 0
      ) {
        return res.status(400).json({
          error: 'Productos inválidos en el pedido'
        });
      }
    }

    await connection.beginTransaction();

    let total = 0;
    const preciosPorProducto = new Map();

    for (const item of productos) {
      const [rows] = await connection.query(
        'SELECT idProducto, precio FROM productos WHERE idProducto = ?',
        [item.idProducto]
      );

      if (rows.length === 0) {
        throw crearErrorHttp(404, `Producto no encontrado: ${item.idProducto}`);
      }

      const producto = rows[0];
      const precioUnitario = Number(producto.precio);
      preciosPorProducto.set(item.idProducto, precioUnitario);
      if (producto.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para el producto ${item.idProducto}`);
      }
      total += precioUnitario * Number(item.cantidad);
    }

    const [pedidoResult] = await connection.query(
      `INSERT INTO pedidos (total, direccionEnvio, metodoPago, idUsuario)
       VALUES (?, ?, ?, ?)`,
      [total, direccionEnvio, metodoPago, idUsuario]
    );

    const idPedido = pedidoResult.insertId;

    for (const item of productos) {
      const precioUnitario = preciosPorProducto.get(item.idProducto);

      await connection.query(
        `INSERT INTO pedidoDetalles (idPedido, idProducto, cantidad, precioUnitario)
         VALUES (?, ?, ?, ?)`,
        [idPedido, item.idProducto, item.cantidad, precioUnitario]
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

    res.status(error.status || 500).json({
      error: error.status ? error.message : 'Error al crear el pedido',
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