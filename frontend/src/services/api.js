/**
 * Configuración base para las llamadas a la API del backend.
 * Centraliza la URL base, los headers y el manejo de errores.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * Obtiene los headers por defecto para las peticiones JSON.
 * @returns {HeadersInit} Headers listos para usar en fetch.
 */
const getHeaders = () => ({
  'Content-Type': 'application/json',
})

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
