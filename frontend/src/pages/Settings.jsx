import { useEffect, useMemo, useState } from 'react'
import { getAllUsers, getProfile, getUserById, logoutUser, updateUser } from '../services/authService'
import '../styles/settings.css'

const getRoleBadgeClass = (role) => {
  if (role === 'admin') return 'settings-role-badge admin'
  return 'settings-role-badge usuario'
}

const getRoleText = (role) => {
  if (role === 'admin') return 'Administrador'
  return 'Usuario'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)

  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getInitialTab = (tab, isAdminUser) => {
  if (isAdminUser) {
    const adminTabs = ['perfil', 'usuarios', 'facturacion', 'planos']
    return adminTabs.includes(tab) ? tab : 'perfil'
  }

  const userTabs = ['perfil', 'facturas', 'planos']
  return userTabs.includes(tab) ? tab : 'perfil'
}

function Settings({ user, initialTab, onAuthExpired, isAdminUser }) {
  const [activeTab, setActiveTab] = useState(getInitialTab(initialTab, isAdminUser))

  // Profile tab state
  const [profileData, setProfileData] = useState(user)
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')

  // Users admin tab state
  const [usuarios, setUsuarios] = useState([])
  const [isUsersLoading, setIsUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState('')
  const [usersSuccessMessage, setUsersSuccessMessage] = useState('')
  const [editingUsuario, setEditingUsuario] = useState(null)
  const [nuevoRol, setNuevoRol] = useState('usuario')
  const [isEditLoading, setIsEditLoading] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')

  const tabs = useMemo(() => {
    if (isAdminUser) {
      return [
        { id: 'perfil', label: 'Perfil' },
        { id: 'facturacion', label: 'Facturacion' },
        { id: 'usuarios', label: 'Usuarios' },
        { id: 'planos', label: 'Planos' },
      ]
    }

    return [
      { id: 'perfil', label: 'Perfil' },
      { id: 'facturas', label: 'Facturas' },
      { id: 'planos', label: 'Planos' },
    ]
  }, [isAdminUser])

  useEffect(() => {
    if (activeTab !== 'perfil') return

    const loadUserProfile = async () => {
      setIsProfileLoading(true)
      setProfileError('')

      try {
        const profile = await getProfile()
        setProfileData(profile)
      } catch {
        setProfileData(user)
        setProfileError('No se pudieron cargar los datos actualizados')
      } finally {
        setIsProfileLoading(false)
      }
    }

    loadUserProfile()
  }, [activeTab, user])

  useEffect(() => {
    if (!isAdminUser || activeTab !== 'usuarios') return

    const loadUsuarios = async () => {
      setIsUsersLoading(true)
      setUsersError('')

      try {
        const data = await getAllUsers()
        setUsuarios(data)
      } catch (err) {
        const message = err.message || 'No se pudo cargar la lista de usuarios.'

        if (message.includes('Token')) {
          if (typeof onAuthExpired === 'function') {
            onAuthExpired()
          } else {
            logoutUser()
          }
          setUsersError(`${message}. Vuelve a iniciar sesion como administrador.`)
          return
        }

        setUsersError(message)
      } finally {
        setIsUsersLoading(false)
      }
    }

    loadUsuarios()
  }, [activeTab, isAdminUser, onAuthExpired])

  const handleEditClick = (usuario) => {
    setEditingUsuario(usuario)
    setNuevoRol(usuario.rol)
  }

  /**
   * Carga el detalle completo de un usuario y abre el modal.
   * Primero mostramos los datos ya visibles en la tabla para que la interfaz
   * responda al instante; después se refresca con la ficha completa desde API.
   * @param {object} usuario - Usuario seleccionado en la tabla.
   */
  const handleViewClick = async (usuario) => {
    setSelectedUsuario(usuario)
    setDetailError('')
    setIsDetailLoading(true)

    try {
      const detalle = await getUserById(usuario.idUsuario)
      setSelectedUsuario(detalle)
    } catch {
      setDetailError('No se pudo cargar el detalle actualizado del usuario.')
    } finally {
      setIsDetailLoading(false)
    }
  }

  const handleCloseModal = () => {
    setEditingUsuario(null)
    setNuevoRol('usuario')
  }

  /**
   * Cierra el modal de detalle y limpia el estado auxiliar.
   */
  const handleCloseDetailModal = () => {
    setSelectedUsuario(null)
    setDetailError('')
  }

  const handleSaveChanges = async () => {
    if (!editingUsuario) return

    setIsEditLoading(true)
    setUsersError('')
    setUsersSuccessMessage('')

    try {
      await updateUser(editingUsuario.idUsuario, {
        nombre: editingUsuario.nombre,
        email: editingUsuario.email,
        rol: nuevoRol,
      })

      setUsuarios((currentUsers) => (
        currentUsers.map((currentUser) => (
          currentUser.idUsuario === editingUsuario.idUsuario
            ? { ...currentUser, rol: nuevoRol }
            : currentUser
        ))
      ))

      setUsersSuccessMessage(`Rol de ${editingUsuario.nombre} actualizado a ${nuevoRol}.`)
      handleCloseModal()
      window.setTimeout(() => setUsersSuccessMessage(''), 3000)
    } catch {
      setUsersError('No se pudo actualizar el rol del usuario.')
    } finally {
      setIsEditLoading(false)
    }
  }

  const renderProfile = () => {
    if (isProfileLoading) {
      return (
        <div className="settings-empty-state">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando datos de perfil...</p>
        </div>
      )
    }

    if (!profileData) {
      return <p className="settings-empty-state">No se pudo cargar el perfil.</p>
    }

    return (
      <div className="settings-profile-grid">
        <div className="settings-card settings-profile-card">
          {profileError && <div className="alert alert-warning mb-3">{profileError}</div>}

          <h2 className="settings-section-title">Perfil</h2>
          <div className="settings-profile-fields">
            <div>
              <label>Rol</label>
              <span className={getRoleBadgeClass(profileData.rol)}>{getRoleText(profileData.rol)}</span>
            </div>

            <div>
              <label>Id de usuario</label>
              <span>{profileData.idUsuario}</span>
            </div>

            <div>
              <label>Nombre</label>
              <span>{profileData.nombre}</span>
            </div>

            <div>
              <label>Correo electronico</label>
              <span>{profileData.email}</span>
            </div>

            {profileData.fechaAlta && (
              <div>
                <label>Miembro desde</label>
                <span>{formatDate(profileData.fechaAlta)}</span>
              </div>
            )}
          </div>
        </div>

        <aside className="settings-card settings-avatar-card" aria-label="Avatar de usuario">
          <div className="settings-avatar-circle">
            <span>{(profileData.nombre || 'U').charAt(0).toUpperCase()}</span>
          </div>
          <button type="button" className="btn btn-outline-light btn-sm" disabled>
            Editar foto
          </button>
        </aside>
      </div>
    )
  }

  const renderUsersAdmin = () => {
    if (!isAdminUser) {
      return <p className="settings-empty-state">Esta opcion solo esta disponible para administradores.</p>
    }

    if (isUsersLoading) {
      return (
        <div className="settings-empty-state">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando usuarios...</p>
        </div>
      )
    }

    return (
      <div className="settings-card">
        <div className="settings-card-head">
          <h2>Gestion de usuarios</h2>
          <small>Total: {usuarios.length}</small>
        </div>

        {usersError && <div className="alert alert-danger">{usersError}</div>}
        {usersSuccessMessage && <div className="alert alert-success">{usersSuccessMessage}</div>}

        <div className="table-responsive settings-table-wrap">
          <table className="table table-hover align-middle mb-0 settings-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map((currentUser) => (
                  <tr key={currentUser.idUsuario}>
                    <td>{currentUser.idUsuario}</td>
                    <td>{currentUser.nombre}</td>
                    <td>{currentUser.email}</td>
                    <td>
                      <span className={getRoleBadgeClass(currentUser.rol)}>{getRoleText(currentUser.rol)}</span>
                    </td>
                    <td>
                      <div className="settings-inline-actions">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-info"
                          onClick={() => handleViewClick(currentUser)}
                        >
                          Ver detalle
                        </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => handleEditClick(currentUser)}
                        disabled={currentUser.idUsuario === user.idUsuario}
                      >
                        Editar
                      </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">No hay usuarios registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderBillingAdmin = () => (
    <div className="settings-card">
      <div className="settings-card-head">
        <h2>Facturacion</h2>
        <small>Sin datos de facturacion por ahora</small>
      </div>

      <div className="table-responsive settings-table-wrap">
        <table className="table align-middle mb-0 settings-table">
          <thead>
            <tr>
              <th>Factura</th>
              <th>Direccion</th>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Total</th>
              <th>Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7" className="text-center py-4">
                No hay facturas disponibles.
              </td>
              </tr>
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderInvoicesUser = () => (
    <div className="settings-card">
      <div className="settings-card-head">
        <h2>Facturas</h2>
        <small>Sin datos de facturas por ahora</small>
      </div>

      <div className="table-responsive settings-table-wrap">
        <table className="table align-middle mb-0 settings-table">
          <thead>
            <tr>
              <th>Factura</th>
              <th>Direccion</th>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Total</th>
              <th>Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7" className="text-center py-4">
                No tienes facturas disponibles.
              </td>
              </tr>
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderPlanos = () => (
    <div className="settings-card settings-placeholder-card">
      <h2>Planos</h2>
      <p>Seccion vacia de momento.</p>
    </div>
  )

  const renderActiveTab = () => {
    if (activeTab === 'perfil') return renderProfile()
    if (activeTab === 'usuarios') return renderUsersAdmin()
    if (activeTab === 'facturacion') return renderBillingAdmin()
    if (activeTab === 'facturas') return renderInvoicesUser()
    if (activeTab === 'planos') return renderPlanos()

    return renderProfile()
  }

  return (
    <section className="settings-page-shell">
      <div className="settings-layout">
        <aside className="settings-sidebar" aria-label="Menu de settings">
          <div className="settings-sidebar-head">
            <h1>Settings</h1>
            <small>{user?.nombre || 'Usuario'}</small>
          </div>

          <nav className="settings-nav-list">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`settings-nav-item${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="settings-content">
          <header className="settings-header-bar">
            <div>
              <h2>{tabs.find((tab) => tab.id === activeTab)?.label || 'Perfil'}</h2>
              <p>Gestiona tu cuenta y tus opciones en una sola pantalla.</p>
            </div>

            <button
              type="button"
              className="btn btn-outline-secondary settings-planos-btn"
              onClick={() => setActiveTab('planos')}
            >
              Planos
            </button>
          </header>

          {renderActiveTab()}
        </main>
      </div>

      {editingUsuario && (
        <div className="modal d-block usuarios-modal-backdrop" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content usuarios-modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar rol de usuario</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  disabled={isEditLoading}
                  aria-label="Cerrar"
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label text-muted">Nombre:</label>
                  <p className="mb-0 fw-bold">{editingUsuario.nombre}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted">Correo electronico:</label>
                  <p className="mb-0">{editingUsuario.email}</p>
                </div>

                <div className="mb-4">
                  <label htmlFor="rolSelect" className="form-label text-muted">
                    Nuevo rol:
                  </label>
                  <select
                    id="rolSelect"
                    className="form-select form-select-sm"
                    value={nuevoRol}
                    onChange={(event) => setNuevoRol(event.target.value)}
                    disabled={isEditLoading}
                  >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleCloseModal}
                  disabled={isEditLoading}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="btn btn-warning text-dark fw-bold"
                  onClick={handleSaveChanges}
                  disabled={isEditLoading}
                >
                  {isEditLoading ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedUsuario && (
        <div className="modal d-block usuarios-modal-backdrop" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content usuarios-modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalle de usuario</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseDetailModal}
                  aria-label="Cerrar"
                ></button>
              </div>

              <div className="modal-body">
                {isDetailLoading && (
                  <div className="settings-empty-state" style={{ minHeight: '120px' }}>
                    <div className="spinner-border text-success" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p>Cargando detalle del usuario...</p>
                  </div>
                )}

                {!isDetailLoading && (
                  <>
                    {detailError && <div className="alert alert-warning">{detailError}</div>}

                    <div className="settings-profile-fields" style={{ width: '100%' }}>
                      <div>
                        <label>ID de usuario</label>
                        <span>{selectedUsuario.idUsuario}</span>
                      </div>

                      <div>
                        <label>Nombre</label>
                        <span>{selectedUsuario.nombre}</span>
                      </div>

                      <div>
                        <label>Primer apellido</label>
                        <span>{selectedUsuario.primerApellido || 'N/A'}</span>
                      </div>

                      <div>
                        <label>Segundo apellido</label>
                        <span>{selectedUsuario.segundoApellido || 'N/A'}</span>
                      </div>

                      <div>
                        <label>Correo electronico</label>
                        <span>{selectedUsuario.email}</span>
                      </div>

                      <div>
                        <label>Rol</label>
                        <span className={getRoleBadgeClass(selectedUsuario.rol)}>{getRoleText(selectedUsuario.rol)}</span>
                      </div>

                      <div>
                        <label>Fecha de alta</label>
                        <span>{formatDate(selectedUsuario.creadoEn || selectedUsuario.fechaAlta)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={handleCloseDetailModal}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Settings
