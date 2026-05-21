/**
 * Configuración base para las llamadas a la API del backend.
 * Centraliza la URL base, los headers y el manejo de errores.
 * Incluye gestión automática de tokens JWT para peticiones autenticadas.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

/**
 * Obtiene los headers por defecto para las peticiones JSON.
 * Si existe un token de autenticación en localStorage, lo incluye en el header Authorization.
 * @returns {HeadersInit} Headers listos para usar en fetch con token si existe.
 */
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  }

  // Obtener token de localStorage si existe
  const token = localStorage.getItem('authToken')
  if (token) {
    // Incluir token en formato Bearer para requests autenticadas
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

/**
 * Lee el cuerpo JSON de una respuesta y lanza un error claro si falla.
 * @param {Response} response - Respuesta de fetch.
 * @returns {Promise<any>} Datos JSON de la respuesta.
 */
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    // Priorizamos el mensaje que manda el backend para que el error sea fácil de depurar.
    const message = data?.error || data?.mensaje || 'Error inesperado en la API'
    throw new Error(message)
  }

  return data
}

/**
 * Realiza una petición GET.
 * @param {string} endpoint - Ruta relativa del backend.
 * @returns {Promise<any>} Respuesta JSON.
 */
export const getRequest = async (endpoint) => {
  // Petición de lectura para listados y consultas simples.
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: getHeaders(),
  })

  return handleResponse(response)
}

/**
 * Realiza una petición POST.
 * @param {string} endpoint - Ruta relativa del backend.
 * @param {object} payload - Datos a enviar.
 * @returns {Promise<any>} Respuesta JSON.
 */
export const postRequest = async (endpoint, payload) => {
  // Petición de creación, usada en formularios de alta o login.
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  })

  return handleResponse(response)
}

/**
 * Realiza una petición PUT.
 * @param {string} endpoint - Ruta relativa del backend.
 * @param {object} payload - Datos a actualizar.
 * @returns {Promise<any>} Respuesta JSON.
 */
export const putRequest = async (endpoint, payload) => {
  // Petición de actualización para editar recursos existentes.
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  })

  return handleResponse(response)
}

/**
 * Realiza una petición DELETE.
 * @param {string} endpoint - Ruta relativa del backend.
 * @returns {Promise<any>} Respuesta JSON.
 */
export const deleteRequest = async (endpoint) => {
  // Petición de borrado para acciones administrativas o limpieza.
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })

  return handleResponse(response)
}

/**
 * Realiza una petición PATCH.
 * @param {string} endpoint - Ruta relativa del backend.
 * @param {object} payload - Datos parciales a actualizar.
 * @returns {Promise<any>} Respuesta JSON.
 */
export const patchRequest = async (endpoint, payload) => {
  // Petición de actualización parcial, usada para cambios específicos sin reemplazar toda la entidad.
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  })

  return handleResponse(response)
}
