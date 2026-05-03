import { useEffect, useMemo, useState } from 'react'
import { getProductos, filtrarProductos } from '../services/productService'

function Catalogo({ onNavigate, searchTerm = '' }) {
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
        setProductos(Array.isArray(data) ? data : [])
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
    setBusqueda(searchTerm)
  }, [searchTerm])

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
    <section className="page-shell">
      <div className="bg-dark text-white p-5 mb-4 rounded text-center">
        <div>
          <h1>Catálogo</h1>
          <p>
            Aquí se muestran los productos reales que vienen del backend.
          </p>
        </div>
      </div>

      <div className="container mb-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            {/* Buscador interno del catálogo para refinar el listado sin salir de la página. */}
            <input
              type="text"
              className="form-control search-bar"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
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
      <div className="page-grid">
        {!cargando && !error && productosFiltrados.map((product) => (
          <article className="page-card" key={product.idProducto} id={`producto-${product.idProducto}`}>
            {/* Bloque superior pensado para una imagen, categoría o tipo de producto. */}
            <div className="page-card-media">
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
      <div className="bg-success text-white text-center p-3 mt-4">
        OFERTA PUBLICITARIA
      </div>
    </section>
  )
}

export default Catalogo