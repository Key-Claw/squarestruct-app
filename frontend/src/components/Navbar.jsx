import { useState } from 'react'

import logo from '../assets/logo/squarestruct-icon.png'
import '../styles/navbar.css'

// Navbar principal.
// Bootstrap usado aqui:
// - navbar / navbar-expand-md / navbar-light: estructura principal responsive.
// - container-fluid: ancho fluido del contenido.
// - navbar-brand: zona del logo.
// - navbar-toggler + collapse + navbar-collapse: menu hamburguesa.
// - navbar-nav / nav-item: listas de navegacion.
// - dropdown / dropdown-toggle / dropdown-menu: menu de usuario.
// - input-group / form-control / btn: buscador y botones.
// El aspecto final esta en src/styles/navbar.css para no mezclar layout con estilos.
function Navbar({ activePage, activeSection, onNavigate, user, onLogout }) {
  const items = [
    { id: 'home', label: 'Inicio' },
    { id: 'galeria', label: 'Galeria' },
    { id: 'catalogo', label: 'Catalogo' },
    { id: 'design', label: 'Design' },
  ]

  const [searchValue, setSearchValue] = useState('')
  const [language, setLanguage] = useState('ES')

  const isItemActive = (item) => {
    const targetPage = item.page || item.id
    return activePage === targetPage && (item.section ? activeSection === item.section : !activeSection)
  }

  const handleSearch = () => {
    const term = searchValue.trim()
    onNavigate('catalogo', term, 'productos')
    setSearchValue('')
  }

  const handleLogout = () => {
    onLogout()
    onNavigate('home')
  }

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
  }

  // Se renderiza dos veces para controlar responsive:
  // desktop dentro del collapse y movil/tablet pequena entre logo y hamburguesa.
  const renderSearchForm = (className = '') => (
    <form className={`navbar-search-form ${className}`} role="search" onSubmit={(e) => { e.preventDefault(); handleSearch() }}>
      {/* Bootstrap input-group + form-control + btn. Los tamanos se ajustan en navbar.css. */}
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
                {/* Dropdown de Bootstrap. El contenido cambia segun haya sesion o no. */}
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  {!user && (
                    <li><button className="dropdown-item" onClick={() => onNavigate('login')}>Iniciar sesion</button></li>
                  )}
                  {user && (
                    <>
                      <li><button className="dropdown-item" onClick={() => onNavigate('perfil')}>Mi perfil</button></li>
                      <li><button className="dropdown-item" onClick={() => onNavigate('pedidos')}>Mis pedidos</button></li>
                      <li><button className="dropdown-item" onClick={() => onNavigate('presupuestos')}>Mis presupuestos</button></li>
                      <li><button className="dropdown-item" onClick={() => onNavigate('configuracion')}>Configuracion</button></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item text-danger" onClick={handleLogout}>Cerrar sesion</button></li>
                    </>
                  )}
                </ul>
              </li>

              <li className="nav-item">
                <button
                  className={`btn navbar-action-btn${activePage === 'carrito' ? ' active' : ''}`}
                  type="button"
                  aria-label="Carrito"
                  title="Carrito"
                  onClick={() => onNavigate('carrito')}
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
