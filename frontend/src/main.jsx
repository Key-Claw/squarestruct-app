// Punto de entrada de la aplicación React.
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// import 'bootstrap/dist/js/bootstrap.bundle.min.js' // Si usamos modales o componentes que requieren JS de Bootstrap
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import './index.css'
import './styles/base/variables.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </StrictMode>,
)

