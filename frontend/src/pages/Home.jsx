const highlights = [
  {
    title: 'Bloques modulares',
    text: 'Piezas inspiradas en sistemas tipo ByBlock para levantar muros por modulos.',
    target: 'productos',
  },
  {
    title: 'Catalogo tecnico',
    text: 'Consulta precio, stock, tipo y dimensiones desde la base de datos.',
    target: 'catalogo',
  },
  {
    title: 'Diseno de planos',
    text: 'Una linea futura para montar estructuras y estimar presupuestos.',
    target: 'design',
  },
]

function Home({ onNavigate }) {
  const goToHighlight = (target) => {
    if (target === 'productos') {
      onNavigate('catalogo', '', 'productos')
      return
    }

    onNavigate(target)
  }

  return (
    /* Bootstrap container-fluid ocupa todo el ancho disponible:
       https://getbootstrap.com/docs/5.3/layout/containers/ */
    <section className="home-page container-fluid">
      <div className="mvp-hero home-hero">
        <p className="eyebrow">Construccion modular sostenible</p>
        <h1>Disena tu plano con bloques modulares</h1>
        <p>
          SquareStruct conecta productos tipo bloque y pilar con un futuro
          sistema de diseno de viviendas por piezas.
        </p>
        {/* Bootstrap buttons:
            https://getbootstrap.com/docs/5.3/components/buttons/ */}
        <div className="hero-actions">
          <button type="button" className="btn btn-light" onClick={() => onNavigate('catalogo', '', 'productos')}>
            Ver productos
          </button>
          <button type="button" className="btn btn-outline-light" onClick={() => onNavigate('design')}>
            Probar Design
          </button>
        </div>
      </div>

      <div className="page-grid">
        {highlights.map((item) => (
          <button
            type="button"
            className="page-card home-card-button"
            key={item.title}
            onClick={() => goToHighlight(item.target)}
          >
            <div className="page-card-body">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="promo-band">
        ByFusion como proveedor de referencia para el MVP
      </div>
    </section>
  )
}

export default Home
