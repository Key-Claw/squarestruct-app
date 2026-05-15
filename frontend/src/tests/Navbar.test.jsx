/**
 * Test: Renderizado básico del componente Navbar
 * Verifica que la barra de navegación renderiza y muestra los items del menú
 */
import { render, screen } from '@testing-library/react'
import { HashRouter } from 'react-router-dom'
import Navbar from '../components/Navbar'

test('Navbar renderiza y muestra el botón Inicio', () => {
  // Mock de funciones callback (props vacías)
  const noop = () => {}
  render(
    <HashRouter>
      <Navbar
        activePage="home"
        activeSection=""
        onNavigate={noop}
        user={null}
        onLogout={noop}
        onOpenAuthModal={noop}
        onOpenCartPanel={noop}
      />
    </HashRouter>
  )

  // Confirma que el menú contiene el botón Inicio
  expect(screen.getByRole('link', { name: /Inicio/i })
  ).toBeInTheDocument()
})
