import { useEffect, useState } from 'react'
import { obtenerPedidosPendientes, actualizarEstadoPedido } from '../services/orderService'
import '../styles/facturacion.css'


/**
 * Componente Facturacion - Panel de gestión de órdenes para administradores
 * 
 * Características:
 * - Carga órdenes pendientes desde la BD
 * - Permite aceptar o denegar órdenes
 * - Estados visuales: Amarillo (Pendiente), Verde (Aceptada), Rojo (Denegada)
 * - Tabla con información del cliente, fecha, total y método de pago
 * - Manejo de errores y estados de carga
 * 
 * Estados de orden:
 * - pendiente: Amarillo (#FCD34D) - A la espera de aprobación
 * - aceptado: Verde (#10B981) - Orden aprobada
 * - denegado: Rojo (#EF4444) - Orden rechazada
 */
function Facturacion() {
  // ============================================================================
  // ESTADO DEL COMPONENTE
  // ============================================================================

  // Órdenes pendientes cargadas desde la BD
  const [ordenes, setOrdenes] = useState([])
  
  // Estados de carga y error
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  // ID de la orden que se está procesando (para mostrar loading en botones)
  const [processingOrderId, setProcessingOrderId] = useState(null)

  // ============================================================================
  // CARGA DE DATOS (useEffect)
  // ============================================================================

  /**
   * Carga las órdenes pendientes cuando el componente se monta.
   */
  useEffect(() => {
    cargarOrdenesPendientes()
  }, [])

  /**
   * Obtiene las órdenes pendientes del servidor.
   * Maneja errores de autenticación y de servidor.
   */
  const cargarOrdenesPendientes = async () => {
    try {
      setIsLoading(true)
      setError('')
      const data = await obtenerPedidosPendientes()
      setOrdenes(data)
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al cargar órdenes'
      setError(mensaje)
      console.error('Error cargando órdenes:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // ============================================================================
  // MANEJADORES DE ACCIONES
  // ============================================================================

  /**
   * Acepta una orden pendiente.
   * Cambia su estado a 'aceptado' y actualiza la interfaz.
   * @param {number} idPedido - ID de la orden a aceptar
   */
  const handleAceptarOrden = async (idPedido) => {
    setProcessingOrderId(idPedido)
    setError('')
    setSuccessMessage('')

    try {
      await actualizarEstadoPedido(idPedido, 'aceptado')
      
      // Actualizar la lista local removiendo la orden aceptada
      setOrdenes((ordenesActuales) =>
        ordenesActuales.map((orden) =>
          orden.idPedido === idPedido
            ? { ...orden, estado: 'aceptado' }
            : orden
        )
      )

      setSuccessMessage(`Orden #${idPedido} aceptada correctamente`)
      window.setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al aceptar la orden'
      setError(mensaje)
    } finally {
      setProcessingOrderId(null)
    }
  }

  /**
   * Deniega una orden pendiente.
   * Cambia su estado a 'denegado' y actualiza la interfaz.
   * @param {number} idPedido - ID de la orden a denegar
   */
  const handleDenegarOrden = async (idPedido) => {
    setProcessingOrderId(idPedido)
    setError('')
    setSuccessMessage('')

    try {
      await actualizarEstadoPedido(idPedido, 'denegado')
      
      // Actualizar la lista local removiendo la orden denegada
      setOrdenes((ordenesActuales) =>
        ordenesActuales.map((orden) =>
          orden.idPedido === idPedido
            ? { ...orden, estado: 'denegado' }
            : orden
        )
      )

      setSuccessMessage(`Orden #${idPedido} denegada correctamente`)
      window.setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al denegar la orden'
      setError(mensaje)
    } finally {
      setProcessingOrderId(null)
    }
  }

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
        return 'billing-status pending' // Amarillo
      case 'aceptado':
        return 'billing-status accepted' // Verde
      case 'denegado':
        return 'billing-status rejected' // Rojo
      default:
        return 'billing-status'
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
    <section className="billing-admin-page">
      {/* ====================================================================
          CONTENIDO PRINCIPAL
          ==================================================================== */}
      <main className="billing-dashboard">
        <header className="billing-topbar">
          <div>
            <p className="eyebrow">Administración</p>
            <h1>Gestión de órdenes</h1>
            <p>Revisa y gestiona las órdenes pendientes de tus clientes.</p>
          </div>

          <div className="billing-topbar-actions">
            <button 
              className="btn billing-soft-btn" 
              type="button"
              onClick={cargarOrdenesPendientes}
              disabled={isLoading}
            >
              {isLoading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </header>

        {/* ALERTAS DE ERROR Y ÉXITO */}
        {error && (
          <div className="billing-alert billing-alert-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {successMessage && (
          <div className="billing-alert billing-alert-success">
            <strong>Éxito:</strong> {successMessage}
          </div>
        )}

        {/* TABLA DE ÓRDENES PENDIENTES */}
        <section className="billing-panel billing-invoices-panel">
          <div className="billing-panel-head">
            <h2>Órdenes pendientes de aprobación</h2>
            <span className="billing-badge">{ordenes.length}</span>
          </div>

          {isLoading ? (
            <div className="billing-loading">
              <p>Cargando órdenes pendientes...</p>
            </div>
          ) : ordenes.length === 0 ? (
            <div className="billing-empty-state">
              <p>No hay órdenes pendientes en este momento. ¡Excelente!</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table billing-modern-table align-middle">
                <thead>
                  <tr>
                    <th>ID Orden</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Método de Pago</th>
                    <th>Dirección</th>
                    <th>Productos</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ordenes.map((orden) => (
                    <tr key={orden.idPedido}>
                      {/* ID de la orden */}
                      <td>
                        <strong>#{orden.idPedido}</strong>
                      </td>

                      {/* Cliente */}
                      <td>
                        <div>
                          <strong>{orden.nombre} {orden.primerApellido}</strong>
                          <small>{orden.email}</small>
                        </div>
                      </td>

                      {/* Fecha */}
                      <td>
                        <small>{formatearFecha(orden.fecha)}</small>
                      </td>

                      {/* Total */}
                      <td>
                        <strong className="billing-amount">€{parseFloat(orden.total).toFixed(2)}</strong>
                      </td>

                      {/* Método de pago */}
                      <td>
                        <span className="billing-payment-method">
                          {getNombreMetodoPago(orden.metodoPago)}
                        </span>
                      </td>

                      {/* Dirección de envío */}
                      <td>
                        <small title={orden.direccionEnvio}>
                          {orden.direccionEnvio.substring(0, 30)}...
                        </small>
                      </td>

                      {/* Cantidad de productos */}
                      <td>
                        <span className="billing-product-count">
                          {orden.totalProductos} {orden.totalProductos === 1 ? 'producto' : 'productos'}
                        </span>
                      </td>

                      {/* Estado */}
                      <td>
                        <span className={getEstadoClase(orden.estado)}>
                          {orden.estado?.charAt(0).toUpperCase() + orden.estado?.slice(1)}
                        </span>
                      </td>

                      {/* Acciones (botones Aceptar/Denegar) */}
                      <td>
                        <div className="billing-table-actions billing-order-actions">
                          <button
                            className="btn billing-accept-btn"
                            type="button"
                            onClick={() => handleAceptarOrden(orden.idPedido)}
                            disabled={processingOrderId === orden.idPedido || orden.estado !== 'pendiente'}
                            title="Aceptar orden"
                          >
                            {processingOrderId === orden.idPedido ? '...' : '✓'}
                          </button>
                          <button
                            className="btn billing-reject-btn"
                            type="button"
                            onClick={() => handleDenegarOrden(orden.idPedido)}
                            disabled={processingOrderId === orden.idPedido || orden.estado !== 'pendiente'}
                            title="Denegar orden"
                          >
                            {processingOrderId === orden.idPedido ? '...' : '✕'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </main>
    </section>
  )
}

export default Facturacion

