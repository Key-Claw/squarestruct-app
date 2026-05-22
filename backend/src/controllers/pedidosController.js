// Controladores para manejar la lógica de pedidos
import { db } from '../app.js';
import { getLocaleFromRequest, getLocalizedMessage, localizePedido, localizePedidos, localizeProduct } from '../utils/localization.js';

const crearErrorHttp = (status, mensaje) => {
  const error = new Error(mensaje);
  error.status = status;
  return error;
};

export const crearPedido = async (req, res) => {
  const connection = await db.getConnection();
  const locale = getLocaleFromRequest(req);

  try {
    const { direccionEnvio, metodoPago, productos } = req.body;
    const idUsuario = req.user.idUsuario || req.user.id;

    if (!idUsuario) {
      return res.status(401).json({
        error: getLocalizedMessage(locale, {
          es: 'Usuario no autenticado',
          en: 'User not authenticated'
        })
      });
    }

    if (!direccionEnvio || !metodoPago || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        error: getLocalizedMessage(locale, {
          es: 'Datos incompletos para crear el pedido',
          en: 'Incomplete data to create the order'
        })
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
          error: getLocalizedMessage(locale, {
            es: 'Productos inválidos en el pedido',
            en: 'Invalid products in the order'
          })
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
        throw crearErrorHttp(404, getLocalizedMessage(locale, {
          es: `Producto no encontrado: ${item.idProducto}`,
          en: `Product not found: ${item.idProducto}`
        }));
      }

      const producto = rows[0];
      const precioUnitario = Number(producto.precio);
      preciosPorProducto.set(item.idProducto, precioUnitario);
      if (producto.stock < item.cantidad) {
        throw new Error(getLocalizedMessage(locale, {
          es: `Stock insuficiente para el producto ${item.idProducto}`,
          en: `Insufficient stock for product ${item.idProducto}`
        }));
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
      mensaje: getLocalizedMessage(locale, {
        es: 'Pedido creado correctamente',
        en: 'Order created successfully'
      }),
      idPedido,
      total
    });
  } catch (error) {
    await connection.rollback();

    res.status(error.status || 500).json({
      error: error.status ? error.message : getLocalizedMessage(locale, {
        es: 'Error al crear el pedido',
        en: 'Error while creating the order'
      }),
      detalle: error.message
    });
  } finally {
    connection.release();
  }
};

export const listarPedidosUsuario = async (req, res) => {
  try {
    const locale = getLocaleFromRequest(req);
    const idUsuario = req.user.idUsuario || req.user.id;

    const [pedidos] = await db.query(
      `SELECT idPedido, fecha, total, estado, fechaCancelacion, direccionEnvio, metodoPago
       FROM pedidos
       WHERE idUsuario = ?
       ORDER BY fecha DESC`,
      [idUsuario]
    );

    res.json(localizePedidos(pedidos, locale));
  } catch (error) {
    res.status(500).json({
      error: getLocalizedMessage(getLocaleFromRequest(req), {
        es: 'Error al obtener los pedidos',
        en: 'Error while fetching the orders'
      })
    });
  }
};

export const obtenerPedidoById = async (req, res) => {
  try {
    const { id } = req.params;
    const locale = getLocaleFromRequest(req);
    const idUsuario = req.user.idUsuario || req.user.id;
    const esAdmin = req.user?.rol?.toLowerCase() === 'admin';

    const [pedidos] = await db.query(
      `SELECT idPedido, fecha, total, estado, fechaCancelacion, direccionEnvio, metodoPago, idUsuario
       FROM pedidos
       WHERE idPedido = ? ${esAdmin ? '' : 'AND idUsuario = ?'}`,
      esAdmin ? [id] : [id, idUsuario]
    );

    if (pedidos.length === 0) {
      return res.status(404).json({
        error: getLocalizedMessage(locale, {
          es: 'Pedido no encontrado',
          en: 'Order not found'
        })
      });
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
      ...localizePedido(pedidos[0], locale),
      productos: detalles.map((producto) => localizeProduct(producto, locale))
    });
  } catch (error) {
    res.status(500).json({
      error: getLocalizedMessage(getLocaleFromRequest(req), {
        es: 'Error al obtener el pedido',
        en: 'Error while fetching the order'
      }),
      detalle: error.message
    });
  }
};

