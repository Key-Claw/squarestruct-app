const values = [
  {
    title: 'Construccion modular',
    text: 'SquareStruct organiza piezas, medidas y datos para explicar como montar estructuras por bloques.',
  },
  {
    title: 'Producto conectado',
    text: 'El catalogo toma la informacion de la base de datos para mantener precio, stock y dimensiones visibles.',
  },
  {
    title: 'Evolucion a Design',
    text: 'La siguiente fase prepara el diseno de planos y el calculo aproximado de presupuestos.',
  },
]

const carouselSlides = [
  {
    image: 'https://mdbcdn.b-cdn.net/img/new/slides/041.webp',
    title: 'SquareStruct',
    text: 'Presentacion visual del proyecto',
    alt: 'Paisaje de presentacion',
  },
  {
    image: 'https://mdbcdn.b-cdn.net/img/new/slides/042.webp',
    title: 'Construccion modular',
    text: 'Ideas para explicar el MVP',
    alt: 'Imagen de camara',
  },
  {
    image: 'https://mdbcdn.b-cdn.net/img/new/slides/043.webp',
    title: 'Futuro del proyecto',
    text: 'Catalogo, diseno y crecimiento',
    alt: 'Imagen de frutas',
  },
]

function AboutUs({ onNavigate }) {
  return (
    /* Bootstrap container-fluid ocupa todo el ancho disponible:
       https://getbootstrap.com/docs/5.3/layout/containers/ */
    <section className="page-shell about-page container-fluid">
      {/* Bootstrap carousel:
          https://getbootstrap.com/docs/5.3/components/carousel/
          Se conserva la esencia del carrusel creado por el companero al entrar desde el logo.
          Se corrigio de MDB/HTML a Bootstrap + React usando className y data-bs. */}
      <div id="aboutCarousel" className="carousel slide about-carousel" data-bs-ride="carousel">
        <div className="carousel-indicators">
          {carouselSlides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              data-bs-target="#aboutCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? 'active' : ''}
              aria-current={index === 0 ? 'true' : undefined}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>

        <div className="carousel-inner">
          {carouselSlides.map((slide, index) => (
            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={slide.title}>
              <img src={slide.image} className="d-block w-100 about-carousel-image" alt={slide.alt} />
              <div className="carousel-caption about-carousel-caption">
                <h1>{slide.title}</h1>
                <p>{slide.text}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#aboutCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#aboutCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>

      <div className="mvp-hero about-hero">
        <p className="eyebrow">Sobre SquareStruct</p>
        <h1>Un MVP para construir ideas por bloques</h1>
        <p>
          El proyecto une catalogo, usuarios y una base tecnica para explicar
          como podria crecer una herramienta de construccion modular.
        </p>
      </div>

      {/* Bootstrap grid:
          https://getbootstrap.com/docs/5.3/layout/grid/ */}
      <div className="row g-4 align-items-stretch">
        {values.map((item) => (
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
          <p className="eyebrow">Presentacion del proyecto</p>
          <h2>De catalogo MVP a disenador de planos</h2>
          <p>
            La web ya deja separadas las partes principales: inspiracion,
            productos, usuarios y una vista inicial para el futuro editor.
          </p>
        </div>
        {/* Bootstrap buttons:
            https://getbootstrap.com/docs/5.3/components/buttons/ */}
        <button type="button" className="btn btn-light" onClick={() => onNavigate('design')}>
          Ver Design
        </button>
      </section>
    </section>
  )
}

export default AboutUs
