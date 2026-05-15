import { useState } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import SiteFooter from './components/SiteFooter'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Catalog from './pages/Catalog'
import AboutUs from './pages/AboutUs'
import Design from './pages/Design'
import Settings from './pages/Settings'
import AuthModal from './components/AuthModal'
import CartPanel from './components/CartPanel'
import Checkout from './components/Checkout'
import { getCurrentUser, logoutUser, isAdmin } from './services/authService'
import { MAIN_ROUTES, PAGE_BY_PATH } from './routes'
import './App.css'

function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()

  const [internalPage, setInternalPage] = useState('')
  const [settingsTab, setSettingsTab] = useState('perfil')
  const [searchTerm, setSearchTerm] = useState('')
  const [catalogSection, setCatalogSection] = useState('')

  const [user, setUser] = useState(() => getCurrentUser())
  const isLoading = false

  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authIsLoginMode, setAuthIsLoginMode] = useState(true)

  const [cartPanelOpen, setCartPanelOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [pendingCheckoutAfterLogin, setPendingCheckoutAfterLogin] = useState(false)

  const adminOnlySettingsTabs = new Set(['usuarios', 'facturacion'])
  const routePage = PAGE_BY_PATH[location.pathname] || 'home'
  const activePage = internalPage || routePage

  const handleUserLogin = (userData) => {
    setUser(userData)

    if (pendingCheckoutAfterLogin) {
      setPendingCheckoutAfterLogin(false)
      setAuthModalOpen(false)
      setCheckoutOpen(true)
    }
  }

  const handleUserLogout = () => {
    logoutUser()
    setUser(null)
    setInternalPage('')
    navigate(MAIN_ROUTES.home)
  }

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
      setInternalPage('settings')
      setSearchTerm('')
      setCatalogSection('')
      return
    }

    setInternalPage('')
    setSearchTerm(term)
    setCatalogSection(section)
    navigate(MAIN_ROUTES[nextPage] || MAIN_ROUTES.home)
  }

  const handleOpenAuthModal = (isLoginMode = true) => {
    setAuthIsLoginMode(isLoginMode)
    setAuthModalOpen(true)
  }

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false)
    setPendingCheckoutAfterLogin(false)
  }

  const handleToggleAuthMode = () => {
    setAuthIsLoginMode(!authIsLoginMode)
  }

  const handleOpenCartPanel = () => {
    setCartPanelOpen(true)
  }

  const handleCloseCartPanel = () => {
    setCartPanelOpen(false)
  }

  const handleRemoveCartItem = (index) => {
    setCartItems(cartItems.filter((_, itemIndex) => itemIndex !== index))
  }

  const handleUpdateCartQuantity = (index, newQuantity) => {
    const newItems = [...cartItems]
    newItems[index] = { ...newItems[index], cantidad: newQuantity }
    setCartItems(newItems)
  }

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

  const handleCloseCheckout = () => {
    setCheckoutOpen(false)
  }

  const handleOrderCreated = () => {
    setCartItems([])
    setSettingsTab('facturas')
    setInternalPage('settings')
  }

  const renderSettings = () => {
    if (!user) {
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

  const renderMainContent = () => {
    if (isLoading) {
      return <div className="text-center p-5">Cargando...</div>
    }

    if (internalPage === 'settings') {
      return renderSettings()
    }

    return (
      <Routes>
        <Route path={MAIN_ROUTES.root} element={<Home onNavigate={handleNavigate} />} />
        <Route path={MAIN_ROUTES.home} element={<Home onNavigate={handleNavigate} />} />
        <Route path={MAIN_ROUTES.gallery} element={<Gallery onNavigate={handleNavigate} />} />
        <Route
          path={MAIN_ROUTES.catalog}
          element={(
            <Catalog
              key={`${searchTerm}-${catalogSection}`}
              onNavigate={handleNavigate}
              searchTerm={searchTerm}
              initialSection={catalogSection}
              onAddToCart={handleAddToCart}
            />
          )}
        />
        <Route path={MAIN_ROUTES.design} element={<Design onNavigate={handleNavigate} />} />
        <Route path={MAIN_ROUTES.aboutus} element={<AboutUs onNavigate={handleNavigate} />} />
        <Route path="*" element={<Navigate to={MAIN_ROUTES.root} replace />} />
      </Routes>
    )
  }

  return (
    <div className="app-shell">
      <Navbar
        activePage={activePage}
        activeSection={catalogSection}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleUserLogout}
        onOpenAuthModal={handleOpenAuthModal}
        onOpenCartPanel={handleOpenCartPanel}
      />
      <main className="app-main">{renderMainContent()}</main>
      <SiteFooter />

      <AuthModal
        isOpen={authModalOpen}
        isLoginMode={authIsLoginMode}
        onClose={handleCloseAuthModal}
        onToggleMode={handleToggleAuthMode}
        onUserLogin={handleUserLogin}
        onNavigate={handleNavigate}
      />

      <CartPanel
        isOpen={cartPanelOpen}
        items={cartItems}
        onClose={handleCloseCartPanel}
        onRemoveItem={handleRemoveCartItem}
        onUpdateQuantity={handleUpdateCartQuantity}
        onCheckout={handleOpenCheckout}
      />

      <Checkout
        isOpen={checkoutOpen}
        cartItems={cartItems}
        onClose={handleCloseCheckout}
        onOrderCreated={handleOrderCreated}
      />
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  )
}

export default App
