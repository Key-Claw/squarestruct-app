import Icon from '../common/Icon'
import { useTranslation } from 'react-i18next'

function SiteFooter({ showBenefits = true }) {
  const { t } = useTranslation()
  const footerBenefits = [
    { icon: 'box', title: t('footer.benefits.shipping.title'), text: t('footer.benefits.shipping.text') },
    { icon: 'checkCircle', title: t('footer.benefits.quality.title'), text: t('footer.benefits.quality.text') },
    { icon: 'headset', title: t('footer.benefits.support.title'), text: t('footer.benefits.support.text') },
    { icon: 'shield', title: t('footer.benefits.secure.title'), text: t('footer.benefits.secure.text') },
  ]

  return (
    <footer className="site-footer" aria-label={t('footer.ariaLabel')}>
      {showBenefits && (
        <div className="site-benefits-footer">
          {footerBenefits.map((benefit) => (
            <article key={benefit.icon}>
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
        {t('footer.copy')}
      </p>
    </footer>
  )
}

export default SiteFooter
