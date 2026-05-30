import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Initialise Telegram Mini App SDK if running inside Telegram
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();    // tells Telegram the app has loaded (removes loading spinner)
  tg.expand();   // expands to full screen
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
