function Login({ onNavigate }) {
  return (
    <section className="page-shell login-shell">
      <div className="container login-container">
        <div className="row justify-content-center align-items-center login-row w-100 mx-auto">
          <div className="col-12 col-md-9 col-lg-7 col-xl-6">
            <div className="card bg-dark text-white login-card">
              <div className="card-body p-4 p-md-5 text-center">
                <div className="mb-md-4 mt-md-2 pb-3">
                  {/* Título y descripción de la pantalla de acceso. */}
                  <h2 className="fw-bold mb-2 text-uppercase">Iniciar Sesión</h2>
                  <p className="text-white-50 mb-4">Por favor, introduce tu usuario y tu contraseña.</p>

                  {/* Campo de correo electrónico del usuario. */}
                  <div className="form-outline form-white mb-3 login-field">
                    <input type="email" id="typeEmailX" className="form-control form-control-lg" />
                    <label className="form-label" htmlFor="typeEmailX">Correo electrónico</label>
                  </div>

                  {/* Campo de contraseña para validar la sesión. */}
                  <div className="form-outline form-white mb-4 login-field">
                    <input type="password" id="typePasswordX" className="form-control form-control-lg" />
                    <label className="form-label" htmlFor="typePasswordX">Contraseña</label>
                  </div>

                  {/* Botón principal para enviar credenciales. */}
                  <button
                    className="btn btn-outline-light btn-lg px-5"
                    type="button"
                  >
                    Iniciar Sesión
                  </button>
                </div>

                {/* Enlace para cambiar al formulario de registro. */}
                <div className="login-footer">
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