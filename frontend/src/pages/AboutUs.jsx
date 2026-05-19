import cristianGilPhoto from '../assets/about/cristiangil.webp'
import raulmartinezPhoto from '../assets/about/raulmartinez.webp'
import teamPhoto from '../assets/about/retoseas.webp'

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
                Apasionado por los videojuegos y la tecnología, orientó su formación
                a sistemas y desarrollo web desde sus primeros pasos, buscando aplicar
                lo aprendido en proyectos reales.
              </p>

              <p>
                Estudia DAW en Centro San Valero y participa activamente en
                SquareStruct, combinando trabajo en equipo y práctica constante para
                consolidar sus habilidades.
              </p>
            </div>
          </section>

          <section className="card about-story-card about-editorial-card">
            <div className="card-body">
              <div className="about-text-content">
                <p className="eyebrow">Sobre SquareStruct</p>
                <h1>Nuestra historia</h1>
                <p className="about-lead">
                  SquareStruct es un proyecto académico con mentalidad práctica: una
                  tienda online para acercar la construcción modular a un usuario que
                  quiere comparar, elegir y planificar con más claridad.
                </p>

                <div className="about-newspaper-text about-story-grid">
                  <article className="about-history-column">
                    <p>
                      SquareStruct nace como proyecto final de primero de DAW en
                      Centro San Valero: una tienda online enfocada en productos
                      modulares para construcción.
                    </p>
                  </article>

                  <article className="about-history-column">
                    <p>
                      Nuestro objetivo es simplificar la consulta, comparación y
                      compra de materiales ensamblables con una experiencia clara,
                      actual y práctica.
                    </p>
                  </article>

                  <article className="about-history-column">
                    <p>
                      El proyecto también nace de nuestra experiencia previa y del
                      trabajo en equipo, con una visión realista y orientada a
                      resolver necesidades concretas.
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section className="card about-profile-text-card">
            <div className="card-body">
              <p>
                Se reinventó profesionalmente hacia el sector tecnológico con base
                en sistemas y redes, aportando una perspectiva práctica y creativa
                al equipo.
              </p>

              <p>
                Actualmente está cursando DAW y colabora en SquareStruct activamente,
                aplicando sus conocimientos en desarrollo web mientras amplía
                constantemente sus competencias.
              </p>
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

export default AboutUs
