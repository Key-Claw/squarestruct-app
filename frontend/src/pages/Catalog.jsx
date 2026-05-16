import { useEffect, useMemo, useState } from 'react'
import Icon from '../components/ui/Icon'
import CatalogFilters from '../components/catalogo/CatalogFilters'
import CatalogProductCard from '../components/catalogo/CatalogProductCard'
import inicioCatalogoImage from '../assets/inicio/inicio-catalogo.jpeg'
import { productosDemo } from '../data/productosDemo'
import { getProductos, filtrarProductos } from '../services/productService'
import { normalizarProducto } from '../utils/text'

const CATALOG_VISIBLE_PRODUCTS = 4

function Catalog({ onNavigate, onAddToCart, searchTerm = '', initialSection = '' }) {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState(searchTerm)
  const [categoriaActiva, setCategoriaActiva] = useState('todos')
  const [orden, setOrden] = useState('reciente')
  const [precioMax, setPrecioMax] = useState(1000)
  const [paginaActiva, setPaginaActiva] = useState(1)

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
    onNavigate('catalog', '')
  }

  const handleAddProduct = (product) => {
    if (typeof onAddToCart === 'function') {
      onAddToCart(product)
    }
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
        count,
      })),
    ]
  }, [productosCatalogo])

  const precioMaxCatalogo = useMemo(() => (
    Math.max(1, ...productosCatalogo.map((product) => Number(product.precio) || 0))
  ), [productosCatalogo])

  useEffect(() => {
    setPrecioMax(Math.ceil(precioMaxCatalogo))
  }, [precioMaxCatalogo])

  const productosFiltrados = useMemo(() => {
    const resultadoBusqueda = filtrarProductos(busqueda, productosCatalogo)
    const resultadoCategoria = categoriaActiva === 'todos'
      ? resultadoBusqueda
      : resultadoBusqueda.filter((product) => product.tipo?.toLowerCase() === categoriaActiva)
    const resultadoPrecio = resultadoCategoria.filter((product) => Number(product.precio || 0) <= precioMax)

    return [...resultadoPrecio].sort((a, b) => {
      if (orden === 'precio-menor') {
        return Number(a.precio) - Number(b.precio)
      }

      if (orden === 'precio-mayor') {
        return Number(b.precio) - Number(a.precio)
      }

      return Number(b.idProducto) - Number(a.idProducto)
    })
  }, [busqueda, categoriaActiva, orden, productosCatalogo, precioMax])

  const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / CATALOG_VISIBLE_PRODUCTS))
  const paginaSegura = Math.min(paginaActiva, totalPaginas)

  const productosVisibles = useMemo(() => {
    const startIndex = (paginaSegura - 1) * CATALOG_VISIBLE_PRODUCTS
    return productosFiltrados.slice(startIndex, startIndex + CATALOG_VISIBLE_PRODUCTS)
  }, [paginaSegura, productosFiltrados])

  useEffect(() => {
    setPaginaActiva(1)
  }, [busqueda, categoriaActiva, orden, precioMax])

  useEffect(() => {
    if (!busqueda.trim() || productosFiltrados.length === 0) {
      return
    }

    const primerProducto = document.getElementById(`producto-${productosFiltrados[0].idProducto}`)
    primerProducto?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [busqueda, productosFiltrados])

  return (
    <section className="page-shell catalog-page container-fluid">
      <header className="card catalog-heading">
        <div className="catalog-heading-copy">
          <h1>Catalogo de productos</h1>
          <p>Encuentra bloques modulares, pilares y accesorios para tu proyecto.</p>
        </div>
        <div className="catalog-heading-media" aria-hidden="true">
          <img src={inicioCatalogoImage} alt="" />
        </div>
      </header>

      <div className="row g-4 align-items-start">
          <CatalogFilters
            categorias={categorias}
            categoriaActiva={categoriaActiva}
            onSelectCategoria={setCategoriaActiva}
            maxCatalogPrice={precioMaxCatalogo}
            priceMax={precioMax}
            onPriceMaxChange={setPrecioMax}
          />

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
                  <Icon name="grid" size={17} />
                </button>
                <button type="button" className="btn catalog-view-btn" aria-label="Vista lista">
                  <Icon name="list" size={17} />
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
              {!cargando && productosVisibles.map((product) => (
                <div className="col-12 col-sm-6 col-xl-3" key={product.idProducto}>
                  <CatalogProductCard product={product} onAddProduct={handleAddProduct} />
                </div>
              ))}
            </div>

            {!cargando && productosFiltrados.length === 0 && (
              <div className="text-center catalog-state mt-4">
                No se encontraron productos con esa busqueda.
              </div>
            )}

            {!cargando && productosFiltrados.length > CATALOG_VISIBLE_PRODUCTS && (
              <nav className="catalog-pagination" aria-label="Paginacion catalogo">
                <ul className="pagination pagination-sm justify-content-end">
                  {Array.from({ length: totalPaginas }, (_, index) => index + 1).map((pageNumber) => (
                    <li className={`page-item${pageNumber === paginaSegura ? ' active' : ''}`} key={pageNumber}>
                      <button
                        className="page-link"
                        type="button"
                        onClick={() => setPaginaActiva(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
      </div>
    </section>
  )
}

export default Catalog
