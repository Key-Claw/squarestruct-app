import { useEffect, useMemo, useState } from 'react'
import { getProductos, filtrarProductos } from '../services/productService'

const normalizarTexto = (value) => {
  if (typeof value !== 'string' || !/[ÃƒÃ‚ï¿½]/.test(value)) {
    return value
  }

  try {
    const bytes = Uint8Array.from([...value].map((character) => character.charCodeAt(0)))
    return new TextDecoder('utf-8').decode(bytes)
  } catch {
    return value
  }
}

const normalizarProducto = (product) => ({
  ...product,
  nombre: normalizarTexto(product.nombre),
  descripcion: normalizarTexto(product.descripcion),
  tipo: normalizarTexto(product.tipo),
  material: normalizarTexto(product.material)
})

const productosDemo = [
  {
    idProducto: 901,
    nombre: 'Bloque EcoBase',
    descripcion: 'Bloque ligero de plastico reciclable para primeras hiladas y tramos medios de muro modular.',
    tipo: 'Bloque',
    material: 'Plastico reciclable',
    proveedor: 'Plasticos renovables ByFusion',
    precio: 42.5,
    alto: 22.7,
    ancho: 19.7,
    largo: 39.4
  },
  {
    idProducto: 902,
    nombre: 'Bloque EcoPlano',
    descripcion: 'Bloque de plastico reciclable con superficie plana para remates superiores y zonas bajo huecos.',
    tipo: 'Bloque',
    material: 'Plastico reciclable',
    proveedor: 'Plasticos renovables ByFusion',
    precio: 41,
    alto: 20.3,
    ancho: 19.7,
    largo: 39.4
  },
  {
    idProducto: 903,
    nombre: 'Bloque EcoUnion',
    descripcion: 'Bloque de plastico reciclable para encuentros, huecos de ventana y transiciones escalonadas.',
    tipo: 'Bloque',
    material: 'Plastico reciclable',
    proveedor: 'Plasticos renovables ByFusion',
    precio: 44,
    alto: 22.7,
    ancho: 19.7,
    largo: 39.4
  },
  {
    idProducto: 904,
    nombre: 'Columna EcoStruct 120',
    descripcion: 'Columna modular de plastico reciclable para muros, particiones y cerramientos ligeros.',
    tipo: 'Pilar',
    material: 'Plastico reciclable',
    proveedor: 'Plasticos renovables ByFusion',
    precio: 180,
    alto: 120,
    ancho: 39.4,
    largo: 39.4
  },
  {
    idProducto: 905,
    nombre: 'Columna EcoStruct 180',
    descripcion: 'Columna alta de plastico reciclable para puntos de refuerzo en cerramientos modulares.',
    tipo: 'Pilar',
    material: 'Plastico reciclable',
    proveedor: 'Plasticos renovables ByFusion',
    precio: 258,
    alto: 180,
    ancho: 39.4,
    largo: 39.4
  },
  {
    idProducto: 906,
    nombre: 'Columna EcoCorner',
    descripcion: 'Pilar de plastico reciclable pensado para esquinas, encuentros y cambios de direccion.',
    tipo: 'Pilar',
    material: 'Plastico reciclable',
    proveedor: 'Plasticos renovables ByFusion',
    precio: 195,
    alto: 120,
    ancho: 39.4,
    largo: 39.4
  },
  {
    idProducto: 907,
    nombre: 'Bloque H80 Max',
    descripcion: 'Bloque de hormigon de gran formato para muros de contencion de tierras y cargas exigentes.',
    tipo: 'Bloque',
    material: 'Hormigon',
    proveedor: 'Hormigon Forpol Group',
    precio: 152,
    alto: 80,
    ancho: 80,
    largo: 160
  },
  {
    idProducto: 908,
    nombre: 'Pilar H80 Refuerzo',
    descripcion: 'Pilar de hormigon pesado para refuerzo vertical en muros de contencion y zonas de carga.',
    tipo: 'Pilar',
    material: 'Hormigon',
    proveedor: 'Hormigon Forpol Group',
    precio: 210,
    alto: 160,
    ancho: 80,
    largo: 80
  },
  {
    idProducto: 909,
    nombre: 'Bloque H60 Max',
    descripcion: 'Bloque de hormigon para separadores de aridos, desechos y materiales a granel.',
    tipo: 'Bloque',
    material: 'Hormigon',
    proveedor: 'Hormigon Forpol Group',
    precio: 168,
    alto: 60,
    ancho: 60,
    largo: 240
  },
  {
    idProducto: 910,
    nombre: 'Pilar H60 Modular',
    descripcion: 'Pilar de hormigon para apoyo intermedio en separadores de materiales y muros industriales.',
    tipo: 'Pilar',
    material: 'Hormigon',
    proveedor: 'Hormigon Forpol Group',
    precio: 148,
    alto: 120,
    ancho: 60,
    largo: 60
  },
  {
    idProducto: 911,
    nombre: 'Bloque H40 Cerramiento',
    descripcion: 'Bloque de hormigon para vallas y cerramientos perimetrales sin contencion de tierras.',
    tipo: 'Bloque',
    material: 'Hormigon',
    proveedor: 'Hormigon Forpol Group',
    precio: 112,
    alto: 80,
    ancho: 40,
    largo: 160
  },
  {
    idProducto: 912,
    nombre: 'Pilar H40 Cerramiento',
    descripcion: 'Pilar de hormigon para esquinas y remates en vallas y cerramientos perimetrales.',
    tipo: 'Pilar',
    material: 'Hormigon',
    proveedor: 'Hormigon Forpol Group',
    precio: 98,
    alto: 120,
    ancho: 40,
    largo: 80
  }
]

