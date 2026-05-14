import { useState } from 'react'
import Navbar from './components/Navbar'
import SiteFooter from './components/SiteFooter'
import Home from './pages/Home'
import Galeria from './pages/Galeria'
import Catalogo from './pages/Catalogo'
import Login from './pages/Login'
import Register from './pages/Register'
import AboutUs from './pages/AboutUs'
import Design from './pages/Design'
import Settings from './pages/Settings'
import AuthModal from './components/AuthModal'
import CartPanel from './components/CartPanel'
import Checkout from './components/Checkout'
import { getCurrentUser, logoutUser, isAdmin } from './services/authService'
import './App.css'

function App() {
  // ============================================================================
  // ESTADO DE PÃGINAS Y NAVEGACIÃ“N
  // ============================================================================
  
  // PÃ¡gina visible en cada momento.
  const [page, setPage] = useState('home')
  // Pestaña activa dentro de la pantalla settings.
  const [settingsTab, setSettingsTab] = useState('perfil')
  // Texto de bÃºsqueda que viaja desde el navbar al catÃ¡logo.
  const [searchTerm, setSearchTerm] = useState('')
  const [catalogSection, setCatalogSection] = useState('')
  
  // ============================================================================
  // ESTADO DE AUTENTICACIÃ“N
  // ============================================================================
  
  // Usuario autenticado (null si no hay sesiÃ³n).
  const [user, setUser] = useState(() => getCurrentUser())
  // Flag para indicar que la app estÃ¡ cargando la sesiÃ³n guardada.
  const isLoading = false
  
  // ============================================================================
  // ESTADO DE MODALES Y PANELES DESLIZANTES
  // ============================================================================
  
  // Control del modal de autenticaciÃ³n (login/register)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  // Indica si el modal estÃ¡ en modo login (true) o registro (false)
  const [authIsLoginMode, setAuthIsLoginMode] = useState(true)
  
  // Control del panel deslizante del carrito
  const [cartPanelOpen, setCartPanelOpen] = useState(false)
  // Items guardados en el carrito (para demo)
  const [cartItems, setCartItems] = useState([])
  // Control del modal de checkout
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  // Si el usuario intenta comprar sin sesion, se abre checkout justo despues del login.
  const [pendingCheckoutAfterLogin, setPendingCheckoutAfterLogin] = useState(false)

  /**
   * Tabs de settings reservadas para administradores.
   * La validacion vive aqui para que no dependa solo de ocultar botones.
   */
  const adminOnlySettingsTabs = new Set(['usuarios', 'facturacion'])
  
  /**
   * Actualiza el usuario autenticado (despuÃ©s de login exitoso).
   * @param {object} userData - Datos del usuario autenticado.
   */
  const handleUserLogin = (userData) => {
    setUser(userData)

    if (pendingCheckoutAfterLogin) {
      setPendingCheckoutAfterLogin(false)
      setAuthModalOpen(false)
      setCheckoutOpen(true)
    }
  }

  /**
   * Maneja el logout del usuario.
   * Limpia tokens, datos de usuario y vuelve a home.
   */
  const handleUserLogout = () => {
    logoutUser()
    setUser(null)
    setPage('home')
  }

  /**
   * Cambia la pÃ¡gina activa y, si aplica, guarda el tÃ©rmino de bÃºsqueda.
   * @param {string} nextPage - PÃ¡gina destino.
   * @param {string} term - TÃ©rmino de bÃºsqueda opcional.
   */
  const handleNavigate = (nextPage, term = '', section = '') => {
    const settingsTabByPage = {
      settings: 'perfil',
      perfil: 'perfil',
      facturas: 'facturas',
      facturacion: 'facturacion',
      usuarios: 'usuarios',
      planos: 'planos',
    }

    if (settingsTabByPage[nextPage]) {
      const requestedTab = settingsTabByPage[nextPage]
      const nextTab = adminOnlySettingsTabs.has(requestedTab) && !isAdmin()
        ? 'perfil'
        : requestedTab

      setSettingsTab(nextTab)
      setPage('settings')
      setSearchTerm('')
      setCatalogSection('')
      return
    }

    setPage(nextPage)
    setSearchTerm(term)
    setCatalogSection(section)
  }

  /**
   * Abre el modal de autenticaciÃ³n en modo login.
   */
  const handleOpenAuthModal = (isLogin = true) => {
    setAuthIsLoginMode(isLogin)
    setAuthModalOpen(true)
  }

  /**
   * Cierra el modal de autenticaciÃ³n.
   */
  const handleCloseAuthModal = () => {
    setAuthModalOpen(false)
    setPendingCheckoutAfterLogin(false)
  }

  /**
   * Cambia entre modo login y modo registro en el modal.
   */
  const handleToggleAuthMode = () => {
    setAuthIsLoginMode(!authIsLoginMode)
  }

  /**
   * Abre el panel deslizante del carrito.
   */
  const handleOpenCartPanel = () => {
    setCartPanelOpen(true)
  }

  /**
   * Cierra el panel deslizante del carrito.
   */
  const handleCloseCartPanel = () => {
    setCartPanelOpen(false)
  }

  /**
   * Elimina un item del carrito.
   * @param {number} index - Ãndice del item a eliminar
   */
  const handleRemoveCartItem = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index))
  }

  /**
   * Actualiza la cantidad de un item en el carrito.
   * @param {number} index - Ãndice del item
   * @param {number} newQuantity - Nueva cantidad
   */
  const handleUpdateCartQuantity = (index, newQuantity) => {
    const newItems = [...cartItems]
    newItems[index] = { ...newItems[index], cantidad: newQuantity }
    setCartItems(newItems)
  }

  /**
   * AÃ±ade un producto al carrito o incrementa su cantidad si ya existe.
   * @param {object} product - Producto seleccionado en el catÃ¡logo.
   */
  const handleAddToCart = (product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.idProducto === product.idProducto)

      if (existingItem) {
        return currentItems.map((item) => (
          item.idProducto === product.idProducto
            ? { ...item, cantidad: (item.cantidad || 1) + 1 }
            : item
        ))
      }

      return [...currentItems, { ...product, cantidad: 1 }]
    })

    setCartPanelOpen(true)
  }

  /**
   * Abre el modal de checkout cuando el usuario quiere proceder al pedido.
   * Cierra el panel del carrito para mostrar el checkout.
   */
  const handleOpenCheckout = () => {
    setCartPanelOpen(false)

    if (!user) {
      setPendingCheckoutAfterLogin(true)
      setAuthIsLoginMode(true)
      setAuthModalOpen(true)
      return
    }

    setCheckoutOpen(true)
  }

  /**
   * Cierra el modal de checkout.
   */
  const handleCloseCheckout = () => {
    setCheckoutOpen(false)
  }

  /**
   * Maneja el evento de orden creada exitosamente.
   * Limpia el carrito y notifica al usuario.
   * @param {object} orderData - Datos de la orden creada
   */
  const handleOrderCreated = () => {
    // Limpiar el carrito
    setCartItems([])
    // Llevamos al usuario a su pestaña de facturas para que vea el pedido en estado pendiente.
    setPage('settings')
    setSettingsTab('facturas')
  }

  /**
   * Renderiza la vista principal según la página seleccionada.
   * Incluye renderizado condicional de páginas protegidas según autenticación.
   * @returns {JSX.Element}
   */
  const renderPage = () => {
    // Mostrar spinner mientras se carga la sesiÃ³n
    if (isLoading) {
      return <div className="text-center p-5">Cargando...</div>
    }

    // El orden importa: primero resolvemos las vistas especiales y luego la vista base.
    if (page === 'galeria') {
      return <Galeria onNavigate={handleNavigate} />
    }

    if (page === 'catalogo') {
      // El catÃ¡logo recibe el tÃ©rmino de bÃºsqueda para abrirse ya filtrado.
      return (
        <Catalogo
          key={`${searchTerm}-${catalogSection}`}
          onNavigate={handleNavigate}
          searchTerm={searchTerm}
          initialSection={catalogSection}
          onAddToCart={handleAddToCart}
        />
      )
    }

    if (page === 'design') {
      return <Design onNavigate={handleNavigate} />
    }

    if (page === 'login') {
      // Vista de acceso de usuario. Pasar callback para actualizar usuario al login.
      return <Login onNavigate={handleNavigate} onUserLogin={handleUserLogin} />
    }

    if (page === 'register') {
      // Vista de alta de usuario nuevo. Pasar callback para actualizar usuario al registro.
      return <Register onNavigate={handleNavigate} onUserLogin={handleUserLogin} />
    }

    if (page === 'aboutus') {
      // PÃ¡gina informativa de presentaciÃ³n de la marca.
      return <AboutUs onNavigate={handleNavigate} />
    }

    if (page === 'settings') {
      // Zona privada de configuracion. Si no hay sesion, vuelve a home.
      if (!user) {
        setPage('home')
        return <Home onNavigate={handleNavigate} />
      }

      const protectedTab = adminOnlySettingsTabs.has(settingsTab) && !isAdmin()
        ? 'perfil'
        : settingsTab

      return (
        <Settings
          key={protectedTab}
          user={user}
          initialTab={protectedTab}
          onAuthExpired={handleUserLogout}
          isAdminUser={isAdmin()}
        />
      )
    }

    // Por defecto volvemos a la portada principal.
    return <Home onNavigate={handleNavigate} />
  }

  return (
    <div className="app-shell">
      <Navbar
        activePage={page}
        activeSection={catalogSection}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleUserLogout}
        onOpenAuthModal={handleOpenAuthModal}
        onOpenCartPanel={handleOpenCartPanel}
      />
      <main className="app-main">{renderPage()}</main>
      <SiteFooter />

      {/* MODAL DE AUTENTICACIÃ“N (LOGIN/REGISTER CON FLIP) */}
      <AuthModal
        isOpen={authModalOpen}
        isLoginMode={authIsLoginMode}
        onClose={handleCloseAuthModal}
        onToggleMode={handleToggleAuthMode}
        onUserLogin={handleUserLogin}
        onNavigate={handleNavigate}
      />

      {/* PANEL DESLIZANTE DEL CARRITO (DESDE LA DERECHA) */}
      <CartPanel
        isOpen={cartPanelOpen}
        items={cartItems}
        onClose={handleCloseCartPanel}
        onRemoveItem={handleRemoveCartItem}
        onUpdateQuantity={handleUpdateCartQuantity}
        onCheckout={handleOpenCheckout}
      />

      {/* MODAL DE CHECKOUT (SELECCIÓN DE PAGO Y DIRECCIÓN) */}
      <Checkout
        isOpen={checkoutOpen}
        cartItems={cartItems}
        onClose={handleCloseCheckout}
        onOrderCreated={handleOrderCreated}
      />
    </div>
  )
}

export default App
