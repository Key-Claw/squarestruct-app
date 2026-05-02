import { useEffect, useMemo, useState } from 'react'
import { getProductos, filtrarProductos } from '../services/productService'
import ProductsIntro from './Products'

/**
 * Corrige texto con mojibake típico de una mala decodificación UTF-8/latin1.
 * En catálogo solo lo aplicamos a textos que claramente vienen dañados.
 * @param {string} value - Texto a revisar.
 * @returns {string} Texto normalizado o el original.
 */
const normalizarTexto = (value) => {
  if (typeof value !== 'string' || !/[ÃÂ�]/.test(value)) {
    return value
  }

  try {
    const bytes = Uint8Array.from([...value].map((character) => character.charCodeAt(0)))
    return new TextDecoder('utf-8').decode(bytes)
  } catch {
    return value
  }
}

/**
 * Normaliza un producto para mostrar textos legibles en la tarjeta.
 * @param {object} product - Producto devuelto por la API.
 * @returns {object} Producto con campos de texto corregidos.
 */
const normalizarProducto = (product) => ({
  ...product,
  nombre: normalizarTexto(product.nombre),
  descripcion: normalizarTexto(product.descripcion),
  tipo: normalizarTexto(product.tipo)
})

function Catalogo({ onNavigate, searchTerm = '', initialSection = '' }) {
  // Productos cargados desde el backend.
  const [productos, setProductos] = useState([])
  // Estado de carga para mostrar feedback visual.
  const [cargando, setCargando] = useState(true)
  // Error visible si la API falla.
  const [error, setError] = useState('')
  // Búsqueda sincronizada con el navbar.
  const [busqueda, setBusqueda] = useState(searchTerm)

  /**
   * Carga los productos del backend al montar la página.
   */
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true)
        setError('')

        // La respuesta del backend debe ser un array de productos.
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

  /**
   * Mantiene sincronizada la búsqueda cuando llega desde el navbar.
   */
  useEffect(() => {
    if (initialSection === 'productos') {
      window.requestAnimationFrame(() => {
        document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }, [initialSection])

  /**
   * Limpia la búsqueda actual y vuelve a mostrar el catálogo completo.
   */
  const handleResetSearch = () => {
    setBusqueda('')
    onNavigate('catalogo', '')
  }

  const productosFiltrados = useMemo(() => {
    // El filtrado se hace en cliente para que la búsqueda sea inmediata.
    return filtrarProductos(busqueda, productos)
  }, [busqueda, productos])

  /**
   * Hace scroll al primer producto que coincide con la búsqueda.
   */
  useEffect(() => {
    if (!busqueda.trim() || productosFiltrados.length === 0) {
      return
    }

    // Cuando hay coincidencia, desplazamos la vista al primer resultado.
    const primerProducto = document.getElementById(`producto-${productosFiltrados[0].idProducto}`)
    primerProducto?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [busqueda, productosFiltrados])

  return (
    /* Bootstrap container-fluid ocupa todo el ancho disponible:
       https://getbootstrap.com/docs/5.3/layout/containers/ */
    <section className="page-shell container-fluid">
      <div className="mvp-hero catalog-hero">
        <p className="eyebrow">Catalogo conectado a la base de datos</p>
        <h1>Productos modulares para disenar tu plano</h1>
        <p>
          Bloques y pilares inspirados en sistemas de construccion modular,
          preparados para alimentar el futuro disenador.
        </p>
      </div>

      <ProductsIntro onNavigate={onNavigate} />

      {/* Bootstrap grid, columns, form-control and button:
          https://getbootstrap.com/docs/5.3/layout/grid/
          https://getbootstrap.com/docs/5.3/forms/form-control/
          https://getbootstrap.com/docs/5.3/components/buttons/ */}
      <div className="container-fluid mb-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            {/* Buscador interno del catálogo para refinar el listado sin salir de la página. */}
            <div className="d-flex gap-2 align-items-center catalog-search-row">
              <input
                type="text"
                className="form-control search-bar"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              {/* Botón para volver al catálogo completo después de filtrar. */}
              {busqueda.trim() && (
                <button
                  type="button"
                  className="btn btn-outline-dark catalog-back-button"
                  onClick={handleResetSearch}
                >
                  Volver
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {cargando && (
        <div className="text-center py-5 text-white">
          Cargando productos...
        </div>
      )}

      {error && (
        // Si la API falla, mostramos un aviso claro para no dejar la pantalla vacía.
        <div className="alert alert-danger text-center mx-3">
          {error}
        </div>
      )}

      {/* Grid de tarjetas con los productos devueltos por el backend. */}
      <div className="page-grid catalog-grid">
        {!cargando && !error && productosFiltrados.map((product) => (
          <article className="page-card" key={product.idProducto} id={`producto-${product.idProducto}`}>
            {/* Bloque superior pensado para una imagen, categoría o tipo de producto. */}
            <div className="page-card-media modular-media">
              {product.tipo || 'Producto'}
            </div>
            {/* Bloque inferior con los datos principales del artículo. */}
            <div className="page-card-body">
              <h3>{product.nombre}</h3>
              <p>{product.descripcion || 'Sin descripción disponible.'}</p>
              <p className="mt-2 mb-0">
                <strong>Precio:</strong> ${product.precio}
              </p>
              <p className="mb-0">
                <strong>Stock:</strong> {product.stock}
              </p>
              <p className="mb-0">
                <strong>Medidas:</strong> {product.alto} x {product.ancho} x {product.largo} cm
              </p>
            </div>
          </article>
        ))}
      </div>

      {!cargando && !error && productosFiltrados.length === 0 && (
        <div className="text-center text-white mt-4">
          No se encontraron productos con esa búsqueda.
        </div>
      )}

      {/* Acciones de retorno a otras páginas principales. */}
      <div className="page-actions">
        <button type="button" className="page-link-button" onClick={() => onNavigate('home')}>
          Home
        </button>
        <button type="button" className="page-link-button" onClick={() => onNavigate('galeria')}>
          Galería
        </button>
      </div>
          {/* PUBLICIDAD */}
      <div className="promo-band">
        OFERTA PUBLICITARIA
      </div>
    </section>
  )
}

export default Catalogo
