import { useEffect, useMemo, useState } from 'react'
import { deleteUser, getAllUsers, getProfile, getUserById, logoutUser, updateUser } from '../../services/authService'
import { actualizarEstadoPedido, obtenerMisPedidos, obtenerPedidosAdmin } from '../../services/orderService'
import { confirmDelete, showError, showSuccess } from '../../utils/alerts'
import '../../styles/pages/settings/settings.css'

const FACTURACION_PAGE_SIZE = 5
const SUPER_ADMIN_EMAIL = 'admin@squarestruct.com'

const getRoleBadgeClass = (role) => {
  if (role === 'admin') return 'settings-role-badge admin'
  return 'settings-role-badge usuario'
}

const getRoleText = (role) => {
  if (role === 'admin') return 'ADMIN'
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

const formatMoney = (amount) => new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
}).format(Number(amount || 0))

const getStatusClass = (status) => {
  const normalizedStatus = (status || '').toLowerCase()

  if (normalizedStatus === 'pendiente') return 'settings-invoice-status pending'
  if (normalizedStatus === 'aceptado') return 'settings-invoice-status accepted'
  if (normalizedStatus === 'denegado') return 'settings-invoice-status rejected'
  if (normalizedStatus === 'cancelado') return 'settings-invoice-status canceled'

  return 'settings-invoice-status'
}

const getStatusLabel = (status) => {
  const normalizedStatus = (status || '').toLowerCase()

  if (normalizedStatus === 'pendiente') return 'Pendiente'
  if (normalizedStatus === 'aceptado') return 'Aceptada'
  if (normalizedStatus === 'denegado') return 'Denegada'
  if (normalizedStatus === 'cancelado') return 'Cancelada'

  return status || 'Sin estado'
}

const getPaymentLabel = (method) => {
  const normalizedMethod = (method || '').toLowerCase()

  if (normalizedMethod === 'tarjeta') return 'Tarjeta'
  if (normalizedMethod === 'transferencia') return 'Transferencia'
  if (normalizedMethod === 'paypal') return 'PayPal'
  if (normalizedMethod === 'efectivo') return 'Efectivo'

  return method || 'N/A'
}

const buildUserFormData = (userData = {}) => ({
  nombre: userData.nombre || '',
  primerApellido: userData.primerApellido || '',
  segundoApellido: userData.segundoApellido || '',
  email: userData.email || '',
  rol: userData.rol || 'usuario',
})

const isSuperAdminAccount = (userData = {}) => userData.email?.toLowerCase() === SUPER_ADMIN_EMAIL

const getInitialTab = (tab, isAdminUser) => {
  if (isAdminUser) {
    const adminTabs = ['perfil', 'usuarios', 'facturacion', 'planos']
    return adminTabs.includes(tab) ? tab : 'perfil'
  }

  const userTabs = ['perfil', 'facturas', 'planos']
  return userTabs.includes(tab) ? tab : 'perfil'
}

const getSettingsHeader = (activeTab, tabs, isAdminUser) => {
  if (isAdminUser && activeTab === 'facturacion') {
    return {
      eyebrow: 'Administración',
      title: 'Facturación',
      text: 'Controla facturas, estados y el histórico completo de pedidos.',
    }
  }

  if (isAdminUser && activeTab === 'usuarios') {
    return {
      eyebrow: 'Administración',
      title: 'Usuarios',
      text: 'Gestiona cuentas, roles y accesos desde el área de administración.',
    }
  }

  return {
    eyebrow: isAdminUser ? 'Administración' : 'Area privada',
    title: tabs.find((tab) => tab.id === activeTab)?.label || 'Perfil',
    text: isAdminUser
      ? 'Accede a tu perfil y a las herramientas de administración.'
      : 'Gestiona tu perfil, facturas y herramientas desde una sola pantalla.',
  }
}

