import { useState } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { loginUser, registerUser } from '../../services/authService'
import { isValidEmail } from '../../utils/validators'
import { useTranslation } from 'react-i18next'
import '../../styles/components/auth/auth-modal.css'

function AuthModal({ isOpen, isLoginMode, onClose, onToggleMode, onUserLogin, onNavigate }) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [registerNombre, setRegisterNombre] = useState('')
  const [registerPrimerApellido, setRegisterPrimerApellido] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    const email = loginEmail.trim()
    const password = loginPassword.trim()

    if (!email || !password) {
      setError(t('auth.errors.loginMissing'))
      return
    }

    setIsLoading(true)

    try {
      const userData = await loginUser({ email, contrasena: password })

      onUserLogin(userData)
      setLoginEmail('')
      setLoginPassword('')
      onClose()
      onNavigate('home')
    } catch (err) {
      setError(err.message || t('auth.errors.loginFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    const nombre = registerNombre.trim()
    const primerApellido = registerPrimerApellido.trim()
    const email = registerEmail.trim()
    const password = registerPassword.trim()
    const confirmPassword = registerConfirmPassword.trim()

    if (!nombre || !primerApellido || !email || !password || !confirmPassword) {
      setError(t('auth.errors.registerMissing'))
      return
    }

    if (nombre.length < 3) {
      setError(t('auth.errors.registerName'))
      return
    }

    if (!isValidEmail(email)) {
      setError(t('auth.errors.registerEmail'))
      return
    }

    if (password.length < 6) {
      setError(t('auth.errors.registerPassword'))
      return
    }

    if (password !== confirmPassword) {
      setError(t('auth.errors.registerMismatch'))
      return
    }

    setIsLoading(true)

    try {
      await registerUser(nombre, primerApellido, email, password)
      const userData = await loginUser({ email, contrasena: password })

      onUserLogin(userData)
      setRegisterNombre('')
      setRegisterPrimerApellido('')
      setRegisterEmail('')
      setRegisterPassword('')
      setRegisterConfirmPassword('')
      onClose()
      onNavigate('home')
    } catch (err) {
      setError(err.message || t('auth.errors.registerFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="auth-modal-backdrop" onClick={handleBackdropClick}>
      <div className="auth-modal-container">
        <div className={`auth-modal-flip-wrapper ${isLoginMode ? 'login' : 'register'}`}>
          <LoginForm
            email={loginEmail}
            password={loginPassword}
            error={error}
            isLoading={isLoading}
            onEmailChange={setLoginEmail}
            onPasswordChange={setLoginPassword}
            onSubmit={handleLogin}
            onToggleMode={onToggleMode}
            onClose={onClose}
            onClearError={() => setError('')}
          />

          <RegisterForm
            nombre={registerNombre}
            primerApellido={registerPrimerApellido}
            email={registerEmail}
            password={registerPassword}
            confirmPassword={registerConfirmPassword}
            error={error}
            isLoading={isLoading}
            onNombreChange={setRegisterNombre}
            onPrimerApellidoChange={setRegisterPrimerApellido}
            onEmailChange={setRegisterEmail}
            onPasswordChange={setRegisterPassword}
            onConfirmPasswordChange={setRegisterConfirmPassword}
            onSubmit={handleRegister}
            onToggleMode={onToggleMode}
            onClose={onClose}
            onClearError={() => setError('')}
          />
        </div>
      </div>
    </div>
  )
}

export default AuthModal

