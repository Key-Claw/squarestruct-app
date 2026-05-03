const cartSteps = [
  'Seleccionar productos desde el catálogo',
  'Revisar cantidades y medidas',
  'Preparar el pedido o presupuesto',
]

function Carrito({ onNavigate }) {
  return (
    /* Bootstrap container-fluid ocupa todo el ancho disponible:
       https://getbootstrap.com/docs/5.3/layout/containers/ */
    <section className="page-shell cart-page container-fluid">
      <div className="mvp-hero cart-hero">
        <p className="eyebrow">Carrito del MVP</p>
        <h1>Productos seleccionados</h1>
        <p>
          Esta vista prepara el futuro flujo de compra o presupuesto. En esta
          fase muestra la estructura visual del carrito.
        </p>
        {/* Bootstrap buttons:
            https://getbootstrap.com/docs/5.3/components/buttons/ */}
        <div className="hero-actions">
          <button type="button" className="btn btn-light" onClick={() => onNavigate('catalogo', '', 'productos')}>
            Ver catálogo
          </button>
          <button type="button" className="btn btn-outline-light" onClick={() => onNavigate('design')}>
            Ir a Diseño
          </button>
        </div>
      </div>

      <section className="page-block cart-summary">
        <div>
          <p className="eyebrow">Estado actual</p>
          <h2>El carrito está preparado para la siguiente fase</h2>
          <p>
            Todavía no guarda productos reales. La idea es enlazarlo después
            con catálogo, pedidos y presupuesto.
          </p>
        </div>

        <div className="cart-total">
          <span>Total estimado</span>
          <strong>0,00 EUR</strong>
        </div>
      </section>

      {/* Bootstrap grid:
          https://getbootstrap.com/docs/5.3/layout/grid/ */}
      <div className="page-grid mt-4">
        {cartSteps.map((step, index) => (
          <article className="page-card compact-card" key={step}>
            <div className="page-card-body">
              <span className="step-number">{index + 1}</span>
              <h3>{step}</h3>
              <p>Parte prevista para completar el flujo de carrito y pedido.</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Carrito
