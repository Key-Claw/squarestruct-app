import { useState } from 'react'
import { loginUser, registerUser } from '../services/authService'
import '../styles/auth-modal.css'

/**
 * Componente de modal de autenticación reutilizable.
 * Combina formularios de login y registro con animación flip 3D.
 * 
 * Features:
 * - Fondo difuminado oscurecido que desactiva interacción con el resto de la página
 * - Tarjeta con animación flip cuando se cambia entre login y registro
 * - La tarjeta cae desde arriba con una animación suave
 * - Validación de formularios en tiempo real
 * - Gestión de errores y mensajes de carga
 * 
 * @param {object} props - Props del componente
 * @param {boolean} props.isOpen - Indica si el modal está visible
 * @param {boolean} props.isLoginMode - true para login, false para registro
 * @param {function} props.onClose - Callback para cerrar el modal
 * @param {function} props.onToggleMode - Callback para cambiar entre login/registro
 * @param {function} props.onUserLogin - Callback al login exitoso
 * @param {function} props.onNavigate - Callback para navegación
 */
function AuthModal({ isOpen, isLoginMode, onClose, onToggleMode, onUserLogin, onNavigate }) {
  // ============================================================================
  // ESTADO COMPARTIDO ENTRE FORMULARIOS
  // ============================================================================
  
  // Estado de loading global para ambos formularios
  const [isLoading, setIsLoading] = useState(false)
  // Mensaje de error que se muestra al usuario
  const [error, setError] = useState('')

  // ============================================================================
  // ESTADO DEL FORMULARIO DE LOGIN
  // ============================================================================
  
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // ============================================================================
  // ESTADO DEL FORMULARIO DE REGISTRO
  // ============================================================================
  
  const [registerNombre, setRegisterNombre] = useState('')
  const [registerPrimerApellido, setRegisterPrimerApellido] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('')

  /**
   * Valida el formato de email.
   * @param {string} email - Email a validar
   * @returns {boolean} true si es válido, false en caso contrario
   */
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  /**
   * Maneja el envío del formulario de login.
   * Valida campos, hace llamada al backend y actualiza estado global.
   * @param {event} e - Evento del formulario
   */
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    // Validación básica de campos
    if (!loginEmail || !loginPassword) {
      setError('Completa el correo y la contraseña para iniciar sesión.')
      return
    }

    setIsLoading(true)

    try {
      // Llamar al servicio de autenticación del backend
      const userData = await loginUser({ email: loginEmail, contrasena: loginPassword })

      // Actualizar usuario en el estado global de la app
      onUserLogin(userData)

      // Limpiar formulario
      setLoginEmail('')
      setLoginPassword('')

      // Cerrar modal
      onClose()

      // Navegar a home
      onNavigate('home')
    } catch (err) {
      // Mostrar error específico al usuario
      setError(err.message || 'No se pudo iniciar sesión. Revisa tus credenciales.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Maneja el envío del formulario de registro.
   * Valida campos, crea cuenta y hace login automático.
   * @param {event} e - Evento del formulario
   */
  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    // Validación básica de campos obligatorios
    if (!registerNombre || !registerPrimerApellido || !registerEmail || !registerPassword || !registerConfirmPassword) {
      setError('Completa todos los campos para crear tu cuenta.')
      return
    }

    // Validación de longitud mínima del nombre
    if (registerNombre.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.')
      return
    }

    // Validación de formato de email
    if (!isValidEmail(registerEmail)) {
      setError('Introduce un correo electrónico válido.')
      return
    }

    // Validación de longitud mínima de contraseña
    if (registerPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    // Validación de coincidencia de contraseñas
    if (registerPassword !== registerConfirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setIsLoading(true)

    try {
      // Crear nueva cuenta en el backend
      await registerUser(registerNombre, registerPrimerApellido, registerEmail, registerPassword)

      // Hacer login automático con email y contraseña
      const userData = await loginUser({ email: registerEmail, contrasena: registerPassword })

      // Actualizar usuario en el estado global de la app
      onUserLogin(userData)

      // Limpiar formularios
      setRegisterNombre('')
      setRegisterPrimerApellido('')
      setRegisterEmail('')
      setRegisterPassword('')
      setRegisterConfirmPassword('')

      // Cerrar modal
      onClose()

      // Navegar a home
      onNavigate('home')
    } catch (err) {
      // Mostrar error específico al usuario
      setError(err.message || 'No se pudo crear la cuenta. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Limpia el error cuando el usuario intenta hacer algo
   */
  const clearError = () => setError('')

  /**
   * Maneja el clic en el fondo oscuro (backdrop)
   * Solo cierra el modal si se hace clic fuera de la tarjeta
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // No renderizar si el modal está cerrado
  if (!isOpen) return null

  return (
    <>
      {/* BACKDROP OSCURO CON EFECTO BLUR */}
      <div className="auth-modal-backdrop" onClick={handleBackdropClick}>
        {/* CONTENEDOR DEL MODAL CON ANIMACIÓN FLIP 3D */}
        <div className="auth-modal-container">
          {/* WRAPPER CON PERSPECTIVA PARA EFECTO 3D */}
          <div className={`auth-modal-flip-wrapper ${isLoginMode ? 'login' : 'register'}`}>
            
            {/* ===== LADO 1: FORMULARIO DE LOGIN ===== */}
            <div className="auth-modal-card auth-modal-login">
              <div className="auth-modal-header">
                <h2>Iniciar sesión</h2>
                <button
                  type="button"
                  className="auth-modal-close-btn"
                  onClick={onClose}
                  aria-label="Cerrar modal"
                >
                  ✕
                </button>
              </div>

              <p className="auth-modal-subtitle">
                Accede con tu correo electrónico y contraseña.
              </p>

              {/* Mostrar mensaje de error si existe */}
              {error && (
                <div className="auth-modal-error">
                  <span>{error}</span>
                  <button
                    type="button"
                    className="auth-modal-error-close"
                    onClick={clearError}
                    aria-label="Cerrar error"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* FORMULARIO DE LOGIN */}
              <form onSubmit={handleLogin} className="auth-modal-form">
                {/* Campo de email */}
                <div className="auth-modal-form-group">
                  <label htmlFor="login-email">Correo</label>
                  <input
                    id="login-email"
                    type="email"
                    className="auth-modal-input"
                    placeholder="tu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {/* Campo de contraseña */}
                <div className="auth-modal-form-group">
                  <label htmlFor="login-password">Contraseña</label>
                  <input
                    id="login-password"
                    type="password"
                    className="auth-modal-input"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {/* Botón de envío */}
                <button
                  type="submit"
                  className="auth-modal-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
              </form>

              {/* Enlace para cambiar a registro */}
              <div className="auth-modal-footer">
                <p>
                  ¿No tienes cuenta?{' '}
                  <button
                    type="button"
                    className="auth-modal-toggle-btn"
                    onClick={onToggleMode}
                    disabled={isLoading}
                  >
                    Regístrate aquí
                  </button>
                </p>
              </div>
            </div>

            {/* ===== LADO 2: FORMULARIO DE REGISTRO ===== */}
            <div className="auth-modal-card auth-modal-register">
              <div className="auth-modal-header">
                <h2>Crear cuenta</h2>
                <button
                  type="button"
                  className="auth-modal-close-btn"
                  onClick={onClose}
                  aria-label="Cerrar modal"
                >
                  ✕
                </button>
              </div>

              <p className="auth-modal-subtitle">
                Crea tu cuenta para guardar tus datos y avanzar con el proyecto.
              </p>

              {/* Mostrar mensaje de error si existe */}
              {error && (
                <div className="auth-modal-error">
                  <span>{error}</span>
                  <button
                    type="button"
                    className="auth-modal-error-close"
                    onClick={clearError}
                    aria-label="Cerrar error"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* FORMULARIO DE REGISTRO */}
              <form onSubmit={handleRegister} className="auth-modal-form">
                {/* Campo de nombre */}
                <div className="auth-modal-form-group">
                  <label htmlFor="register-nombre">Nombre</label>
                  <input
                    id="register-nombre"
                    type="text"
                    className="auth-modal-input"
                    placeholder="Tu nombre"
                    value={registerNombre}
                    onChange={(e) => setRegisterNombre(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {/* Campo de primer apellido */}
                <div className="auth-modal-form-group">
                  <label htmlFor="register-apellido">Primer apellido</label>
                  <input
                    id="register-apellido"
                    type="text"
                    className="auth-modal-input"
                    placeholder="Tu primer apellido"
                    value={registerPrimerApellido}
                    onChange={(e) => setRegisterPrimerApellido(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {/* Campo de email */}
                <div className="auth-modal-form-group">
                  <label htmlFor="register-email">Correo</label>
                  <input
                    id="register-email"
                    type="email"
                    className="auth-modal-input"
                    placeholder="tu@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {/* Campo de contraseña */}
                <div className="auth-modal-form-group">
                  <label htmlFor="register-password">Contraseña</label>
                  <input
                    id="register-password"
                    type="password"
                    className="auth-modal-input"
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {/* Campo de confirmación de contraseña */}
                <div className="auth-modal-form-group">
                  <label htmlFor="register-confirm-password">Confirmar contraseña</label>
                  <input
                    id="register-confirm-password"
                    type="password"
                    className="auth-modal-input"
                    placeholder="••••••••"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {/* Botón de envío */}
                <button
                  type="submit"
                  className="auth-modal-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
              </form>

              {/* Enlace para cambiar a login */}
              <div className="auth-modal-footer">
                <p>
                  ¿Ya tienes cuenta?{' '}
                  <button
                    type="button"
                    className="auth-modal-toggle-btn"
                    onClick={onToggleMode}
                    disabled={isLoading}
                  >
                    Inicia sesión aquí
                  </button>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default AuthModal
