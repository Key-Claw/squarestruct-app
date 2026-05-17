import Icon from './ui/Icon'

const footerBenefits = [
  {
    icon: 'box',
    title: 'Envíos rápidos',
    text: 'A todo el país',
  },
  {
    icon: 'checkCircle',
    title: 'Calidad garantizada',
    text: 'Materiales certificados',
  },
  {
    icon: 'headset',
    title: 'Atención personalizada',
    text: 'Te ayudamos a elegir',
  },
  {
    icon: 'shield',
    title: 'Compra segura',
    text: 'Tus datos protegidos',
  },
]

function SiteFooter({ showBenefits = true }) {
  return (
    <footer className="site-footer" aria-label="Información de SquareStruct">
      {showBenefits && (
        <div className="site-benefits-footer">
          {footerBenefits.map((benefit) => (
            <article key={benefit.title}>
              <span><Icon name={benefit.icon} size={24} /></span>
              <div className="site-benefit-copy">
                <h2>{benefit.title}</h2>
                <p>{benefit.text}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="site-footer-copy">
        SquareStruct © 2026 · Proyecto académico de construcción modular desarrollado por Raúl Martín y Cristian Gil
      </p>
    </footer>
  )
}

export default SiteFooter
