import AuthErrorMessage from './AuthErrorMessage'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  return (
    <div className="auth-modal-card auth-modal-login">
      <div className="auth-modal-header">
        <h2>{t('auth.login.title')}</h2>
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
        {t('auth.login.subtitle')}
      </p>

      <AuthErrorMessage error={error} onClear={onClearError} />

      <form onSubmit={onSubmit} className="auth-modal-form">
        <div className="auth-modal-fields">
          <div className="auth-modal-form-group">
            <label htmlFor="login-email">{t('auth.login.email')}</label>
            <input
              id="login-email"
              type="email"
              className="auth-modal-input"
              placeholder={t('auth.placeholders.email')}
              value={email}
              autoComplete="username"
              onChange={(e) => onEmailChange(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="auth-modal-form-group">
            <label htmlFor="login-password">{t('auth.login.password')}</label>
            <input
              id="login-password"
              type="password"
              className="auth-modal-input"
              placeholder={t('auth.placeholders.password')}
              value={password}
              autoComplete="current-password"
              onChange={(e) => onPasswordChange(e.target.value)}
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
            {isLoading ? t('auth.login.submitLoading') : t('auth.login.submit')}
          </button>

          <div className="auth-modal-footer">
            <p>
              {t('auth.login.noAccount')}{' '}
              <button
                type="button"
                className="auth-modal-toggle-btn"
                onClick={onToggleMode}
                disabled={isLoading}
              >
                {t('auth.login.toggle')}
              </button>
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
