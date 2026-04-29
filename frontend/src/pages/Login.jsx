function Login({ onNavigate }) {
  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card bg-dark text-white" style={{ borderRadius: '1rem' }}>
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">Iniciar Sesión</h2>
                  <p className="text-white-50 mb-5">Porfavor, instroduzca su usuario y su contraseña!</p>

                  <div className="form-outline form-white mb-4">
                    <input type="email" id="typeEmailX" className="form-control form-control-lg" />
                    <label className="form-label" htmlFor="typeEmailX">Correo Electronico</label>
                  </div>

                  <div className="form-outline form-white mb-4">
                    <input type="password" id="typePasswordX" className="form-control form-control-lg" />
                    <label className="form-label" htmlFor="typePasswordX">Contraseña</label>
                  </div>

                  <button
                    className="btn btn-outline-light btn-lg px-5"
                    type="button"
                  >
                    Iniciar Sesión
                  </button>
                </div>

                <div>
                  <p className="mb-0">
                    Aún no tiene cuenta?{' '}
                    <button
                      type="button"
                      className="btn btn-link text-white-50 fw-bold p-0"
                      onClick={() => onNavigate('register')}
                    >
                      Registrarse
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login