function Settings({ user, initialTab, onAuthExpired, isAdminUser, onTabChange, onUserUpdate, onUserDeleted }) {
  const [activeTab, setActiveTab] = useState(getInitialTab(initialTab, isAdminUser))

  // Profile tab state
  const [profileData, setProfileData] = useState(user)
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSuccessMessage, setProfileSuccessMessage] = useState('')
  const [profileFormData, setProfileFormData] = useState(buildUserFormData(user))
  const [isProfileEditing, setIsProfileEditing] = useState(false)
  const [isProfileSaving, setIsProfileSaving] = useState(false)
  const [isProfileDeleting, setIsProfileDeleting] = useState(false)

  // Users admin tab state
  const [usuarios, setUsuarios] = useState([])
  const [isUsersLoading, setIsUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState('')
  const [usersSuccessMessage, setUsersSuccessMessage] = useState('')
  const [editingUsuario, setEditingUsuario] = useState(null)
  const [editingUsuarioForm, setEditingUsuarioForm] = useState(buildUserFormData())
  const [isEditLoading, setIsEditLoading] = useState(false)
  const [deletingUsuarioId, setDeletingUsuarioId] = useState(null)
  const [selectedUsuario, setSelectedUsuario] = useState(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [usersSearchTerm, setUsersSearchTerm] = useState('')
  const [usersRoleFilter, setUsersRoleFilter] = useState('todos')

  // Facturas del usuario autenticado.
  const [facturasUsuario, setFacturasUsuario] = useState([])
  const [isFacturasLoading, setIsFacturasLoading] = useState(false)
  const [facturasError, setFacturasError] = useState('')
  const [facturaDetalleAbiertoId, setFacturaDetalleAbiertoId] = useState(null)

  // Facturación pendiente para administradores.
  const [facturasAdmin, setFacturasAdmin] = useState([])
  const [isFacturacionLoading, setIsFacturacionLoading] = useState(false)
  const [facturacionError, setFacturacionError] = useState('')
  const [facturacionSuccessMessage, setFacturacionSuccessMessage] = useState('')
  const [processingPedidoId, setProcessingPedidoId] = useState(null)
  const [facturacionPage, setFacturacionPage] = useState(1)
  const [facturacionSearchTerm, setFacturacionSearchTerm] = useState('')
  const [facturacionStatusFilter, setFacturacionStatusFilter] = useState('todos')
  const [facturacionPaymentFilter, setFacturacionPaymentFilter] = useState('todos')

  const tabs = useMemo(() => {
    if (isAdminUser) {
      return [
        { id: 'perfil', label: 'Perfil' },
        { id: 'facturacion', label: 'Facturación' },
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
        setProfileFormData(buildUserFormData(profile))
      } catch {
        setProfileData(user)
        setProfileFormData(buildUserFormData(user))
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
          setUsersError(`${message}. Vuelve a iniciar sesión como administrador.`)
          return
        }

        setUsersError(message)
      } finally {
        setIsUsersLoading(false)
      }
    }

    loadUsuarios()
  }, [activeTab, isAdminUser, onAuthExpired])

  useEffect(() => {
    if (activeTab !== 'facturas') return

    const loadFacturas = async () => {
      setIsFacturasLoading(true)
      setFacturasError('')

      try {
        const pedidos = await obtenerMisPedidos()
        setFacturasUsuario(pedidos)
      } catch (err) {
        setFacturasError(err.message || 'No se pudieron cargar tus facturas.')
      } finally {
        setIsFacturasLoading(false)
      }
    }

    loadFacturas()
  }, [activeTab])

  useEffect(() => {
    if (!isAdminUser || activeTab !== 'facturacion') return

    const loadFacturacion = async () => {
      setIsFacturacionLoading(true)
      setFacturacionError('')

      try {
        const pedidos = await obtenerPedidosAdmin()
        setFacturasAdmin(pedidos)
      } catch (err) {
        const message = err.message || 'No se pudo cargar el historial de facturación.'

        if (message.includes('Token')) {
          if (typeof onAuthExpired === 'function') {
            onAuthExpired()
          } else {
            logoutUser()
          }
        }

        setFacturacionError(message)
      } finally {
        setIsFacturacionLoading(false)
      }
    }

    loadFacturacion()
  }, [activeTab, isAdminUser, onAuthExpired])

  const facturasAdminFiltradas = useMemo(() => {
    const search = facturacionSearchTerm.trim().toLowerCase()

    return facturasAdmin.filter((factura) => {
      const estado = (factura.estado || '').toLowerCase()
      const metodoPago = (factura.metodoPago || '').toLowerCase()
      const nombreCompleto = `${factura.nombre || ''} ${factura.primerApellido || ''}`.toLowerCase()
      const email = (factura.email || '').toLowerCase()
      const idPedido = String(factura.idPedido || '')
      const matchesSearch = !search
        || nombreCompleto.includes(search)
        || email.includes(search)
        || idPedido.includes(search)
      const matchesStatus = facturacionStatusFilter === 'todos' || estado === facturacionStatusFilter
      const matchesPayment = facturacionPaymentFilter === 'todos' || metodoPago === facturacionPaymentFilter

      return matchesSearch && matchesStatus && matchesPayment
    })
  }, [facturasAdmin, facturacionPaymentFilter, facturacionSearchTerm, facturacionStatusFilter])

  const usuariosFiltrados = useMemo(() => {
    const search = usersSearchTerm.trim().toLowerCase()

    return usuarios.filter((currentUser) => {
      const role = (currentUser.rol || 'usuario').toLowerCase()
      const matchesRole = usersRoleFilter === 'todos' || role === usersRoleFilter
      const matchesSearch = !search
        || String(currentUser.idUsuario || '').includes(search)
        || (currentUser.nombre || '').toLowerCase().includes(search)
        || (currentUser.email || '').toLowerCase().includes(search)

      return matchesRole && matchesSearch
    })
  }, [usuarios, usersRoleFilter, usersSearchTerm])

  const facturacionStats = useMemo(() => {
    const totalFacturado = facturasAdminFiltradas.reduce((sum, factura) => sum + Number(factura.total || 0), 0)
    const totalFacturas = facturasAdminFiltradas.length
    const totalProductos = facturasAdminFiltradas.reduce((sum, factura) => sum + Number(factura.totalProductos || 0), 0)
    const pendientes = facturasAdminFiltradas.filter((factura) => factura.estado === 'pendiente').length
    const aceptadas = facturasAdminFiltradas.filter((factura) => factura.estado === 'aceptado').length
    const denegadas = facturasAdminFiltradas.filter((factura) => factura.estado === 'denegado').length
    const canceladas = facturasAdminFiltradas.filter((factura) => factura.estado === 'cancelado').length
    const ticketMedio = totalFacturas > 0 ? totalFacturado / totalFacturas : 0
    const pedidoPrincipal = facturasAdminFiltradas.reduce((top, factura) => {
      if (!top) return factura
      return Number(factura.totalProductos || 0) > Number(top.totalProductos || 0) ? factura : top
    }, null)

    const estados = [
      { nombre: 'Aceptadas', total: aceptadas, color: 'success' },
      { nombre: 'Pendientes', total: pendientes, color: 'warning' },
      { nombre: 'Denegadas', total: denegadas, color: 'danger' },
      { nombre: 'Canceladas', total: canceladas, color: 'secondary' },
    ].map((estado) => ({
      ...estado,
      porcentaje: totalFacturas > 0 ? Math.round((estado.total / totalFacturas) * 100) : 0,
    }))

    return {
      totalFacturado,
      totalFacturas,
      totalProductos,
      pendientes,
      aceptadas,
      denegadas,
      canceladas,
      ticketMedio,
      pedidoPrincipal,
      estados,
      acceptedPercent: totalFacturas > 0 ? Math.round((aceptadas / totalFacturas) * 100) : 0,
    }
  }, [facturasAdminFiltradas])

  const handleResetBillingFilters = () => {
    setFacturacionSearchTerm('')
    setFacturacionStatusFilter('todos')
    setFacturacionPaymentFilter('todos')
    setFacturacionPage(1)
  }

  const facturacionTotalPages = Math.max(1, Math.ceil(facturasAdminFiltradas.length / FACTURACION_PAGE_SIZE))
  const facturacionPageSafe = Math.min(facturacionPage, facturacionTotalPages)

  const facturasAdminPaginadas = useMemo(() => {
    const startIndex = (facturacionPageSafe - 1) * FACTURACION_PAGE_SIZE
    return facturasAdminFiltradas.slice(startIndex, startIndex + FACTURACION_PAGE_SIZE)
  }, [facturacionPageSafe, facturasAdminFiltradas])

  const handleEditClick = (usuario) => {
    if (isSuperAdminAccount(usuario)) {
      setUsersError('La cuenta super admin no se puede editar.')
      return
    }

    setEditingUsuario(usuario)
    setEditingUsuarioForm(buildUserFormData(usuario))
  }

  const handleProfileInputChange = (field, value) => {
    setProfileFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }))
  }

  const handleAdminUserInputChange = (field, value) => {
    setEditingUsuarioForm((currentData) => ({
      ...currentData,
      [field]: value,
    }))
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
    setEditingUsuarioForm(buildUserFormData())
  }

  /**
   * Cierra el modal de detalle y limpia el estado auxiliar.
   */
  const handleCloseDetailModal = () => {
    setSelectedUsuario(null)
    setDetailError('')
  }

  const handleSaveProfile = async (event) => {
    event.preventDefault()

    if (!profileData) return
    if (isSuperAdminAccount(profileData)) {
      setProfileError('La cuenta super admin no se puede editar.')
      return
    }

    setIsProfileSaving(true)
    setProfileError('')
    setProfileSuccessMessage('')

    try {
      const response = await updateUser(profileData.idUsuario, {
        ...profileFormData,
        rol: profileData.rol,
      })
      const updatedUser = response.usuario || { ...profileData, ...profileFormData }

      setProfileData(updatedUser)
      setProfileFormData(buildUserFormData(updatedUser))
      setIsProfileEditing(false)
      setProfileSuccessMessage('Datos personales actualizados correctamente.')

      if (typeof onUserUpdate === 'function') {
        onUserUpdate(updatedUser)
      }

      window.setTimeout(() => setProfileSuccessMessage(''), 3000)
    } catch (err) {
      setProfileError(err.message || 'No se pudieron actualizar tus datos.')
    } finally {
      setIsProfileSaving(false)
    }
  }

  const handleDeleteOwnAccount = async () => {
    if (!profileData) return
    if (isSuperAdminAccount(profileData)) {
      setProfileError('La cuenta super admin no se puede eliminar.')
      return
    }

    const confirmed = await confirmDelete({
      title: 'Eliminar cuenta',
      text: 'Vas a eliminar tu cuenta. Tus pedidos se conservaran anonimizados para mantener el historial de la empresa.',
    })
    if (!confirmed) return

    setIsProfileDeleting(true)
    setProfileError('')

    try {
      await deleteUser(profileData.idUsuario)
      await showSuccess({
        title: 'Cuenta eliminada',
        text: 'Tu cuenta se ha eliminado correctamente.',
      })
      logoutUser()

      if (typeof onUserDeleted === 'function') {
        onUserDeleted()
      }
    } catch (err) {
      const message = err.message || 'No se pudo eliminar tu cuenta. Intentalo de nuevo.'
      setProfileError(message)
      await showError({
        title: 'No se pudo eliminar',
        text: message,
      })
    } finally {
      setIsProfileDeleting(false)
    }
  }

  const handleDeleteUser = async (usuario) => {
    if (!usuario || usuario.idUsuario === user.idUsuario) return
    if (isSuperAdminAccount(usuario)) {
      setUsersError('La cuenta super admin no se puede eliminar.')
      return
    }

    const confirmed = await confirmDelete({
      title: 'Eliminar usuario',
      text: `Vas a eliminar la cuenta de ${usuario.nombre}. Sus pedidos se conservaran anonimizados en el historial.`,
    })
    if (!confirmed) return

    setDeletingUsuarioId(usuario.idUsuario)
    setUsersError('')
    setUsersSuccessMessage('')

    try {
      await deleteUser(usuario.idUsuario)
      setUsuarios((currentUsers) => currentUsers.filter((currentUser) => currentUser.idUsuario !== usuario.idUsuario))
      setUsersSuccessMessage(`Cuenta de ${usuario.nombre} eliminada correctamente.`)
      await showSuccess({
        title: 'Usuario eliminado',
        text: `La cuenta de ${usuario.nombre} se ha eliminado correctamente.`,
      })
      window.setTimeout(() => setUsersSuccessMessage(''), 3000)
    } catch (err) {
      const message = err.message || 'No se pudo eliminar el usuario. Intentalo de nuevo.'
      setUsersError(message)
      await showError({
        title: 'No se pudo eliminar',
        text: message,
      })
    } finally {
      setDeletingUsuarioId(null)
    }
  }

  const actualizarFactura = async (idPedido, nuevoEstado) => {
    setProcessingPedidoId(idPedido)
    setFacturacionError('')
    setFacturacionSuccessMessage('')

    try {
      await actualizarEstadoPedido(idPedido, nuevoEstado)
      setFacturasAdmin((currentPedidos) => (
        currentPedidos.map((pedido) => (
          pedido.idPedido === idPedido
            ? { ...pedido, estado: nuevoEstado }
            : pedido
        ))
      ))
      setFacturacionSuccessMessage(`Pedido ${nuevoEstado === 'aceptado' ? 'aceptado' : 'denegado'} correctamente.`)
      window.setTimeout(() => setFacturacionSuccessMessage(''), 3000)
    } catch (err) {
      setFacturacionError(err.message || 'No se pudo actualizar la factura.')
    } finally {
      setProcessingPedidoId(null)
    }
  }

  const handleSaveChanges = async () => {
    if (!editingUsuario) return
    if (isSuperAdminAccount(editingUsuario)) {
      setUsersError('La cuenta super admin no se puede editar.')
      handleCloseModal()
      return
    }

    setIsEditLoading(true)
    setUsersError('')
    setUsersSuccessMessage('')

    try {
      await updateUser(editingUsuario.idUsuario, {
        ...editingUsuarioForm,
      })

      setUsuarios((currentUsers) => (
        currentUsers.map((currentUser) => (
          currentUser.idUsuario === editingUsuario.idUsuario
            ? { ...currentUser, ...editingUsuarioForm }
            : currentUser
        ))
      ))

      setUsersSuccessMessage(`Datos de ${editingUsuarioForm.nombre} actualizados correctamente.`)
      handleCloseModal()
      window.setTimeout(() => setUsersSuccessMessage(''), 3000)
    } catch (err) {
      setUsersError(err.message || 'No se pudo actualizar el usuario.')
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

    const isSuperAdminProfile = isSuperAdminAccount(profileData)

    return (
      <div className="settings-profile-grid">
        <div className={`settings-card settings-profile-card${isProfileEditing ? ' is-editing' : ''}`}>
          {profileError && <div className="alert alert-warning mb-3">{profileError}</div>}
          {profileSuccessMessage && <div className="alert alert-success mb-3">{profileSuccessMessage}</div>}
          {isSuperAdminProfile && (
            <div className="alert alert-info mb-3">
              Cuenta super admin protegida: no permite edicion ni eliminacion.
            </div>
          )}

          <div className="settings-profile-head">
            <h2 className="settings-section-title">Perfil</h2>
            <div className="settings-profile-actions">
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={() => setIsProfileEditing((isEditing) => !isEditing)}
                disabled={isProfileSaving || isProfileDeleting || isSuperAdminProfile}
              >
                {isProfileEditing ? 'Cancelar edicion' : 'Editar datos'}
              </button>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={handleDeleteOwnAccount}
                disabled={isProfileSaving || isProfileDeleting || isSuperAdminProfile}
              >
                {isProfileDeleting ? 'Eliminando...' : 'Eliminar cuenta'}
              </button>
            </div>
          </div>
          <div className="settings-profile-fields">
            <div>
              <label>Rol</label>
              <span className={getRoleBadgeClass(profileData.rol)}>{getRoleText(profileData.rol)}</span>
            </div>

            <div>
              <label>Nombre</label>
              <span>{profileData.nombre}</span>
            </div>

            <div>
              <label>Primer apellido</label>
              <span>{profileData.primerApellido || 'N/A'}</span>
            </div>

            <div>
              <label>Segundo apellido</label>
              <span>{profileData.segundoApellido || 'N/A'}</span>
            </div>

            <div>
              <label>Correo electrónico</label>
              <span>{profileData.email}</span>
            </div>

            {(profileData.creadoEn || profileData.fechaAlta) && (
              <div>
                <label>Miembro desde</label>
                <span>{formatDate(profileData.creadoEn || profileData.fechaAlta)}</span>
              </div>
            )}
          </div>

          {isProfileEditing && (
            <form className="settings-profile-form" onSubmit={handleSaveProfile}>
              <div className="settings-profile-form-grid">
                <label>
                  Nombre
                  <input
                    className="form-control"
                    value={profileFormData.nombre}
                    onChange={(event) => handleProfileInputChange('nombre', event.target.value)}
                    disabled={isProfileSaving}
                    required
                  />
                </label>

                <label>
                  Primer apellido
                  <input
                    className="form-control"
                    value={profileFormData.primerApellido}
                    onChange={(event) => handleProfileInputChange('primerApellido', event.target.value)}
                    disabled={isProfileSaving}
                  />
                </label>

                <label>
                  Segundo apellido
                  <input
                    className="form-control"
                    value={profileFormData.segundoApellido}
                    onChange={(event) => handleProfileInputChange('segundoApellido', event.target.value)}
                    disabled={isProfileSaving}
                  />
                </label>

                <label>
                  Correo electronico
                  <input
                    className="form-control"
                    type="email"
                    value={profileFormData.email}
                    onChange={(event) => handleProfileInputChange('email', event.target.value)}
                    disabled={isProfileSaving}
                    required
                  />
                </label>
              </div>

              <div className="settings-profile-form-actions">
                <button type="submit" className="btn btn-success" disabled={isProfileSaving}>
                  {isProfileSaving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )
  }

  const renderUsersAdmin = () => {
    if (!isAdminUser) {
      return <p className="settings-empty-state">Esta opción solo está disponible para administradores.</p>
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
      <div className="settings-card settings-users-card">
        <div className="settings-card-head">
          <h2>Gestión de usuarios</h2>
          <small>Total: {usuariosFiltrados.length} de {usuarios.length}</small>
        </div>

        <div className="settings-users-toolbar" aria-label="Filtros de usuarios">
          <input
            className="form-control settings-users-search"
            type="search"
            placeholder="Buscar usuarios..."
            value={usersSearchTerm}
            onChange={(event) => setUsersSearchTerm(event.target.value)}
          />
          <div className="settings-users-role-filter" role="group" aria-label="Filtrar por rol">
            {[
              { value: 'todos', label: 'Todos' },
              { value: 'admin', label: 'Admin' },
              { value: 'usuario', label: 'Usuarios' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                className={`settings-role-filter-btn${usersRoleFilter === option.value ? ' active' : ''}`}
                onClick={() => setUsersRoleFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {usersError && <div className="alert alert-danger">{usersError}</div>}
        {usersSuccessMessage && <div className="alert alert-success">{usersSuccessMessage}</div>}

        <>
          <div className="settings-users-mobile" aria-label="Usuarios móviles">
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((currentUser) => (
                <article key={currentUser.idUsuario} className="settings-user-mobile-card">
                  <div className="settings-user-mobile-line">
                    <strong className="settings-user-mobile-name">{currentUser.nombre}</strong>
                    <span className={getRoleBadgeClass(currentUser.rol)}>{getRoleText(currentUser.rol)}</span>
                  </div>

                  <div className="settings-user-mobile-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-info"
                      onClick={() => handleViewClick(currentUser)}
                    >
                      Detalle
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => handleEditClick(currentUser)}
                      disabled={currentUser.idUsuario === user.idUsuario || isSuperAdminAccount(currentUser)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteUser(currentUser)}
                      disabled={currentUser.idUsuario === user.idUsuario || isSuperAdminAccount(currentUser) || deletingUsuarioId === currentUser.idUsuario}
                    >
                      {deletingUsuarioId === currentUser.idUsuario ? 'Borrando...' : 'Borrar'}
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="settings-empty-state">
                <p>No hay usuarios que coincidan con los filtros</p>
              </div>
            )}
          </div>

          <div className="table-responsive settings-table-wrap settings-users-desktop">
            <table className="table table-hover align-middle mb-0 settings-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((currentUser) => (
                    <tr key={currentUser.idUsuario}>
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
                            Detalle
                          </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => handleEditClick(currentUser)}
                          disabled={currentUser.idUsuario === user.idUsuario || isSuperAdminAccount(currentUser)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteUser(currentUser)}
                          disabled={currentUser.idUsuario === user.idUsuario || isSuperAdminAccount(currentUser) || deletingUsuarioId === currentUser.idUsuario}
                        >
                          {deletingUsuarioId === currentUser.idUsuario ? 'Borrando...' : 'Borrar'}
                        </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">No hay usuarios que coincidan con los filtros</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      </div>
    )
  }

  const renderBillingAdmin = () => (
    <div className="settings-billing-dashboard">
      {facturacionError && <div className="alert alert-danger">{facturacionError}</div>}
      {facturacionSuccessMessage && <div className="alert alert-success">{facturacionSuccessMessage}</div>}

      <div className="settings-billing-table-block card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="settings-billing-filters">
            <div className="settings-billing-filter-field settings-billing-filter-search">
              <input
                className="form-control"
                type="search"
                placeholder="Buscar cliente..."
                value={facturacionSearchTerm}
                onChange={(event) => {
                  setFacturacionSearchTerm(event.target.value)
                  setFacturacionPage(1)
                }}
              />
            </div>
            <div className="settings-billing-filter-field">
              <select
                className="form-select"
                value={facturacionStatusFilter}
                onChange={(event) => {
                  setFacturacionStatusFilter(event.target.value)
                  setFacturacionPage(1)
                }}
              >
                <option value="todos">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="aceptado">Aceptada</option>
                <option value="denegado">Rechazada</option>
                <option value="cancelado">Cancelada</option>
              </select>
            </div>
            <div className="settings-billing-filter-field">
              <select
                className="form-select"
                value={facturacionPaymentFilter}
                onChange={(event) => {
                  setFacturacionPaymentFilter(event.target.value)
                  setFacturacionPage(1)
                }}
              >
                <option value="todos">Método de pago</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
                <option value="paypal">PayPal</option>
                <option value="efectivo">Efectivo</option>
              </select>
            </div>
            <div className="settings-billing-filter-action">
              <button type="button" className="btn btn-success settings-billing-reset-btn" onClick={handleResetBillingFilters}>Desactivar filtros</button>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-billing-grid">
        <section className="settings-card settings-billing-summary-card">
          <div className="settings-card-head">
            <h2>Panel de facturación</h2>
            <small>Vista general</small>
          </div>

          <div className="settings-billing-metrics">
            <article className="settings-billing-metric">
              <span className="settings-billing-metric-icon">EUR</span>
              <div>
                <p>Facturación total</p>
                <strong>{formatMoney(facturacionStats.totalFacturado)}</strong>
                <small>{facturacionStats.pendientes} pendientes</small>
              </div>
            </article>

            <article className="settings-billing-metric">
              <span className="settings-billing-metric-icon">{facturacionStats.totalFacturas}</span>
              <div>
                <p>Número de facturas</p>
                <strong>{facturacionStats.totalFacturas}</strong>
                <small>{facturacionStats.aceptadas} aceptadas</small>
              </div>
            </article>

            <article className="settings-billing-metric">
              <span className="settings-billing-metric-icon">TM</span>
              <div>
                <p>Ticket medio</p>
                <strong>{formatMoney(facturacionStats.ticketMedio)}</strong>
                <small>{facturacionStats.denegadas} denegadas</small>
              </div>
            </article>

            <article className="settings-billing-metric">
              <span className="settings-billing-metric-icon">PZ</span>
              <div>
                <p>Productos pedidos</p>
                <strong>{facturacionStats.totalProductos}</strong>
                <small>
                  {facturacionStats.pedidoPrincipal
                    ? `Pedido #${facturacionStats.pedidoPrincipal.idPedido} con mas piezas`
                    : 'Sin pedidos registrados'}
                </small>
              </div>
            </article>
          </div>
        </section>

        <aside className="settings-card settings-billing-chart-card">
          <div className="settings-card-head">
            <h2>Estado de pedidos</h2>
          </div>

          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex flex-column gap-4 align-items-center">
              <div className="d-flex align-items-center justify-content-center w-100">
                {/*
                  TODO: Donut SVG (Bootstrap-ready)
                  - Pendiente: conectar dinámicamente a los datos reales.
                  - Usa variables de Bootstrap para colores (ej. `var(--bs-success)`) y está preparado
                    para actualizar el stroke-dasharray/segments desde JS cuando tengamos los datos.
                */}
                <div className="settings-billing-donut-svg">
                  {(() => {
                    const normalized = Math.max(0, Math.min(100, facturacionStats.acceptedPercent))
                    const radius = 60
                    const stroke = 16
                    const circumference = 2 * Math.PI * radius
                    const dash = (normalized / 100) * circumference

                    return (
                      <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden="true">
                        <defs>
                          <filter id="donutShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#0f172a" floodOpacity="0.06"/>
                          </filter>
                        </defs>

                        <g transform="translate(90,90)">
                          {/* background ring */}
                          <circle r={radius} fill="none" stroke="var(--bs-light)" strokeWidth={stroke} />

                          {/* active slice (main category) */}
                          <circle
                            r={radius}
                            fill="none"
                            stroke="var(--bs-success)"
                            strokeWidth={stroke}
                            strokeLinecap="round"
                            strokeDasharray={`${dash} ${circumference - dash}`}
                            strokeDashoffset={-circumference * 0.25}
                            style={{ filter: 'url(#donutShadow)' }}
                          />

                          {/* inner white circle */}
                          <circle r={radius - stroke - 4} fill="#fff" />

                          {/* center text */}
                          <g>
                            <text y="-6" textAnchor="middle" className="donut-center-label" fill="#64748b">Total</text>
                            <text y="12" textAnchor="middle" className="donut-center-value" fontWeight="900">{facturasAdminFiltradas.length}</text>
                            <text y="28" textAnchor="middle" className="donut-center-small" fill="#94a3b8">facturas</text>
                          </g>
                        </g>
                      </svg>
                    )
                  })()}
                </div>
              </div>

              <div className="d-grid gap-3 w-100">
                {facturacionStats.estados.map((trend) => (
                  <div key={trend.nombre}>
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <strong className="small text-dark">{trend.nombre}</strong>
                      <span className="small text-muted">{trend.porcentaje}% - {trend.total} pedidos</span>
                    </div>
                    <div className="progress" style={{ height: '10px' }}>
                      <div className={`progress-bar bg-${trend.color}`} role="progressbar" style={{ width: `${trend.porcentaje}%` }} aria-valuenow={trend.porcentaje} aria-valuemin="0" aria-valuemax="100" />
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" className="btn btn-outline-success fw-bold mt-auto">
                Ver informe completo
              </button>
            </div>
          </div>
        </aside>
      </div>

      <div className="settings-card settings-billing-table-card settings-billing-history-card">
        <div className="settings-card-head">
          <h2>Facturas recientes</h2>
          <small>{facturasAdminFiltradas.length} resultados</small>
        </div>

        {isFacturacionLoading ? (
          <div className="settings-empty-state">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p>Cargando historial de facturación...</p>
          </div>
        ) : facturasAdminFiltradas.length === 0 ? (
          <div className="settings-empty-state">
            <p>No hay facturas para los filtros actuales.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive settings-table-wrap settings-billing-history-desktop">
              <table className="table align-middle mb-0 settings-table">
                <thead>
                  <tr>
                    <th>Factura</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Pago</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {facturasAdminPaginadas.map((factura) => (
                    <tr key={factura.idPedido}>
                      <td>#{factura.idPedido}</td>
                      <td>
                        <div>
                          <strong>{factura.nombre} {factura.primerApellido}</strong>
                          <small>{factura.email}</small>
                        </div>
                      </td>
                      <td>{formatDate(factura.fecha)}</td>
                      <td>{factura.totalProductos ?? 0}</td>
                      <td>{formatMoney(factura.total)}</td>
                      <td>{getPaymentLabel(factura.metodoPago)}</td>
                      <td><span className={getStatusClass(factura.estado)}>{getStatusLabel(factura.estado)}</span></td>
                      <td>
                        <div className="settings-inline-actions">
                          <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={() => actualizarFactura(factura.idPedido, 'aceptado')}
                            disabled={processingPedidoId === factura.idPedido || factura.estado !== 'pendiente'}
                          >
                            Aceptar
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => actualizarFactura(factura.idPedido, 'denegado')}
                            disabled={processingPedidoId === factura.idPedido || factura.estado !== 'pendiente'}
                          >
                            Denegar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="settings-billing-history-mobile" aria-label="Facturas recientes en tablet y movil">
              {facturasAdminPaginadas.map((factura) => (
                <article key={factura.idPedido} className="settings-billing-history-item">
                  <div className="settings-billing-history-main">
                    <div>
                      <strong className="settings-billing-history-number">#{factura.idPedido}</strong>
                      <p>{factura.nombre} {factura.primerApellido}</p>
                      <small>{factura.email}</small>
                    </div>
                    <div className="settings-billing-history-total">
                      <strong>{formatMoney(factura.total)}</strong>
                      <span className={getStatusClass(factura.estado)}>{getStatusLabel(factura.estado)}</span>
                    </div>
                  </div>

                  <div className="settings-billing-history-meta">
                    <span>{formatDate(factura.fecha)}</span>
                    <span>{factura.totalProductos ?? 0} productos</span>
                    <span>{getPaymentLabel(factura.metodoPago)}</span>
                  </div>

                  <div className="settings-inline-actions settings-billing-history-actions">
                    <button
                      type="button"
                      className="btn btn-sm btn-success"
                      onClick={() => actualizarFactura(factura.idPedido, 'aceptado')}
                      disabled={processingPedidoId === factura.idPedido || factura.estado !== 'pendiente'}
                    >
                      Aceptar
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => actualizarFactura(factura.idPedido, 'denegado')}
                      disabled={processingPedidoId === factura.idPedido || factura.estado !== 'pendiente'}
                    >
                      Denegar
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <nav className="billing-pagination" aria-label="Paginación de facturas">
              <button type="button" className="billing-page-btn" onClick={() => setFacturacionPage((value) => Math.max(1, value - 1))} disabled={facturacionPageSafe === 1}>
                &lt;
              </button>

              {Array.from({ length: facturacionTotalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={`billing-page-btn${pageNumber === facturacionPageSafe ? ' active' : ''}`}
                  onClick={() => setFacturacionPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}

              <button type="button" className="billing-page-btn" onClick={() => setFacturacionPage((value) => Math.min(facturacionTotalPages, value + 1))} disabled={facturacionPageSafe === facturacionTotalPages}>
                &gt;
              </button>
            </nav>
          </>
        )}
      </div>
    </div>
  )

  const renderInvoicesUser = () => (
    <div className="settings-card">
      <div className="settings-card-head settings-invoices-head">
        <h2>Facturas</h2>
        <small>{facturasUsuario.length} pedidos</small>
      </div>

      {facturasError && <div className="alert alert-danger">{facturasError}</div>}

      {isFacturasLoading ? (
        <div className="settings-empty-state">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando tus facturas...</p>
        </div>
      ) : (
        <>
          <div className="settings-invoices-mobile" aria-label="Facturas en móvil">
            {facturasUsuario.length > 0 ? (
              facturasUsuario.map((factura) => {
                const isDetalleAbierto = facturaDetalleAbiertoId === factura.idPedido

                return (
                  <article key={factura.idPedido} className="settings-invoice-mobile-card">
                    <div className="settings-invoice-mobile-top">
                      <strong className="settings-invoice-mobile-number">#{factura.idPedido}</strong>
                      <span className={getStatusClass(factura.estado)}>{getStatusLabel(factura.estado)}</span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success settings-invoice-mobile-toggle"
                      onClick={() => setFacturaDetalleAbiertoId((currentId) => (
                        currentId === factura.idPedido ? null : factura.idPedido
                      ))}
                    >
                      {isDetalleAbierto ? 'Ocultar detalle' : 'Ver detalle'}
                    </button>

                    {isDetalleAbierto && (
                      <div className="settings-invoice-mobile-detail">
                        <p><strong>Dirección:</strong> {factura.direccionEnvio || 'Sin dirección'}</p>
                        <p><strong>Fecha:</strong> {formatDate(factura.fecha)}</p>
                        <p><strong>Total:</strong> {formatMoney(factura.total)}</p>
                        <p><strong>Pago:</strong> {getPaymentLabel(factura.metodoPago)}</p>
                      </div>
                    )}
                  </article>
                )
              })
            ) : (
              <div className="settings-empty-state">
                <p>No tienes facturas disponibles.</p>
              </div>
            )}
          </div>

          <div className="table-responsive settings-table-wrap settings-invoices-desktop">
            <table className="table align-middle mb-0 settings-table">
              <thead>
                <tr>
                  <th>Factura</th>
                  <th>Dirección</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Pago</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {facturasUsuario.length > 0 ? (
                  facturasUsuario.map((factura) => (
                    <tr key={factura.idPedido}>
                      <td>#{factura.idPedido}</td>
                      <td>{factura.direccionEnvio}</td>
                      <td>{formatDate(factura.fecha)}</td>
                      <td>{formatMoney(factura.total)}</td>
                      <td>{getPaymentLabel(factura.metodoPago)}</td>
                      <td>
                        <span className={getStatusClass(factura.estado)}>{getStatusLabel(factura.estado)}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No tienes facturas disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )

  const renderPlanos = () => (
    <div className="settings-card settings-placeholder-card">
      <h2>Planos</h2>
      <p>Aún no hay planos guardados. Cuando prepares diseños, aparecerán en esta sección.</p>
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

  const headerContent = getSettingsHeader(activeTab, tabs, isAdminUser)

  return (
    <section className="page-shell settings-page-shell container-fluid">
      <div className="settings-layout">
        <aside className="settings-sidebar" aria-label="Menú de cuenta">
          <div className="settings-sidebar-head">
            <h1>Mi cuenta</h1>
            <small>{user?.nombre || 'Usuario'}</small>
          </div>

          <nav className="settings-nav-list">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`settings-nav-item${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => {
                  setFacturaDetalleAbiertoId(null)
                  setActiveTab(tab.id)
                  if (typeof onTabChange === 'function') {
                    onTabChange(tab.id)
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="settings-content">
          <header className="settings-header-bar">
            <div>
              <p className="settings-eyebrow">{headerContent.eyebrow}</p>
              <h2>{headerContent.title}</h2>
              <p>{headerContent.text}</p>
            </div>
          </header>

          {renderActiveTab()}
        </main>
      </div>

      {editingUsuario && (
        <div className="modal d-block usuarios-modal-backdrop" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content usuarios-modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar usuario</h5>
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
                  <input
                    className="form-control"
                    value={editingUsuarioForm.nombre}
                    onChange={(event) => handleAdminUserInputChange('nombre', event.target.value)}
                    disabled={isEditLoading}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted">Correo electrónico:</label>
                  <input
                    className="form-control"
                    type="email"
                    value={editingUsuarioForm.email}
                    onChange={(event) => handleAdminUserInputChange('email', event.target.value)}
                    disabled={isEditLoading}
                    required
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label text-muted">Primer apellido:</label>
                    <input
                      className="form-control"
                      value={editingUsuarioForm.primerApellido}
                      onChange={(event) => handleAdminUserInputChange('primerApellido', event.target.value)}
                      disabled={isEditLoading}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted">Segundo apellido:</label>
                    <input
                      className="form-control"
                      value={editingUsuarioForm.segundoApellido}
                      onChange={(event) => handleAdminUserInputChange('segundoApellido', event.target.value)}
                      disabled={isEditLoading}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="rolSelect" className="form-label text-muted">
                    Nuevo rol:
                  </label>
                  <select
                    id="rolSelect"
                    className="form-select form-select-sm"
                    value={editingUsuarioForm.rol}
                    onChange={(event) => handleAdminUserInputChange('rol', event.target.value)}
                    disabled={isEditLoading}
                  >
                    <option value="usuario">Usuario</option>
                    <option value="admin">ADMIN</option>
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
                        <label>Correo electrónico</label>
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

