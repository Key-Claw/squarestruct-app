import { useState, useEffect } from 'react'
import { getAllUsers, logoutUser, updateUser } from '../../services/authService'
import '../../styles/pages/settings/users.css'
import { useTranslation } from 'react-i18next'

/**
 * Página de administración de usuarios (solo para admin).
 * Muestra lista de todos los usuarios y permite cambiar sus roles.
 * @param {function} onNavigate - Callback para cambiar de página.
 * @param {object} user - Datos del usuario autenticado (admin).
 */
function Users({ onNavigate, user, onAuthExpired }) {
  const { t, i18n } = useTranslation()
  // Lista de usuarios del sistema.
  const [usuarios, setUsuarios] = useState([])
  // Flag para mostrar spinner mientras se cargan datos.
  const [isLoading, setIsLoading] = useState(true)
  // Mensaje de error si ocurre un problema.
  const [error, setError] = useState('')
  // Mensaje de éxito después de actualizar un usuario.
  const [successMessage, setSuccessMessage] = useState('')

  // Modal para editar rol de usuario.
  const [editingUsuario, setEditingUsuario] = useState(null)
  const [nuevoRol, setNuevoRol] = useState('usuario')
  const [isEditLoading, setIsEditLoading] = useState(false)

  /**
   * Carga la lista de todos los usuarios desde el servidor.
   * Se ejecuta al montar el componente.
   */
  useEffect(() => {
    const loadUsuarios = async () => {
      setIsLoading(true)
      setError('')
      try {
        const data = await getAllUsers()
        setUsuarios(data)
      } catch (err) {
        const message = err.message || t('settings.users.loading')

        if (message.includes('Token')) {
          if (typeof onAuthExpired === 'function') {
            onAuthExpired()
          } else {
            logoutUser()
          }
          setError(`${message}. ${t('settings.users.adminOnly')}`)
          return
        }

        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsuarios()
  }, [onAuthExpired, t])

  /**
   * Abre el modal para editar el rol de un usuario.
   * @param {object} usuario - Usuario a editar.
   */
  const handleEditClick = (usuario) => {
    setEditingUsuario(usuario)
    setNuevoRol(usuario.rol)
  }

  /**
   * Cierra el modal de edición.
   */
  const handleCloseModal = () => {
    setEditingUsuario(null)
    setNuevoRol('usuario')
  }

  /**
   * Envía los cambios de rol del usuario al servidor.
   */
  const handleSaveChanges = async () => {
    if (!editingUsuario) return

    setIsEditLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      // Actualizar usuario en el backend
      await updateUser(editingUsuario.idUsuario, {
        nombre: editingUsuario.nombre,
        email: editingUsuario.email,
        rol: nuevoRol,
      })

      // Actualizar la lista local
      setUsuarios(
        usuarios.map((u) =>
          u.idUsuario === editingUsuario.idUsuario
            ? { ...u, rol: nuevoRol }
            : u
        )
      )

      setSuccessMessage(t('settings.users.updateSuccess', { name: editingUsuario.nombre }))
      handleCloseModal()

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch {
      setError(t('settings.users.updateError'))
    } finally {
      setIsEditLoading(false)
    }
  }

  /**
   * Obtiene el badge de color según el rol del usuario.
   * @param {string} rol - Rol del usuario.
   * @returns {string} Clase Bootstrap para el badge.
   */
  const getRolBadgeClass = (rol) => {
    switch (rol) {
      case 'admin':
        return 'badge bg-danger'
      default:
        return 'badge bg-info'
    }
  }

  const getRolText = (rol) => {
    if (rol === 'admin') return t('settings.profile.roles.admin').toUpperCase()
    return t('settings.profile.roles.user').toUpperCase()
  }

  /**
   * Formatea una fecha ISO a formato legible.
   * @param {string} dateString - Fecha en formato ISO.
   * @returns {string} Fecha formateada.
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString(i18n.resolvedLanguage?.startsWith('en') ? 'en-US' : 'es-ES')
  }

  // Mostrar spinner mientras se carga
  if (isLoading) {
    return (
      <section className="page-shell usuarios-shell container-fluid">
        <div className="container-fluid usuarios-container">
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">{t('common.loading')}</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="page-shell usuarios-shell container-fluid">
      {/* Bootstrap grid, card, table, modal, select, alerts, badges and buttons:
          https://getbootstrap.com/docs/5.3/layout/grid/
          https://getbootstrap.com/docs/5.3/components/card/
          https://getbootstrap.com/docs/5.3/content/tables/
          https://getbootstrap.com/docs/5.3/components/modal/
          https://getbootstrap.com/docs/5.3/forms/select/
          https://getbootstrap.com/docs/5.3/components/alerts/
          https://getbootstrap.com/docs/5.3/components/badge/
          https://getbootstrap.com/docs/5.3/components/buttons/ */}
      <div className="container-fluid usuarios-container">
        <div className="row">
          <div className="col-12">
            <div className="card usuarios-card">
              <div className="card-body p-4">
                {/* Encabezado con título y botón de retorno. */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="fw-bold mb-0 text-uppercase">{t('settings.users.title')}</h2>
                  <button
                    type="button"
                    className="btn btn-outline-light btn-sm"
                    onClick={() => onNavigate('home')}
                  >
                    ← {t('common.back')}
                  </button>
                </div>

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

                {/* Mostrar mensaje de éxito después de actualizar. */}
                {successMessage && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {successMessage}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setSuccessMessage('')}
                      aria-label={t('common.close')}
                    ></button>
                  </div>
                )}

                {/* Tabla de usuarios. */}
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>{t('settings.users.table.name')}</th>
                        <th>{t('settings.users.table.email')}</th>
                        <th>{t('settings.users.table.role')}</th>
                        <th>{t('settings.profile.memberSince')}</th>
                        <th>{t('settings.users.table.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Renderizar cada usuario en una fila. */}
                      {usuarios && usuarios.length > 0 ? (
                        usuarios.map((u) => (
                          <tr key={u.idUsuario}>
                            <td className="fw-bold">{u.nombre}</td>
                            <td>{u.email}</td>
                            <td>
                              {/* Badge con el rol actual del usuario. */}
                              <span className={getRolBadgeClass(u.rol)}>
                                {getRolText(u.rol)}
                              </span>
                            </td>
                            <td className="text-muted text-nowrap">
                              {formatDate(u.creadoEn)}
                            </td>
                            <td>
                              {/* Botón para editar rol (no permitir editar al usuario actual). */}
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-warning"
                                onClick={() => handleEditClick(u)}
                                disabled={u.idUsuario === user.idUsuario}
                                title={
                                  u.idUsuario === user.idUsuario
                                    ? t('settings.users.editRoleOwn')
                                    : t('settings.users.editRole')
                                }
                              >
                                {t('settings.users.edit')}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center text-muted py-4">
                            {t('settings.users.empty')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Información de resumen. */}
                <div className="mt-3 text-muted">
                  <small>{t('settings.users.total', { visible: usuarios ? usuarios.length : 0, total: usuarios ? usuarios.length : 0 })}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para editar rol de usuario. */}
      {editingUsuario && (
        <div
          className="modal d-block usuarios-modal-backdrop"
          style={{ display: 'block' }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content usuarios-modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('settings.users.edit')}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  disabled={isEditLoading}
                  aria-label={t('common.close')}
                ></button>
              </div>

              <div className="modal-body">
                {/* Información del usuario a editar. */}
                <div className="mb-3">
                  <label className="form-label text-muted">{t('settings.profile.formName')}:</label>
                  <p className="mb-0 fw-bold">{editingUsuario.nombre}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted">{t('settings.profile.formEmail')}:</label>
                  <p className="mb-0">{editingUsuario.email}</p>
                </div>

                {/* Selector de nuevo rol. */}
                <div className="mb-4">
                    <label htmlFor="rolSelect" className="form-label text-muted">
                    {t('settings.profile.role')}:
                  </label>
                  <select
                    id="rolSelect"
                    className="form-select form-select-sm"
                    value={nuevoRol}
                    onChange={(e) => setNuevoRol(e.target.value)}
                    disabled={isEditLoading}
                  >
                    <option value="usuario">{t('settings.profile.roles.user')}</option>
                    <option value="admin">ADMIN</option>
                  </select>
                </div>

                {/* Aviso si se cambia a admin. */}
                {nuevoRol === 'admin' && nuevoRol !== editingUsuario.rol && (
                  <div className="alert alert-warning alert-sm mb-3" role="alert">
                    {t('settings.users.assignAdmin')}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                {/* Botón para cancelar. */}
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={handleCloseModal}
                  disabled={isEditLoading}
                >
                  {t('common.cancel')}
                </button>

                {/* Botón para guardar cambios. */}
                <button
                  type="button"
                  className="btn btn-warning text-dark fw-bold"
                  onClick={handleSaveChanges}
                  disabled={isEditLoading}
                >
                  {isEditLoading ? t('settings.profile.saving') : t('settings.profile.save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Users



