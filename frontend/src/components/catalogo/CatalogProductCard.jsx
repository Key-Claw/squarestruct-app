const formatCatalogText = (value) => (
  String(value || '')
    .replace(/hormigon/gi, 'hormigón')
    .replace(/Hormigon/g, 'Hormigón')
)

function CatalogProductCard({ product, onAddProduct }) {
  const tipo = formatCatalogText(product.tipo || 'Producto')
  const material = formatCatalogText(product.material || 'Sin material')
  const descripcion = formatCatalogText(product.descripcion || 'Sin descripcion disponible.')

  return (
    <article className="card h-100 catalog-product-card" id={`producto-${product.idProducto}`}>
      <div className="catalog-product-media">
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
        </dl>
        <div className="catalog-card-actions">
          <button type="button" className="btn catalog-detail-btn">
            Ver detalle
          </button>
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
