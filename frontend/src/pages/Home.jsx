import carruselDesignImage from '../assets/inicio/carrusel-design.webp'
import carruselPersonasImage from '../assets/inicio/carrusel-personas.webp'
import carruselSostenibleImage from '../assets/inicio/carrusel-sostenible.webp'
import inicioCatalogoImage from '../assets/inicio/inicio-catalogo.webp'
import inicioDesignImage from '../assets/inicio/inicio-design.webp'
import inicioGaleriaImage from '../assets/inicio/inicio-galeeria.webp'
import inicioSquarestructImage from '../assets/inicio/inicio-squarestruct.webp'
import Icon from '../components/common/Icon'
import { useTranslation } from 'react-i18next'

function Home({ onNavigate }) {
  const { t } = useTranslation()

  const homeHighlights = [
    { id: 'modular', title: t('home.highlights.modular.title'), text: t('home.highlights.modular.text') },
    { id: 'resistant', title: t('home.highlights.resistant.title'), text: t('home.highlights.resistant.text') },
    { id: 'plan', title: t('home.highlights.plan.title'), text: t('home.highlights.plan.text') },
    { id: 'sustainable', title: t('home.highlights.sustainable.title'), text: t('home.highlights.sustainable.text') },
  ]

  const homeFeatureCards = [
    {
      id: 'gallery',
      title: t('home.featureCards.gallery.title'),
      text: t('home.featureCards.gallery.text'),
      image: inicioGaleriaImage,
      icon: 'image',
      action: t('home.featureCards.gallery.action'),
      handler: (nextNavigate) => nextNavigate('gallery'),
    },
    {
      id: 'catalog',
      title: t('home.featureCards.catalog.title'),
      text: t('home.featureCards.catalog.text'),
      image: inicioCatalogoImage,
      icon: 'cube',
      action: t('home.featureCards.catalog.action'),
      handler: (nextNavigate) => nextNavigate('catalog', '', 'productos'),
    },
    {
      id: 'design',
      title: t('home.featureCards.design.title'),
      text: t('home.featureCards.design.text'),
      image: inicioDesignImage,
      icon: 'penTool',
      action: t('home.featureCards.design.action'),
      handler: (nextNavigate) => nextNavigate('design'),
    },
  ]

  const homeSlides = [
    {
      id: 'design',
      image: carruselDesignImage,
      title: t('home.slides.design.title'),
      alt: t('home.slides.design.alt'),
    },
    {
      id: 'catalog',
      image: carruselPersonasImage,
      title: t('home.slides.catalog.title'),
      alt: t('home.slides.catalog.alt'),
    },
    {
      id: 'sustainable',
      image: carruselSostenibleImage,
      title: t('home.slides.sustainable.title'),
      alt: t('home.slides.sustainable.alt'),
    },
  ]

  return (
    <section className="page-shell home-page container-fluid">
      <div className="home-hero card">
        <div className="row g-0 align-items-stretch home-hero-grid">
          <div className="col-12 col-md-4 home-hero-copy-wrap">
            <div className="home-hero-copy">
              <p className="eyebrow">{t('home.eyebrow')}</p>
              <h1>{t('home.title')}</h1>
              <h2>{t('home.subtitle')}</h2>
              <p>{t('home.description')}</p>
              <div className="hero-actions home-hero-actions">
                <button type="button" className="btn btn-light" onClick={() => onNavigate('catalog', '', 'productos')}>
                  {t('home.ctaCatalog')}
                </button>
                <button type="button" className="btn btn-outline-light home-design-btn" onClick={() => onNavigate('design')}>
                  {t('home.ctaDesign')}
                </button>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-8 home-carousel-wrap">
            <div id="homeCarousel" className="carousel slide home-carousel" data-bs-ride="carousel">
              <div className="carousel-indicators">
                {homeSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    data-bs-target="#homeCarousel"
                    data-bs-slide-to={index}
                    className={index === 0 ? 'active' : ''}
                    aria-current={index === 0 ? 'true' : undefined}
                    aria-label={t('home.carouselSlide', { index: index + 1 })}
                  ></button>
                ))}
              </div>

              <div className="carousel-inner">
                {homeSlides.map((slide, index) => (
                  <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={slide.id}>
                    <img src={slide.image} className="d-block w-100 home-carousel-image" alt={slide.alt} />
                  </div>
                ))}
              </div>

              <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">{t('home.carouselPrev')}</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">{t('home.carouselNext')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="home-about card">
        <div className="row g-0 align-items-stretch home-about-grid">
          <div className="col-12 col-md-5 home-about-media-wrap">
            <img src={inicioSquarestructImage} className="home-about-image" alt={t('home.aboutTitle')} />
          </div>

          <div className="col-12 col-md-7 home-about-copy-wrap">
            <div className="home-about-copy">
              <p className="eyebrow">{t('home.aboutEyebrow')}</p>
              <h2>{t('home.aboutTitle')}</h2>
              <p>{t('home.aboutIntro1')}</p>
              <p>{t('home.aboutIntro2')}</p>

              <div className="home-highlight-grid">
                {homeHighlights.map((item, index) => {
                  return (
                    <article className="home-highlight" key={item.id}>
                      <div className="home-highlight-header">
                        <span className="home-highlight-icon">{index + 1}</span>
                        <h3>{item.title}</h3>
                      </div>
                      <p>{item.text}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-capabilities">
        <div className="home-section-heading">
          <p className="eyebrow">{t('home.featuresEyebrow')}</p>
          <h2>{t('home.featuresTitle')}</h2>
        </div>

        <div className="home-feature-grid-shell">
          <div className="row g-4 home-feature-grid">
            {homeFeatureCards.map((item) => {
              return (
                <div className="col-12 col-md-4" key={item.id}>
                  <article className="page-card home-feature-card h-100">
                    <img src={item.image} className="home-feature-image" alt={item.title} />
                    <div className="page-card-body home-feature-body">
                      <span className="home-feature-badge">
                        <Icon name={item.icon} size={22} />
                      </span>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                      <button type="button" className="home-feature-link" onClick={() => item.handler(onNavigate)}>
                        {item.action} →
                      </button>
                    </div>
                  </article>
                </div>
              )
            })}
          </div>
        </div>
      </section>

    </section>
  )
}

export default Home

