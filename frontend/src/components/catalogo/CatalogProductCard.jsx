import bloqueEcoImage from '../../assets/catalog/bloque-eco.jpeg'
import bloqueHormigonImage from '../../assets/catalog/bloque-hormigon.jpeg'
import pilarEcoImage from '../../assets/catalog/pilar-eco.jpeg'
import pilarHormigonImage from '../../assets/catalog/pilar-hormigon.jpeg'

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
  const tipo = formatCatalogText(product.tipo || 'Producto')
  const material = formatCatalogText(product.material || 'Sin material')
  const descripcion = formatCatalogText(product.descripcion || 'Sin descripcion disponible.')
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
            <dt>Material</dt>
            <dd>{material}</dd>
          </div>
          {dimensiones && (
            <div>
              <dt>Dimensiones</dt>
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
            Anadir
          </button>
        </div>
      </div>
    </article>
  )
}

export default CatalogProductCard
