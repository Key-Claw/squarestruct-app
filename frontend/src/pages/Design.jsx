function Design({ onNavigate }) {
  const steps = [
    'Selecciona bloques del catálogo',
    'Colócalos sobre el plano',
    'Calcula una estimación de presupuesto',
  ]

  return (
    /* Bootstrap container-fluid ocupa todo el ancho disponible:
       https://getbootstrap.com/docs/5.3/layout/containers/ */
    <section className="page-shell design-shell container-fluid">
      <div className="mvp-hero design-hero">
        <p className="eyebrow">v3 - Diseñador de planos</p>
        <h1>Diseña tu estructura modular</h1>
        <p>
          Este espacio prepara el futuro editor de planos: una herramienta para
          montar viviendas por bloques, revisar piezas y estimar costes.
        </p>
        {/* Bootstrap buttons:
            https://getbootstrap.com/docs/5.3/components/buttons/ */}
        <div className="hero-actions">
          <button type="button" className="btn btn-light" onClick={() => onNavigate('catalogo', '', 'productos')}>
            Ver productos
          </button>
          <button type="button" className="btn btn-outline-light" onClick={() => onNavigate('galeria')}>
            Ver inspiración
          </button>
        </div>
      </div>

      <div className="design-board">
        <aside className="design-panel">
          <h2>Herramientas MVP</h2>
          <p>
            Por ahora se muestra una maqueta visual. Más adelante aquí irán
            bloques arrastrables, presupuesto y guardado de diseños.
          </p>
          <div className="tool-stack">
            <button type="button">Bloque 300</button>
            <button type="button">Bloque 600</button>
            <button type="button">Pilar 180</button>
          </div>
        </aside>

        <div className="plan-preview" aria-label="Vista previa de plano modular">
          {Array.from({ length: 36 }).map((_, index) => (
            <span key={index} className={index === 8 || index === 9 || index === 14 || index === 20 ? 'is-filled' : ''} />
          ))}
        </div>
      </div>

      <div className="page-grid mt-4">
        {steps.map((step, index) => (
          <article className="page-card compact-card" key={step}>
            <div className="page-card-body">
              <span className="step-number">{index + 1}</span>
              <h3>{step}</h3>
              <p>Base funcional pensada para explicar la evolución futura de SquareStruct.</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Design
