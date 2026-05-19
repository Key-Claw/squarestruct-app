import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import Icon from './ui/Icon'
import logo from '../assets/logo/squarestruct-icon.png'
import logoText from '../assets/logo/squarestruct-texto.png'
import { MAIN_ROUTES, NAV_LINKS } from '../routes'
import '../styles/layout/navbar.css'

const SEARCHABLE_PAGES = [
  {
    page: 'home',
    words: ['home', 'inicio', 'principal', 'squarestruct', 'modular', 'construccion', 'sostenible'],
  },
  {
    page: 'gallery',
    words: ['galeria', 'gallery', 'galery', 'galeery', 'inspiracion', 'inspirarte', 'proyecto', 'casa', 'eco', 'hormigon'],
  },
  {
    page: 'catalog',
    words: ['catalogo', 'catalog', 'producto', 'productos', 'bloque', 'pilar', 'material', 'precio', 'comprar'],
  },
  {
    page: 'design',
    words: ['diseno', 'design', 'disenador', 'designer', 'plano', 'estructura', 'presupuesto'],
  },
]

const normalizeSearchTerm = (value) => (
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
)

function Navbar({
  activePage,
  activeSection,
  onNavigate,
  user,
  onLogout,
  onOpenAuthModal,
  onOpenCartPanel,
}) {
  const [searchValue, setSearchValue] = useState('')
  const [language, setLanguage] = useState('ES')
  const accountName = user?.nombre?.trim().split(/\s+/)[0] || 'Cuenta'

  const handleSearch = () => {
    const term = normalizeSearchTerm(searchValue)

    if (!term) return

    const result = SEARCHABLE_PAGES.find((item) => (
      item.words.some((word) => term.includes(normalizeSearchTerm(word)))
    ))

    onNavigate(result?.page || 'home')
    setSearchValue('')
  }

  const handleLogout = () => {
    onLogout()
    onNavigate('home')
  }

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
  }

  const renderSearchForm = (className = '') => (
    <form
      className={`navbar-search-form ${className}`}
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        handleSearch()
      }}
    >
      <div className="input-group navbar-search-group">
        <span className="navbar-search-icon" aria-hidden="true">
          <Icon name="search" size={22} />
        </span>
        <input
          type="text"
          className="form-control navbar-search-input"
          placeholder="Buscar en la web..."
          aria-label="Buscar"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
        <button className="btn navbar-search-btn" type="button" onClick={handleSearch}>
          <Icon name="search" className="navbar-search-button-icon" size={20} />
          <span>Buscar</span>
        </button>
      </div>
    </form>
  )

  const renderAccountMenu = (dropdownId) => (
    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={dropdownId}>
      {!user && (
        <>
          <li>
            <button className="dropdown-item" onClick={() => onOpenAuthModal(true)}>
              Iniciar sesión
            </button>
          </li>
          <li>
            <button className="dropdown-item" onClick={() => onOpenAuthModal(false)}>
              Crear cuenta
            </button>
          </li>
        </>
      )}
      {user && (
        <>
          <li>
            <button className="dropdown-item" onClick={() => onNavigate('settings')}>
              Mi cuenta
            </button>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <button className="dropdown-item text-danger" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </li>
        </>
      )}
    </ul>
  )

  return (
    <div className="square-navbar-stage">
      <nav className="navbar navbar-expand-md navbar-light app-navbar square-navbar">
        <div className="container-fluid square-navbar-inner">
          <div className="navbar-brand-group">
            <Link
              className="navbar-brand square-navbar-brand d-flex align-items-center"
              to={MAIN_ROUTES.aboutus}
              aria-label="Sobre nosotros"
              onClick={() => onNavigate('aboutus')}
            >
              <img src={logo} alt="SquareStruct" className="navbar-logo" />
            </Link>

            <Link
              className={`navbar-wordmark-btn${activePage === 'home' ? ' active' : ''}`}
              to={MAIN_ROUTES.home}
              aria-label="Inicio"
              onClick={() => onNavigate('home')}
            >
              <img src={logoText} alt="SquareStruct" className="navbar-wordmark" />
            </Link>
          </div>

          {renderSearchForm('navbar-search-mobile')}

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="navbar-mobile-actions" aria-label="Acciones rápidas">
            <button
              className="btn navbar-action-btn"
              type="button"
              aria-label="Carrito"
              title="Carrito"
              onClick={() => onOpenCartPanel()}
            >
              <Icon name="cart" className="cart-icon" size={22} />
            </button>

            <button
              className="btn navbar-action-btn navbar-language-btn"
              type="button"
              onClick={() => handleLanguageChange(language === 'ES' ? 'EN' : 'ES')}
              aria-label={language === 'ES' ? 'Idioma actual: español' : 'Idioma actual: inglés'}
            >
              <Icon name="globe" size={20} />
              <span>{language}</span>
            </button>
          </div>

          <div className="collapse navbar-collapse square-navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav navbar-menu">
              {NAV_LINKS.map((item) => (
                <li className="nav-item" key={item.id}>
                  <NavLink
                    className={({ isActive }) => `navbar-menu-btn${isActive && !activeSection ? ' active' : ''}`}
                    to={item.path}
                    onClick={() => onNavigate(item.id)}
                  >
                    <Icon name={item.icon} size={25} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}

              <li className="nav-item dropdown navbar-menu-account">
                <button
                  className="btn dropdown-toggle navbar-user-btn navbar-menu-account-btn"
                  id="mobileUserDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  type="button"
                >
                  <Icon name="user" size={18} />
                  <span>{accountName}</span>
                </button>
                {renderAccountMenu('mobileUserDropdown')}
              </li>
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
                  <Icon name="user" size={22} />
                  <span>{accountName}</span>
                </button>
                {renderAccountMenu('userDropdown')}
              </li>

              <li className="nav-item">
                <button
                  className="btn navbar-action-btn"
                  type="button"
                  aria-label="Carrito"
                  title="Carrito"
                  onClick={() => onOpenCartPanel()}
                >
                  <Icon name="cart" className="cart-icon" size={22} />
                </button>
              </li>

              <li className="nav-item d-flex align-items-center">
                <button
                  className="btn navbar-action-btn navbar-language-btn"
                  type="button"
                  onClick={() => handleLanguageChange(language === 'ES' ? 'EN' : 'ES')}
                  aria-label={language === 'ES' ? 'Idioma actual: español' : 'Idioma actual: inglés'}
                >
                  <Icon name="globe" size={22} />
                  <span>{language}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar


