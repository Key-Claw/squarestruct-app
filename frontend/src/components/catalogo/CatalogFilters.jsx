function CatalogFilters({ categorias, categoriaActiva, onSelectCategoria }) {
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

      <section className="card catalog-filter-card">
        <div className="card-header">Tipo de bloque</div>
        <div className="card-body catalog-check-list">
          <label><input type="checkbox" /> Estructural</label>
          <label><input type="checkbox" /> Esquina</label>
          <label><input type="checkbox" /> Refuerzo</label>
          <label><input type="checkbox" /> Decorativo</label>
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
        <div className="card-header">Material</div>
        <div className="card-body catalog-check-list">
          <label><input type="checkbox" /> Hormigon</label>
          <label><input type="checkbox" /> Fibrocemento</label>
          <label><input type="checkbox" /> Mixto</label>
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
