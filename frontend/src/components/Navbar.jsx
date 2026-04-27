function Navbar({ activePage, onNavigate }) {
  const items = [
    { id: 'home', label: 'Home' },
    { id: 'galeria', label: 'Galería' },
    { id: 'catalogo', label: 'Catálogo' },
  ]

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 app-navbar">
      <button className="navbar-brand brand-button" type="button" onClick={() => onNavigate('home')}>
        SquareStruct
      </button>

      <div className="navbar-nav me-auto nav-strip">
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

      <button className="btn btn-outline-light user-button" type="button">
        User
      </button>
    </nav>
  )
}

export default Navbar