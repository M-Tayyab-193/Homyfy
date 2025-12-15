import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { ListingsProvider } from './contexts/ListingsContext'
import { NotificationsProvider } from './contexts/NotificationsContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ListingsProvider>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </ListingsProvider>
    </BrowserRouter>
  </StrictMode>,
)
