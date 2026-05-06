import { useState } from 'react'

import logo from '../assets/logo/squarestruct-icon.png'
import '../styles/navbar.css'

/**
 * Barra de navegación principal.
 * 
 * Componentes de Bootstrap utilizados:
 * - navbar / navbar-expand-md / navbar-light: estructura principal responsive
 * - container-fluid: ancho fluido del contenido
 * - navbar-brand: zona del logo
 * - navbar-toggler + collapse + navbar-collapse: menú hamburguesa
 * - navbar-nav / nav-item: listas de navegación
 * - dropdown / dropdown-toggle / dropdown-menu: menú de usuario
 * - input-group / form-control / btn: buscador y botones
 * 
 * Los estilos finales están en src/styles/navbar.css
 * 
 * @param {object} props - Props del componente
 * @param {string} props.activePage - Página activa actual
 * @param {string} props.activeSection - Sección activa del catálogo
 * @param {function} props.onNavigate - Callback para cambiar de página
 * @param {object} props.user - Datos del usuario autenticado (null si no hay sesión)
 * @param {function} props.onLogout - Callback para logout
 * @param {function} props.onOpenAuthModal - Callback para abrir modal de autenticación
 * @param {function} props.onOpenCartPanel - Callback para abrir panel del carrito
 * @param {function} props.onOpenProfilePanel - Callback para abrir panel del perfil
 */
function Navbar({
  activePage,
  activeSection,
  onNavigate,
  user,
  onLogout,
  onOpenAuthModal,
  onOpenCartPanel,
  onOpenProfilePanel,
}) {
  // Elementos del menú de navegación principal
  const items = [
    { id: 'home', label: 'Inicio' },
    { id: 'galeria', label: 'Galeria' },
    { id: 'catalogo', label: 'Catalogo' },
    { id: 'design', label: 'Design' },
  ]

  // Estado del buscador
  const [searchValue, setSearchValue] = useState('')
  // Estado del idioma
  const [language, setLanguage] = useState('ES')

  /**
   * Determina si un item de menú está activo.
   * @param {object} item - Item del menú
   * @returns {boolean} true si el item está activo
   */
  const isItemActive = (item) => {
    const targetPage = item.page || item.id
    return activePage === targetPage && (item.section ? activeSection === item.section : !activeSection)
  }

  /**
   * Maneja la búsqueda en el catálogo.
   */
  const handleSearch = () => {
    const term = searchValue.trim()
    onNavigate('catalogo', term, 'productos')
    setSearchValue('')
  }

  /**
   * Maneja el logout del usuario.
   */
  const handleLogout = () => {
    onLogout()
    onNavigate('home')
  }

  /**
   * Cambia el idioma (por ahora solo para demostración).
   * @param {string} lang - Código del idioma
   */
  const handleLanguageChange = (lang) => {
    setLanguage(lang)
  }

  /**
   * Renderiza el formulario de búsqueda (reutilizado en mobile y desktop).
   * @param {string} className - Clase CSS adicional
   * @returns {JSX.Element}
   */
  const renderSearchForm = (className = '') => (
    <form
      className={`navbar-search-form ${className}`}
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        handleSearch()
      }}
    >
      {/* Bootstrap input-group + form-control + btn. Los tamaños se ajustan en navbar.css. */}
      <div className="input-group navbar-search-group">
        <input
          type="text"
          className="form-control navbar-search-input"
          placeholder="Choose file"
          aria-label="Buscar"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button className="btn navbar-search-btn" type="button" onClick={handleSearch}>
          Browse
        </button>
      </div>
    </form>
  )

  return (
    <div className="square-navbar-stage">
      {/* navbar-expand-md: en tablet queda todo en fila; en movil aparece hamburguesa. */}
      <nav className="navbar navbar-expand-md navbar-light app-navbar square-navbar">
        <div className="container-fluid square-navbar-inner">
          <a className="navbar-brand square-navbar-brand d-flex align-items-center" href="#" onClick={() => onNavigate('aboutus')}>
            <img src={logo} alt="SquareStruct" className="navbar-logo" />
          </a>

          {renderSearchForm('navbar-search-mobile')}

          {/* Toggler de Bootstrap. data-bs-target debe coincidir con id="mainNavbar". */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse square-navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav navbar-menu">
              {items.map((item) => (
                <li className="nav-item" key={item.id}>
                  <button
                    className={`navbar-menu-btn${isItemActive(item) ? ' active' : ''}`}
                    onClick={() => onNavigate(item.page || item.id, '', item.section || '')}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>

            {renderSearchForm('navbar-search-desktop')}

            <ul className="navbar-nav navbar-actions">
              <li className="nav-item dropdown">
                <button
                  className="btn dropdown-toggle navbar-user-btn"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  type="button"
                >
                  USER<span className="ms-1">{user ? user.nombre : ''}</span>
                </button>
                {/* Dropdown de Bootstrap. El contenido cambia según haya sesión o no. */}
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  {!user && (
                    <>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => onOpenAuthModal(true)}
                        >
                          Iniciar sesión
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => onOpenAuthModal(false)}
                        >
                          Crear cuenta
                        </button>
                      </li>
                    </>
                  )}
                  {user && (
                    // Mostrar solo opciones esenciales para usuarios normales.
                    // Si es admin, mostrar el menú completo; si no, mostrar únicamente "Mi perfil" y la opción de cerrar sesión.
                    user.rol === 'admin' ? (
                      <>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => onOpenProfilePanel()}
                          >
                            Mi perfil
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => onNavigate('pedidos')}
                          >
                            Mis pedidos
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => onNavigate('presupuestos')}
                          >
                            Mis presupuestos
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => onNavigate('configuracion')}
                          >
                            Configuración
                          </button>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={handleLogout}
                          >
                            Cerrar sesión
                          </button>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => onOpenProfilePanel()}
                          >
                            Mi perfil
                          </button>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={handleLogout}
                          >
                            Cerrar sesión
                          </button>
                        </li>
                      </>
                    )
                  )}
                </ul>
              </li>

              <li className="nav-item">
                <button
                  className={`btn navbar-action-btn${activePage === 'carrito' ? ' active' : ''}`}
                  type="button"
                  aria-label="Carrito"
                  title="Carrito"
                  onClick={() => onOpenCartPanel()}
                >
                  <span className="cart-icon" aria-hidden="true">&#128722;</span>
                </button>
              </li>

              <li className="nav-item d-flex align-items-center">
                {language === 'ES' ? (
                  <button
                    className="btn navbar-action-btn"
                    type="button"
                    onClick={() => handleLanguageChange('EN')}
                  >
                    ES
                  </button>
                ) : (
                  <button
                    className="btn navbar-action-btn"
                    type="button"
                    onClick={() => handleLanguageChange('ES')}
                  >
                    EN
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
