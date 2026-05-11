import { useState } from 'react'
import LoginForm from './auth/LoginForm'
import RegisterForm from './auth/RegisterForm'
import { loginUser, registerUser } from '../services/authService'
import { isValidEmail } from '../utils/validators'
import '../styles/auth-modal.css'

function AuthModal({ isOpen, isLoginMode, onClose, onToggleMode, onUserLogin, onNavigate }) {
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

    if (!loginEmail || !loginPassword) {
      setError('Completa el correo y la contrasena para iniciar sesion.')
      return
    }

    setIsLoading(true)

    try {
      const userData = await loginUser({ email: loginEmail, contrasena: loginPassword })

      onUserLogin(userData)
      setLoginEmail('')
      setLoginPassword('')
      onClose()
      onNavigate('home')
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesion. Revisa tus credenciales.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (!registerNombre || !registerPrimerApellido || !registerEmail || !registerPassword || !registerConfirmPassword) {
      setError('Completa todos los campos para crear tu cuenta.')
      return
    }

    if (registerNombre.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.')
      return
    }

    if (!isValidEmail(registerEmail)) {
      setError('Introduce un correo electronico valido.')
      return
    }

    if (registerPassword.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres.')
      return
    }

    if (registerPassword !== registerConfirmPassword) {
      setError('Las contrasenas no coinciden.')
      return
    }

    setIsLoading(true)

    try {
      await registerUser(registerNombre, registerPrimerApellido, registerEmail, registerPassword)
      const userData = await loginUser({ email: registerEmail, contrasena: registerPassword })

      onUserLogin(userData)
      setRegisterNombre('')
      setRegisterPrimerApellido('')
      setRegisterEmail('')
      setRegisterPassword('')
      setRegisterConfirmPassword('')
      onClose()
      onNavigate('home')
    } catch (err) {
      setError(err.message || 'No se pudo crear la cuenta. Intentalo de nuevo.')
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
