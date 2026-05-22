import { useState } from 'react'
import { registerUser, loginUser } from '../../services/authService'
import { useTranslation } from 'react-i18next'

/**
 * Página de registro - formulario para crear nueva cuenta.
 * Al registrarse correctamente, hace login automático y navega a home.
 * @param {function} onNavigate - Callback para cambiar de página.
 * @param {function} onUserLogin - Callback al hacer login exitoso después del registro.
 */
function Register({ onNavigate, onUserLogin }) {
  const { t } = useTranslation()
  // Nombre y primer apellido del usuario a registrar.
  const [nombre, setNombre] = useState('')
  const [primerApellido, setPrimerApellido] = useState('')
  // Email para la nueva cuenta.
  const [email, setEmail] = useState('')
  // Contraseña a establecer.
  const [contrasena, setContrasena] = useState('')
  // Confirmación de contraseña para validar coincidencia.
  const [confirmaContrasena, setConfirmaContrasena] = useState('')
  // Mensaje de error para mostrar al usuario.
  const [error, setError] = useState('')
  // Flag para mostrar spinner durante la petición al servidor.
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Maneja el envío del formulario de registro.
   * Valida campos, crea la cuenta, y hace login automático.
   * @param {event} e - Evento del formulario.
   */
  const handleRegister = async (e) => {
    e.preventDefault()

    // Validación básica de campos obligatorios.
    if (!nombre || !primerApellido || !email || !contrasena || !confirmaContrasena) {
      setError(t('auth.errors.registerMissing'))
      return
    }

    // Validación de longitud mínima del nombre.
    if (nombre.trim().length < 3) {
      setError(t('auth.errors.registerName'))
      return
    }

    // Validación de formato de email.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('auth.errors.registerEmail'))
      return
    }

    // Validación de longitud mínima de contraseña.
    if (contrasena.length < 6) {
      setError(t('auth.errors.registerPassword'))
      return
    }

    // Validación de coincidencia de contraseñas.
    if (contrasena !== confirmaContrasena) {
      setError(t('auth.errors.registerMismatch'))
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Crear la nueva cuenta en el backend.
      await registerUser(nombre, primerApellido, email, contrasena)

      // Hacer login automático con email y contraseña
      const userData = await loginUser({ email, contrasena })

      // Actualizar estado global del usuario.
      onUserLogin(userData)

      // Limpiar formulario.
      setNombre('')
      setPrimerApellido('')
      setEmail('')
      setContrasena('')
      setConfirmaContrasena('')

      // Navegar a home.
      onNavigate('home')
    } catch (err) {
      // Mostrar error específico al usuario.
      setError(err.message || t('auth.errors.registerFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="page-shell register-shell container-fluid">
      {/* Bootstrap grid, card, form-control, alert and buttons:
          https://getbootstrap.com/docs/5.3/layout/grid/
          https://getbootstrap.com/docs/5.3/components/card/
          https://getbootstrap.com/docs/5.3/forms/form-control/
          https://getbootstrap.com/docs/5.3/components/alerts/
          https://getbootstrap.com/docs/5.3/components/buttons/ */}
      <div className="container-fluid register-container auth-container">
        <div className="row justify-content-center align-items-center register-row w-100 mx-auto">
          <div className="col-12 col-md-8 col-lg-7 col-xl-6">
            <div className="card bg-dark text-white register-card auth-card">
              <div className="card-body p-4 p-md-5 text-center">
                <div className="mb-md-4 mt-md-2 pb-3">
                  {/* Título y contexto de la creación de cuenta. */}
                  <h2 className="fw-bold mb-2 text-uppercase">
                    {t('auth.register.title')}
                  </h2>

                  <p className="text-white-50 mb-4">
                    {t('auth.register.subtitle')}
                  </p>

                  {/* Mostrar mensaje de error si ocurre. */}
                  {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                      {error}
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError('')}
                        aria-label={t('common.close')}
                      ></button>
                    </div>
                  )}

                  {/* Formulario de registro. */}
                  <form onSubmit={handleRegister}>
                    {/* Campo para el nombre y primer apellido */}
                    <div className="form-outline form-white mb-3">
                      <input
                        type="text"
                        id="registerNombre"
                        className="form-control form-control-lg mb-2"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder=" "
                        disabled={isLoading}
                      />
                      <label className="form-label" htmlFor="registerNombre">{t('auth.register.name')}</label>

                      <input
                        type="text"
                        id="registerPrimerApellido"
                        className="form-control form-control-lg mt-2"
                        value={primerApellido}
                        onChange={(e) => setPrimerApellido(e.target.value)}
                        placeholder=" "
                        disabled={isLoading}
                      />
                      <label className="form-label" htmlFor="registerPrimerApellido">{t('auth.register.firstSurname')}</label>
                    </div>

                    {/* Campo para el correo de acceso. */}
                    <div className="form-outline form-white mb-3">
                      <input
                        type="email"
                        id="registerEmail"
                        className="form-control form-control-lg"
                        value={email}
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder=" "
                        disabled={isLoading}
                      />
                      <label
                        className="form-label"
                        htmlFor="registerEmail"
                      >
                        {t('auth.register.email')}
                      </label>
                    </div>

                    {/* Campo para definir la contraseña principal. */}
                    <div className="form-outline form-white mb-3">
                      <input
                        type="password"
                        id="registerPassword"
                        className="form-control form-control-lg"
                        value={contrasena}
                        autoComplete="new-password"
                        onChange={(e) => setContrasena(e.target.value)}
                        placeholder=" "
                        disabled={isLoading}
                      />
                      <label
                        className="form-label"
                        htmlFor="registerPassword"
                      >
                        {t('auth.register.password')}
                      </label>
                    </div>

                    {/* Confirmación para evitar errores al escribir la contraseña. */}
                    <div className="form-outline form-white mb-4">
                      <input
                        type="password"
                        id="registerConfirmPassword"
                        className="form-control form-control-lg"
                        value={confirmaContrasena}
                        autoComplete="new-password"
                        onChange={(e) => setConfirmaContrasena(e.target.value)}
                        placeholder=" "
                        disabled={isLoading}
                      />
                      <label
                        className="form-label"
                        htmlFor="registerConfirmPassword"
                      >
                        {t('auth.register.confirmPassword')}
                      </label>
                    </div>

                    {/* Botón principal para crear la cuenta. */}
                    <button
                      className="btn btn-outline-light btn-lg px-5"
                      type="submit"
                      disabled={isLoading}
                    >
                        {isLoading ? t('auth.register.submitLoading') : t('auth.register.submit')}
                    </button>
                  </form>
                </div>

                {/* Enlace para volver al acceso si ya existe una cuenta. */}
                <div>
                  <p className="mb-0">
                    {t('auth.register.hasAccount')}{' '}
                    <button
                      type="button"
                      className="btn btn-link text-white-50 fw-bold p-0 text-decoration-none"
                      onClick={() => onNavigate('login')}
                      disabled={isLoading}
                    >
                      {t('auth.register.toggle')}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Register
