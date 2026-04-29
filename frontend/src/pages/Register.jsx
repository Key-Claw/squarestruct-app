function Register({ onNavigate }) {
    return (
      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-7 col-xl-6">
              <div
                className="card bg-dark text-white"
                style={{ borderRadius: '1rem' }}
              >
                <div className="card-body p-5 text-center">
                  <div className="mb-md-4 mt-md-4 pb-4">
                    <h2 className="fw-bold mb-2 text-uppercase">
                      Registrarse
                    </h2>
  
                    <p className="text-white-50 mb-5">
                      Crea tu cuenta para continuar
                    </p>
  
                    <div className="form-outline form-white mb-4">
                      <input
                        type="text"
                        id="registerName"
                        className="form-control form-control-lg"
                      />
                      <label
                        className="form-label"
                        htmlFor="registerName"
                      >
                        Nombre completo
                      </label>
                    </div>
  
                    <div className="form-outline form-white mb-4">
                      <input
                        type="email"
                        id="registerEmail"
                        className="form-control form-control-lg"
                      />
                      <label
                        className="form-label"
                        htmlFor="registerEmail"
                      >
                        Correo electrónico
                      </label>
                    </div>
  
                    <div className="form-outline form-white mb-4">
                      <input
                        type="password"
                        id="registerPassword"
                        className="form-control form-control-lg"
                      />
                      <label
                        className="form-label"
                        htmlFor="registerPassword"
                      >
                        Contraseña
                      </label>
                    </div>
  
                    <div className="form-outline form-white mb-4">
                      <input
                        type="password"
                        id="registerConfirmPassword"
                        className="form-control form-control-lg"
                      />
                      <label
                        className="form-label"
                        htmlFor="registerConfirmPassword"
                      >
                        Confirmar contraseña
                      </label>
                    </div>
  
                    <button
                      className="btn btn-outline-light btn-lg px-5"
                      type="button"
                    >
                      Crear cuenta
                    </button>
                  </div>
  
                  <div>
                    <p className="mb-0">
                      ¿Ya tienes una cuenta?{' '}
                      <button
                        type="button"
                        className="btn btn-link text-white-50 fw-bold p-0 text-decoration-none"
                        onClick={() => onNavigate('login')}
                      >
                        Iniciar sesión
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
  
  export default Register