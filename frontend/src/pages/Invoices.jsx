import { useEffect, useState } from 'react'
import Icon from '../components/ui/Icon'
import { obtenerMisPedidos } from '../services/orderService'
import '../styles/pages/facturas.css'

/**
 * Componente Facturas - Página donde los usuarios ven sus órdenes/facturas
 * 
 * Características:
 * - Muestra el historial de órdenes del usuario autenticado
 * - Estados visuales: Amarillo (Pendiente), Verde (Aceptada), Rojo (Denegada)
 * - Tabla con detalles de cada orden
 * - Información de método de pago, total y dirección de envío
 * - Manejo de errores y estados de carga
 */
function Invoices() {
  // ============================================================================
  // ESTADO DEL COMPONENTE
  // ============================================================================

  // Órdenes/facturas del usuario actual
  const [ordenes, setOrdenes] = useState([])
  
  // Estados de carga y error
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // ============================================================================
  // CARGA DE DATOS (useEffect)
  // ============================================================================

  /**
   * Obtiene todas las órdenes del usuario autenticado.
   */
  const cargarMisOrdenes = async () => {
    try {
      setIsLoading(true)
      setError('')
      const data = await obtenerMisPedidos()
      setOrdenes(data)
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al cargar tus órdenes'
      setError(mensaje)
      console.error('Error cargando órdenes:', err)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Carga las órdenes del usuario cuando el componente se monta.
   */
  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      void cargarMisOrdenes()
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [])

  // ============================================================================
  // FUNCIONES AUXILIARES
  // ============================================================================

  /**
   * Obtiene la clase CSS para el badge de estado.
   * @param {string} estado - Estado de la orden
   * @returns {string} Clase CSS correspondiente
   */
  const getEstadoClase = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return 'facturas-status pending'
      case 'aceptado':
        return 'facturas-status accepted'
      case 'denegado':
        return 'facturas-status rejected'
      default:
        return 'facturas-status'
    }
  }

  /**
   * Formatea una fecha a formato DD/MM/YYYY HH:MM
   * @param {string} dateString - Fecha en formato ISO
   * @returns {string} Fecha formateada
   */
  const formatearFecha = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const dia = String(date.getDate()).padStart(2, '0')
    const mes = String(date.getMonth() + 1).padStart(2, '0')
    const anio = date.getFullYear()
    const hora = String(date.getHours()).padStart(2, '0')
    const minutos = String(date.getMinutes()).padStart(2, '0')
    return `${dia}/${mes}/${anio} ${hora}:${minutos}`
  }

  /**
   * Obtiene el nombre del método de pago en español
   * @param {string} metodo - Método de pago
   * @returns {string} Nombre legible del método
   */
  const getNombreMetodoPago = (metodo) => {
    const metodos = {
      tarjeta: 'Tarjeta',
      transferencia: 'Transferencia',
      paypal: 'PayPal',
      efectivo: 'Efectivo'
    }
    return metodos[metodo?.toLowerCase()] || metodo
  }

  // ============================================================================
  // RENDERIZADO
  // ============================================================================

  return (
    <section className="facturas-page">
      {/* ENCABEZADO */}
      <header className="facturas-header">
        <div>
          <h1>Mis órdenes</h1>
          <p>Historial de todas tus compras y facturas</p>
        </div>
        <button 
          className="btn facturas-refresh-btn"
          onClick={cargarMisOrdenes}
          disabled={isLoading}
        >
          {isLoading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </header>

      {/* ALERTA DE ERROR */}
      {error && (
        <div className="facturas-alert facturas-alert-error">
          <span className="facturas-alert-icon"><Icon name="warning" size={18} /></span>
          <div>
            <strong>Error</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* TABLA DE ÓRDENES */}
      {isLoading ? (
        <div className="facturas-loading">
          <div className="facturas-spinner"></div>
          <p>Cargando tus órdenes...</p>
        </div>
      ) : ordenes.length === 0 ? (
        <div className="facturas-empty-state">
          <div className="facturas-empty-icon">📦</div>
          <h2>Aún no tienes órdenes</h2>
          <p>Cuando realices tu primera compra, aparecerá aquí.</p>
        </div>
      ) : (
        <div className="facturas-container">
          <div className="table-responsive">
            <table className="facturas-table">
              <thead>
                <tr>
                  <th>ID Orden</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Método de Pago</th>
                  <th>Dirección de Envío</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.map((orden) => (
                  <tr key={orden.idPedido} className={`facturas-row facturas-row-${orden.estado}`}>
                    {/* ID de la orden */}
                    <td className="facturas-id">
                      <strong>#{orden.idPedido}</strong>
                    </td>

                    {/* Fecha */}
                    <td className="facturas-fecha">
                      {formatearFecha(orden.fecha)}
                    </td>

                    {/* Total */}
                    <td className="facturas-total">
                      <strong className="facturas-amount">
                        {'\u20ac'}{parseFloat(orden.total).toFixed(2)}
                      </strong>
                    </td>

                    {/* Método de pago */}
                    <td className="facturas-metodo">
                      <span className="facturas-metodo-badge">
                        {getNombreMetodoPago(orden.metodoPago)}
                      </span>
                    </td>

                    {/* Dirección de envío */}
                    <td className="facturas-direccion">
                      <small title={orden.direccionEnvio}>
                        {orden.direccionEnvio.substring(0, 40)}...
                      </small>
                    </td>

                    {/* Estado */}
                    <td className="facturas-estado">
                      <span className={getEstadoClase(orden.estado)}>
                        {orden.estado ? orden.estado.charAt(0).toUpperCase() + orden.estado.slice(1) : 'Desconocido'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* LEYENDA DE ESTADOS */}
          <div className="facturas-legend">
            <div className="facturas-legend-item">
              <span className="facturas-legend-color pending"></span>
              <span>Pendiente: A la espera de aprobación</span>
            </div>
            <div className="facturas-legend-item">
              <span className="facturas-legend-color accepted"></span>
              <span>Aceptada: Orden aprobada</span>
            </div>
            <div className="facturas-legend-item">
              <span className="facturas-legend-color rejected"></span>
              <span>Denegada: Orden rechazada</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Invoices

