import { getRequest, postRequest, patchRequest } from './api'

/**
 * Crea un pedido para el usuario autenticado.
 * @param {object} payload - Datos del pedido (direccionEnvio, metodoPago, productos).
 * @returns {Promise<any>} Respuesta del backend con ID del pedido creado.
 */
export const crearPedido = async (payload) => {
	return postRequest('/orders', payload)
}

/**
 * Obtiene los pedidos del usuario autenticado.
 * @returns {Promise<any>} Listado de pedidos del usuario.
 */
export const obtenerMisPedidos = async () => {
	return getRequest('/orders')
}

/**
 * Obtiene los detalles de un pedido específico.
 * @param {number} idPedido - ID del pedido a consultar.
 * @returns {Promise<any>} Detalles completos del pedido con productos.
 */
export const obtenerPedidoById = async (idPedido) => {
	return getRequest(`/orders/${idPedido}`)
}

/**
 * Obtiene todos los pedidos pendientes de aprobación (solo para administradores).
 * Devuelve información del cliente y resumen de productos.
 * @returns {Promise<any>} Listado de pedidos con estado 'pendiente'.
 * @throws {Error} Si el usuario no es administrador o falla la petición.
 */
export const obtenerPedidosPendientes = async () => {
	return getRequest('/orders/admin/pendientes')
}

/**
 * Obtiene todo el historial de pedidos para administradores.
 * @returns {Promise<any>} Listado completo de pedidos con su estado histórico.
 */
export const obtenerPedidosAdmin = async () => {
	return getRequest('/orders/admin/todos')
}

/**
 * Actualiza el estado de un pedido a 'aceptado' o 'denegado' (solo para administradores).
 * Esta acción notifica al usuario del cambio mediante la actualización del estado.
 * @param {number} idPedido - ID del pedido a actualizar.
 * @param {string} nuevoEstado - Nuevo estado: 'aceptado' o 'denegado'.
 * @returns {Promise<any>} Pedido actualizado con nuevo estado.
 * @throws {Error} Si el estado no es válido o falla la petición.
 */
export const actualizarEstadoPedido = async (idPedido, nuevoEstado) => {
	return patchRequest(`/orders/${idPedido}/estado`, { nuevoEstado })
}
