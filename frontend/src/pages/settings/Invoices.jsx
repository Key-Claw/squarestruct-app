import { useCallback, useEffect, useState } from 'react'
import Icon from '../../components/common/Icon'
import { obtenerMisPedidos } from '../../services/orderService'
import '../../styles/pages/settings/invoices.css'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
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
  const cargarMisOrdenes = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')
      const data = await obtenerMisPedidos()
      setOrdenes(data)
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : t('orders.loadError')
      setError(mensaje)
      console.error('Error cargando órdenes:', err)
    } finally {
      setIsLoading(false)
    }
  }, [t])

  /**
   * Carga las órdenes del usuario cuando el componente se monta.
   */
  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      void cargarMisOrdenes()
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [cargarMisOrdenes])

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
  const getNombreMetodoPago = (metodo, metodoLabel) => {
    if (!metodo) return metodoLabel || 'N/A'

    const key = `orders.payment.${metodo.toLowerCase()}`
    const translated = t(key)

    return translated === key ? (metodoLabel || metodo) : translated
  }

  const getEstadoLabel = (estado, estadoLabel) => {
    if (!estado) return estadoLabel || t('common.unknown')

    const key = `orders.status.${estado}`
    const translated = t(key)

    return translated === key ? (estadoLabel || estado) : translated
  }

  // ============================================================================
  // RENDERIZADO
  // ============================================================================

  return (
    <section className="facturas-page">
      {/* ENCABEZADO */}
      <header className="facturas-header">
        <div>
          <h1>{t('orders.title')}</h1>
          <p>{t('settings.headers.privateText')}</p>
        </div>
        <button 
          className="btn facturas-refresh-btn"
          onClick={cargarMisOrdenes}
          disabled={isLoading}
        >
          {isLoading ? t('billing.loading') : t('common.update')}
        </button>
      </header>

      {/* ALERTA DE ERROR */}
      {error && (
        <div className="facturas-alert facturas-alert-error">
          <span className="facturas-alert-icon"><Icon name="warning" size={18} /></span>
          <div>
            <strong>{t('common.error')}</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* TABLA DE ÓRDENES */}
      {isLoading ? (
        <div className="facturas-loading">
          <div className="facturas-spinner"></div>
          <p>{t('orders.loading')}</p>
        </div>
      ) : ordenes.length === 0 ? (
        <div className="facturas-empty-state">
          <div className="facturas-empty-icon">📦</div>
          <h2>{t('orders.emptyTitle')}</h2>
          <p>{t('orders.empty')}</p>
        </div>
      ) : (
        <div className="facturas-container">
          <div className="table-responsive">
            <table className="facturas-table">
              <thead>
                <tr>
                  <th>{t('billing.table.order')}</th>
                  <th>{t('billing.table.date')}</th>
                  <th>{t('billing.table.total')}</th>
                  <th>{t('billing.table.payment')}</th>
                  <th>{t('billing.details.shipping')}</th>
                  <th>{t('billing.table.status')}</th>
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
                        {getNombreMetodoPago(orden.metodoPago, orden.metodoPagoLabel)}
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
                        {getEstadoLabel(orden.estado, orden.estadoLabel)}
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
              <span>{t('billing.status.pending')}: {t('billing.details.pendingDescription')}</span>
            </div>
            <div className="facturas-legend-item">
              <span className="facturas-legend-color accepted"></span>
              <span>{t('billing.status.accepted')}: {t('billing.details.acceptedDescription')}</span>
            </div>
            <div className="facturas-legend-item">
              <span className="facturas-legend-color rejected"></span>
              <span>{t('billing.status.rejected')}: {t('billing.details.rejectedDescription')}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Invoices

