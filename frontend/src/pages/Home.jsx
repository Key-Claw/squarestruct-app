import heroGalleryImage from '../assets/galeria/hero-galeria-casa-modular.jpeg'
import featuredHouseImage from '../assets/galeria/galeria-casa-moderna-desierto-destacada.jpeg'
import compactHouseImage from '../assets/galeria/galeria-casa-compacta.jpeg'
import forestHouseImage from '../assets/galeria/galeria-casa-moderna-bosque.jpeg'

const homeHighlights = [
  {
    title: 'Modular',
    text: 'Piezas para muros, cerramientos y estructuras ordenadas por tipos.',
  },
  {
    title: 'Resistente',
    text: 'Materiales pensados para mantener solidez y confianza en obra.',
  },
  {
    title: 'Plano',
    text: 'Disena y ajusta la estructura antes de construir.',
  },
  {
    title: 'Sostenible',
    text: 'Construccion mas eficiente con un uso mejor de recursos.',
  },
]

const homeFeatureCards = [
  {
    title: 'Explorar catalogo',
    text: 'Encuentra bloques, pilares y accesorios con una vista clara y ordenada.',
    image: compactHouseImage,
    action: 'Ir al catalogo',
    handler: (onNavigate) => onNavigate('catalogo', '', 'productos'),
  },
  {
    title: 'Inspirarte',
    text: 'Descubre ideas de composicion y referencias visuales para tus proyectos.',
    image: heroGalleryImage,
    action: 'Ver galeria',
    handler: (onNavigate) => onNavigate('galeria'),
  },
  {
    title: 'Generar tu estructura',
    text: 'Crea tu propio diseno y calcula los materiales necesarios para hacerlo realidad.',
    image: forestHouseImage,
    action: 'Ir a Design',
    handler: (onNavigate) => onNavigate('design'),
  },
]

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
    image: heroGalleryImage,
    title: 'SquareStruct',
    text: 'Construccion modular organizada por piezas',
    alt: 'Presentacion visual de SquareStruct',
  },
  {
    image: featuredHouseImage,
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
      <div className="home-hero card">
        <div className="row g-0 align-items-stretch home-hero-grid">
          <div className="col-12 col-lg-4 home-hero-copy-wrap">
            <div className="home-hero-copy">
              <p className="eyebrow">Construccion modular sostenible</p>
              <h1>Construye sin limites.</h1>
              <h2>Modular, facil, real.</h2>
              <p>
                SquareStruct es la plataforma que te permite descubrir, comparar y
                planificar tu construccion modular con total claridad y confianza.
              </p>
              <div className="hero-actions home-hero-actions">
                <button type="button" className="btn btn-light" onClick={() => onNavigate('catalogo', '', 'productos')}>
                  Ver catalogo
                </button>
                <button type="button" className="btn btn-outline-light home-design-btn" onClick={() => onNavigate('design')}>
                  Diseñar tu estructura
                </button>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-8 home-carousel-wrap">
            <div id="homeCarousel" className="carousel slide home-carousel" data-bs-ride="carousel">
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
                    <img src={slide.image} className="d-block w-100 home-carousel-image" alt={slide.alt} />
                    <div className="carousel-caption home-carousel-caption">
                      <p>{slide.title}</p>
                      <h2>{slide.text}</h2>
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
          </div>
        </div>
      </div>

      <section className="home-about card">
        <div className="row g-0 align-items-stretch home-about-grid">
          <div className="col-12 col-lg-5 home-about-media-wrap">
            <img src={featuredHouseImage} className="home-about-image" alt="Casa modular de SquareStruct" />
          </div>

          <div className="col-12 col-lg-7 home-about-copy-wrap">
            <div className="home-about-copy">
              <p className="eyebrow">SquareStruct</p>
              <h2>¿Qué es SquareStruct?</h2>
              <p>
                Somos una tienda online especializada en soluciones modulares y
                pilares para la construccion.
              </p>
              <p>
                Nuestro objetivo es acercar este tipo de soluciones al usuario,
                facilitando la eleccion de materiales y la planificacion de
                estructuras mediante piezas ensamblables.
              </p>

              <div className="home-highlight-grid">
                {homeHighlights.map((item, index) => (
                  <article className="home-highlight" key={item.title}>
                    <span className="home-highlight-icon">{index + 1}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section-heading">
        <h2>Todo lo que puedes hacer en SquareStruct</h2>
      </section>

      <div className="row g-4 home-feature-grid">
        {homeFeatureCards.map((item) => (
          <div className="col-12 col-lg-4" key={item.title}>
            <article className="page-card home-feature-card h-100">
              <img src={item.image} className="home-feature-image" alt={item.title} />
              <div className="page-card-body home-feature-body">
                <span className="home-feature-badge">0{homeFeatureCards.indexOf(item) + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <button type="button" className="home-feature-link" onClick={() => item.handler(onNavigate)}>
                  {item.action} →
                </button>
              </div>
            </article>
          </div>
        ))}
      </div>

      <section className="page-block home-cta-block">
        <div className="home-cta-copy">
          <p className="eyebrow home-cta-eyebrow">SquareStruct</p>
          <h2>Empieza a construir tu idea</h2>
          <p>
            Planifica, elige y consigue con la confianza de usar soluciones modulares de calidad.
          </p>
        </div>
        <button type="button" className="btn btn-light home-cta-button" onClick={() => onNavigate('design')}>
          Comienza ahora
        </button>
      </section>
    </section>
  )
}

export default Home
