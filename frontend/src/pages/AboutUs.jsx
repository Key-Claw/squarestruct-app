import cristianGilPhoto from '../assets/about/cristiangil.jpeg'
import raulmartinezPhoto from '../assets/about/raulmartinez.jpeg'
import teamPhoto from '../assets/about/retoseas.jpeg'

function AboutUs() {
  return (
    <section className="page-shell about-page about-story-page container-fluid">
      <div className="row g-3 about-layout-row align-items-start">
        <aside className="col-12 col-lg-2 about-profile-col">
          <div className="card about-name-card">
            <div className="card-body">Raul Martinez</div>
          </div>

          <article className="card about-profile-photo-card">
            <img src={raulmartinezPhoto} className="card-img about-profile-image" alt="Raul Martinez" />
          </article>

          <section className="card about-profile-text-card">
            <div className="card-body">
              <p>
                Raul Martin ha sentido desde pequeno una gran pasion por los
                videojuegos y el mundo de la tecnologia, lo que le llevo a orientar su
                formacion hacia este sector.
              </p>

              <p>
                Inicio sus estudios en Sistemas Microinformaticos y Redes en el Centro
                San Valero, donde adquirio una base solida en sistemas y tecnologia y
                desperto su interes por el desarrollo web.
              </p>

              <p>
                Actualmente cursa Desarrollo de Aplicaciones Web (DAW), aplicando sus
                conocimientos en proyectos como SquareStruct mientras continua
                formandose de manera autodidacta con el objetivo de crecer en el
                ambito tecnologico.
              </p>
            </div>
          </section>
        </aside>

        <main className="col-12 col-lg-8">
          <div className="card about-team-card">
            <img src={teamPhoto} className="card-img about-team-image" alt="Raul y Cristian" />
          </div>

          <section className="card about-story-card about-editorial-card">
            <div className="card-body">
              <div className="about-text-content">
                <h1>Nuestra historia</h1>
                <p className="about-lead">
                  SquareStruct es un proyecto academico con mentalidad practica: una
                  tienda online para acercar la construccion modular a un usuario que
                  quiere comparar, elegir y planificar con mas claridad.
                </p>

                <div className="row g-4 about-newspaper-text align-items-stretch">
                  <div className="col-12 col-md-4 d-flex">
                    <div className="about-history-column flex-fill h-100">
                      <p>
                        SquareStruct nace como proyecto final del primer curso de
                        Desarrollo de Aplicaciones Web (DAW) en el Centro San Valero,
                        con la idea de crear una tienda online especializada en productos
                        modulares para la construccion. El proyecto se centra
                        principalmente en la comercializacion de bloques de distintas
                        medidas y pilares, suministrados por una empresa que actuara
                        como proveedora inicial.
                      </p>
                    </div>
                  </div>

                  <div className="col-12 col-md-4 d-flex">
                    <div className="about-history-column flex-fill h-100">
                      <p>
                        La finalidad de SquareStruct es facilitar al usuario la consulta,
                        seleccion y compra de materiales modulares, ofreciendo una
                        plataforma clara, moderna y orientada a la construccion de
                        viviendas o estructuras mediante piezas ensamblables.
                      </p>
                    </div>
                  </div>

                  <div className="col-12 col-md-4 d-flex">
                    <div className="about-history-column flex-fill h-100">
                      <p>
                        La idea surge tambien de nuestra experiencia previa en otros
                        ciclos formativos y de la buena dinamica de trabajo que hemos
                        construido como equipo. Aunque no comenzamos a trabajar juntos
                        directamente hasta este curso, la confianza, la coordinacion y
                        la forma de complementarnos nos han permitido plantear un
                        proyecto mas completo, con una vision practica y cercana a un
                        caso real.
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
            <div className="card-body">Cristian Gil Gz</div>
          </div>

          <article className="card about-profile-photo-card">
            <img src={cristianGilPhoto} className="card-img about-profile-image" alt="Cristian Gil" />
          </article>

          <section className="card about-profile-text-card">
            <div className="card-body">
              <p>
                Cristian Gil decidio reinventarse profesionalmente apostando por el
                sector tecnologico, dejando atras un entorno laboral distinto para
                enfocarse en su desarrollo como programador.
              </p>

              <p>
                Inicio su formacion en Sistemas Microinformaticos y Redes en el Centro
                San Valero, donde adquirio una base solida en sistemas y redes que le
                permite comprender mejor el funcionamiento de las aplicaciones.
              </p>

              <p>
                Actualmente cursa Desarrollo de Aplicaciones Web (DAW), aplicando sus
                conocimientos en proyectos como SquareStruct mientras continua
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
