import { useTranslation } from 'react-i18next'

function AuthErrorMessage({ error, onClear }) {
  const { t } = useTranslation()

  if (!error) {
    return null
  }

  return (
    <div className="auth-modal-error">
      <span>{error}</span>
      <button
        type="button"
        className="auth-modal-error-close"
        onClick={onClear}
        aria-label={t('auth.closeError')}
      >
        X
      </button>
    </div>
  )
}

export default AuthErrorMessage
