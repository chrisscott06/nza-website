import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Order matters: tailwind preflight first, then design tokens, then bespoke
// page CSS. Bespoke CSS wins over preflight where they overlap.
import './styles/tailwind.css'
import './styles/colors_and_type.css'
import './styles/nza-website.css'
import './styles/pablo.css'
import './styles/nz-ai.css'
import './styles/landing.css'
import './styles/site-nav.css'
import './styles/product-page.css'

import App from './App.tsx'

// Remove the static index.html splash the moment the bundle has
// finished loading + we're about to mount React. If the splash is
// absent (e.g. dev mode or already removed), this is a no-op.
const splash = document.getElementById('initial-splash')
if (splash && splash.parentNode) {
  splash.parentNode.removeChild(splash)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
