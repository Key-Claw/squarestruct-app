import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from '../components/common/Icon'
import CatalogFilters from '../components/catalog/CatalogFilters'
import CatalogProductCard from '../components/catalog/CatalogProductCard'
import catalogHeroImage from '../assets/catalog/catalog-hero.webp'
import { productosDemo } from '../data/productosDemo'
import { getProductos, filtrarProductos } from '../services/productService'
import { getCatalogDisplayName } from '../utils/catalogLocalization'
import { normalizarProducto } from '../utils/text'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n'

const CATALOG_VISIBLE_PRODUCTS = 8
const MATERIAL_ALL = 'todos'
const MATERIAL_HORMIGON = 'hormigon'

const normalizeCatalogText = (value) => (
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
)

const getCatalogTypeLabel = (type, t) => {
  const normalizedType = normalizeCatalogText(type)

  if (normalizedType === 'bloque') return t('catalog.types.bloque')
  if (normalizedType === 'pilar') return t('catalog.types.pilar')
  return type || t('catalog.types.product')
}

function Catalog({ onNavigate, onAddToCart, searchTerm = '', initialSection = '' }) {
  const { t } = useTranslation()
  const catalogLanguage = i18n.resolvedLanguage || i18n.language
  const resultsBarRef = useRef(null)
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState(searchTerm)
  const [categoriaActiva, setCategoriaActiva] = useState('todos')
  const [materialActivo, setMaterialActivo] = useState(MATERIAL_ALL)
  const [orden, setOrden] = useState('reciente')
  const [precioMax, setPrecioMax] = useState(null)
  const [paginaActiva, setPaginaActiva] = useState(1)
  const [viewMode, setViewMode] = useState('grid')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true)
        setError('')
        const data = await getProductos()
        setProductos(Array.isArray(data) ? data.map(normalizarProducto) : [])
      } catch (err) {
        setError(err.message || i18n.t('catalog.loading'))
      } finally {
        setCargando(false)
      }
    }

    cargarProductos()
  }, [catalogLanguage])

  useEffect(() => {
    if (initialSection === 'productos') {
      window.requestAnimationFrame(() => {
        document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }, [initialSection])

  const handleResetSearch = () => {
    setBusqueda('')
    setPaginaActiva(1)
    onNavigate('catalog', '')
  }

  const handleResetFilters = () => {
    setBusqueda('')
    setCategoriaActiva('todos')
    setMaterialActivo(MATERIAL_ALL)
    setOrden('reciente')
    setPrecioMax(null)
    setPaginaActiva(1)
  }

  const handleAddProduct = (product) => {
    if (typeof onAddToCart === 'function') {
      onAddToCart(product)
    }
  }

  const handleSearchChange = (event) => {
    setBusqueda(event.target.value)
    setPaginaActiva(1)
    window.requestAnimationFrame(() => {
      resultsBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const handleSelectCategoria = (categoryId) => {
    setCategoriaActiva(categoryId)
    setPaginaActiva(1)
  }

  const handleSelectMaterial = (materialId) => {
    setMaterialActivo(materialId)
    setPaginaActiva(1)
  }

  const handlePriceMaxChange = (nextPrice) => {
    setPrecioMax(nextPrice)
    setPaginaActiva(1)
  }

  const handleOrderChange = (event) => {
    setOrden(event.target.value)
    setPaginaActiva(1)
  }

  const productosCatalogo = useMemo(() => (
    (productos.length > 0 ? productos : productosDemo)
      .filter((product) => product.tipo?.toLowerCase() !== 'plano')
      .map((product) => ({
        ...product,
        nombreOriginal: product.nombre,
        nombre: getCatalogDisplayName(product.nombre, catalogLanguage) || product.nombre,
      }))
  ), [catalogLanguage, productos])

  const categorias = useMemo(() => {
    const resumen = productosCatalogo.reduce((acc, product) => {
      const tipo = product.tipo || 'Producto'
      acc[tipo] = (acc[tipo] || 0) + 1
      return acc
    }, {})

    return [
      { id: 'todos', label: t('catalog.materials.all'), count: productosCatalogo.length },
      ...Object.entries(resumen).map(([label, count]) => ({
        id: normalizeCatalogText(label),
        label: getCatalogTypeLabel(label, t),
        count,
      })),
    ]
  }, [productosCatalogo, t])

  const precioMaxCatalogo = Math.max(1, ...productosCatalogo.map((product) => Number(product.precio) || 0))
  const precioMaxActivo = precioMax ?? Math.ceil(precioMaxCatalogo)

  const productosFiltrados = useMemo(() => {
    const resultadoBusqueda = filtrarProductos(busqueda, productosCatalogo)
    const resultadoCategoria = categoriaActiva === 'todos'
      ? resultadoBusqueda
      : resultadoBusqueda.filter((product) => product.tipo?.toLowerCase() === categoriaActiva)
    const resultadoMaterial = resultadoCategoria.filter((product) => {
      if (materialActivo === MATERIAL_ALL) {
        return true
      }

      const material = normalizeCatalogText(product.material)

      if (materialActivo === MATERIAL_HORMIGON) {
        return material.includes('hormigon')
      }

      return material.includes('plastico')
        || material.includes('reciclable')
        || material.includes('eco')
    })
    const resultadoPrecio = resultadoMaterial.filter((product) => Number(product.precio || 0) <= precioMaxActivo)

    return [...resultadoPrecio].sort((a, b) => {
      if (orden === 'precio-menor') {
        return Number(a.precio) - Number(b.precio)
      }

      if (orden === 'precio-mayor') {
        return Number(b.precio) - Number(a.precio)
      }

      return Number(b.idProducto) - Number(a.idProducto)
    })
  }, [busqueda, categoriaActiva, materialActivo, orden, productosCatalogo, precioMaxActivo])

  const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / CATALOG_VISIBLE_PRODUCTS))
  const paginaSegura = Math.min(paginaActiva, totalPaginas)

  const productosVisibles = useMemo(() => {
    const startIndex = (paginaSegura - 1) * CATALOG_VISIBLE_PRODUCTS
    return productosFiltrados.slice(startIndex, startIndex + CATALOG_VISIBLE_PRODUCTS)
  }, [paginaSegura, productosFiltrados])

  useEffect(() => {
    if (!mobileFiltersOpen) {
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setMobileFiltersOpen(false)
      }
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileFiltersOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    window.addEventListener('resize', handleResize)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
      window.removeEventListener('resize', handleResize)
    }
  }, [mobileFiltersOpen])

  return (
    <section className="page-shell catalog-page container-fluid">
      <header className="card catalog-heading">
        <div className="catalog-heading-copy">
          <div className="catalog-heading-title">
            <p className="catalog-eyebrow">{t('catalog.eyebrow')}</p>
            <h1>{t('catalog.title')}</h1>
          </div>
          <div className="catalog-heading-text">
            <p>{t('catalog.intro')}</p>
          </div>
        </div>
        <div className="catalog-heading-media" aria-hidden="true">
          <img src={catalogHeroImage} alt="" />
        </div>
      </header>

      <button
        type="button"
        className="btn catalog-mobile-filters-toggle d-md-none"
        onClick={() => setMobileFiltersOpen(true)}
        aria-expanded={mobileFiltersOpen}
        aria-controls="catalogFilters"
      >
        {t('catalog.openFilters')}
      </button>

      <div
        className={`catalog-mobile-filters-backdrop d-md-none${mobileFiltersOpen ? ' is-open' : ''}`}
        onClick={() => setMobileFiltersOpen(false)}
        aria-hidden={!mobileFiltersOpen}
      ></div>

      <div className="row g-4 align-items-start">
          <CatalogFilters
            id="catalogFilters"
            categorias={categorias}
            categoriaActiva={categoriaActiva}
            onSelectCategoria={handleSelectCategoria}
            materialActivo={materialActivo}
            onSelectMaterial={handleSelectMaterial}
            maxCatalogPrice={precioMaxCatalogo}
            priceMax={precioMaxActivo}
            onPriceMaxChange={handlePriceMaxChange}
            onResetFilters={handleResetFilters}
            isMobileOpen={mobileFiltersOpen}
            onCloseMobile={() => setMobileFiltersOpen(false)}
          />

          <div className="col-12 col-md-9 col-xl-10 catalog-content">
            <div className="card catalog-results-bar" ref={resultsBarRef}>
              <div className="catalog-results-count">
                {t('catalog.results', { count: productosFiltrados.length })}
              </div>

              <div className="d-flex gap-2 catalog-results-actions">
                <input
                  type="text"
                  className="form-control catalog-search-input"
                  placeholder={t('catalog.searchPlaceholder')}
                  value={busqueda}
                  onChange={handleSearchChange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                    }
                  }}
                />

                {busqueda.trim() && (
                  <button
                    type="button"
                    className="btn btn-outline-dark catalog-back-button"
                    onClick={handleResetSearch}
                  >
                    {t('catalog.resetSearch')}
                  </button>
                )}

                <span>{t('catalog.sortBy')}</span>
                <select
                  className="form-select catalog-sort-select"
                  aria-label={t('catalog.sortAria')}
                  value={orden}
                  onChange={handleOrderChange}
                >
                  <option value="reciente">{t('catalog.sort.recent')}</option>
                  <option value="precio-menor">{t('catalog.sort.priceLow')}</option>
                  <option value="precio-mayor">{t('catalog.sort.priceHigh')}</option>
                </select>

                <button
                  type="button"
                  className={`btn catalog-view-btn${viewMode === 'grid' ? ' active' : ''}`}
                  aria-label={t('catalog.viewGrid')}
                  aria-pressed={viewMode === 'grid'}
                  onClick={() => setViewMode('grid')}
                >
                  <Icon name="grid" size={17} />
                </button>
                <button
                  type="button"
                  className={`btn catalog-view-btn${viewMode === 'list' ? ' active' : ''}`}
                  aria-label={t('catalog.viewList')}
                  aria-pressed={viewMode === 'list'}
                  onClick={() => setViewMode('list')}
                >
                  <Icon name="list" size={17} />
                </button>
              </div>
            </div>

            {cargando && (
              <div className="text-center py-5 catalog-state">
                {t('catalog.loading')}
              </div>
            )}

            {error && (
              <div className="alert alert-warning catalog-demo-alert text-center">
                {t('catalog.demoError')}
              </div>
            )}

            <div className={`row g-4 catalog-products-grid${viewMode === 'list' ? ' catalog-products-list' : ''}`} id="productos">
              {!cargando && productosVisibles.map((product) => (
                <div className={viewMode === 'list' ? 'col-12' : 'col-12 col-sm-6 col-xl-3'} key={product.idProducto}>
                  <CatalogProductCard product={product} onAddProduct={handleAddProduct} />
                </div>
              ))}
            </div>

            {!cargando && productosFiltrados.length === 0 && (
              <div className="text-center catalog-state mt-4">
                {t('catalog.empty')}
              </div>
            )}

            {!cargando && productosFiltrados.length > CATALOG_VISIBLE_PRODUCTS && (
              <nav className="catalog-pagination" aria-label={t('catalog.pagination')}>
                <ul className="pagination pagination-sm">
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


