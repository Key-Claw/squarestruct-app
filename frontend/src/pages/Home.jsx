const homeValues = [
  {
    title: 'Bloques modulares',
    text: 'Piezas pensadas para levantar muros, cerramientos y estructuras por modulos.',
  },
  {
    title: 'Catalogo tecnico',
    text: 'Consulta precio, stock, tipo y dimensiones desde la base de datos del proyecto.',
  },
  {
    title: 'Diseno de planos',
    text: 'Una linea futura para montar estructuras y estimar presupuestos de forma visual.',
  },
]

const homeSlides = [
  {
    image: 'https://mdbcdn.b-cdn.net/img/new/slides/041.webp',
    title: 'SquareStruct',
    text: 'Construccion modular organizada por piezas',
    alt: 'Presentacion visual de SquareStruct',
  },
  {
    image: 'https://mdbcdn.b-cdn.net/img/new/slides/042.webp',
    title: 'Catalogo conectado',
    text: 'Productos, medidas, stock y precios en una misma interfaz',
    alt: 'Imagen de apoyo para catalogo modular',
  },
  {
    image: 'https://mdbcdn.b-cdn.net/img/new/slides/043.webp',
    title: 'Disena tu estructura',
    text: 'Base inicial para evolucionar hacia planos y presupuestos',
    alt: 'Imagen de apoyo para diseno de estructuras',
  },
]

function Home({ onNavigate }) {
  return (
    <section className="page-shell home-page container-fluid">
      {/* Carrusel de Bootstrap reutilizado como portada principal.
          https://getbootstrap.com/docs/5.3/components/carousel/ */}
      <div id="homeCarousel" className="carousel slide about-carousel" data-bs-ride="carousel">
        <div className="carousel-indicators">
          {homeSlides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              data-bs-target="#homeCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? 'active' : ''}
              aria-current={index === 0 ? 'true' : undefined}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>

        <div className="carousel-inner">
          {homeSlides.map((slide, index) => (
            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={slide.title}>
              <img src={slide.image} className="d-block w-100 about-carousel-image" alt={slide.alt} />
              <div className="carousel-caption about-carousel-caption">
                <h1>{slide.title}</h1>
                <p>{slide.text}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>

      <div className="mvp-hero home-hero">
        <p className="eyebrow">Construccion modular sostenible</p>
        <h1>Disena tu plano con bloques modulares</h1>
        <p>
          SquareStruct conecta productos tipo bloque y pilar con un futuro
          sistema de diseno de viviendas por piezas.
        </p>
        <div className="hero-actions">
          <button type="button" className="btn btn-light" onClick={() => onNavigate('catalogo', '', 'productos')}>
            Ver productos
          </button>
          <button type="button" className="btn btn-outline-light" onClick={() => onNavigate('design')}>
            Explorar Design
          </button>
        </div>
      </div>

      <div className="row g-4 align-items-stretch">
        {homeValues.map((item) => (
          <div className="col-12 col-md-4" key={item.title}>
            <article className="page-card compact-card h-100">
              <div className="page-card-body">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          </div>
        ))}
      </div>

      <section className="page-block product-link-block">
        <div>
          <p className="eyebrow">MVP SquareStruct</p>
          <h2>Del catalogo al diseno de estructuras</h2>
          <p>
            La portada queda alineada con About Us: una presentacion visual,
            acceso al catalogo y una entrada directa al futuro editor.
          </p>
        </div>
        <button type="button" className="btn btn-light" onClick={() => onNavigate('catalogo', '', 'productos')}>
          Ir al catalogo
        </button>
      </section>
    </section>
  )
}

export default Home
