import { useState } from 'react'
import { loginUser } from '../../services/authService'
import { useTranslation } from 'react-i18next'

/**
 * Página de login - formulario para iniciar sesión con email y contraseña.
 * Al iniciar sesión correctamente, llama al callback onUserLogin y navega a home.
 * @param {function} onNavigate - Callback para cambiar de página.
 * @param {function} onUserLogin - Callback al hacer login exitoso, recibe datos del usuario.
 */
function Login({ onNavigate, onUserLogin }) {
  const { t } = useTranslation()
  // Email ingresado en el formulario.
  const [email, setEmail] = useState('')
  // Contraseña ingresada en el formulario.
  const [contrasena, setContrasena] = useState('')
  // Mensaje de error para mostrar al usuario.
  const [error, setError] = useState('')
  // Flag para mostrar spinner durante la petición al servidor.
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Maneja el envío del formulario de login.
   * Valida los campos, hace la petición al backend y actualiza el estado global.
   * @param {event} e - Evento del formulario.
   */
  const handleLogin = async (e) => {
    e.preventDefault()
    
      // Validación básica de campos (email + contraseña).
      if (!email || !contrasena) {
          setError(t('auth.errors.loginMissing'))
        return
      }

    setIsLoading(true)
    setError('')

    try {
      // Llamar al servicio de autenticación con email.
      const userData = await loginUser({ email, contrasena })

      // Actualizar estado global del usuario.
      onUserLogin(userData)

      // Limpiar formulario.
      setEmail('')
      setContrasena('')

      // Navegar a home.
      onNavigate('home')
    } catch (err) {
      // Mostrar error al usuario.
      setError(err.message || t('auth.errors.loginFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="page-shell login-shell container-fluid">
      {/* Bootstrap grid, card, form-control, alert and buttons:
          https://getbootstrap.com/docs/5.3/layout/grid/
          https://getbootstrap.com/docs/5.3/components/card/
          https://getbootstrap.com/docs/5.3/forms/form-control/
          https://getbootstrap.com/docs/5.3/components/alerts/
          https://getbootstrap.com/docs/5.3/components/buttons/ */}
      <div className="container-fluid login-container auth-container">
        <div className="row justify-content-center align-items-center login-row w-100 mx-auto">
          <div className="col-12 col-md-9 col-lg-7 col-xl-6">
            <div className="card bg-dark text-white login-card auth-card">
              <div className="card-body p-4 p-md-5 text-center">
                <div className="mb-md-4 mt-md-2 pb-3">
                  {/* Título y descripción de la pantalla de acceso. */}
                  <h2 className="fw-bold mb-2 text-uppercase">{t('auth.login.title')}</h2>
                  <p className="text-white-50 mb-4">{t('auth.login.subtitle')}</p>

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

                  {/* Formulario de login. */}
                  <form onSubmit={handleLogin}>


                    {/* Campo de correo electrónico del usuario. */}
                    <div className="form-outline form-white mb-3 login-field">
                      <input
                        type="email"
                        id="typeEmailX"
                        className="form-control form-control-lg"
                        value={email}
                        autoComplete="username"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder=" "
                        disabled={isLoading}
                      />
                      <label className="form-label" htmlFor="typeEmailX">
                        {t('auth.login.email')}
                      </label>
                    </div>

                    {/* Campo de contraseña para validar la sesión. */}
                    <div className="form-outline form-white mb-4 login-field">
                      <input
                        type="password"
                        id="typePasswordX"
                        className="form-control form-control-lg"
                        value={contrasena}
                        autoComplete="current-password"
                        onChange={(e) => setContrasena(e.target.value)}
                        placeholder=" "
                        disabled={isLoading}
                      />
                      <label className="form-label" htmlFor="typePasswordX">
                        {t('auth.login.password')}
                      </label>
                    </div>

                    {/* Botón principal para enviar credenciales. */}
                    <button
                      className="btn btn-outline-light btn-lg px-5"
                      type="submit"
                      disabled={isLoading}
                    >
                        {isLoading ? t('auth.login.submitLoading') : t('auth.login.submit')}
                    </button>
                  </form>
                </div>

                {/* Enlace para cambiar al formulario de registro. */}
                <div className="login-footer">
                  <p className="mb-0">
                    {t('auth.login.noAccount')}{' '}
                    <button
                      type="button"
                      className="btn btn-link text-white-50 fw-bold p-0"
                      onClick={() => onNavigate('register')}
                      disabled={isLoading}
                    >
                      {t('auth.login.toggle')}
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

export default Login
