/**
 * Test: Renderizado básico del componente Home
 * Verifica que la portada renderiza y muestra los elementos principales
 */
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import Home from '../pages/Home'

test('Home renderiza héroe y botón Ver catálogo', () => {
  // Mock con vi.fn() (Vitest, no Jest)
  const mockNavigate = vi.fn()
  render(<Home onNavigate={mockNavigate} />)

  // Confirma que el heading principal está presente
  expect(screen.getByText(/Construye sin límites/i)).toBeInTheDocument()
  // Confirma que el botón de catálogo está presente
  expect(screen.getByRole('button', { name: /Ver catálogo/i })).toBeInTheDocument()
})
