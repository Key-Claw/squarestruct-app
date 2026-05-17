import { useState } from 'react'
import Icon from './ui/Icon'
import { crearPedido } from '../services/orderService'
import '../styles/components/checkout.css'

/**
 * Componente Checkout - Permite completar la compra seleccionando método de pago y dirección.
 * 
 * Características:
 * - Muestra resumen del carrito
 * - Permite elegir método de pago (tarjeta, transferencia, paypal, efectivo)
 * - Solicita dirección de envío
 * - Crea el pedido y lo envía al backend
 * - Estados: Amarillo (Pendiente), Verde (Aceptada), Rojo (Denegada)
 * 
 * @param {object} props - Props del componente
 * @param {boolean} props.isOpen - Indica si el checkout está visible
 * @param {array} props.cartItems - Items del carrito
 * @param {function} props.onClose - Callback para cerrar el checkout
 * @param {function} props.onOrderCreated - Callback cuando la orden se crea exitosamente
 */
function Checkout({ isOpen, cartItems = [], onClose, onOrderCreated }) {
  // ============================================================================
  // ESTADO DEL FORMULARIO
  // ============================================================================

  // Datos del formulario
  const [direccionEnvio, setDireccionEnvio] = useState('')
  const [metodoPago, setMetodoPago] = useState('tarjeta')

  // Estados de carga y error
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // ============================================================================
  // FUNCIONES AUXILIARES
  // ============================================================================

  /**
   * Calcula el total del carrito
   * @returns {number} Total en euros
   */
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = parseFloat(item.precio) || 0
      const quantity = parseInt(item.cantidad) || 1
      return sum + (price * quantity)
    }, 0)
  }

  /**
   * Maneja el envío del formulario de checkout.
   * Valida los datos, crea el pedido y maneja los estados de éxito/error.
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validación: dirección de envío
    if (!direccionEnvio.trim()) {
      setError('Por favor, ingresa una dirección de envío')
      return
    }

    if (direccionEnvio.trim().length < 10) {
      setError('La dirección debe tener al menos 10 caracteres')
      return
    }

    // Validación: carrito no vacío
    if (cartItems.length === 0) {
      setError('El carrito está vacío')
      return
    }

    // Preparar datos del pedido
    const productos = cartItems.map(item => ({
      idProducto: item.idProducto,
      cantidad: parseInt(item.cantidad) || 1
    }))

    const pedido = {
      direccionEnvio: direccionEnvio.trim(),
      metodoPago: metodoPago,
      productos: productos
    }

    setIsLoading(true)

    try {
      // Crear el pedido en el backend
      const response = await crearPedido(pedido)

      // Mostrar mensaje de éxito
      setSuccess('¡Pedido creado exitosamente! Tu pedido está pendiente de aprobación.')

      // Ejecutar callback de orden creada (para limpiar carrito, etc.)
      if (typeof onOrderCreated === 'function') {
        onOrderCreated(response)
      }

      // Limpiar formulario
      setDireccionEnvio('')
      setMetodoPago('tarjeta')

      // Cerrar checkout después de 2 segundos
      window.setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage || 'No se pudo crear el pedido. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Maneja el clic en el backdrop para cerrar el checkout
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // No renderizar si el checkout está cerrado
  if (!isOpen) return null

  const total = calculateTotal()

  return (
    <>
      {/* BACKDROP OSCURO */}
      <div className="checkout-backdrop" onClick={handleBackdropClick}>

        {/* MODAL DE CHECKOUT */}
        <div className="checkout-container">

          {/* ENCABEZADO */}
          <div className="checkout-header">
            <h2>Completar compra</h2>
            <button
              type="button"
              className="checkout-close-btn"
              onClick={onClose}
              aria-label="Cerrar checkout"
            >
              ×
            </button>
          </div>

          {/* CONTENIDO */}
          <div className="checkout-content">

            {/* SECCIÓN IZQUIERDA: Resumen del carrito */}
            <div className="checkout-summary-section">
              <h3>Resumen de tu pedido</h3>

              {cartItems && cartItems.length > 0 ? (
                <>
                  {/* Lista de items */}
                  <div className="checkout-items-list">
                    {cartItems.map((item, index) => (
                      <div key={index} className="checkout-item-row">
                        <div className="checkout-item-info">
                          <p className="checkout-item-name">{item.nombre}</p>
                          <p className="checkout-item-qty">
                            Cantidad: {item.cantidad || 1}
                          </p>
                        </div>
                        <div className="checkout-item-subtotal">
                          {'\u20ac'}{(parseFloat(item.precio) * (item.cantidad || 1)).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Divisor */}
                  <div className="checkout-divider"></div>

                  {/* Total */}
                  <div className="checkout-total-row">
                    <span className="checkout-total-label">Total:</span>
                    <span className="checkout-total-amount">{'\u20ac'}{total.toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <p className="checkout-empty">Tu carrito está vacío</p>
              )}
            </div>

            {/* SECCIÓN DERECHA: Formulario de pago */}
            <div className="checkout-form-section">
              <form onSubmit={handleSubmit}>

                {/* DIRECCIÓN DE ENVÍO */}
                <div className="checkout-form-group">
                  <label htmlFor="direccion-input" className="checkout-label">
                    Dirección de envío *
                  </label>
                  <textarea
                    id="direccion-input"
                    className="checkout-textarea"
                    placeholder="Ej: Calle Principal 123, 28001 Madrid, España"
                    value={direccionEnvio}
                    onChange={(e) => setDireccionEnvio(e.target.value)}
                    rows="4"
                    disabled={isLoading}
                  />
                  <small className="checkout-hint">Mínimo 10 caracteres</small>
                </div>

                {/* MÉTODO DE PAGO */}
                <div className="checkout-form-group">
                  <label htmlFor="pago-select" className="checkout-label">
                    Método de pago *
                  </label>
                  <select
                    id="pago-select"
                    className="checkout-select"
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="tarjeta">Tarjeta de crédito/débito</option>
                    <option value="transferencia">Transferencia bancaria</option>
                    <option value="paypal">PayPal</option>
                    <option value="efectivo">Efectivo contra reembolso</option>
                  </select>
                </div>

                {/* MENSAJES DE ERROR */}
                {error && (
                  <div className="checkout-alert checkout-error">
                    <span className="checkout-alert-icon"><Icon name="warning" size={18} /></span>
                    <span>{error}</span>
                  </div>
                )}

                {/* MENSAJES DE ÉXITO */}
                {success && (
                  <div className="checkout-alert checkout-success">
                    <span className="checkout-alert-icon"><Icon name="checkCircle" size={18} /></span>
                    <span>{success}</span>
                  </div>
                )}

                {/* BOTONES DE ACCIÓN */}
                <div className="checkout-actions">
                  <button
                    type="button"
                    className="checkout-btn checkout-cancel-btn"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="checkout-btn checkout-submit-btn"
                    disabled={isLoading || cartItems.length === 0}
                  >
                    {isLoading ? 'Procesando...' : 'Confirmar pedido'}
                  </button>
                </div>

              </form>
            </div>

          </div>

        </div>

      </div>
    </>
  )
}

export default Checkout

