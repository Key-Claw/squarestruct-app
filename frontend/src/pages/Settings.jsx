import { useEffect, useMemo, useState } from 'react'
import { getAllUsers, getProfile, getUserById, logoutUser, updateUser } from '../services/authService'
import { actualizarEstadoPedido, obtenerMisPedidos, obtenerPedidosAdmin } from '../services/orderService'
import '../styles/settings.css'

const FACTURACION_PAGE_SIZE = 5

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

const formatMoney = (amount) => new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
}).format(Number(amount || 0))

const getStatusClass = (status) => {
  const normalizedStatus = (status || '').toLowerCase()

  if (normalizedStatus === 'pendiente') return 'settings-invoice-status pending'
  if (normalizedStatus === 'aceptado') return 'settings-invoice-status accepted'
  if (normalizedStatus === 'denegado') return 'settings-invoice-status rejected'

  return 'settings-invoice-status'
}

const getStatusLabel = (status) => {
  const normalizedStatus = (status || '').toLowerCase()

  if (normalizedStatus === 'pendiente') return 'Pendiente'
  if (normalizedStatus === 'aceptado') return 'Aceptada'
  if (normalizedStatus === 'denegado') return 'Denegada'

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

  // Facturas del usuario autenticado.
  const [facturasUsuario, setFacturasUsuario] = useState([])
  const [isFacturasLoading, setIsFacturasLoading] = useState(false)
  const [facturasError, setFacturasError] = useState('')

  // Facturación pendiente para administradores.
  const [facturasAdmin, setFacturasAdmin] = useState([])
  const [isFacturacionLoading, setIsFacturacionLoading] = useState(false)
  const [facturacionError, setFacturacionError] = useState('')
  const [facturacionSuccessMessage, setFacturacionSuccessMessage] = useState('')
  const [processingPedidoId, setProcessingPedidoId] = useState(null)
  const [facturacionPage, setFacturacionPage] = useState(1)

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

  const facturasAdminFiltradas = useMemo(() => facturasAdmin, [facturasAdmin])

  const facturacionStats = useMemo(() => {
    const totalFacturado = facturasAdminFiltradas.reduce((sum, factura) => sum + Number(factura.total || 0), 0)
    const totalFacturas = facturasAdminFiltradas.length
    const totalProductos = facturasAdminFiltradas.reduce((sum, factura) => sum + Number(factura.totalProductos || 0), 0)
    const pendientes = facturasAdminFiltradas.filter((factura) => factura.estado === 'pendiente').length
    const aceptadas = facturasAdminFiltradas.filter((factura) => factura.estado === 'aceptado').length
    const denegadas = facturasAdminFiltradas.filter((factura) => factura.estado === 'denegado').length
    const ticketMedio = totalFacturas > 0 ? totalFacturado / totalFacturas : 0
    const pedidoPrincipal = facturasAdminFiltradas.reduce((top, factura) => {
      if (!top) return factura
      return Number(factura.totalProductos || 0) > Number(top.totalProductos || 0) ? factura : top
    }, null)

    const estados = [
      { nombre: 'Aceptadas', total: aceptadas, color: 'success' },
      { nombre: 'Pendientes', total: pendientes, color: 'warning' },
      { nombre: 'Denegadas', total: denegadas, color: 'danger' },
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
      ticketMedio,
      pedidoPrincipal,
      estados,
      acceptedPercent: totalFacturas > 0 ? Math.round((aceptadas / totalFacturas) * 100) : 0,
    }
  }, [facturasAdminFiltradas])

  const facturacionDateRange = useMemo(() => {
    const fechas = facturasAdminFiltradas
      .map((factura) => new Date(factura.fecha))
      .filter((fecha) => !Number.isNaN(fecha.getTime()))
      .sort((a, b) => a - b)

    if (fechas.length === 0) return 'Sin pedidos'

    return `${fechas[0].toLocaleDateString('es-ES')} - ${fechas[fechas.length - 1].toLocaleDateString('es-ES')}`
  }, [facturasAdminFiltradas])

  const facturacionTotalPages = Math.max(1, Math.ceil(facturasAdminFiltradas.length / FACTURACION_PAGE_SIZE))
  const facturacionPageSafe = Math.min(facturacionPage, facturacionTotalPages)

  const facturasAdminPaginadas = useMemo(() => {
    const startIndex = (facturacionPageSafe - 1) * FACTURACION_PAGE_SIZE
    return facturasAdminFiltradas.slice(startIndex, startIndex + FACTURACION_PAGE_SIZE)
  }, [facturacionPageSafe, facturasAdminFiltradas])

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
              <label>Correo electrónico</label>
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
      <div className="settings-card">
        <div className="settings-card-head">
          <h2>Gestión de usuarios</h2>
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
    <div className="settings-billing-dashboard">
      <div className="settings-billing-hero">
        <div>
          <p className="settings-billing-eyebrow">Administración</p>
          <h2>Panel de facturación</h2>
          <p>Controla facturas, estados y el histórico completo de pedidos.</p>
        </div>
      </div>

      {facturacionError && <div className="alert alert-danger">{facturacionError}</div>}
      {facturacionSuccessMessage && <div className="alert alert-success">{facturacionSuccessMessage}</div>}

      <div className="settings-billing-table-block card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-4">
              <input className="form-control" type="text" placeholder="Buscar cliente..." readOnly />
            </div>
            <div className="col-12 col-md-3">
              <input className="form-control" type="text" value={facturacionDateRange} readOnly />
            </div>
            <div className="col-12 col-md-2">
              <select className="form-select" defaultValue="todos" disabled>
                <option value="todos">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="aceptado">Aceptada</option>
                <option value="denegado">Rechazada</option>
                <option value="pagado">Pagada</option>
              </select>
            </div>
            <div className="col-12 col-md-2">
              <select className="form-select" defaultValue="todos" disabled>
                <option value="todos">Método de pago</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
                <option value="paypal">PayPal</option>
                <option value="efectivo">Efectivo</option>
              </select>
            </div>
            <div className="col-12 col-lg-1 d-grid">
              <button type="button" className="btn btn-success" disabled>Filtrar</button>
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
            <button type="button" className="btn btn-outline-secondary btn-sm">Este mes</button>
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
            <div className="table-responsive settings-table-wrap">
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

            <nav className="billing-pagination" aria-label="Paginación de facturas">
              <button type="button" className="btn" onClick={() => setFacturacionPage((value) => Math.max(1, value - 1))} disabled={facturacionPageSafe === 1}>
                &lt;
              </button>

              {Array.from({ length: facturacionTotalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={`btn${pageNumber === facturacionPageSafe ? ' active' : ''}`}
                  onClick={() => setFacturacionPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}

              <button type="button" className="btn" onClick={() => setFacturacionPage((value) => Math.min(facturacionTotalPages, value + 1))} disabled={facturacionPageSafe === facturacionTotalPages}>
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
      <div className="settings-card-head">
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
        <div className="table-responsive settings-table-wrap">
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
              <p>Gestiona tu perfil, facturas y herramientas desde una sola pantalla.</p>
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
                  <label className="form-label text-muted">Correo electrónico:</label>
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
