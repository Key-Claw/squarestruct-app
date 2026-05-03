import { getRequest, postRequest } from './api'

/**
 * Crea un pedido para el usuario autenticado.
 * @param {object} payload - Datos del pedido.
 * @returns {Promise<any>} Respuesta del backend.
 */
export const crearPedido = async (payload) => {
	return postRequest('/orders', payload)
}

/**
 * Obtiene los pedidos del usuario autenticado.
 * @returns {Promise<any>} Listado de pedidos.
 */
export const obtenerMisPedidos = async () => {
	return getRequest('/orders')
}
