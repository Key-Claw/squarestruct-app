import AuthErrorMessage from './AuthErrorMessage'

function LoginForm({
  email,
  password,
  error,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onToggleMode,
  onClose,
  onClearError
}) {
  return (
    <div className="auth-modal-card auth-modal-login">
      <div className="auth-modal-header">
        <h2>Iniciar sesion</h2>
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
        Accede con tu correo electronico y contrasena.
      </p>

      <AuthErrorMessage error={error} onClear={onClearError} />

      <form onSubmit={onSubmit} className="auth-modal-form">
        <div className="auth-modal-form-group">
          <label htmlFor="login-email">Correo</label>
          <input
            id="login-email"
            type="email"
            className="auth-modal-input"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="auth-modal-form-group">
          <label htmlFor="login-password">Contrasena</label>
          <input
            id="login-password"
            type="password"
            className="auth-modal-input"
            placeholder="********"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="auth-modal-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesion...' : 'Iniciar sesion'}
        </button>
      </form>

      <div className="auth-modal-footer">
        <p>
          No tienes cuenta?{' '}
          <button
            type="button"
            className="auth-modal-toggle-btn"
            onClick={onToggleMode}
            disabled={isLoading}
          >
            Registrate aqui
          </button>
        </p>
      </div>
    </div>
  )
}

export default LoginForm
