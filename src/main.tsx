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

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
