const footerBenefits = [
  {
    icon: '▣',
    title: 'Envios rapidos',
    text: 'A todo el pais'
  },
  {
    icon: '✓',
    title: 'Calidad garantizada',
    text: 'Materiales certificados'
  },
  {
    icon: '☏',
    title: 'Atencion personalizada',
    text: 'Te ayudamos a elegir'
  },
  {
    icon: '◇',
    title: 'Compra segura',
    text: 'Tus datos protegidos'
  }
]

function SiteFooter({ showBenefits = true }) {
  return (
    <footer className="site-footer" aria-label="Informacion de SquareStruct">
      {showBenefits && (
        <div className="site-benefits-footer">
          {footerBenefits.map((benefit) => (
            <article key={benefit.title}>
              <span>{benefit.icon}</span>
              <div>
                <h2>{benefit.title}</h2>
                <p>{benefit.text}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="site-footer-copy">
        SquareStruct © 2026 · Proyecto academico de construccion modular desarrollado por Raúl Martín y Cristian Gil
      </p>
    </footer>
  )
}

export default SiteFooter
