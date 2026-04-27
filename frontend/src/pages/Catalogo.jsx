function Catalogo({ onNavigate }) {
  const products = [1, 2, 3, 4, 5, 6]

  return (
    <section className="page-shell">
      <div className="bg-dark text-white p-5 mb-4 rounded text-center">
        <div>
          <h1>Catálogo</h1>
          <p>
            Un catálogo esquemático, con el mismo lenguaje visual que Home, pero reducido al
            mínimo para navegar rápido.
          </p>
        </div>
      </div>

      <div className="page-grid">
        {products.map((product) => (
          <article className="page-card" key={product}>
            <div className="page-card-media">Producto {product}</div>
            <div className="page-card-body">
              <h3>Producto {product}</h3>
              <p>Descripción básica y placeholder de información.</p>
            </div>
          </article>
        ))}
      </div>

      <div className="page-actions">
        <button type="button" className="page-link-button" onClick={() => onNavigate('home')}>
          Home
        </button>
        <button type="button" className="page-link-button" onClick={() => onNavigate('galeria')}>
          Galería
        </button>
      </div>
          {/* PUBLICIDAD */}
      <div className="bg-success text-white text-center p-3 mt-4">
        OFERTA PUBLICITARIA
      </div>
    </section>
  )
}

export default Catalogo