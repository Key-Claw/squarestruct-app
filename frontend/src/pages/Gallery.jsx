import { useMemo, useState } from 'react'

import heroGalleryImage from '../assets/galeria/hero-galeria-casa-modular.jpeg'
import compactHouseImage from '../assets/galeria/galeria-casa-compacta.jpeg'
import minimalHouseImage from '../assets/galeria/galeria-casa-minimalista.jpeg'
import forestHouseImage from '../assets/galeria/galeria-casa-moderna-bosque.jpeg'
import featuredHouseImage from '../assets/galeria/galeria-casa-moderna-desierto-destacada.jpeg'
import beachHouseImage from '../assets/galeria/galeria-casa-playa.jpeg'
import desertRusticHouseImage from '../assets/galeria/galeria-casa-rustica-desierto.jpeg'
import sustainableHouseImage from '../assets/galeria/galeria-casa-sostenible-desierto.jpeg'

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
  architect: 'Referencia conceptual de vivienda modular',
  area: '156 m2',
  material: 'Hormigón',
  description:
    'Vivienda de líneas limpias, pensada para combinar módulos resistentes, terraza protegida y espacios de uso diario.',
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
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIdea, setSelectedIdea] = useState(null)

  const allProjects = useMemo(() => [...topProjects, ...bottomProjects], [])

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return allProjects.filter((project) => {
      const matchesMaterial = project.material === activeFilter
      const matchesSearch = !normalizedSearch
        || project.title.toLowerCase().includes(normalizedSearch)
        || project.description.toLowerCase().includes(normalizedSearch)
        || project.material.toLowerCase().includes(normalizedSearch)

      return matchesMaterial && matchesSearch
    })
  }, [activeFilter, allProjects, searchTerm])

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
            <h2>{project.title}</h2>
            <p className="gallery-project-description">{project.description}</p>
            <p className="gallery-area">{project.area} · {project.material}</p>
          </div>
        </div>
      </article>
    </div>
  )

  return (
    <section className="page-shell gallery-page container-fluid">
      <section className="card gallery-intro-card">
        <div className="row g-0 align-items-center">
          <div className="col-12 col-lg-5">
            <div className="card-body gallery-intro-copy">
              <h1>Galería de soluciones modulares</h1>
              <p>
                Referencias visuales para elegir material, distribución y estilo antes de pasar al diseñador.
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
        <div className="col-12 col-lg-4">
          <div className="d-flex flex-wrap gap-2">
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
        </div>

        <div className="col-12 col-lg-4">
          <input
            type="search"
            className="form-control gallery-search-input"
            placeholder="Buscar ideas"
            aria-label="Buscar ideas en la galería"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="col-12 col-lg-4 d-flex justify-content-lg-end">
          <select className="form-select gallery-sort-select" aria-label="Ordenar galería">
            <option>Más recientes</option>
            <option>Mayor superficie</option>
            <option>Menor superficie</option>
          </select>
        </div>
      </div>

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
            <button
              type="button"
              className="btn gallery-favorite-btn gallery-feature-favorite"
              aria-label={`Ampliar ${featuredProject.title}`}
              onClick={() => setSelectedIdea(featuredProject)}
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
              <p className="gallery-area">{featuredProject.area} · {featuredProject.material}</p>
              <div className="d-flex flex-wrap gap-3 gallery-feature-actions">
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

      <nav className="gallery-pagination" aria-label="Paginación de galería">
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
              <h2>Prepara tu estructura</h2>
              <p>Usa el diseñador para calcular módulos y revisar materiales.</p>
            </div>
          </div>
          <div className="col-12 col-lg-5 d-flex justify-content-lg-center">
            <button type="button" className="btn gallery-cta-btn" onClick={() => onNavigate('design')}>
              Ir al diseñador
            </button>
          </div>
        </div>
      </section>

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
