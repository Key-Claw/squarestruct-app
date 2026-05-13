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
      `SELECT idPedido, fecha, total, estado, fechaCancelacion, direccionEnvio, metodoPago
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

export const obtenerPedidoById = async (req, res) => {
  try {
    const { id } = req.params;
    const idUsuario = req.user.idUsuario || req.user.id;
    const esAdmin = req.user?.rol?.toLowerCase() === 'admin';

    const [pedidos] = await db.query(
      `SELECT idPedido, fecha, total, estado, fechaCancelacion, direccionEnvio, metodoPago, idUsuario
       FROM pedidos
       WHERE idPedido = ? ${esAdmin ? '' : 'AND idUsuario = ?'}`,
      esAdmin ? [id] : [id, idUsuario]
    );

    if (pedidos.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const [detalles] = await db.query(
      `SELECT
        pd.idProducto,
        pd.cantidad,
        pd.precioUnitario,
        p.nombre
       FROM pedidoDetalles pd
       JOIN productos p ON pd.idProducto = p.idProducto
       WHERE pd.idPedido = ?`,
      [id]
    );

    res.json({
      ...pedidos[0],
      productos: detalles
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener el pedido',
      detalle: error.message
    });
  }
};

export const cancelarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const idUsuario = req.user.idUsuario || req.user.id;
    const esAdmin = req.user?.rol?.toLowerCase() === 'admin';

    const [pedidos] = await db.query(
      `SELECT idPedido, estado, idUsuario
       FROM pedidos
       WHERE idPedido = ?`,
      [id]
    );

    if (pedidos.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const pedido = pedidos[0];

    if (!esAdmin && Number(pedido.idUsuario) !== Number(idUsuario)) {
      return res.status(403).json({ error: 'No puedes cancelar este pedido' });
    }

    if (pedido.estado === 'cancelado') {
      return res.status(409).json({ error: 'El pedido ya esta cancelado' });
    }

    if (['enviado', 'entregado'].includes(pedido.estado)) {
      return res.status(409).json({
        error: 'No se puede cancelar un pedido completado o enviado'
      });
    }

    await db.query(
      `UPDATE pedidos
       SET estado = 'cancelado', fechaCancelacion = NOW()
       WHERE idPedido = ?`,
      [id]
    );

    res.json({
      message: 'Pedido cancelado correctamente',
      pedido: {
        idPedido: Number(id),
        estado: 'cancelado'
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al cancelar el pedido',
      detalle: error.message
    });
  }
};

/**
 * Lista todos los pedidos con estado 'pendiente' para administradores.
 * Devuelve información del pedido, usuario y detalles de productos.
 * @route GET /api/pedidos/admin/pendientes
 * @middleware authMiddleware - Requiere autenticación
 * @middleware adminMiddleware - Requiere rol de administrador
 * @returns {json} Array de pedidos pendientes con detalles de usuario y productos
 */
export const listarPedidosPendientes = async (req, res) => {
  try {
    // Consulta pedidos pendientes con info del usuario y productos
    const [pedidos] = await db.query(
      `SELECT 
        p.idPedido,
        p.fecha,
        p.total,
        p.estado,
        p.direccionEnvio,
        p.metodoPago,
        u.idUsuario,
        u.nombre,
        u.primerApellido,
        u.segundoApellido,
        u.email,
        COUNT(pd.idProducto) as totalProductos
       FROM pedidos p
       JOIN usuarios u ON p.idUsuario = u.idUsuario
       LEFT JOIN pedidoDetalles pd ON p.idPedido = pd.idPedido
       WHERE p.estado = 'pendiente'
       GROUP BY p.idPedido
       ORDER BY p.fecha ASC`
    );

    res.json(pedidos);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener los pedidos pendientes',
      detalle: error.message
    });
  }
};

/**
 * Actualiza el estado de un pedido (aceptado o denegado).
 * Solo los administradores pueden cambiar el estado de un pedido.
 * Estados válidos: 'aceptado', 'denegado'
 * @route PATCH /api/pedidos/:id/estado
 * @middleware authMiddleware - Requiere autenticación
 * @middleware adminMiddleware - Requiere rol de administrador
 * @param {number} id - ID del pedido
 * @body {string} nuevoEstado - Nuevo estado ('aceptado' o 'denegado')
 * @returns {json} Pedido actualizado con su nuevo estado
 */
export const actualizarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevoEstado } = req.body;

    // Validar que el nuevo estado sea permitido
    const estadosValidos = ['aceptado', 'denegado'];
    if (!nuevoEstado || !estadosValidos.includes(nuevoEstado.toLowerCase())) {
      return res.status(400).json({
        error: 'El estado debe ser "aceptado" o "denegado"'
      });
    }

    // Verificar que el pedido existe y está en estado pendiente
    const [pedidos] = await db.query(
      `SELECT idPedido, estado FROM pedidos WHERE idPedido = ?`,
      [id]
    );

    if (pedidos.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const pedido = pedidos[0];
    if (pedido.estado !== 'pendiente') {
      return res.status(409).json({
        error: `No se puede cambiar el estado de un pedido que está en estado: ${pedido.estado}`
      });
    }

    // Actualizar el estado del pedido
    const estadoNormalizado = nuevoEstado.toLowerCase();
    await db.query(
      `UPDATE pedidos SET estado = ? WHERE idPedido = ?`,
      [estadoNormalizado, id]
    );

    // Devolver el pedido actualizado con info del usuario
    const [pedidoActualizado] = await db.query(
      `SELECT 
        p.idPedido,
        p.fecha,
        p.total,
        p.estado,
        p.direccionEnvio,
        p.metodoPago,
        u.nombre,
        u.email
       FROM pedidos p
       JOIN usuarios u ON p.idUsuario = u.idUsuario
       WHERE p.idPedido = ?`,
      [id]
    );

    res.json({
      mensaje: `Pedido ${estadoNormalizado} correctamente`,
      pedido: pedidoActualizado[0]
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al actualizar el estado del pedido',
      detalle: error.message
    });
  }
};
