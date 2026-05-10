function AuthErrorMessage({ error, onClear }) {
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
        aria-label="Cerrar error"
      >
        âœ•
      </button>
    </div>
  )
}

export default AuthErrorMessage
