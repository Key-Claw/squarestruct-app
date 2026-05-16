const materialTabs = [
  { id: 'Hormigon', label: 'Hormigón' },
  { id: 'ECO', label: 'ECO' },
]

function CatalogFilters({
  categorias,
  categoriaActiva,
  onSelectCategoria,
  materialActivo,
  onSelectMaterial,
  maxCatalogPrice,
  priceMax,
  onPriceMaxChange,
  onResetFilters,
}) {
  const safeMaxPrice = Math.max(1, Math.ceil(Number(maxCatalogPrice) || 1000))
  const safePriceMax = Math.min(Number(priceMax) || safeMaxPrice, safeMaxPrice)

  return (
    <aside className="col-12 col-lg-2 catalog-sidebar">
      <button type="button" className="btn catalog-filter-title">
        Filtros
      </button>

      <section className="card catalog-filter-card">
        <div className="card-header">Categoria</div>
        <div className="list-group list-group-flush">
          {categorias.map((category) => (
            <button
              type="button"
              className={`list-group-item list-group-item-action ${categoriaActiva === category.id ? 'active' : ''}`}
              key={category.id}
              onClick={() => onSelectCategoria(category.id)}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </section>

      <section className="card catalog-filter-card catalog-material-card">
        <div className="card-header">Material</div>
        <div className="card-body catalog-material-tabs" role="tablist" aria-label="Material del producto">
          {materialTabs.map((material) => (
            <button
              key={material.id}
              type="button"
              className={`btn catalog-material-tab${materialActivo === material.id ? ' active' : ''}`}
              onClick={() => onSelectMaterial(material.id)}
            >
              {material.label}
            </button>
          ))}
        </div>
      </section>

      <section className="card catalog-filter-card">
        <div className="card-header">Rango de precio</div>
        <div className="card-body catalog-price-filter">
          <div className="catalog-price-values">
            <span>0 EUR</span>
            <strong>{safePriceMax} EUR</strong>
          </div>
          <input
            type="range"
            className="form-range catalog-price-range"
            min="0"
            max={safeMaxPrice}
            step="1"
            value={safePriceMax}
            onChange={(event) => onPriceMaxChange(Number(event.target.value))}
            aria-label="Rango maximo de precio"
          />
        </div>
      </section>

      <button type="button" className="btn catalog-reset-btn" onClick={onResetFilters}>
        Desactivar filtros
      </button>
    </aside>
  )
}

export default CatalogFilters
