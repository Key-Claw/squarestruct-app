import { useMemo, useState } from 'react'

import heroGalleryImage from '../assets/gallery/gallery-hero.webp'
import compactHouseImage from '../assets/gallery/galeria-casa-compacta.webp'
import minimalHouseImage from '../assets/gallery/galeria-casa-minimalista.webp'
import forestHouseImage from '../assets/gallery/galeria-casa-moderna-bosque.webp'
import featuredHouseImage from '../assets/gallery/galeria-casa-moderna-desierto-destacada.webp'
import beachHouseImage from '../assets/gallery/galeria-casa-playa.webp'
import desertRusticHouseImage from '../assets/gallery/galeria-casa-rustica-desierto.webp'
import sustainableHouseImage from '../assets/gallery/galeria-casa-sostenible-desierto.webp'
import { useTranslation } from 'react-i18next'

function Gallery({ onNavigate }) {
  const { t } = useTranslation()
  const [activeFilter, setActiveFilter] = useState('hormigon')
  const [selectedIdea, setSelectedIdea] = useState(null)

  const filters = [
    { id: 'hormigon', label: t('gallery.materials.hormigon') },
    { id: 'eco', label: t('gallery.materials.eco') },
  ]

  const topProjects = [
    {
      id: 'casa-bruma',
      title: t('gallery.projects.casaBruma.title'),
      area: '118 m2',
      material: 'eco',
      materialLabel: t('gallery.materials.eco'),
      description: t('gallery.projects.casaBruma.description'),
      image: forestHouseImage,
    },
    {
      id: 'modulo-nido',
      title: t('gallery.projects.moduloNido.title'),
      area: '64 m2',
      material: 'hormigon',
      materialLabel: t('gallery.materials.hormigon'),
      description: t('gallery.projects.moduloNido.description'),
      image: compactHouseImage,
    },
    {
      id: 'casa-cala',
      title: t('gallery.projects.casaCala.title'),
      area: '132 m2',
      material: 'eco',
      materialLabel: t('gallery.materials.eco'),
      description: t('gallery.projects.casaCala.description'),
      image: beachHouseImage,
    },
  ]

  const featuredProject = {
    id: 'casa-horizonte',
    title: t('gallery.projects.casaHorizonte.title'),
    architect: t('gallery.projects.casaHorizonte.architect'),
    area: '156 m2',
    material: 'hormigon',
    materialLabel: t('gallery.materials.hormigon'),
    description: [
      t('gallery.projects.casaHorizonte.description1'),
      t('gallery.projects.casaHorizonte.description2'),
    ],
    image: featuredHouseImage,
  }

  const bottomProjects = [
    {
      id: 'casa-lineal',
      title: t('gallery.projects.casaLineal.title'),
      area: '96 m2',
      material: 'hormigon',
      materialLabel: t('gallery.materials.hormigon'),
      description: t('gallery.projects.casaLineal.description'),
      image: minimalHouseImage,
    },
    {
      id: 'refugio-arena',
      title: t('gallery.projects.refugioArena.title'),
      area: '104 m2',
      material: 'hormigon',
      materialLabel: t('gallery.materials.hormigon'),
      description: t('gallery.projects.refugioArena.description'),
      image: desertRusticHouseImage,
    },
    {
      id: 'casa-solar',
      title: t('gallery.projects.casaSolar.title'),
      area: '122 m2',
      material: 'eco',
      materialLabel: t('gallery.materials.eco'),
      description: t('gallery.projects.casaSolar.description'),
      image: sustainableHouseImage,
    },
  ]

  const allProjects = [...topProjects, ...bottomProjects]

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => project.material === activeFilter)
  }, [activeFilter, allProjects])

  const firstRow = filteredProjects.slice(0, 3)
  const secondRow = filteredProjects.slice(3, 6)

  const renderProjectCard = (project) => (
    <div className="col-12 col-md-4" key={project.id}>
      <article className="card h-100 gallery-project-card">
        <div className="gallery-project-media">
          <img src={project.image} className="gallery-cover-image" alt={project.title} />
          <button
            type="button"
            className="btn gallery-favorite-btn"
            aria-label={t('gallery.enlarge', { title: project.title })}
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
              <p className="gallery-area">{project.area} · {project.materialLabel}</p>
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
            <p className="gallery-eyebrow">{t('gallery.eyebrow')}</p>
            <h1>{t('gallery.title')}</h1>
          </div>
          <div className="gallery-intro-text">
            <p>{t('gallery.intro')}</p>
          </div>
        </div>

        <div className="gallery-intro-media" aria-hidden="true">
          <img src={heroGalleryImage} className="gallery-cover-image" alt="" />
        </div>
        <div className="gallery-intro-actions" aria-label={t('gallery.filtersLabel')}>
          {filters.map((filter) => (
            <button
              type="button"
              className={`btn gallery-filter-btn${activeFilter === filter.id ? ' active' : ''}`}
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      {filteredProjects.length === 0 ? (
        <div className="gallery-empty-state">{t('gallery.empty')}</div>
      ) : (
        <>
          <div className="row g-4 gallery-grid">{firstRow.map(renderProjectCard)}</div>

          <section className="card gallery-feature-card">
            <img
              src={featuredProject.image}
              className="gallery-cover-image gallery-feature-image"
              alt={featuredProject.title}
            />
            <button
              type="button"
              className="btn gallery-feature-star"
              aria-label={t('gallery.enlarge', { title: featuredProject.title })}
              onClick={() => setSelectedIdea(featuredProject)}
            >
              ★
            </button>
            <div className="card-body gallery-feature-copy">
              <div className="gallery-feature-title-grid">
                <h2>{featuredProject.title}</h2>
                <h3 className="gallery-badge">{t('gallery.featured')}</h3>
              </div>
              <div className="gallery-feature-info-grid">
                <p className="gallery-feature-architect">{featuredProject.architect}</p>
                {featuredProject.description.map((paragraph, index) => (
                  <p key={`${featuredProject.id}-${index}`}>{paragraph}</p>
                ))}
                <p className="gallery-area">{featuredProject.area} · {featuredProject.materialLabel}</p>
              </div>
              <div className="gallery-feature-actions">
                <button
                  type="button"
                  className="btn gallery-outline-btn gallery-feature-action-btn"
                  onClick={() => onNavigate('design')}
                >
                  {t('gallery.designIdea')}
                </button>
              </div>
            </div>
          </section>

          {secondRow.length > 0 && <div className="row g-4 gallery-grid">{secondRow.map(renderProjectCard)}</div>}
        </>
      )}

      {selectedIdea && (
        <div className="gallery-idea-backdrop" role="presentation" onClick={() => setSelectedIdea(null)}>
          <article
            className="gallery-idea-modal"
            role="dialog"
            aria-modal="true"
            aria-label={selectedIdea.title}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="btn gallery-idea-close" aria-label={t('gallery.close')} onClick={() => setSelectedIdea(null)}>
              ×
            </button>
            <img src={selectedIdea.image} alt={selectedIdea.title} />
          </article>
        </div>
      )}
    </section>
  )
}

export default Gallery




