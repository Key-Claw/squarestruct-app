import bloqueEcoImage from '../../assets/catalog/bloque-eco.webp'
import bloqueHormigonImage from '../../assets/catalog/bloque-hormigon.webp'
import pilarEcoImage from '../../assets/catalog/pilar-eco.webp'
import pilarHormigonImage from '../../assets/catalog/pilar-hormigon.webp'
import { useTranslation } from 'react-i18next'

const formatCatalogText = (value) => (
  String(value || '')
    .replace(/hormigon/gi, 'hormigón')
    .replace(/Hormigon/g, 'Hormigón')
)

const normalizeCatalogText = (value) => (
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
)

const getCatalogTypeLabel = (type, t) => {
  const normalizedType = normalizeCatalogText(type)

  if (normalizedType === 'bloque') return t('catalog.types.bloque')
  if (normalizedType === 'pilar') return t('catalog.types.pilar')
  return type || t('catalog.types.product')
}

const getCatalogProductImage = (product) => {
  const type = normalizeCatalogText(product.tipo)
  const material = normalizeCatalogText(product.material)
  const isPillar = type.includes('pilar')
  const isEco = material.includes('plastico') || material.includes('reciclable') || material.includes('eco')

  if (isPillar && isEco) return pilarEcoImage
  if (isPillar) return pilarHormigonImage
  if (isEco) return bloqueEcoImage
  return bloqueHormigonImage
}

function CatalogProductCard({ product, onAddProduct }) {
  const { t } = useTranslation()
  const tipo = getCatalogTypeLabel(product.tipo, t)
  const normalizedMaterial = normalizeCatalogText(product.material)
  const material = normalizedMaterial.includes('hormigon')
    ? t('catalog.materials.hormigon')
    : normalizedMaterial.includes('plastico') || normalizedMaterial.includes('reciclable') || normalizedMaterial.includes('eco')
      ? t('catalog.materials.eco')
      : formatCatalogText(product.material || t('catalog.card.noMaterial'))
  const descripcion = formatCatalogText(product.descripcion || t('catalog.card.noDescription'))
  const productImage = getCatalogProductImage(product)
  const dimensiones = [product.largo, product.ancho, product.alto]
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value > 0)
    .map((value) => `${value.toFixed(0)} cm`)
    .join(' x ')

  return (
    <article className="card h-100 catalog-product-card" id={`producto-${product.idProducto}`}>
      <div className="catalog-product-media">
        <img src={productImage} alt={product.nombre} />
        <span>{tipo}</span>
      </div>
      <div className="card-body">
        <span className="catalog-product-tag">{tipo}</span>
        <h2>{product.nombre}</h2>
        <p>{descripcion}</p>
        <strong className="catalog-product-price">
          {Number(product.precio).toFixed(2)} EUR
        </strong>
        <dl className="catalog-product-meta">
          <div>
            <dt>{t('catalog.card.material')}</dt>
            <dd>{material}</dd>
          </div>
          {dimensiones && (
            <div>
              <dt>{t('catalog.card.dimensions')}</dt>
              <dd>{dimensiones}</dd>
            </div>
          )}
        </dl>
        <div className="catalog-card-actions">
          <button
            type="button"
            className="btn catalog-add-btn"
            onClick={() => onAddProduct(product)}
          >
            {t('catalog.card.add')}
          </button>
        </div>
      </div>
    </article>
  )
}

export default CatalogProductCard

