function ProductsIntro({ onNavigate }) {
  return (
    /* Bootstrap button en esta seccion:
       https://getbootstrap.com/docs/5.3/components/buttons/ */
    <section className="page-block products-intro" id="productos">
      <div>
        <p className="eyebrow">Producto destacado</p>
        <h2>Bloque ByFusion para construccion modular</h2>
        <p>
          En el MVP, los productos representan bloques y pilares disponibles
          para crear muros, cerramientos y futuras composiciones en Design.
        </p>
      </div>

      <div className="product-specs">
        <span>Tipo: bloque / pilar</span>
        <span>Datos: precio, stock y dimensiones</span>
        <span>Proveedor: ByFusion</span>
      </div>

      <button type="button" className="btn btn-outline-light" onClick={() => onNavigate('galeria')}>
        Ver aplicaciones
      </button>
    </section>
  )
}

export default ProductsIntro
