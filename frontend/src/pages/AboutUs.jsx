function AboutUs ({ onNavigate }) {
    const items = [1, 2, 3, 4]
  
    return (
<section className="page-shell">
  {/* Carrusel con foto de alguna foto enfocada al curro */}
<div id="carouselExampleIndicators" class="carousel slide" data-mdb-ride="carousel" data-mdb-carousel-init>
  <div class="carousel-indicators">
    <button
      type="button"
      data-mdb-target="#carouselExampleIndicators"
      data-mdb-slide-to="0"
      class="active"
      aria-current="true"
      aria-label="Slide 1"
    ></button>
    <button
      type="button"
      data-mdb-target="#carouselExampleIndicators"
      data-mdb-slide-to="1"
      aria-label="Slide 2"
    ></button>
    <button
      type="button"
      data-mdb-target="#carouselExampleIndicators"
      data-mdb-slide-to="2"
      aria-label="Slide 3"
    ></button>
  </div>
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="https://mdbcdn.b-cdn.net/img/new/slides/041.webp" class="d-block w-100" alt="Wild Landscape"/>
    </div>
    <div class="carousel-item">
      <img src="https://mdbcdn.b-cdn.net/img/new/slides/042.webp" class="d-block w-100" alt="Camera"/>
    </div>
    <div class="carousel-item">
      <img src="https://mdbcdn.b-cdn.net/img/new/slides/043.webp" class="d-block w-100" alt="Exotic Fruits"/>
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-mdb-target="#carouselExampleIndicators" data-mdb-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-mdb-target="#carouselExampleIndicators" data-mdb-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>

  {/* Persona 1 */}
  <div className="row align-items-center mb-5">
    <div className="col-md-6">
      <div className="page-card-media" style={{ minHeight: '350px' }}>
        Imagen 1
      </div>
    </div>
    <div className="col-md-6">
      <div className="page-card-body">
        <h2>Nombre</h2>
        <p>
          Descripción
        </p>
      </div>
    </div>
  </div>

  {/* Persona 2 */}
  <div className="row align-items-center mb-5 flex-md-row-reverse">
    <div className="col-md-6">
      <div className="page-card-media" style={{ minHeight: '350px' }}>
        Imagen 2
      </div>
    </div>
    <div className="col-md-6">
      <div className="page-card-body">
        <h2>Nombre</h2>
        <p>
          Descripción
        </p>
      </div>
    </div>
  </div>

  {/* Foto de los 2 */}
  <div className="text-center mb-5">
    <div
      className="page-card-media mb-4"
      style={{ minHeight: '450px' }}
    >
      Imagen Principal
    </div>

    <div className="page-card-body mx-auto" style={{ maxWidth: '900px' }}>
      <h2>Nuestro Futuro</h2>
      <p>
        Miramos hacia adelante con entusiasmo, apostando por nuevas
        oportunidades, tecnologías y experiencias que nos permitan
        seguir creciendo junto a nuestros clientes y colaboradores.
      </p>
    </div>
  </div>
</section>
    )
  }
  
  export default AboutUs