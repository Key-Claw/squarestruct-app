import AuthErrorMessage from './AuthErrorMessage'

function RegisterForm({
  nombre,
  primerApellido,
  email,
  password,
  confirmPassword,
  error,
  isLoading,
  onNombreChange,
  onPrimerApellidoChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onToggleMode,
  onClose,
  onClearError
}) {
  return (
    <div className="auth-modal-card auth-modal-register">
      <div className="auth-modal-header">
        <h2>Crear cuenta</h2>
        <button
          type="button"
          className="auth-modal-close-btn"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          X
        </button>
      </div>

      <p className="auth-modal-subtitle">
        Crea tu cuenta para guardar tus datos y avanzar con el proyecto.
      </p>

      <AuthErrorMessage error={error} onClear={onClearError} />

      <form onSubmit={onSubmit} className="auth-modal-form">
        <div className="auth-modal-fields">
          <div className="auth-modal-form-group">
            <label htmlFor="register-nombre">Nombre</label>
            <input
              id="register-nombre"
              type="text"
              className="auth-modal-input"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => onNombreChange(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="auth-modal-form-group">
            <label htmlFor="register-apellido">Primer apellido</label>
            <input
              id="register-apellido"
              type="text"
              className="auth-modal-input"
              placeholder="Tu primer apellido"
              value={primerApellido}
              onChange={(e) => onPrimerApellidoChange(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="auth-modal-form-group">
            <label htmlFor="register-email">Correo</label>
            <input
              id="register-email"
              type="email"
              className="auth-modal-input"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="auth-modal-form-group">
            <label htmlFor="register-password">Contraseña</label>
            <input
              id="register-password"
              type="password"
              className="auth-modal-input"
              placeholder="********"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="auth-modal-form-group">
            <label htmlFor="register-confirm-password">Confirmar contraseña</label>
            <input
              id="register-confirm-password"
              type="password"
              className="auth-modal-input"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="auth-modal-bottom">
          <button
            type="submit"
            className="auth-modal-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

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
      </form>
    </div>
  )
}

export default RegisterForm
