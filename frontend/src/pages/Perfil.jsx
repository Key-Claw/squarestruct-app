import { useState, useEffect } from 'react'
import { getProfile } from '../services/authService'

/**
 * Página de perfil del usuario autenticado.
 * Muestra información personal del usuario y permite ver datos de la cuenta.
 * @param {function} onNavigate - Callback para cambiar de página.
 * @param {object} user - Datos del usuario autenticado.
 * @param {function} onUserLogout - Callback para cerrar sesión.
 */
function Perfil({ onNavigate, user, onUserLogout }) {
  // Datos del usuario (pueden ser más actualizados que los del estado global).
  const [userData, setUserData] = useState(user)
  // Flag para mostrar spinner mientras se cargan datos.
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Carga los datos más recientes del usuario desde el servidor.
   * Se ejecuta al montar el componente.
   */
  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true)
      try {
        const profile = await getProfile()
        setUserData(profile)
      } catch {
        // Si falla el refresco, usamos la sesión local para no romper la vista.
        setUserData(user)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserProfile()
  }, [user])

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

  // Mostrar spinner mientras se carga
  if (isLoading) {
    return (
      <section className="page-shell perfil-shell container-fluid">
        <div className="container-fluid perfil-container profile-container">
          <div className="text-center py-5">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Renderizar perfil del usuario
  return (
    <section className="page-shell perfil-shell container-fluid">
      {/* Bootstrap grid, card, table, badge, spinner and buttons:
          https://getbootstrap.com/docs/5.3/layout/grid/
          https://getbootstrap.com/docs/5.3/components/card/
          https://getbootstrap.com/docs/5.3/content/tables/
          https://getbootstrap.com/docs/5.3/components/badge/
          https://getbootstrap.com/docs/5.3/components/spinners/
          https://getbootstrap.com/docs/5.3/components/buttons/ */}
      <div className="container-fluid perfil-container profile-container">
        <div className="row justify-content-center align-items-start">
          <div className="col-12 col-md-10 col-lg-8 col-xxl-7">
            <div className="card bg-dark text-white perfil-card">
              <div className="card-body p-4 p-md-5">
                {/* Título de la página. */}
                <h2 className="fw-bold mb-4 text-uppercase text-center">Mi perfil</h2>

                {/* Nota breve para aclarar qué información se muestra. */}
                <p className="perfil-note text-center text-white-50 mb-4">
                  Aquí puedes consultar los datos asociados a tu cuenta.
                </p>

                {/* Contenedor de información del usuario. */}
                {userData && (
                  <div className="perfil-info">
                    {/* Tabla con separadores visuales para hacer la información más clara. */}
                    <div className="table-responsive perfil-table-wrap">
                      <table className="table table-dark table-bordered align-middle perfil-table mb-0">
                        <tbody>
                          <tr>
                            <th scope="row">ID de usuario</th>
                            <td>{userData.idUsuario}</td>
                          </tr>
                          <tr>
                            <th scope="row">Nombre</th>
                            <td>{userData.nombre}</td>
                          </tr>
                          <tr>
                            <th scope="row">Correo electrónico</th>
                            <td>{userData.email}</td>
                          </tr>
                          <tr>
                            <th scope="row">Rol</th>
                            <td>
                              <span className={getRolBadgeClass(userData.rol)}>
                                {userData.rol.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Botones de acciones. */}
                    <div className="perfil-actions d-flex gap-2 justify-content-center mt-4 pt-3 border-top border-secondary">
                      {/* Botón para volver a home. */}
                      <button
                        type="button"
                        className="btn btn-outline-light"
                        onClick={() => onNavigate('home')}
                      >
                        Volver al inicio
                      </button>

                      {/* Botón para cerrar sesión. */}
                      <button
                        type="button"
                        className="btn btn-outline-warning"
                        onClick={() => {
                          onUserLogout()
                          onNavigate('home')
                        }}
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Perfil
