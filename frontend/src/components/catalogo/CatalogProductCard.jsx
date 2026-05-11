function CatalogProductCard({ product, onAddProduct }) {
  return (
    <article className="card h-100 catalog-product-card" id={`producto-${product.idProducto}`}>
      <div className="catalog-product-media">
        <span>{product.tipo || 'Producto'}</span>
      </div>
      <div className="card-body">
        <span className="catalog-product-tag">{product.tipo || 'Producto'}</span>
        <h2>{product.nombre}</h2>
        <p>{product.descripcion || 'Sin descripcion disponible.'}</p>
        <strong className="catalog-product-price">
          {Number(product.precio).toFixed(2)} EUR
        </strong>
        <dl className="catalog-product-meta">
          <div>
            <dt>Material</dt>
            <dd>{product.material || 'Sin material'}</dd>
          </div>
          <div>
            <dt>Medidas</dt>
            <dd>
              {product.alto || product.ancho || product.largo
                ? `${product.alto} x ${product.ancho} x ${product.largo} cm`
                : 'Sin medidas'}
            </dd>
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
