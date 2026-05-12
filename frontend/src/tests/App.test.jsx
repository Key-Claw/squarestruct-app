/**
 * Test: Renderizado básico del componente App
 * Verifica que App renderiza la portada y muestra el heading principal
 */
import { render, screen } from '@testing-library/react'
import App from '../App'

test('App renderiza la portada sin errores', () => {
  render(<App />)
  // Verifica que el encabezado principal de la portada se renderiza correctamente
  expect(screen.getByText(/Construye sin limites/i)).toBeInTheDocument()
})