export const cancelarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const locale = getLocaleFromRequest(req);
    const idUsuario = req.user.idUsuario || req.user.id;
    const esAdmin = req.user?.rol?.toLowerCase() === 'admin';

    const [pedidos] = await db.query(
      `SELECT idPedido, estado, idUsuario
       FROM pedidos
       WHERE idPedido = ?`,
      [id]
    );

    if (pedidos.length === 0) {
      return res.status(404).json({
        error: getLocalizedMessage(locale, {
          es: 'Pedido no encontrado',
          en: 'Order not found'
        })
      });
    }

    const pedido = pedidos[0];

    if (!esAdmin && Number(pedido.idUsuario) !== Number(idUsuario)) {
      return res.status(403).json({
        error: getLocalizedMessage(locale, {
          es: 'No puedes cancelar este pedido',
          en: 'You cannot cancel this order'
        })
      });
    }

    if (pedido.estado === 'cancelado') {
      return res.status(409).json({
        error: getLocalizedMessage(locale, {
          es: 'El pedido ya esta cancelado',
          en: 'The order is already canceled'
        })
      });
    }

    if (['enviado', 'entregado'].includes(pedido.estado)) {
      return res.status(409).json({
        error: getLocalizedMessage(locale, {
          es: 'No se puede cancelar un pedido completado o enviado',
          en: 'A shipped or completed order cannot be canceled'
        })
      });
    }

    await db.query(
      `UPDATE pedidos
       SET estado = 'cancelado', fechaCancelacion = NOW()
       WHERE idPedido = ?`,
      [id]
    );

    res.json({
      message: getLocalizedMessage(locale, {
        es: 'Pedido cancelado correctamente',
        en: 'Order canceled successfully'
      }),
      pedido: {
        idPedido: Number(id),
        estado: 'cancelado',
        estadoLabel: getLocalizedMessage(locale, {
          es: 'Cancelado',
          en: 'Canceled'
        })
      }
    });
  } catch (error) {
    res.status(500).json({
      error: getLocalizedMessage(getLocaleFromRequest(req), {
        es: 'Error al cancelar el pedido',
        en: 'Error while canceling the order'
      }),
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
    const locale = getLocaleFromRequest(req);
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

    res.json(localizePedidos(pedidos, locale));
  } catch (error) {
    res.status(500).json({
      error: getLocalizedMessage(getLocaleFromRequest(req), {
        es: 'Error al obtener los pedidos pendientes',
        en: 'Error while fetching pending orders'
      }),
      detalle: error.message
    });
  }
};

/**
 * Lista todo el historial de pedidos para administradores.
 * @route GET /api/pedidos/admin/todos
 * @middleware authMiddleware - Requiere autenticación
 * @middleware adminMiddleware - Requiere rol de administrador
 * @returns {json} Array de pedidos con estado histórico y datos del cliente
 */
export const listarPedidosAdmin = async (req, res) => {
  try {
    const locale = getLocaleFromRequest(req);
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
       GROUP BY p.idPedido
       ORDER BY p.fecha DESC`
    );

    res.json(localizePedidos(pedidos, locale));
  } catch (error) {
    res.status(500).json({
      error: getLocalizedMessage(getLocaleFromRequest(req), {
        es: 'Error al obtener el historial de pedidos',
        en: 'Error while fetching the order history'
      }),
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
    const locale = getLocaleFromRequest(req);

    // Validar que el nuevo estado sea permitido
    const estadosValidos = ['aceptado', 'denegado'];
    if (!nuevoEstado || !estadosValidos.includes(nuevoEstado.toLowerCase())) {
      return res.status(400).json({
        error: getLocalizedMessage(locale, {
          es: 'El estado debe ser "aceptado" o "denegado"',
          en: 'The status must be "accepted" or "rejected"'
        })
      });
    }

    // Verificar que el pedido existe y está en estado pendiente
    const [pedidos] = await db.query(
      `SELECT idPedido, estado FROM pedidos WHERE idPedido = ?`,
      [id]
    );

    if (pedidos.length === 0) {
      return res.status(404).json({
        error: getLocalizedMessage(locale, {
          es: 'Pedido no encontrado',
          en: 'Order not found'
        })
      });
    }

    const pedido = pedidos[0];
    if (pedido.estado !== 'pendiente') {
      return res.status(409).json({
        error: getLocalizedMessage(locale, {
          es: `No se puede cambiar el estado de un pedido que está en estado: ${pedido.estado}`,
          en: `You cannot change the status of an order that is currently: ${pedido.estado}`
        })
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
      mensaje: getLocalizedMessage(locale, {
        es: `Pedido ${estadoNormalizado} correctamente`,
        en: `Order ${estadoNormalizado === 'aceptado' ? 'accepted' : 'rejected'} successfully`
      }),
      pedido: localizePedido(pedidoActualizado[0], locale)
    });
  } catch (error) {
    res.status(500).json({
      error: getLocalizedMessage(getLocaleFromRequest(req), {
        es: 'Error al actualizar el estado del pedido',
        en: 'Error while updating the order status'
      }),
      detalle: error.message
    });
  }
};
