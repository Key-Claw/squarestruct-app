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
import Design from './pages/Design'
import Carrito from './pages/Carrito'
import { getCurrentUser, logoutUser, isAdmin } from './services/authService'
import './App.css'

function App() {
  // Página visible en cada momento.
  const [page, setPage] = useState('home')
  // Texto de búsqueda que viaja desde el navbar al catálogo.
  const [searchTerm, setSearchTerm] = useState('')
  const [catalogSection, setCatalogSection] = useState('')
  // Usuario autenticado (null si no hay sesión).
  const [user, setUser] = useState(() => getCurrentUser())
  // Flag para indicar que la app está cargando la sesión guardada.
  const isLoading = false

  /**
   * Restaura la sesión del usuario al cargar la aplicación.
   * Si existe un token y datos de usuario en localStorage, los recupera.
   */

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

    // Por defecto volvemos a la portada principal.
    return <Home onNavigate={handleNavigate} />
  }

  const showSiteFooter = ['home', 'galeria', 'catalogo', 'design', 'aboutus'].includes(page)

  return (
    <div className="app-shell">
      <Navbar
        activePage={page}
        activeSection={catalogSection}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleUserLogout}
      />
      <main className="app-main">{renderPage()}</main>
      {showSiteFooter && <SiteFooter showBenefits={page !== 'aboutus'} />}
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

