import { useTranslation } from 'react-i18next'

const materialTabs = [
  { id: 'hormigon', labelKey: 'catalog.materials.hormigon' },
  { id: 'eco', labelKey: 'catalog.materials.eco' },
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
  isMobileOpen = false,
  onCloseMobile,
  ...asideProps
}) {
  const { t } = useTranslation()
  const safeMaxPrice = Math.max(1, Math.ceil(Number(maxCatalogPrice) || 1000))
  const safePriceMax = Math.min(Number(priceMax) || safeMaxPrice, safeMaxPrice)

  return (
    <aside
      className={`col-12 col-md-3 col-xl-2 catalog-sidebar${isMobileOpen ? ' is-mobile-open' : ''}`}
      {...asideProps}
    >
      <button
        type="button"
        className="btn catalog-mobile-filters-close d-md-none"
        onClick={onCloseMobile}
        aria-label={t('catalog.filters.close')}
      >
        {t('catalog.filters.close')}
      </button>

      <button type="button" className="btn catalog-filter-title">
        {t('catalog.filters.title')}
      </button>

      <section className="card catalog-filter-card">
        <div className="card-header">{t('catalog.filters.category')}</div>
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
        <div className="card-header">{t('catalog.filters.material')}</div>
        <div className="card-body catalog-material-tabs" role="tablist" aria-label={t('catalog.filters.materialAria')}>
          {materialTabs.map((material) => (
            <button
              key={material.id}
              type="button"
              className={`btn catalog-material-tab${materialActivo === material.id ? ' active' : ''}`}
              onClick={() => onSelectMaterial(material.id)}
            >
              {t(material.labelKey)}
            </button>
          ))}
        </div>
      </section>

      <section className="card catalog-filter-card">
        <div className="card-header">{t('catalog.filters.priceRange')}</div>
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
            aria-label={t('catalog.filters.priceAria')}
          />
        </div>
      </section>

      <button type="button" className="btn catalog-reset-btn" onClick={onResetFilters}>
        {t('catalog.filters.reset')}
      </button>
    </aside>
  )
}

export default CatalogFilters
