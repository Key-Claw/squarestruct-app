
import { useState } from 'react'
import logo from '../assets/LogoSquareStruct.png'

function Navbar({ activePage, onNavigate }) {
  // Menú principal visible en desktop y mobile.
  const items = [
    { id: 'home', label: 'Home' },
    { id: 'galeria', label: 'Galería' },
    { id: 'catalogo', label: 'Catálogo' },
  ]

  // Texto escrito en el buscador.
  const [searchValue, setSearchValue] = useState('')

  /**
   * Envía la búsqueda al catálogo y limpia el input.
   * Si el campo está vacío, igualmente abre catálogo para mostrar todo.
   */
  const handleSearch = () => {
    const term = searchValue.trim()

    // La navegación lleva el término al catálogo para aplicar el filtrado allí.
    onNavigate('catalogo', term)
    setSearchValue('')
  }

  return (
    <nav className="navbar navbar-dark bg-dark px-2 px-lg-3 app-navbar">
      <div className="d-none d-lg-flex align-items-center w-100 navbar-desktop">
        {/* Logo principal: actúa como acceso directo a About Us. */}
        <button
          className="brand-mark"
          type="button"
          onClick={() => onNavigate('aboutus')}
          aria-label="Ir al inicio"
        >
          <img src={logo} alt="SquareStruct" className="navbar-logo navbar-logo-desktop" />
        </button>

        {/* Navegación principal de escritorio. */}
        <div className="navbar-nav nav-strip nav-strip-desktop">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-link nav-button ${activePage === item.id ? 'is-active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Buscador de escritorio, pensado para lanzar el filtrado con Enter o botón. */}
        <div className="desktop-search mx-auto">
          <div className="input-group search-group">
            <input
              type="text"
              className="form-control search-bar"
              placeholder="Buscar productos..."
              aria-label="Buscar productos"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
            />
            <button className="btn btn-outline-light search-submit" type="button" onClick={handleSearch}>
              ➜
            </button>
          </div>
        </div>

        {/* Botón de acceso rápido a la pantalla de login. */}
        <button
          type="button"
          className="btn btn-outline-light ms-2"
          onClick={() => onNavigate('login')}
        >
          👤
        </button>

        <button className="btn btn-outline-light cart-button ms-2" type="button" aria-label="Carrito">
          🛒
        </button>
      </div>

      {/* Layout móvil: logo, buscador y botón de menú en una sola fila. */}
      <div className="d-flex d-lg-none align-items-center w-100 navbar-mobile">
        {/* El logo mantiene el mismo comportamiento que en escritorio. */}
        <button
          className="brand-mark brand-mark-mobile"
          type="button"
          onClick={() => onNavigate('aboutus')}
          aria-label="Ir al inicio"
        >
          <img src={logo} alt="SquareStruct" className="navbar-logo navbar-logo-mobile" />
        </button>

        {/* Campo compacto de búsqueda para pantallas pequeñas. */}
        <div className="flex-grow-1 px-2 mobile-search-wrap">
          <div className="input-group search-group search-group-mobile">
            <input
              type="text"
              className="form-control search-bar search-bar-mobile"
              placeholder="Buscar"
              aria-label="Buscar productos"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
            />
            <button className="btn btn-outline-light search-submit search-submit-mobile" type="button" onClick={handleSearch}>
              ➜
            </button>
          </div>
        </div>

        {/* Carrito visual en mobile. */}
        <button className="btn btn-outline-light cart-button cart-button-mobile" type="button" aria-label="Carrito">
          🛒
        </button>

        {/* Botón colapsable para mostrar el menú principal en pantallas pequeñas. */}
        <button
          className="navbar-toggler ms-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
          aria-controls="navbarMenu"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>

      {/* Menú colapsado exclusivo de mobile con navegación y acceso a login. */}
      <div className="collapse navbar-collapse d-lg-none" id="navbarMenu">
        <div className="navbar-nav mobile-menu-row">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-link nav-button ${activePage === item.id ? 'is-active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}

          <button type="button" className="nav-link nav-button" onClick={() => onNavigate('login')}>
            Login
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
