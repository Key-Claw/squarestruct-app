import cristianGilPhoto from '../assets/about/cristiangil.webp'
import raulmartinezPhoto from '../assets/about/raulmartinez.webp'
import teamPhoto from '../assets/about/retoseas.webp'
import squarestructLogo from '../assets/logo/squarestruct-logo.png'

function AboutUs() {
  return (
    <section className="page-shell about-page about-story-page container-fluid">
      <div className="about-layout-row">
        <div className="about-top-grid">
          <aside className="about-profile-col">
            <div className="card about-name-card">
              <div className="card-body">Raúl Martín</div>
            </div>

            <article className="card about-profile-photo-card">
              <img src={raulmartinezPhoto} className="card-img about-profile-image" alt="Raúl Martín" />
            </article>
          </aside>

          <div className="card about-team-card">
            <img src={teamPhoto} className="card-img about-team-image" alt="Raúl y Cristian" />
          </div>

          <aside className="about-profile-col">
            <div className="card about-name-card">
              <div className="card-body">Cristian Gil</div>
            </div>

            <article className="card about-profile-photo-card">
              <img src={cristianGilPhoto} className="card-img about-profile-image" alt="Cristian Gil" />
            </article>
          </aside>
        </div>

        <div className="about-content-grid">
          <section className="card about-profile-text-card">
            <div className="card-body">
              <p>
                Raúl es un apasionado por los videojuegos y la tecnología. Orientó
                su formación a sistemas y desarrollo web desde sus primeros pasos,
                buscando aplicar lo aprendido en proyectos reales.
              </p>

              {/* <p>
                Estudia DAW en Centro San Valero y participa activamente en
                SquareStruct, combinando trabajo en equipo y práctica constante para
                consolidar sus habilidades.
              </p> */}
            </div>
          </section>

          <section className="card about-story-card about-editorial-card">
            <div className="card-body">
              <div className="about-text-content">
                <p className="eyebrow">Sobre SquareStruct</p>
                <h1>Nuestra historia</h1>
                <p>
                  SquareStruct nace en el aula, pero mira hacia la obra real:
                  una forma sencilla de explorar, comparar y planificar
                  soluciones modulares antes de construir.
                </p>
                <p>
                  Queremos que elegir materiales ensamblables sea una experiencia
                  clara y cercana, donde cada pieza tenga sentido dentro del
                  proyecto que el usuario imagina.
                </p>
                <p>
                  Detrás de la plataforma hay práctica, aprendizaje y trabajo en
                  equipo: una idea académica convertida en una herramienta útil
                  para resolver necesidades concretas.
                </p>
              </div>
              <img src={squarestructLogo} className="about-story-watermark" alt="" aria-hidden="true" />
            </div>
          </section>

          <section className="card about-profile-text-card">
            <div className="card-body">
              <p>
                Cristian se reinventó profesionalmente hacia el sector tecnológico.
                Orientó su aprendizaje al desarrollo web y aporta una base práctica
                en sistemas y redes, buscando crear soluciones útiles para proyectos reales.
              </p>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

export default AboutUs
