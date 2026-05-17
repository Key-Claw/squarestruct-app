import '../styles/components/cart-panel.css'

/**
 * Panel deslizante del carrito
 * 
 * Características:
 * - Se desliza desde la derecha de la pantalla
 * - Backdrop oscuro que permite cerrar al hacer clic fuera
 * - Muestra items agregados al carrito
 * - Calcula y muestra el total
 * - Interfaz limpia y responsive
 * - Integración con checkout para procesar compra
 * 
 * @param {object} props - Props del componente
 * @param {boolean} props.isOpen - Indica si el panel está visible
 * @param {array} props.items - Array de items en el carrito
 * @param {function} props.onClose - Callback para cerrar el panel
 * @param {function} props.onRemoveItem - Callback para eliminar un item
 * @param {function} props.onUpdateQuantity - Callback para actualizar cantidad
 * @param {function} props.onCheckout - Callback para abrir el checkout (nueva compra)
 */
function CartPanel({ isOpen, items = [], onClose, onRemoveItem, onUpdateQuantity, onCheckout }) {
  /**
   * Calcula el total del carrito basado en los items.
   * @returns {number} Total en euros
   */
  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const price = parseFloat(item.precio) || 0
      const quantity = parseInt(item.cantidad) || 1
      return sum + (price * quantity)
    }, 0)
  }

  /**
   * Calcula la cantidad total de artículos.
   * @returns {number} Cantidad total
   */
  const calculateItemCount = () => {
    return items.reduce((sum, item) => sum + (parseInt(item.cantidad) || 1), 0)
  }

  /**
   * Maneja el clic en el backdrop para cerrar el panel
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // No renderizar si el panel está cerrado
  if (!isOpen) return null

  const total = calculateTotal()
  const itemCount = calculateItemCount()

  return (
    <>
      {/* BACKDROP OSCURO */}
      <div className="cart-panel-backdrop" onClick={handleBackdropClick}>
        
        {/* PANEL DESLIZANTE */}
        <div className="cart-panel-container">
          
          {/* ENCABEZADO DEL PANEL */}
          <div className="cart-panel-header">
            <h2>Mi cesta</h2>
            <button
              type="button"
              className="cart-panel-close-btn"
              onClick={onClose}
              aria-label="Cerrar carrito"
            >
              ×
            </button>
          </div>

          {/* CONTENIDO DEL PANEL */}
          <div className="cart-panel-content">
            
            {/* LISTA DE ITEMS */}
            {items && items.length > 0 ? (
              <div className="cart-items-list">
                {items.map((item, index) => (
                  <div key={index} className="cart-item">
                    {/* INFORMACIÓN DEL PRODUCTO */}
                    <div className="cart-item-info">
                      <h3 className="cart-item-name">{item.nombre}</h3>
                      <p className="cart-item-type">{item.tipo}</p>
                      <p className="cart-item-dimensions">
                        {item.largo} x {item.ancho} x {item.alto} cm
                      </p>
                    </div>

                    {/* PRECIO UNITARIO */}
                    <div className="cart-item-price">
                      <span className="cart-item-unit-price">
                        {'\u20ac'}{parseFloat(item.precio).toFixed(2)}
                      </span>
                    </div>

                    {/* CANTIDAD */}
                    <div className="cart-item-quantity">
                      <button
                        type="button"
                        className="cart-quantity-btn"
                        onClick={() => onUpdateQuantity(index, Math.max(1, (item.cantidad || 1) - 1))}
                        aria-label="Reducir cantidad"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="cart-quantity-input"
                        value={item.cantidad || 1}
                        onChange={(e) => onUpdateQuantity(index, Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                      />
                      <button
                        type="button"
                        className="cart-quantity-btn"
                        onClick={() => onUpdateQuantity(index, (item.cantidad || 1) + 1)}
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>

                    {/* SUBTOTAL */}
                    <div className="cart-item-subtotal">
                      <span className="cart-item-subtotal-value">
                        {'\u20ac'}{(parseFloat(item.precio) * (item.cantidad || 1)).toFixed(2)}
                      </span>
                    </div>

                    {/* BOTÓN DE ELIMINAR */}
                    <button
                      type="button"
                      className="cart-item-remove-btn"
                      onClick={() => onRemoveItem(index)}
                      aria-label="Eliminar del carrito"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              /* MENSAJE CUANDO EL CARRITO ESTÁ VACÍO */
              <div className="cart-empty-state">
                <div className="cart-empty-icon">🛒</div>
                <p className="cart-empty-message">Tu cesta está vacía</p>
                <p className="cart-empty-hint">
                  Añade productos desde el catálogo para empezar
                </p>
              </div>
            )}

          </div>

          {/* PIE DEL PANEL (RESUMEN Y ACCIONES) */}
          {items && items.length > 0 && (
            <div className="cart-panel-footer">
              
              {/* RESUMEN DE CANTIDAD */}
              <div className="cart-summary-row">
                <span className="cart-summary-label">
                  {itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}
                </span>
              </div>

              {/* LÍNEA DIVISORIA */}
              <div className="cart-panel-divider"></div>

              {/* TOTAL */}
              <div className="cart-total-row">
                <span className="cart-total-label">Total</span>
                <span className="cart-total-value">{'\u20ac'}{total.toFixed(2)}</span>
              </div>

              {/* BOTONES DE ACCIÓN */}
              <div className="cart-actions">
                <button
                  type="button"
                  className="cart-action-btn cart-continue-btn"
                  onClick={onClose}
                >
                  Seguir comprando
                </button>
                <button
                  type="button"
                  className="cart-action-btn cart-checkout-btn"
                  onClick={onCheckout}
                  disabled={items.length === 0}
                >
                  Proceder al pedido
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </>
  )
}

export default CartPanel

