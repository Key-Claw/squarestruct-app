function Home({ onNavigate }) {
  return (
    <div className="container mt-4">

      {/* HERO */}
      <div className="bg-dark text-white p-5 mb-4 rounded text-center">
        <h1>Diseña tu plano</h1>
        <p>Construye tu idea y calcula tu presupuesto</p>
      </div>

      {/* CARDS */}
      <div className="row">
        {[1, 2, 3].map((i) => (
          <div className="col-md-4 mb-3" key={i}>
            <button
              type="button"
              className="card bg-dark text-white w-100 border-0 text-start home-card-button"
              onClick={() => onNavigate('catalogo')}
            >
              <div className="card-body">
                <h5>Producto {i}</h5>
                <p>Descripción básica</p>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* PUBLICIDAD */}
      <div className="bg-success text-white text-center p-3 mt-4">
        OFERTA PUBLICITARIA
      </div>

    </div>
  )
}

export default Home