import AuthErrorMessage from './AuthErrorMessage'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  return (
    <div className="auth-modal-card auth-modal-register">
      <div className="auth-modal-header">
        <h2>{t('auth.register.title')}</h2>
        <button
          type="button"
          className="auth-modal-close-btn"
          onClick={onClose}
          aria-label={t('auth.closeModal')}
        >
          X
        </button>
      </div>

      <p className="auth-modal-subtitle">
        {t('auth.register.subtitle')}
      </p>

      <AuthErrorMessage error={error} onClear={onClearError} />

      <form onSubmit={onSubmit} className="auth-modal-form">
        <div className="auth-modal-fields">
          <div className="auth-modal-form-group">
            <label htmlFor="register-nombre">{t('auth.register.name')}</label>
            <input
              id="register-nombre"
              type="text"
              className="auth-modal-input"
              placeholder={t('auth.placeholders.name')}
              value={nombre}
              onChange={(e) => onNombreChange(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="auth-modal-form-group">
            <label htmlFor="register-apellido">{t('auth.register.firstSurname')}</label>
            <input
              id="register-apellido"
              type="text"
              className="auth-modal-input"
              placeholder={t('auth.placeholders.firstSurname')}
              value={primerApellido}
              onChange={(e) => onPrimerApellidoChange(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="auth-modal-form-group">
            <label htmlFor="register-email">{t('auth.register.email')}</label>
            <input
              id="register-email"
              type="email"
              className="auth-modal-input"
              placeholder={t('auth.placeholders.email')}
              value={email}
              autoComplete="email"
              onChange={(e) => onEmailChange(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="auth-modal-form-group">
            <label htmlFor="register-password">{t('auth.register.password')}</label>
            <input
              id="register-password"
              type="password"
              className="auth-modal-input"
              placeholder={t('auth.placeholders.password')}
              value={password}
              autoComplete="new-password"
              onChange={(e) => onPasswordChange(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="auth-modal-form-group">
            <label htmlFor="register-confirm-password">{t('auth.register.confirmPassword')}</label>
            <input
              id="register-confirm-password"
              type="password"
              className="auth-modal-input"
              placeholder={t('auth.placeholders.password')}
              value={confirmPassword}
              autoComplete="new-password"
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
            {isLoading ? t('auth.register.submitLoading') : t('auth.register.submit')}
          </button>

          <div className="auth-modal-footer">
            <p>
              {t('auth.register.hasAccount')}{' '}
              <button
                type="button"
                className="auth-modal-toggle-btn"
                onClick={onToggleMode}
                disabled={isLoading}
              >
                {t('auth.register.toggle')}
              </button>
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default RegisterForm
