import designBocetoImage from '../assets/design/design-boceto.webp'
import designHeroImage from '../assets/design/design-hero.webp'
import Icon from '../components/common/Icon'

const designPieces = [
  { name: 'Bloque 200', material: 'Plástico reciclado' },
  { name: 'Bloque 200', material: 'Hormigón' },
  { name: 'Bloque 300', material: 'Hormigón' },
  { name: 'Bloque 600', material: 'Hormigón' },
  { name: 'Bloque 800', material: 'Plástico reciclado' },
]

const projectItems = [
  ['Bloque 200', 'Plástico reciclado', 24],
  ['Bloque 200', 'Hormigón', 18],
  ['Bloque 300', 'Hormigón', 6],
  ['Bloque 600', 'Hormigón', 8],
  ['Bloque 800', 'Plástico reciclado', 4],
]

const howItWorks = [
  {
    title: 'Selecciona una pieza',
    text: 'Elige el tipo de bloque o pilar que quieres colocar.'
  },
  {
    title: 'Coloca en el plano',
    text: 'Haz clic en la cuadrícula para colocar la pieza.'
  },
  {
    title: 'Construye tu diseño',
    text: 'Añade piezas, mueve, elimina y ajusta tu estructura.'
  },
]

function Design({ onNavigate }) {
  return (
    <section className="page-shell design-page container-fluid">
      {/* ====================================================================
          BARRA SUPERIOR - Título, descripción y botones de acción principal
          ==================================================================== */}
      <header className="card design-topbar">
        <div className="design-topbar-copy">
          <div className="design-topbar-title">
            <p className="design-eyebrow">Diseñador modular</p>
            <h1>Diseña tu estructura</h1>
          </div>
          <div className="design-topbar-text">
            <p>Crea tu plano en 3D utilizando bloques modulares y calcula materiales precios.</p>
          </div>
        </div>

        <div className="design-topbar-actions">
          <button type="button" className="btn design-outline-btn">Guardar</button>
          <button type="button" className="btn design-outline-btn">Cargar</button>
          <button type="button" className="btn design-outline-btn">Nuevo</button>
          <button type="button" className="btn design-budget-btn">Gestionar presupuesto</button>
        </div>

        <div className="design-topbar-media" aria-hidden="true">
          <img src={designHeroImage} alt="" />
        </div>
      </header>

      <div className="row g-4 design-workspace">
        {/* ====================================================================
            PANEL IZQUIERDO - Piezas disponibles (Bloques, Pilares, Accesorios)
            ==================================================================== */}
        <aside className="col-12 col-md-3 col-xl-2">
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
                    <span>Pieza modular</span>
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

        {/* ====================================================================
            ÁREA CENTRAL - Canvas 2D/3D, herramientas de edición, zoom, vistas
            ==================================================================== */}
        <main className="col-12 col-md-6 col-xl-8">
          <section className="card design-canvas-card" aria-label="Boceto provisional del futuro panel de Design">
            <img
              src={designBocetoImage}
              className="design-boceto-image"
              alt="Boceto provisional del futuro panel de Design"
            />

            <div className="design-toolbar" aria-label="Herramientas de plano">
              <button type="button" className="active" aria-label="Seleccionar bloque">■</button>
              <button type="button" aria-label="Mover">↔</button>
              <button type="button" aria-label="Desplazar">✥</button>
              <button type="button" aria-label="Rotar">↺</button>
              <button type="button" aria-label="Pantalla completa"><Icon name="fullscreen" size={16} /></button>
              <button type="button" aria-label="Eliminar">⌫</button>
            </div>

            <div className="design-zoom">
              <button type="button" aria-label="Aumentar zoom">+</button>
              <button type="button" aria-label="Reducir zoom">-</button>
              <button type="button" aria-label="Ajustar vista"><Icon name="fit" size={16} /></button>
            </div>

            <div className="design-view-switch" aria-label="Cambiar vista">
              <button type="button">2D</button>
              <button type="button" className="active">3D</button>
            </div>
          </section>
        </main>

        {/* ====================================================================
            PANEL DERECHO - Resumen del proyecto, totales, precio, acciones rápidas
            ==================================================================== */}
        <aside className="col-12 col-md-3 col-xl-2">
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

            <h3>Acciones rápidas</h3>
            <div className="design-quick-actions">
              <button type="button" className="btn design-outline-btn">Limpiar todo</button>
              <button type="button" className="btn design-outline-btn">Exportar plano</button>
            </div>
          </section>
        </aside>
      </div>

      {/* ====================================================================
          SECCIÓN INFERIOR - Pasos de uso y caja de ayuda
          ==================================================================== */}
      <section className="card design-help-card">
        <div className="design-help-steps">
          <h2>Cómo funciona</h2>
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
            <h2>¿Necesitas ayuda?</h2>
            <p>Consulta nuestra guía rápida para aprender a usar el diseñador.</p>
          </div>
          <button type="button" className="btn design-guide-btn" onClick={() => onNavigate('catalog', '', 'productos')}>
            Ver guía
          </button>
        </aside>
      </section>
    </section>
  )
}

export default Design


