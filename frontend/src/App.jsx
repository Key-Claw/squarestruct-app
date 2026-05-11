import { useState } from 'react'
import Navbar from './components/Navbar'
import SiteFooter from './components/SiteFooter'
import Home from './pages/Home'
import Galeria from './pages/Galeria'
import Catalogo from './pages/Catalogo'
import Login from './pages/Login'
import Register from './pages/Register'
import AboutUs from './pages/AboutUs'
import Usuarios from './pages/Usuarios'
import Facturacion from './pages/Facturacion'
import Design from './pages/Design'
import AuthModal from './components/AuthModal'
import CartPanel from './components/CartPanel'
import ProfilePanel from './components/ProfilePanel'
import { getCurrentUser, logoutUser, isAdmin } from './services/authService'
import './App.css'

function App() {
  // ============================================================================
  // ESTADO DE PÃGINAS Y NAVEGACIÃ“N
  // ============================================================================
  
  // PÃ¡gina visible en cada momento.
  const [page, setPage] = useState('home')
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
  
  // Control del panel deslizante del perfil
  const [profilePanelOpen, setProfilePanelOpen] = useState(false)

  /**
   * Actualiza el usuario autenticado (despuÃ©s de login exitoso).
   * @param {object} userData - Datos del usuario autenticado.
   */
  const handleUserLogin = (userData) => {
    setUser(userData)
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
   * Abre el panel deslizante del perfil.
   */
  const handleOpenProfilePanel = () => {
    setProfilePanelOpen(true)
  }

  /**
   * Cierra el panel deslizante del perfil.
   */
  const handleCloseProfilePanel = () => {
    setProfilePanelOpen(false)
  }

  /**
   * Renderiza la vista principal segÃºn la pÃ¡gina seleccionada.
   * Incluye renderizado condicional de pÃ¡ginas protegidas segÃºn autenticaciÃ³n.
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

    if (page === 'usuarios') {
      // Panel de administraciÃ³n - solo para usuarios admin
      if (!user || !isAdmin()) {
        // Si intenta acceder sin ser admin, redirige a home
        setPage('home')
        return <Home onNavigate={handleNavigate} />
      }
      return <Usuarios onNavigate={handleNavigate} user={user} onAuthExpired={handleUserLogout} />
    }

    if (page === 'facturacion') {
      if (!user || !isAdmin()) {
        // Si intenta acceder sin ser admin, redirige a home
        setPage('home')
        return <Home onNavigate={handleNavigate} />
      }
      return <Facturacion onNavigate={handleNavigate} user={user} />
    }

    // Por defecto volvemos a la portada principal.
    return <Home onNavigate={handleNavigate} />
  }

  // Determina si mostrar el footer (solo en ciertas pÃ¡ginas)
  const showSiteFooter = ['home', 'galeria', 'catalogo', 'design', 'aboutus'].includes(page)

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
        onOpenProfilePanel={handleOpenProfilePanel}
      />
      <main className="app-main">{renderPage()}</main>
      {showSiteFooter && <SiteFooter showBenefits={page !== 'aboutus'} />}

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
      />

      {/* PANEL DESLIZANTE DEL PERFIL (DESDE LA IZQUIERDA) */}
      <ProfilePanel
        isOpen={profilePanelOpen}
        user={user}
        onClose={handleCloseProfilePanel}
        onLogout={handleUserLogout}
        isAdmin={user && isAdmin()}
        onNavigateToUsers={() => handleNavigate('usuarios')}
      />
    </div>
  )
}

export default App
