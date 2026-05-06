import { Routes, Route } from 'react-router-dom'
import { WebsitePage } from './routes/WebsitePage'
import { PabloPage } from './routes/PabloPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WebsitePage />} />
      <Route path="/pablo" element={<PabloPage />} />
    </Routes>
  )
}
