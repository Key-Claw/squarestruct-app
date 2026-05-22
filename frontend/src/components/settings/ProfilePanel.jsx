import { useState, useEffect } from 'react'
import { getProfile } from '../../services/authService'
import '../../styles/components/settings/profile-panel.css'
import { useTranslation } from 'react-i18next'
import i18n from '../../i18n'

/**
 * Panel deslizante del perfil del usuario
 * 
 * Características:
 * - Se desliza desde la izquierda de la pantalla
 * - Muestra información del usuario autenticado
 * - Botones de acción (logout, cambiar contraseña, etc.)
 * - Interfaz limpia y responsive
 * 
 * @param {object} props - Props del componente
 * @param {boolean} props.isOpen - Indica si el panel está visible
 * @param {object} props.user - Datos del usuario autenticado
 * @param {function} props.onClose - Callback para cerrar el panel
 * @param {function} props.onLogout - Callback para logout
 * @param {boolean} props.isAdmin - Indica si el usuario es admin
 * @param {function} props.onNavigateToUsers - Callback para ir a la lista de usuarios
 */
function ProfilePanel({ isOpen, user, onClose, onLogout, isAdmin, onNavigateToUsers }) {
  const { t } = useTranslation()
  // Datos del perfil (pueden ser más actualizados que los del estado global)
  const [profileData, setProfileData] = useState(user)
  // Flag para mostrar spinner mientras se cargan datos
  const [isLoading, setIsLoading] = useState(false)
  // Mensaje de error
  const [error, setError] = useState('')

  /**
   * Carga los datos más recientes del usuario desde el servidor.
   * Se ejecuta cada vez que se abre el panel.
   */
  useEffect(() => {
    if (!isOpen) return

    const loadUserProfile = async () => {
      setIsLoading(true)
      setError('')
      try {
        const profile = await getProfile()
        setProfileData(profile)
      } catch {
        // Si falla el refresco, usamos la sesión local para no romper la vista
        setProfileData(user)
        setError(t('settings.profile.error'))
      } finally {
        setIsLoading(false)
      }
    }

    loadUserProfile()
  }, [isOpen, user, t])

  /**
   * Obtiene el badge de color según el rol del usuario.
   * @param {string} rol - Rol del usuario
   * @returns {string} Clase CSS para el badge
   */
  const getRolBadgeClass = (rol) => {
    switch (rol) {
      case 'admin':
        return 'profile-role-badge admin'
      default:
        return 'profile-role-badge usuario'
    }
  }

  /**
   * Obtiene el texto del rol en español.
   * @param {string} rol - Rol del usuario
   * @returns {string} Texto del rol
   */
  const getRolText = (rol) => {
    switch (rol) {
      case 'admin':
        return t('settings.profile.roles.admin')
      default:
        return t('settings.profile.roles.user')
    }
  }

  /**
   * Formatea una fecha ISO a formato legible.
   * @param {string} dateString - Fecha en formato ISO
   * @returns {string} Fecha formateada
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString(i18n.resolvedLanguage?.startsWith('en') ? 'en-US' : 'es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  /**
   * Maneja el clic en el backdrop para cerrar el panel
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  /**
   * Maneja el logout del usuario
   */
  const handleLogout = () => {
    onClose()
    onLogout()
  }

  // No renderizar si el panel está cerrado
  if (!isOpen) return null

  return (
    <>
      {/* BACKDROP OSCURO */}
      <div className="profile-panel-backdrop" onClick={handleBackdropClick}>
        
        {/* PANEL DESLIZANTE */}
        <div className="profile-panel-container">
          
          {/* ENCABEZADO DEL PANEL */}
          <div className="profile-panel-header">
            <h2>{t('settings.profile.title')}</h2>
            <button
              type="button"
              className="profile-panel-close-btn"
              onClick={onClose}
              aria-label={t('common.close')}
            >
              ×
            </button>
          </div>

          {/* CONTENIDO DEL PANEL */}
          <div className="profile-panel-content">
            
            {/* SPINNER DE CARGA */}
            {isLoading ? (
              <div className="profile-loading">
                <div className="profile-spinner"></div>
                <p>{t('settings.profile.loading')}</p>
              </div>
            ) : (
              <>
                {/* MENSAJE DE ERROR */}
                {error && (
                  <div className="profile-error-message">
                    {error}
                  </div>
                )}

                {/* INFORMACIÓN DEL USUARIO */}
                {profileData ? (
                  <div className="profile-info">
                    {/* TARJETA DE INFORMACIÓN */}
                    <div className="profile-info-card">
                      
                      {/* Rol del usuario */}
                      <div className="profile-field">
                        <label>{t('settings.profile.role')}</label>
                        <span className={getRolBadgeClass(profileData.rol)}>
                          {getRolText(profileData.rol)}
                        </span>
                      </div>

                      {/* ID del usuario */}
                      <div className="profile-field">
                        <label>ID</label>
                        <span className="profile-value">{profileData.idUsuario}</span>
                      </div>

                      {/* Nombre del usuario */}
                      <div className="profile-field">
                        <label>{t('settings.profile.name')}</label>
                        <span className="profile-value">{profileData.nombre}</span>
                      </div>

                      {/* Email del usuario */}
                      <div className="profile-field">
                        <label>{t('settings.profile.email')}</label>
                        <span className="profile-value">{profileData.email}</span>
                      </div>

                      {/* Fecha de alta */}
                      {profileData.fechaAlta && (
                        <div className="profile-field">
                          <label>{t('settings.profile.memberSince')}</label>
                          <span className="profile-value">
                            {formatDate(profileData.fechaAlta)}
                          </span>
                        </div>
                      )}

                    </div>

                    {/* DIVIDER */}
                    <div className="profile-divider"></div>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="profile-actions">
                      
                      {/* Botón para admin: gestionar usuarios */}
                      {isAdmin && (
                        <button
                          type="button"
                          className="profile-action-btn users-btn"
                          onClick={() => {
                            onClose()
                            onNavigateToUsers()
                          }}
                        >
                           {t('settings.users.title')}
                        </button>
                      )}

                      {/* Botón de cambiar contraseña */}
                      <button
                        type="button"
                        className="profile-action-btn change-password-btn"
                      >
                         {t('settings.profile.changePassword')}
                      </button>

                      {/* Botón de logout */}
                      <button
                        type="button"
                        className="profile-action-btn logout-btn"
                        onClick={handleLogout}
                      >
                         {t('settings.profile.logout')}
                      </button>

                    </div>

                  </div>
                ) : (
                  <div className="profile-empty">
                    <p>{t('settings.profile.error')}</p>
                  </div>
                )}

              </>
            )}

          </div>

        </div>

      </div>
    </>
  )
}

export default ProfilePanel

