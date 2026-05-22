import { getRequest } from './api'

/**
 * Obtiene todos los productos publicados por el backend.
 * @returns {Promise<Array>} Lista de productos.
 */
export const getProductos = async () => {
  // Devolvemos el listado completo para que la página pueda filtrar en cliente.
  return getRequest('/productos')
}

/**
 * Busca coincidencias por nombre o descripción.
 * @param {string} texto - Texto escrito en el buscador.
 * @param {Array} productos - Productos cargados desde la API.
 * @returns {Array} Productos que coinciden con el texto.
 */
export const filtrarProductos = (texto, productos) => {
  const busqueda = texto.trim().toLowerCase()

  if (!busqueda) {
    // Sin texto de búsqueda, mostramos todo el catálogo.
    return productos
  }

  return productos.filter((producto) => {
    // Se busca por nombre y por descripción para hacer la experiencia más útil.
    const nombre = (producto.nombre || producto.nombreOriginal || '').toLowerCase()
    const descripcion = (producto.descripcion || producto.descripcionOriginal || '').toLowerCase()

    return nombre.includes(busqueda) || descripcion.includes(busqueda)
  })
}
