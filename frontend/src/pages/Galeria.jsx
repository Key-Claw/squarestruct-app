const galleryItems = [
  {
    title: 'Muros modulares',
    text: 'Aplicaciones para cerramientos, perímetros y separaciones exteriores.',
  },
  {
    title: 'Vivienda por piezas',
    text: 'Inspiración para combinar bloques y pilares en estructuras habitables.',
  },
  {
    title: 'Zonas exteriores',
    text: 'Ideas para patios, jardines, muros bajos y espacios de servicio.',
  },
  {
    title: 'Montaje limpio',
    text: 'Una propuesta enfocada en ensamblaje rápido y menor desperdicio.',
  },
]

function Galeria({ onNavigate }) {
  return (
    /* Bootstrap container-fluid ocupa todo el ancho disponible:
       https://getbootstrap.com/docs/5.3/layout/containers/ */
    <section className="page-shell gallery-page container-fluid">
      <div className="mvp-hero gallery-hero">
        <p className="eyebrow">Galería de aplicaciones</p>
        <h1>Ideas para construir con bloques</h1>
        <p>
          Referencias visuales para explicar cómo los productos del catálogo
          pueden convertirse en muros, espacios y estructuras modulares.
        </p>
      </div>

      <div className="page-grid">
        {galleryItems.map((item, index) => (
          <article className="page-card gallery-card" key={item.title}>
            <div className="page-card-media modular-media">
              <span>{String(index + 1).padStart(2, '0')}</span>
            </div>
            <div className="page-card-body">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>

      <section className="page-block product-link-block">
        <div>
          <p className="eyebrow">Productos dentro del catálogo</p>
          <h2>Consulta los bloques y pilares disponibles</h2>
          <p>
            La galería muestra usos; el catálogo contiene los productos reales
            conectados con la base de datos.
          </p>
        </div>
        {/* Bootstrap button:
            https://getbootstrap.com/docs/5.3/components/buttons/ */}
        <button type="button" className="btn btn-light" onClick={() => onNavigate('catalogo', '', 'productos')}>
          Ir a productos
        </button>
      </section>

      <div className="promo-band">
        Espacio reservado para oferta publicitaria.
      </div>
    </section>
  )
}

export default Galeria