function Catalogo({ onNavigate, searchTerm = '', initialSection = '' }) {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState(searchTerm)
  const [categoriaActiva, setCategoriaActiva] = useState('todos')
  const [orden, setOrden] = useState('reciente')

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true)
        setError('')
        const data = await getProductos()
        setProductos(Array.isArray(data) ? data.map(normalizarProducto) : [])
      } catch (err) {
        setError(err.message || 'No se pudieron cargar los productos')
      } finally {
        setCargando(false)
      }
    }

    cargarProductos()
  }, [])

  useEffect(() => {
    if (initialSection === 'productos') {
      window.requestAnimationFrame(() => {
        document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }, [initialSection])

  const handleResetSearch = () => {
    setBusqueda('')
    onNavigate('catalogo', '')
  }

  const productosCatalogo = useMemo(() => (
    (productos.length > 0 ? productos : productosDemo)
      .filter((product) => product.tipo?.toLowerCase() !== 'plano')
  ), [productos])

  const categorias = useMemo(() => {
    const resumen = productosCatalogo.reduce((acc, product) => {
      const tipo = product.tipo || 'Producto'
      acc[tipo] = (acc[tipo] || 0) + 1
      return acc
    }, {})

    return [
      { id: 'todos', label: 'Todos los productos', count: productosCatalogo.length },
      ...Object.entries(resumen).map(([label, count]) => ({
        id: label.toLowerCase(),
        label,
        count
      }))
    ]
  }, [productosCatalogo])

  const productosFiltrados = useMemo(() => {
    const resultadoBusqueda = filtrarProductos(busqueda, productosCatalogo)
    const resultadoCategoria = categoriaActiva === 'todos'
      ? resultadoBusqueda
      : resultadoBusqueda.filter((product) => product.tipo?.toLowerCase() === categoriaActiva)

    return [...resultadoCategoria].sort((a, b) => {
      if (orden === 'precio-menor') {
        return Number(a.precio) - Number(b.precio)
      }

      if (orden === 'precio-mayor') {
        return Number(b.precio) - Number(a.precio)
      }

      return Number(b.idProducto) - Number(a.idProducto)
    })
  }, [busqueda, categoriaActiva, orden, productosCatalogo])

  useEffect(() => {
    if (!busqueda.trim() || productosFiltrados.length === 0) {
      return
    }

    const primerProducto = document.getElementById(`producto-${productosFiltrados[0].idProducto}`)
    primerProducto?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [busqueda, productosFiltrados])

  return (
    <section className="page-shell catalog-page container-fluid">
      <header className="catalog-heading">
        <h1>Catalogo de productos</h1>
        <p>Encuentra los bloques modulares, pilares y accesorios que necesitas para tu proyecto.</p>
      </header>

      <div className="row g-4 align-items-start">
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
                  onClick={() => setCategoriaActiva(category.id)}
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

        <div className="col-12 col-lg-10 catalog-content">
          <div className="card catalog-results-bar">
            <div className="catalog-results-count">
              {productosFiltrados.length} productos encontrados
            </div>

            <div className="d-flex gap-2 align-items-center catalog-results-actions">
              <input
                type="text"
                className="form-control catalog-search-input"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              {busqueda.trim() && (
                <button
                  type="button"
                  className="btn btn-outline-dark catalog-back-button"
                  onClick={handleResetSearch}
                >
                  Volver
                </button>
              )}

              <span>Ordenar por:</span>
              <select
                className="form-select catalog-sort-select"
                aria-label="Ordenar catalogo"
                value={orden}
                onChange={(event) => setOrden(event.target.value)}
              >
                <option value="reciente">Mas reciente</option>
                <option value="precio-menor">Precio menor</option>
                <option value="precio-mayor">Precio mayor</option>
              </select>

              <button type="button" className="btn catalog-view-btn active" aria-label="Vista cuadricula">
                ▦
              </button>
              <button type="button" className="btn catalog-view-btn" aria-label="Vista lista">
                ≡
              </button>
            </div>
          </div>

          {cargando && (
            <div className="text-center py-5 catalog-state">
              Cargando productos...
            </div>
          )}

          {error && (
            <div className="alert alert-warning catalog-demo-alert text-center">
              No se pudo conectar con la base de datos. Mostrando productos provisionales.
            </div>
          )}

          <div className="row g-4 catalog-products-grid" id="productos">
            {!cargando && productosFiltrados.map((product) => (
              <div className="col-12 col-sm-6 col-xl-3" key={product.idProducto}>
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
                      <button type="button" className="btn catalog-add-btn">
                        Anadir
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>

          {!cargando && productosFiltrados.length === 0 && (
            <div className="text-center catalog-state mt-4">
              No se encontraron productos con esa busqueda.
            </div>
          )}

          <nav className="catalog-pagination" aria-label="Paginacion catalogo">
            <ul className="pagination pagination-sm justify-content-end">
              <li className="page-item active"><button className="page-link" type="button">1</button></li>
              <li className="page-item"><button className="page-link" type="button">2</button></li>
              <li className="page-item"><button className="page-link" type="button">3</button></li>
            </ul>
          </nav>
        </div>
      </div>

    </section>
  )
}

export default Catalogo
