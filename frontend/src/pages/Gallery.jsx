import { useMemo, useState } from 'react'

import heroGalleryImage from '../assets/gallery/gallery-hero.webp'
import compactHouseImage from '../assets/gallery/galeria-casa-compacta.webp'
import minimalHouseImage from '../assets/gallery/galeria-casa-minimalista.webp'
import forestHouseImage from '../assets/gallery/galeria-casa-moderna-bosque.webp'
import featuredHouseImage from '../assets/gallery/galeria-casa-moderna-desierto-destacada.webp'
import beachHouseImage from '../assets/gallery/galeria-casa-playa.webp'
import desertRusticHouseImage from '../assets/gallery/galeria-casa-rustica-desierto.webp'
import sustainableHouseImage from '../assets/gallery/galeria-casa-sostenible-desierto.webp'

const filters = ['Hormigón', 'ECO']

const topProjects = [
  {
    title: 'Casa Bruma',
    area: '118 m2',
    material: 'ECO',
    description: 'Vivienda modular con fachada ligera, zonas abiertas y distribución familiar.',
    image: forestHouseImage,
  },
  {
    title: 'Módulo Nido',
    area: '64 m2',
    material: 'Hormigón',
    description: 'Formato compacto para parcelas pequeñas, con espacios fáciles de adaptar.',
    image: compactHouseImage,
  },
  {
    title: 'Casa Cala',
    area: '132 m2',
    material: 'ECO',
    description: 'Proyecto luminoso con terraza amplia y conexión directa entre interior y exterior.',
    image: beachHouseImage,
  },
]

const featuredProject = {
  title: 'Casa Horizonte',
  architect: 'La joya de Van der Router',
  area: '156 m2',
  material: 'Hormigón',
  description: [
    'Diseño modular contemporáneo inspirado en la arquitectura de líneas limpias y estructuras funcionales, pensado para combinar resistencia, amplitud visual y eficiencia en el uso diario.',
    'La distribución abierta favorece la entrada de luz natural, la conexión entre interior y exterior y una circulación fluida entre espacios, creando una vivienda moderna, cómoda y preparada para futuras ampliaciones modulares.',
  ],
  image: featuredHouseImage,
}

const bottomProjects = [
  {
    title: 'Casa Lineal',
    area: '96 m2',
    material: 'Hormigón',
    description: 'Volumen alargado para separar descanso, trabajo y zona social.',
    image: minimalHouseImage,
  },
  {
    title: 'Refugio Arena',
    area: '104 m2',
    material: 'Hormigón',
    description: 'Solución resistente para clima seco, con acabados cálidos y planta sencilla.',
    image: desertRusticHouseImage,
  },
  {
    title: 'Casa Solar',
    area: '122 m2',
    material: 'ECO',
    description: 'Vivienda sostenible con grandes sombras y consumo optimizado.',
    image: sustainableHouseImage,
  },
]

function Gallery({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState('Hormigón')
  const [selectedIdea, setSelectedIdea] = useState(null)

  const allProjects = useMemo(() => [...topProjects, ...bottomProjects], [])

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => project.material === activeFilter)
  }, [activeFilter, allProjects])

  const firstRow = filteredProjects.slice(0, 3)
  const secondRow = filteredProjects.slice(3, 6)

  const renderProjectCard = (project) => (
    <div className="col-12 col-md-4" key={project.title}>
      <article className="card h-100 gallery-project-card">
        <div className="gallery-project-media">
          <img src={project.image} className="gallery-cover-image" alt={project.title} />
          <button
            type="button"
            className="btn gallery-favorite-btn"
            aria-label={`Ampliar ${project.title}`}
            onClick={() => setSelectedIdea(project)}
          >
            +
          </button>
          <div className="card-body gallery-card-overlay">
            <div className="gallery-card-title-grid">
              <h2>{project.title}</h2>
            </div>
            <div className="gallery-card-info-grid">
              <p className="gallery-project-description">{project.description}</p>
            <p className="gallery-area">{project.area} · {project.material}</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  )

  return (
    <section className="page-shell gallery-page container-fluid">
      <section className="card gallery-intro-card">
        <div className="gallery-intro-copy">
          <div className="gallery-intro-title">
            <p className="gallery-eyebrow">Inspiración modular</p>
              <h1>Galería de soluciones</h1>
          </div>
          <div className="gallery-intro-text">
              <p>
                Ideas visuales para descubrir estilos, materiales y distribuciones antes de pasar al diseñador.
              </p>
            </div>
          </div>

        <div className="gallery-intro-media" aria-hidden="true">
          <img
            src={heroGalleryImage}
            className="gallery-cover-image"
            alt=""
          />
        </div>
        <div className="gallery-intro-actions" aria-label="Filtrar galería por material">
          {filters.map((filter) => (
            <button
              type="button"
              className={`btn gallery-filter-btn${activeFilter === filter ? ' active' : ''}`}
              key={filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {filteredProjects.length === 0 ? (
        <div className="gallery-empty-state">
          No hay ideas que coincidan con la búsqueda actual.
        </div>
      ) : (
        <>
          <div className="row g-4 gallery-grid">
            {firstRow.map(renderProjectCard)}
          </div>

          <section className="card gallery-feature-card">
            <img
              src={featuredProject.image}
              className="gallery-cover-image gallery-feature-image"
              alt={featuredProject.title}
            />
            <span className="gallery-feature-star" role="img" aria-label="Destacada">
              ★
            </span>
            <div className="card-body gallery-feature-copy">
              <div className="gallery-feature-title-grid">
                <h2>{featuredProject.title}</h2>
                <h3 className="gallery-badge">
                  Destacada
                </h3>
              </div>
              <div className="gallery-feature-info-grid">
                <p className="gallery-feature-architect">{featuredProject.architect}</p>
                {featuredProject.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <p className="gallery-area">{featuredProject.area} · {featuredProject.material}</p>
              </div>
              <div className="gallery-feature-actions">
                <button
                  type="button"
                  className="btn gallery-outline-btn gallery-feature-action-btn"
                  onClick={() => onNavigate('design')}
                >
                  Diseñar esta idea
                </button>
              </div>
            </div>
          </section>

          {secondRow.length > 0 && (
            <div className="row g-4 gallery-grid">
              {secondRow.map(renderProjectCard)}
            </div>
          )}
        </>
      )}

      {selectedIdea && (
        <div className="gallery-idea-backdrop" role="presentation" onClick={() => setSelectedIdea(null)}>
          <article className="gallery-idea-modal" role="dialog" aria-modal="true" aria-label={selectedIdea.title} onClick={(event) => event.stopPropagation()}>
            <button type="button" className="btn gallery-idea-close" aria-label="Cerrar" onClick={() => setSelectedIdea(null)}>
              ×
            </button>
            <img src={selectedIdea.image} alt={selectedIdea.title} />
            <div className="gallery-idea-content">
              <span>{selectedIdea.material}</span>
              <h2>{selectedIdea.title}</h2>
              <p>{selectedIdea.description}</p>
              <strong>{selectedIdea.area}</strong>
              <button type="button" className="btn gallery-cta-btn" onClick={() => onNavigate('design')}>
                Diseñar esta idea
              </button>
            </div>
          </article>
        </div>
      )}
    </section>
  )
}

export default Gallery




