import { useEffect, useState } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import SiteFooter from './components/layout/SiteFooter'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Catalog from './pages/Catalog'
import AboutUs from './pages/AboutUs'
import Design from './pages/Design'
import Settings from './pages/settings/Settings'
import AuthModal from './components/auth/AuthModal'
import CartPanel from './components/layout/CartPanel'
import Checkout from './components/settings/Checkout'
import { getCurrentUser, logoutUser, isAdmin } from './services/authService'
import { MAIN_ROUTES, PAGE_BY_PATH, SETTINGS_SECTION_TO_TAB, getSettingsRoute } from './routes'
import './App.css'

function SettingsAliasRedirect() {
  const { settingsSection = 'profile' } = useParams()

  return <Navigate to={`${MAIN_ROUTES.settings}/${settingsSection}`} replace />
}

const ADMIN_ONLY_SETTINGS_TABS = new Set(['usuarios', 'facturacion'])

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

  const isSettingsRoute = location.pathname === MAIN_ROUTES.settings
    || location.pathname.startsWith(`${MAIN_ROUTES.settings}/`)
    || location.pathname === MAIN_ROUTES.settingsAlias
    || location.pathname.startsWith(`${MAIN_ROUTES.settingsAlias}/`)
  const routePage = PAGE_BY_PATH[location.pathname] || (isSettingsRoute ? 'settings' : 'home')
  const activePage = internalPage || routePage

  const getSettingsTabFromPath = (pathname) => {
    const settingsPrefix = pathname.startsWith(MAIN_ROUTES.settingsAlias)
      ? MAIN_ROUTES.settingsAlias
      : MAIN_ROUTES.settings
    const section = pathname.slice(settingsPrefix.length).split('/').filter(Boolean)[0]

    return SETTINGS_SECTION_TO_TAB[section] || 'perfil'
  }

  useEffect(() => {
    if (!isSettingsRoute) return

    const nextTab = getSettingsTabFromPath(location.pathname)
    const protectedTab = ADMIN_ONLY_SETTINGS_TABS.has(nextTab) && !isAdmin() ? 'perfil' : nextTab

    if (protectedTab !== nextTab) {
      navigate(getSettingsRoute(protectedTab), { replace: true })
    }
  }, [location.pathname, isSettingsRoute, navigate])

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

  const handleUserUpdate = (userData) => {
    setUser(userData)
  }

  const handleUserDeleted = () => {
    setUser(null)
    setInternalPage('')
    navigate(MAIN_ROUTES.home)
  }

  const handleNavigate = (nextPage, term = '', section = '') => {
    const settingsTabByPage = {
      settings: 'perfil',
      profile: 'perfil',
      perfil: 'perfil',
      invoices: 'facturas',
      facturas: 'facturas',
      billing: 'facturacion',
      facturacion: 'facturacion',
      users: 'usuarios',
      usuarios: 'usuarios',
      plans: 'planos',
      planos: 'planos',
    }

    if (settingsTabByPage[nextPage]) {
      const requestedTab = settingsTabByPage[nextPage]
      const nextTab = ADMIN_ONLY_SETTINGS_TABS.has(requestedTab) && !isAdmin()
        ? 'perfil'
        : requestedTab

      setSettingsTab(nextTab)
      setInternalPage('')
      setSearchTerm('')
      setCatalogSection('')
      navigate(getSettingsRoute(nextTab))
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
    setInternalPage('')
    navigate(getSettingsRoute('facturas'))
  }

  const handleSettingsTabChange = (tab) => {
    const nextTab = ADMIN_ONLY_SETTINGS_TABS.has(tab) && !isAdmin() ? 'perfil' : tab
    setSettingsTab(nextTab)
    navigate(getSettingsRoute(nextTab))
  }

  const renderSettings = () => {
    if (!user) {
      return <Home onNavigate={handleNavigate} />
    }

    const requestedTab = isSettingsRoute ? getSettingsTabFromPath(location.pathname) : settingsTab
    const protectedTab = ADMIN_ONLY_SETTINGS_TABS.has(requestedTab) && !isAdmin()
      ? 'perfil'
      : requestedTab

    return (
      <Settings
        key={protectedTab}
        user={user}
        initialTab={protectedTab}
        onAuthExpired={handleUserLogout}
        isAdminUser={isAdmin()}
        onTabChange={handleSettingsTabChange}
        onUserUpdate={handleUserUpdate}
        onUserDeleted={handleUserDeleted}
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
        <Route path={MAIN_ROUTES.settings} element={<Navigate to={getSettingsRoute('perfil')} replace />} />
        <Route path={`${MAIN_ROUTES.settings}/:settingsSection`} element={renderSettings()} />
        <Route path={MAIN_ROUTES.settingsAlias} element={<Navigate to={getSettingsRoute('perfil')} replace />} />
        <Route path={`${MAIN_ROUTES.settingsAlias}/:settingsSection`} element={<SettingsAliasRedirect />} />
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

      {/* Overlays globales: auth, carrito y checkout viven fuera de las rutas para mantener su estado. */}
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
