function Register({ onNavigate }) {
  return (
    <section className="page-shell register-shell">
      <div className="container register-container">
        <div className="row justify-content-center align-items-center register-row w-100 mx-auto">
          <div className="col-12 col-md-8 col-lg-7 col-xl-6">
            <div className="card bg-dark text-white register-card">
              <div className="card-body p-4 p-md-5 text-center">
                <div className="mb-md-4 mt-md-2 pb-3">
                  {/* Título y contexto de la creación de cuenta. */}
                  <h2 className="fw-bold mb-2 text-uppercase">
                    Registrarse
                  </h2>
  
                  <p className="text-white-50 mb-4">
                    Crea tu cuenta para continuar
                  </p>
  
                  {/* Campo para el nombre visible del usuario. */}
                  <div className="form-outline form-white mb-3">
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
  
                  {/* Campo para el correo de acceso. */}
                  <div className="form-outline form-white mb-3">
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
  
                  {/* Campo para definir la contraseña principal. */}
                  <div className="form-outline form-white mb-3">
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
  
                  {/* Confirmación para evitar errores al escribir la contraseña. */}
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
  
                  {/* Botón principal para crear la cuenta. */}
                  <button
                    className="btn btn-outline-light btn-lg px-5"
                    type="button"
                  >
                    Crear cuenta
                  </button>
                </div>
  
                {/* Enlace para volver al acceso si ya existe una cuenta. */}
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