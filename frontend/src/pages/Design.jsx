import designBocetoImage from '../assets/design/design-boceto.jpeg'

const designPieces = [
  { name: 'Bloque 200', material: 'Plastico reciclado', size: '20 x 15 x 20 cm' },
  { name: 'Bloque 200', material: 'Hormigon', size: '20 x 15 x 20 cm' },
  { name: 'Bloque 300', material: 'Hormigon', size: '20 x 15 x 20 cm' },
  { name: 'Bloque 600', material: 'Hormigon', size: '20 x 15 x 20 cm' },
  { name: 'Bloque 800', material: 'Plastico reciclado', size: '20 x 15 x 20 cm' },
]

const projectItems = [
  ['Bloque 200', 'Plastico reciclado', 24],
  ['Bloque 200', 'Hormigon', 18],
  ['Bloque 300', 'Hormigon', 6],
  ['Bloque 600', 'Hormigon', 8],
  ['Bloque 800', 'Plastico reciclado', 4],
]

const howItWorks = [
  {
    title: 'Selecciona una pieza',
    text: 'Elige el tipo de bloque o pilar que quieres colocar.'
  },
  {
    title: 'Coloca en el plano',
    text: 'Haz clic en la cuadricula para colocar la pieza.'
  },
  {
    title: 'Construye tu diseno',
    text: 'Anade piezas, mueve, elimina y ajusta tu estructura.'
  },
]

function Design({ onNavigate }) {
  return (
    <section className="page-shell design-page container-fluid">
      <header className="card design-topbar">
        <div>
          <h1>Disena tu estructura modular</h1>
          <p>Crea tu plano en 3D utilizando bloques modulares y calcula automaticamente los materiales necesarios.</p>
        </div>

        <div className="design-topbar-actions">
          <button type="button" className="btn design-outline-btn">Guardar</button>
          <button type="button" className="btn design-outline-btn">Cargar</button>
          <button type="button" className="btn design-outline-btn">Nuevo</button>
          <button type="button" className="btn design-budget-btn">Gestionar presupuesto</button>
        </div>
      </header>

      <div className="row g-4 design-workspace">
        <aside className="col-12 col-xl-2">
          <section className="card design-pieces-panel">
            <h2>Bloques y piezas</h2>
            <div className="design-tabs" role="tablist" aria-label="Tipos de piezas">
              <button type="button" className="active">Bloques</button>
              <button type="button">Pilares</button>
              <button type="button">Accesorios</button>
            </div>

            <div className="design-piece-list">
              {designPieces.map((piece, index) => (
                <article className="design-piece-card" key={`${piece.name}-${piece.material}-${index}`}>
                  <div className="design-piece-media">Image cap</div>
                  <div>
                    <h3>{piece.name}</h3>
                    <p>{piece.material}</p>
                    <span>{piece.size}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="design-drag-help">
              <span aria-hidden="true">+</span>
              <div>
                <strong>Arrastra o selecciona</strong>
                <p>una pieza para empezar</p>
              </div>
            </div>
          </section>
        </aside>

        <main className="col-12 col-xl-8">
          <section className="card design-canvas-card" aria-label="Boceto provisional del futuro panel de Design">
            <img
              src={designBocetoImage}
              className="design-boceto-image"
              alt="Boceto provisional del futuro panel de Design"
            />

            <div className="design-toolbar" aria-label="Herramientas de plano">
              <button type="button" className="active" aria-label="Seleccionar bloque">■</button>
              <button type="button" aria-label="Mover">↕</button>
              <button type="button" aria-label="Desplazar">✥</button>
              <button type="button" aria-label="Rotar">↺</button>
              <button type="button" aria-label="Pantalla completa">□</button>
              <button type="button" aria-label="Eliminar">⌫</button>
            </div>

            <div className="design-zoom">
              <button type="button" aria-label="Aumentar zoom">+</button>
              <button type="button" aria-label="Reducir zoom">-</button>
              <button type="button" aria-label="Ajustar vista">□</button>
            </div>

            <div className="design-view-switch" aria-label="Cambiar vista">
              <button type="button">2D</button>
              <button type="button" className="active">3D</button>
            </div>
          </section>
        </main>

        <aside className="col-12 col-xl-2">
          <section className="card design-summary-panel">
            <h2>Resumen del proyecto</h2>

            <div className="design-summary-list">
              {projectItems.map(([name, material, amount]) => (
                <div key={`${name}-${material}`}>
                  <span><strong>{name}</strong> {material}</span>
                  <b>{amount}</b>
                </div>
              ))}
            </div>

            <dl className="design-summary-totals">
              <div>
                <dt>Total piezas</dt>
                <dd>60</dd>
              </div>
              <div>
                <dt>Superficie construida</dt>
                <dd>48.0 m2</dd>
              </div>
              <div>
                <dt>Altura de muros</dt>
                <dd>2.40 m</dd>
              </div>
            </dl>

            <div className="design-price-box">
              <span>Precio estimado</span>
              <strong>1.250,75 EUR</strong>
            </div>

            <h3>Acciones rapidas</h3>
            <div className="design-quick-actions">
              <button type="button" className="btn design-outline-btn">Limpiar todo</button>
              <button type="button" className="btn design-outline-btn">Exportar plano</button>
            </div>
          </section>
        </aside>
      </div>

      <section className="card design-help-card">
        <div className="design-help-steps">
          <h2>Como funciona</h2>
          <div className="design-help-step-row">
            {howItWorks.map((step, index) => (
              <article key={step.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="design-guide-box">
          <div>
            <h2>Necesitas ayuda?</h2>
            <p>Consulta nuestra guia rapida para aprender a usar el disenador.</p>
          </div>
          <button type="button" className="btn design-guide-btn" onClick={() => onNavigate('catalogo', '', 'productos')}>
            Ver guia
          </button>
        </aside>
      </section>
    </section>
  )
}

export default Design
