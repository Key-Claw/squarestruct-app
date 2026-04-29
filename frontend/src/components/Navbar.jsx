
import logo from '../assets/LogoSquareStruct.png'

function Navbar({ activePage, onNavigate }) {
  const items = [
    { id: 'home', label: 'Home' },
    { id: 'galeria', label: 'Galería' },
    { id: 'catalogo', label: 'Catálogo' },
  ]

  const authItems = [
    { id: 'login', label: '👤' },
  ]

  const mobileItems = [
    ...items,
    { id: 'login', label: 'Login' },
  ]

  return (
    <nav className="navbar navbar-dark bg-dark px-2 px-lg-3 app-navbar">
      <div className="d-none d-lg-flex align-items-center w-100 navbar-desktop">
        <button
          className="brand-mark"
          type="button"
          onClick={() => onNavigate('aboutus')}
          aria-label="Ir al inicio"
        >
          <img src={logo} alt="SquareStruct" className="navbar-logo navbar-logo-desktop" />
        </button>

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

        <div className="desktop-search mx-auto">
          <div className="input-group search-group">
            <input
              type="text"
              className="form-control search-bar"
              placeholder="Buscar productos..."
              aria-label="Buscar productos"
            />
            <button className="btn btn-outline-light search-submit" type="button">
            ➜]
            </button>
          </div>
        </div>

        {authItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="btn btn-outline-light"
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </button>
            ))}

        <button className="btn btn-outline-light cart-button ms-2" type="button" aria-label="Carrito">
          🛒
        </button>
      </div>

      <div className="d-flex d-lg-none align-items-center w-100 navbar-mobile">
        <button
          className="brand-mark brand-mark-mobile"
          type="button"
          onClick={() => onNavigate('aboutus')}
          aria-label="Ir al inicio"
        >
          <img src={logo} alt="SquareStruct" className="navbar-logo navbar-logo-mobile" />
        </button>

        <div className="flex-grow-1 px-2 mobile-search-wrap">
          <div className="input-group search-group search-group-mobile">
            <input
              type="text"
              className="form-control search-bar search-bar-mobile"
              placeholder="Buscar"
              aria-label="Buscar productos"
            />
            <button className="btn btn-outline-light search-submit search-submit-mobile" type="button">
            ➜]
            </button>
          </div>
        </div>

        <button className="btn btn-outline-light cart-button cart-button-mobile" type="button" aria-label="Carrito">
          🛒
        </button>

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

      <div className="collapse navbar-collapse d-lg-none" id="navbarMenu">
        <div className="navbar-nav mobile-menu-row">
          {mobileItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-link nav-button ${activePage === item.id ? 'is-active' : ''}`}
              data-auth={item.id === 'signin' || item.id === 'logout' ? 'true' : 'false'}
              onClick={() => onNavigate(item.id === 'signin' || item.id === 'logout' ? 'aboutus' : item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
