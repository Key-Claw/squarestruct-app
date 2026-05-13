/**
 * Servicio centralizado de autenticación.
 * Gestiona login, registro, logout, almacenamiento de tokens y datos de usuario.
 * Proporciona métodos auxiliares para verificar estado de autenticación y permisos.
 */

import { postRequest, getRequest, putRequest } from './api'

const TOKEN_KEY = 'authToken'
const USER_KEY = 'currentUser'

const decodeTokenPayload = (token) => {
  try {
    const [, payload] = token.split('.')
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

const isTokenExpired = (token) => {
  const payload = decodeTokenPayload(token)

  if (!payload?.exp) {
    return true
  }

  return payload.exp * 1000 <= Date.now()
}

/**
 * Corrige texto con mojibake típico de una mala decodificación UTF-8/latin1.
 * En frontend usamos una heurística para no tocar textos que ya están correctos.
 * @param {string} value - Texto a revisar.
 * @returns {string} Texto normalizado o el original.
 */
const normalizarTexto = (value) => {
  if (typeof value !== 'string' || !/[ÃÂ�]/.test(value)) {
    return value
  }

  try {
    const bytes = Uint8Array.from([...value].map((character) => character.charCodeAt(0)))
    return new TextDecoder('utf-8').decode(bytes)
  } catch {
    return value
  }
}

/**
 * Normaliza los datos del usuario para evitar nombres o emails con caracteres rotos.
 * @param {object} userData - Usuario a normalizar.
 * @returns {object} Usuario con texto corregido.
 */
const normalizarUsuario = (userData) => {
  if (!userData) return userData

  return {
    ...userData,
    nombre: normalizarTexto(userData.nombre),
    email: normalizarTexto(userData.email),
    rol: normalizarTexto(userData.rol),
  }
}

/**
 * Registra un nuevo usuario en el sistema.
 * @param {string} nombre - Nombre completo del usuario.
 * @param {string} email - Correo electrónico único.
 * @param {string} contrasena - Contraseña del usuario.
 * @returns {Promise<object>} Respuesta del servidor con mensaje de éxito.
 * @throws {Error} Si fallan validaciones o si el email ya existe.
 */
export const registerUser = async (nombre, primerApellido, email, contrasena) => {
  const response = await postRequest('/usuarios/register', {
    nombre,
    primerApellido,
    email,
    contrasena,
  })
  return response
}

/**
 * Inicia sesión con credenciales de usuario.
 * Valida credenciales en backend, almacena JWT token y datos de usuario en localStorage.
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} contrasena - Contraseña del usuario.
 * @returns {Promise<object>} Objeto con datos del usuario autenticado.
 * @throws {Error} Si las credenciales son inválidas.
 */
export const loginUser = async ({ email, nombre, primerApellido, contrasena }) => {
  try {
    const payload = {}
    if (nombre && primerApellido) {
      payload.nombre = nombre
      payload.primerApellido = primerApellido
    } else if (email) {
      payload.email = email
    }
    payload.contrasena = contrasena

    // Llamar al endpoint de login (acepta email o nombre+primerApellido)
    const response = await postRequest('/usuarios/login', payload)

    // El backend devuelve { token }
    if (response.token) {
      localStorage.setItem(TOKEN_KEY, response.token)
      const jwtPayload = decodeTokenPayload(response.token)
      const userData = {
        idUsuario: jwtPayload.idUsuario,
        nombre: normalizarTexto(jwtPayload.nombre),
        email: normalizarTexto(jwtPayload.email),
        rol: normalizarTexto(jwtPayload.rol)
      }
      localStorage.setItem(USER_KEY, JSON.stringify(userData))
      return userData
    }

    throw new Error('No se recibió token de autenticación')
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error(String(error), { cause: error })
  }
}

/**
 * Cierra la sesión del usuario.
 * Elimina token y datos del usuario de localStorage.
 */
export const logoutUser = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

/**
 * Obtiene el token JWT almacenado.
 * @returns {string|null} Token JWT o null si no existe.
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Obtiene los datos del usuario autenticado.
 * @returns {object|null} Objeto con datos del usuario o null si no está autenticado.
 */
export const getCurrentUser = () => {
  const token = getToken()

  if (!token || isTokenExpired(token)) {
    logoutUser()
    return null
  }

  const userJson = localStorage.getItem(USER_KEY)
  return userJson ? normalizarUsuario(JSON.parse(userJson)) : null
}

/**
 * Verifica si el usuario está autenticado (tiene token válido).
 * @returns {boolean} true si el usuario tiene sesión activa.
 */
export const isAuthenticated = () => {
  const token = getToken()
  return !!token && !isTokenExpired(token)
}

/**
 * Verifica si el usuario autenticado tiene rol de administrador.
 * @returns {boolean} true si el usuario es admin, false en caso contrario.
 */
export const isAdmin = () => {
  const user = getCurrentUser()
  return user?.rol?.toLowerCase() === 'admin'
}

/**
 * Obtiene el perfil del usuario autenticado (datos completos desde servidor).
 * Útil para refrescar los datos del usuario después de cambios.
 * @returns {Promise<object>} Datos completos del usuario del servidor.
 * @throws {Error} Si no hay usuario autenticado o falla la petición.
 */
export const getProfile = async () => {
  const user = getCurrentUser()
  if (!user) {
    throw new Error('No hay usuario autenticado')
  }

  try {
    const response = await getRequest('/perfil')
    const userData = response?.usuario ?? response
    // Actualizar datos en localStorage
    const normalizedUser = normalizarUsuario(userData)
    localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser))
    return normalizedUser
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error(String(error), { cause: error })
  }
}

/**
 * Obtiene la lista de todos los usuarios (solo para admin).
 * @returns {Promise<Array>} Lista de usuarios con sus datos.
 * @throws {Error} Si no está autenticado o el servidor rechaza la petición.
 */
export const getAllUsers = async () => {
  try {
    return await getRequest('/usuarios')
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error(String(error), { cause: error })
  }
}

/**
 * Obtiene el detalle completo de un usuario por su ID.
 * Se usa en el panel de administracion para abrir una vista detallada sin
 * depender solo de los datos resumidos de la tabla.
 * @param {number} idUsuario - ID del usuario a consultar.
 * @returns {Promise<object>} Datos completos del usuario.
 * @throws {Error} Si la petición falla.
 */
export const getUserById = async (idUsuario) => {
  try {
    const response = await getRequest(`/usuarios/${idUsuario}`)
    const userData = response?.usuario ?? response
    return normalizarUsuario(userData)
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error(String(error), { cause: error })
  }
}

/**
 * Actualiza los datos de un usuario (principalmente usado para cambiar rol por admin).
 * @param {number} idUsuario - ID del usuario a actualizar.
 * @param {object} userData - Objeto con los campos a actualizar (nombre, email, rol).
 * @returns {Promise<object>} Respuesta del servidor con confirmación.
 * @throws {Error} Si la petición falla.
 */
export const updateUser = async (idUsuario, userData) => {
  try {
    return await putRequest(`/usuarios/${idUsuario}`, userData)
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error(String(error), { cause: error })
  }
}
