import cristianGilPhoto from '../assets/about/cristiangil.webp'
import raulmartinezPhoto from '../assets/about/raulmartinez.webp'
import teamPhoto from '../assets/about/retoseas.webp'
import squarestructLogo from '../assets/logo/squarestruct-logo.png'
import { useTranslation } from 'react-i18next'

function AboutUs() {
  const { t } = useTranslation()

  return (
    <section className="page-shell about-page about-story-page container-fluid">
      <div className="about-layout-row">
        <div className="about-top-grid">
          <aside className="about-profile-col">
            <div className="card about-name-card">
              <div className="card-body">{t('about.raul.name')}</div>
            </div>

            <article className="card about-profile-photo-card">
              <img src={raulmartinezPhoto} className="card-img about-profile-image" alt={t('about.raul.imageAlt')} />
            </article>
          </aside>

          <div className="card about-team-card">
            <img src={teamPhoto} className="card-img about-team-image" alt={t('about.raul.teamAlt')} />
          </div>

          <aside className="about-profile-col">
            <div className="card about-name-card">
              <div className="card-body">{t('about.cristian.name')}</div>
            </div>

            <article className="card about-profile-photo-card">
              <img src={cristianGilPhoto} className="card-img about-profile-image" alt={t('about.cristian.imageAlt')} />
            </article>
          </aside>
        </div>

        <div className="about-content-grid">
          <section className="card about-profile-text-card">
            <div className="card-body">
              <p>{t('about.raul.bio')}</p>
            </div>
          </section>

          <section className="card about-story-card about-editorial-card">
            <div className="card-body">
              <div className="about-text-content">
                <p className="eyebrow">{t('about.eyebrow')}</p>
                <h1>{t('about.title')}</h1>
                <p>{t('about.intro1')}</p>
                <p>{t('about.intro2')}</p>
                <p>{t('about.intro3')}</p>
              </div>
              <img src={squarestructLogo} className="about-story-watermark" alt="" aria-hidden="true" />
            </div>
          </section>

          <section className="card about-profile-text-card">
            <div className="card-body">
              <p>{t('about.cristian.bio')}</p>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

export default AboutUs
