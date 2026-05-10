import { Routes, Route } from 'react-router-dom'
import { WebsitePage } from './routes/WebsitePage'
import { PabloPage } from './routes/PabloPage'
import { DevicePreview } from './components/DevicePreview'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<WebsitePage />} />
        <Route path="/pablo" element={<PabloPage />} />
      </Routes>
      {/* Dev-only floating preview launcher; auto-removed in `npm run build`. */}
      <DevicePreview />
    </>
  )
}
