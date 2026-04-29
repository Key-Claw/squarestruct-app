import { useState, useEffect } from 'react'
import { getAllUsers, updateUser } from '../services/authService'

/**
 * Página de administración de usuarios (solo para admin).
 * Muestra lista de todos los usuarios y permite cambiar sus roles.
 * @param {function} onNavigate - Callback para cambiar de página.
 * @param {object} user - Datos del usuario autenticado (admin).
 */
function Usuarios({ onNavigate, user }) {
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
        setError('Error al cargar la lista de usuarios')
      } finally {
        setIsLoading(false)
      }
    }

    loadUsuarios()
  }, [])

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

      setSuccessMessage(`Rol de ${editingUsuario.nombre} actualizado a ${nuevoRol}`)
      handleCloseModal()

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setError('Error al actualizar el rol del usuario')
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
      case 'moderador':
        return 'badge bg-warning text-dark'
      default:
        return 'badge bg-info'
    }
  }

  /**
   * Formatea una fecha ISO a formato legible.
   * @param {string} dateString - Fecha en formato ISO.
   * @returns {string} Fecha formateada.
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES')
  }

  // Mostrar spinner mientras se carga
  if (isLoading) {
    return (
      <section className="page-shell usuarios-shell">
        <div className="container usuarios-container">
          <div className="text-center py-5">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="page-shell usuarios-shell">
      <div className="container-fluid usuarios-container">
        <div className="row">
          <div className="col-12">
            <div className="card bg-dark text-white usuarios-card">
              <div className="card-body p-4">
                {/* Encabezado con título y botón de retorno. */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="fw-bold mb-0 text-uppercase">Gestión de Usuarios</h2>
                  <button
                    type="button"
                    className="btn btn-outline-light btn-sm"
                    onClick={() => onNavigate('home')}
                  >
                    ← Volver
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
                      aria-label="Cerrar"
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
                      aria-label="Cerrar"
                    ></button>
                  </div>
                )}

                {/* Tabla de usuarios. */}
                <div className="table-responsive">
                  <table className="table table-dark table-hover mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Miembro desde</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Renderizar cada usuario en una fila. */}
                      {usuarios && usuarios.length > 0 ? (
                        usuarios.map((u) => (
                          <tr key={u.idUsuario}>
                            <td className="text-muted">{u.idUsuario}</td>
                            <td className="fw-bold">{u.nombre}</td>
                            <td>{u.email}</td>
                            <td>
                              {/* Badge con el rol actual del usuario. */}
                              <span className={getRolBadgeClass(u.rol)}>
                                {u.rol.toUpperCase()}
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
                                    ? 'No puedes editar tu propio rol'
                                    : 'Editar rol'
                                }
                              >
                                Editar
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center text-muted py-4">
                            No hay usuarios registrados
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Información de resumen. */}
                <div className="mt-3 text-muted">
                  <small>Total de usuarios: {usuarios ? usuarios.length : 0}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para editar rol de usuario. */}
      {editingUsuario && (
        <div
          className="modal d-block bg-dark bg-opacity-50"
          style={{ display: 'block' }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header border-secondary">
                <h5 className="modal-title">Editar Rol de Usuario</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                  disabled={isEditLoading}
                  aria-label="Cerrar"
                ></button>
              </div>

              <div className="modal-body">
                {/* Información del usuario a editar. */}
                <div className="mb-3">
                  <label className="form-label text-muted">Nombre:</label>
                  <p className="mb-0 fw-bold">{editingUsuario.nombre}</p>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted">Email:</label>
                  <p className="mb-0">{editingUsuario.email}</p>
                </div>

                {/* Selector de nuevo rol. */}
                <div className="mb-4">
                  <label htmlFor="rolSelect" className="form-label text-muted">
                    Nuevo Rol:
                  </label>
                  <select
                    id="rolSelect"
                    className="form-select form-select-sm bg-secondary text-white"
                    value={nuevoRol}
                    onChange={(e) => setNuevoRol(e.target.value)}
                    disabled={isEditLoading}
                  >
                    <option value="usuario">Usuario</option>
                    <option value="moderador">Moderador</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Aviso si se cambia a admin. */}
                {nuevoRol === 'admin' && nuevoRol !== editingUsuario.rol && (
                  <div className="alert alert-warning alert-sm mb-3" role="alert">
                    ⚠️ Estás asignando permisos de administrador a este usuario.
                  </div>
                )}
              </div>

              <div className="modal-footer border-secondary">
                {/* Botón para cancelar. */}
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={handleCloseModal}
                  disabled={isEditLoading}
                >
                  Cancelar
                </button>

                {/* Botón para guardar cambios. */}
                <button
                  type="button"
                  className="btn btn-warning text-dark fw-bold"
                  onClick={handleSaveChanges}
                  disabled={isEditLoading}
                >
                  {isEditLoading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Usuarios
