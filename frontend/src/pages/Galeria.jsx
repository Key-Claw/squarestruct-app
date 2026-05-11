import heroGalleryImage from '../assets/galeria/hero-galeria-casa-modular.jpeg'
import compactHouseImage from '../assets/galeria/galeria-casa-compacta.jpeg'
import minimalHouseImage from '../assets/galeria/galeria-casa-minimalista.jpeg'
import forestHouseImage from '../assets/galeria/galeria-casa-moderna-bosque.jpeg'
import featuredHouseImage from '../assets/galeria/galeria-casa-moderna-desierto-destacada.jpeg'
import beachHouseImage from '../assets/galeria/galeria-casa-playa.jpeg'
import desertRusticHouseImage from '../assets/galeria/galeria-casa-rustica-desierto.jpeg'
import sustainableHouseImage from '../assets/galeria/galeria-casa-sostenible-desierto.jpeg'

const filters = ['Todas', 'Casas modernas', 'Casas pequenas', 'Industria', 'Minimalistas', 'Publicos']

const topProjects = [
  {
    title: 'Casa Bruma',
    area: '118 m2',
    description: 'Vivienda modular abierta al paisaje, pensada para combinar madera, cristal y zonas de descanso.',
    image: forestHouseImage,
  },
  {
    title: 'Modulo Nido',
    area: '64 m2',
    description: 'Casa compacta de una planta, ideal para parcelas pequenas y distribuciones muy eficientes.',
    image: compactHouseImage,
  },
  {
    title: 'Casa Cala',
    area: '132 m2',
    description: 'Proyecto luminoso cerca del mar, con terrazas amplias y espacios interiores conectados.',
    image: beachHouseImage,
  },
]

const featuredProject = {
  title: 'Casa Horizonte',
  architect: 'Obra conceptual del arquitecto Adrian Valcazar',
  area: '156 m2',
  description:
    'Una vivienda modular de lineas limpias que aprovecha la luz del desierto y abre la zona social hacia una gran terraza protegida.',
  image: featuredHouseImage,
}

const bottomProjects = [
  {
    title: 'Casa Lineal',
    area: '96 m2',
    description: 'Diseno minimalista con volumen alargado, pensado para separar descanso, trabajo y vida diaria.',
    image: minimalHouseImage,
  },
  {
    title: 'Refugio Arena',
    area: '104 m2',
    description: 'Casa rustica adaptada a clima seco, con acabados calidos y una distribucion muy sencilla.',
    image: desertRusticHouseImage,
  },
  {
    title: 'Casa Solar',
    area: '122 m2',
    description: 'Vivienda sostenible con cubierta ligera, grandes sombras y consumo optimizado para uso familiar.',
    image: sustainableHouseImage,
  },
]

function Galeria({ onNavigate }) {
  return (
    <section className="page-shell gallery-page container-fluid">
      <section className="card gallery-intro-card">
        <div className="row g-0 align-items-center">
          <div className="col-12 col-lg-5">
            <div className="card-body gallery-intro-copy">
              <h1>Galeria de inspiracion</h1>
              <p>
                Explora proyectos reales y descubre como un producto comercial modular
                puede convertirse en una vivienda clara, flexible y preparada para vivir.
              </p>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <div className="gallery-intro-media">
              <img
                src={heroGalleryImage}
                className="gallery-cover-image"
                alt="Casa modular en entorno natural"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="row g-3 align-items-center gallery-toolbar">
        <div className="col-12 col-xl-8">
          <div className="d-flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button type="button" className="btn gallery-filter-btn" key={filter}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="col-12 col-xl-4 d-flex justify-content-xl-end">
          <select className="form-select gallery-sort-select" aria-label="Ordenar galeria">
            <option>Mas recientes</option>
            <option>Mas grandes</option>
            <option>Mas pequenos</option>
          </select>
        </div>
      </div>

      <div className="row g-4 gallery-grid">
        {topProjects.map((project) => (
          <div className="col-12 col-md-4" key={project.title}>
            <article className="card h-100 gallery-project-card">
              <div className="gallery-project-media">
                <img src={project.image} className="gallery-cover-image" alt={project.title} />
                <button type="button" className="btn gallery-favorite-btn" aria-label={`Guardar ${project.title}`}>
                  +
                </button>
                <div className="card-body gallery-card-overlay">
                  <h2>{project.title}</h2>
                  <p className="gallery-project-description">{project.description}</p>
                  <p className="gallery-area">{project.area}</p>
                </div>
                <button type="button" className="btn gallery-card-action" aria-label={`Ver ${project.title}`}>
                  &gt;
                </button>
              </div>
            </article>
          </div>
        ))}
      </div>

      <section className="card gallery-feature-card">
        <img
          src={featuredProject.image}
          className="gallery-cover-image gallery-feature-image"
          alt={featuredProject.title}
        />
        <button
          type="button"
          className="btn gallery-favorite-btn gallery-feature-favorite"
          aria-label={`Guardar ${featuredProject.title}`}
        >
          +
        </button>
        <div className="card-body gallery-feature-copy">
          <button type="button" className="btn gallery-badge">
            Destacado
          </button>
          <h2>{featuredProject.title}</h2>
          <p className="gallery-feature-architect">{featuredProject.architect}</p>
          <p>{featuredProject.description}</p>
          <p className="gallery-area">{featuredProject.area}</p>
          <div className="d-flex flex-wrap gap-3 gallery-feature-actions">
            <button type="button" className="btn gallery-outline-btn gallery-feature-action-btn">
              Ver proyecto
            </button>
            <button
              type="button"
              className="btn gallery-outline-btn gallery-feature-action-btn"
              onClick={() => onNavigate('design')}
            >
              Disenar esta idea
            </button>
          </div>
        </div>
      </section>

      <div className="row g-4 gallery-grid">
        {bottomProjects.map((project) => (
          <div className="col-12 col-md-4" key={project.title}>
            <article className="card h-100 gallery-project-card">
              <div className="gallery-project-media">
                <img src={project.image} className="gallery-cover-image" alt={project.title} />
                <button type="button" className="btn gallery-favorite-btn" aria-label={`Guardar ${project.title}`}>
                  +
                </button>
                <div className="card-body gallery-card-overlay">
                  <h2>{project.title}</h2>
                  <p className="gallery-project-description">{project.description}</p>
                  <p className="gallery-area">{project.area}</p>
                </div>
                <button type="button" className="btn gallery-card-action" aria-label={`Ver ${project.title}`}>
                  &gt;
                </button>
              </div>
            </article>
          </div>
        ))}
      </div>

      <nav className="gallery-pagination" aria-label="Paginacion galeria">
        <ul className="pagination pagination-sm justify-content-center">
          <li className="page-item active"><button className="page-link" type="button">1</button></li>
          <li className="page-item"><button className="page-link" type="button">2</button></li>
          <li className="page-item"><button className="page-link" type="button">3</button></li>
        </ul>
      </nav>

      <section className="card gallery-cta-card">
        <div className="row g-4 align-items-center">
          <div className="col-12 col-lg-7">
            <div className="card-body">
              <h2>Quieres una idea en mente?</h2>
              <p>Disena tu propia estructura modular en 3D y calcula los materiales.</p>
            </div>
          </div>
          <div className="col-12 col-lg-5 d-flex justify-content-lg-center">
            <button type="button" className="btn gallery-cta-btn" onClick={() => onNavigate('design')}>
              Ir a Design
            </button>
          </div>
        </div>
      </section>
    </section>
  )
}

export default Galeria
