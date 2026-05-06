import { useState } from 'react'
import Navbar from './components/Navbar'
import SiteFooter from './components/SiteFooter'
import Home from './pages/Home'
import Galeria from './pages/Galeria'
import Catalogo from './pages/Catalogo'
import Login from './pages/Login'
import Register from './pages/Register'
import AboutUs from './pages/AboutUs'
import Perfil from './pages/Perfil'
import Usuarios from './pages/Usuarios'
import Facturacion from './pages/Facturacion'
import Design from './pages/Design'
import Carrito from './pages/Carrito'
import AuthModal from './components/AuthModal'
import CartPanel from './components/CartPanel'
import ProfilePanel from './components/ProfilePanel'
import { getCurrentUser, logoutUser, isAdmin } from './services/authService'
import './App.css'

function App() {
  // ============================================================================
  // ESTADO DE PÁGINAS Y NAVEGACIÓN
  // ============================================================================
  
  // Página visible en cada momento.
  const [page, setPage] = useState('facturacion')
  // Texto de búsqueda que viaja desde el navbar al catálogo.
  const [searchTerm, setSearchTerm] = useState('')
  const [catalogSection, setCatalogSection] = useState('')
  
  // ============================================================================
  // ESTADO DE AUTENTICACIÓN
  // ============================================================================
  
  // Usuario autenticado (null si no hay sesión).
  const [user, setUser] = useState(() => getCurrentUser())
  // Flag para indicar que la app está cargando la sesión guardada.
  const isLoading = false
  
  // ============================================================================
  // ESTADO DE MODALES Y PANELES DESLIZANTES
  // ============================================================================
  
  // Control del modal de autenticación (login/register)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  // Indica si el modal está en modo login (true) o registro (false)
  const [authIsLoginMode, setAuthIsLoginMode] = useState(true)
  
  // Control del panel deslizante del carrito
  const [cartPanelOpen, setCartPanelOpen] = useState(false)
  // Items guardados en el carrito (para demo)
  const [cartItems, setCartItems] = useState([])
  
  // Control del panel deslizante del perfil
  const [profilePanelOpen, setProfilePanelOpen] = useState(false)

  /**
   * Actualiza el usuario autenticado (después de login exitoso).
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
   * Cambia la página activa y, si aplica, guarda el término de búsqueda.
   * @param {string} nextPage - Página destino.
   * @param {string} term - Término de búsqueda opcional.
   */
  const handleNavigate = (nextPage, term = '', section = '') => {
    setPage(nextPage)
    setSearchTerm(term)
    setCatalogSection(section)
  }

  /**
   * Abre el modal de autenticación en modo login.
   */
  const handleOpenAuthModal = (isLogin = true) => {
    setAuthIsLoginMode(isLogin)
    setAuthModalOpen(true)
  }

  /**
   * Cierra el modal de autenticación.
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
   * @param {number} index - Índice del item a eliminar
   */
  const handleRemoveCartItem = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index))
  }

  /**
   * Actualiza la cantidad de un item en el carrito.
   * @param {number} index - Índice del item
   * @param {number} newQuantity - Nueva cantidad
   */
  const handleUpdateCartQuantity = (index, newQuantity) => {
    const newItems = [...cartItems]
    newItems[index] = { ...newItems[index], cantidad: newQuantity }
    setCartItems(newItems)
  }

  /**
   * Añade un producto al carrito o incrementa su cantidad si ya existe.
   * @param {object} product - Producto seleccionado en el catálogo.
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
   * Renderiza la vista principal según la página seleccionada.
   * Incluye renderizado condicional de páginas protegidas según autenticación.
   * @returns {JSX.Element}
   */
  const renderPage = () => {
    // Mostrar spinner mientras se carga la sesión
    if (isLoading) {
      return <div className="text-center p-5">Cargando...</div>
    }

    // El orden importa: primero resolvemos las vistas especiales y luego la vista base.
    if (page === 'galeria') {
      return <Galeria onNavigate={handleNavigate} />
    }

    if (page === 'catalogo') {
      // El catálogo recibe el término de búsqueda para abrirse ya filtrado.
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

    if (page === 'carrito') {
      return <Carrito onNavigate={handleNavigate} />
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
      // Página informativa de presentación de la marca.
      return <AboutUs onNavigate={handleNavigate} />
    }

    // Páginas protegidas - solo disponibles si el usuario está autenticado
    if (page === 'perfil') {
      if (!user) {
        // Si intenta acceder sin autenticación, redirige a login
        setPage('login')
        return <Login onNavigate={handleNavigate} onUserLogin={handleUserLogin} />
      }
      return <Perfil onNavigate={handleNavigate} user={user} onUserLogout={handleUserLogout} />
    }

    if (page === 'usuarios') {
      // Panel de administración - solo para usuarios admin
      if (!user || !isAdmin()) {
        // Si intenta acceder sin ser admin, redirige a home
        setPage('home')
        return <Home onNavigate={handleNavigate} />
      }
      return <Usuarios onNavigate={handleNavigate} user={user} />
    }

    if (page === 'facturacion') {
      // Acceso provisional para revisar la maqueta sin backend ni login.
      // Antes de entregar, volver a proteger esta ruta con rol admin.
      return <Facturacion onNavigate={handleNavigate} user={user} />
    }

    // Por defecto volvemos a la portada principal.
    return <Home onNavigate={handleNavigate} />
  }

  // Determina si mostrar el footer (solo en ciertas páginas)
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

      {/* MODAL DE AUTENTICACIÓN (LOGIN/REGISTER CON FLIP) */}
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

// PLANTILLA DE VITE + REACT (ELIMINADA PARA LIMPIAR EL PROYECTO, PERO SE DEJA AQUÍ POR SI QUEDÓ ALGÚN RESTO O PARA REFERENCIA FUTURA)
// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           type="button"
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

// export default App

