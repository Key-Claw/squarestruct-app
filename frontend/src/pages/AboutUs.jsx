import cristianGilPhoto from '../assets/about/cristiangil.webp'
import raulmartinezPhoto from '../assets/about/raulmartinez.webp'
import teamPhoto from '../assets/about/retoseas.webp'

function AboutUs() {
  return (
    <section className="page-shell about-page about-story-page container-fluid">
      <div className="row g-3 about-layout-row align-items-start">
        <aside className="col-12 col-lg-2 about-profile-col">
          <div className="card about-name-card">
            <div className="card-body">Raúl Martín</div>
          </div>

          <article className="card about-profile-photo-card">
            <img src={raulmartinezPhoto} className="card-img about-profile-image" alt="Raúl Martín" />
          </article>

          <section className="card about-profile-text-card">
            <div className="card-body">
              <p>
                Raúl Martín ha sentido desde pequeño una gran pasión por los
                videojuegos y el mundo de la tecnología, lo que le llevó a orientar su
                formación hacia este sector.
              </p>

              <p>
                Inició sus estudios en Sistemas Microinformáticos y Redes en el Centro
                San Valero, donde adquirió una base sólida en sistemas y tecnología y
                despertó su interés por el desarrollo web.
              </p>

              <p>
                Actualmente cursa Desarrollo de Aplicaciones Web (DAW), aplicando sus
                conocimientos en proyectos como SquareStruct mientras continúa
                formándose de manera autodidacta con el objetivo de crecer en el
                ámbito tecnológico.
              </p>
            </div>
          </section>
        </aside>

        <main className="col-12 col-lg-8">
          <div className="card about-team-card">
            <img src={teamPhoto} className="card-img about-team-image" alt="Raúl y Cristian" />
          </div>

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

                <div className="row g-4 about-newspaper-text align-items-stretch">
                  <div className="col-12 col-md-4 d-flex">
                    <div className="about-history-column flex-fill h-100">
                      <p>
                        SquareStruct nace como proyecto final del primer curso de
                        Desarrollo de Aplicaciones Web (DAW) en el Centro San Valero,
                        con la idea de crear una tienda online especializada en productos
                        modulares para la construcción. El proyecto se centra
                        principalmente en la comercialización de bloques de distintas
                        medidas y pilares, suministrados por una empresa proveedora.
                      </p>
                    </div>
                  </div>

                  <div className="col-12 col-md-4 d-flex">
                    <div className="about-history-column flex-fill h-100">
                      <p>
                        La finalidad de SquareStruct es facilitar al usuario la consulta,
                        selección y compra de materiales modulares, ofreciendo una
                        plataforma clara, moderna y orientada a la construcción de
                        viviendas o estructuras mediante piezas ensamblables.
                      </p>
                    </div>
                  </div>

                  <div className="col-12 col-md-4 d-flex">
                    <div className="about-history-column flex-fill h-100">
                      <p>
                        La idea surge también de nuestra experiencia previa en otros
                        ciclos formativos y de la buena dinámica de trabajo construida
                        como equipo. La confianza, la coordinación y la forma de
                        complementarnos nos han permitido plantear un proyecto completo,
                        con una visión práctica y cercana a un caso real.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <aside className="col-12 col-lg-2 about-profile-col">
          <div className="card about-name-card">
            <div className="card-body">Cristian Gil</div>
          </div>

          <article className="card about-profile-photo-card">
            <img src={cristianGilPhoto} className="card-img about-profile-image" alt="Cristian Gil" />
          </article>

          <section className="card about-profile-text-card">
            <div className="card-body">
              <p>
                Cristian Gil decidió reinventarse profesionalmente apostando por el
                sector tecnológico, dejando atrás un entorno laboral distinto para
                enfocarse en su desarrollo como programador.
              </p>

              <p>
                Inició su formación en Sistemas Microinformáticos y Redes en el Centro
                San Valero, donde adquirió una base sólida en sistemas y redes que le
                permite comprender mejor el funcionamiento de las aplicaciones.
              </p>

              <p>
                Actualmente cursa Desarrollo de Aplicaciones Web (DAW), aplicando sus
                conocimientos en proyectos como SquareStruct mientras continúa
                ampliando sus habilidades dentro del desarrollo web.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </section>
  )
}

export default AboutUs


