function Galeria({ onNavigate }) {
  const items = [1, 2, 3, 4]

  return (
    <section className="page-shell">
      <div className="bg-dark text-white p-5 mb-4 rounded text-center">
        <div>
          <h1>Galería</h1>
          <p>
            Una vista simple para explorar ideas, sin detalle todavía. Todo queda conectado con
            Home y Catálogo desde arriba.
          </p>
        </div>
      </div>

      <div className="page-grid">
        {items.map((item) => (
          <article className="page-card" key={item}>
            <div className="page-card-media">Imagen {item}</div>
            <div className="page-card-body">
              <h3>Referencia {item}</h3>
              <p>Boceto visual para mostrar una imagen o concepto.</p>
            </div>
          </article>
        ))}
      </div>

      <div className="page-actions">
        <button type="button" className="page-link-button" onClick={() => onNavigate('home')}>
          Home
        </button>
        <button type="button" className="page-link-button" onClick={() => onNavigate('catalogo')}>
          Catálogo
        </button>
      </div>

            {/* PUBLICIDAD */}
      <div className="bg-success text-white text-center p-3 mt-4">
        OFERTA PUBLICITARIA
      </div>
    </section>
  )
}

export default Galeria