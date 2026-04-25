function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <a className="navbar-brand" href="#">
        SquareStruct
      </a>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item"><a className="nav-link">Home</a></li>
          <li className="nav-item"><a className="nav-link">Galería</a></li>
          <li className="nav-item"><a className="nav-link">Catálogo</a></li>
                {/*  Producto va dentro de catalogo <li className="nav-item"><a className="nav-link">Producto</a></li> */}
          <li className="nav-item"><a className="nav-link">Design</a></li>
        </ul>

        <button className="btn btn-outline-light">User</button>
      </div>
    </nav>
  )
}

export default Navbar