import logo from '../assets/LogoSquareStruct.png'

function Navbar({ activePage, onNavigate }) {
  const items = [
    { id: 'home', label: 'Home' },
    { id: 'galeria', label: 'Galería' },
    { id: 'catalogo', label: 'Catálogo' },
  ]

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 app-navbar">

 {/* Logo arriba en móvil */}
<div className="d-flex flex-column d-lg-none w-100 text-center mobile-wrapper">
  <div className="mobile-logo-container">
    <img
      src={logo}
      alt="SquareStruct Logo"
      className="navbar-logo mx-auto"
    />
    <span className="mobile-overlay-text">SquareStruct</span>
  </div>
</div>


      {/* Logo + título en desktop */}
      <div className="d-none d-lg-flex align-items-center">
        <img
          src={logo}
          alt="SquareStruct Logo"
          className="navbar-logo"
          style={{ width: '200px', height: 'auto' }}
        />
        <button
          className="navbar-brand brand-button ms-3"
          type="button"
          onClick={() => onNavigate('home')}
        >
          SquareStruct
        </button>
      </div>

      {/* Botón hamburguesa */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarMenu"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

{/* Menú colapsable */}
<div className="collapse navbar-collapse" id="navbarMenu">

  {/* Menú izquierda */}
  <div className="navbar-nav me-auto nav-strip text-center text-lg-start">
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

  {/* Buscador + carrito en desktop */}
  <div className="d-none d-lg-flex align-items-center mx-auto gap-3">

    <input
      type="text"
      className="form-control search-bar"
      placeholder="Buscar productos..."
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onNavigate('catalogo', e.target.value)
        }
      }}
    />

    <button className="btn btn-outline-light cart-button" type="button">
      🛒
    </button>

  </div>

  {/* Botón User */}
  <button className="btn btn-outline-light user-button mt-3 mt-lg-0" type="button">
    User
  </button>
</div>

    </nav>
  )
}

export default Navbar
