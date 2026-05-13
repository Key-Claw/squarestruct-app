import { useState } from 'react'

const materialTabs = ['Hormigón', 'ECO']

function CatalogFilters({ categorias, categoriaActiva, onSelectCategoria }) {
  const [activeMaterial, setActiveMaterial] = useState('Hormigón')

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
              key={material}
              type="button"
              className={`btn catalog-material-tab${activeMaterial === material ? ' active' : ''}`}
              onClick={() => setActiveMaterial(material)}
            >
              {material}
            </button>
          ))}
        </div>
      </section>

      <section className="card catalog-filter-card">
        <div className="card-header">Medidas (cm)</div>
        <div className="list-group list-group-flush">
          <button type="button" className="list-group-item list-group-item-action">Ancho</button>
          <button type="button" className="list-group-item list-group-item-action">Alto</button>
          <button type="button" className="list-group-item list-group-item-action">Largo</button>
        </div>
      </section>

      <section className="card catalog-filter-card">
        <div className="card-header">Rango de precio</div>
        <div className="card-body">
          <p>0-1000</p>
        </div>
      </section>

      <button type="button" className="btn catalog-apply-btn">
        Aplicar filtro
      </button>
    </aside>
  )
}

export default CatalogFilters
