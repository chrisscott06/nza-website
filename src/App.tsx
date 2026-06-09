import { Routes, Route } from 'react-router-dom'
import { WebsitePage } from './routes/WebsitePage'
import { ExpertisePage } from './routes/ExpertisePage'
import { ApproachPage } from './routes/ApproachPage'
import { PabloPage } from './routes/PabloPage'
import { NzAiPage } from './routes/NzAiPage'
import { DecodedPage } from './routes/DecodedPage'
import { AboutPage } from './routes/AboutPage'
import { ClientsPage } from './routes/ClientsPage'
import { SiteNav } from './components/SiteNav'
import { DevicePreview } from './components/DevicePreview'

export default function App() {
  return (
    <>
      <SiteNav />
      <Routes>
        <Route path="/" element={<WebsitePage />} />
        <Route path="/expertise" element={<ExpertisePage />} />
        <Route path="/approach" element={<ApproachPage />} />
        <Route path="/pablo" element={<PabloPage />} />
        <Route path="/nz-ai" element={<NzAiPage />} />
        <Route path="/decoded" element={<DecodedPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/clients" element={<ClientsPage />} />
      </Routes>
      {/* Dev-only floating preview launcher; auto-removed in `npm run build`. */}
      <DevicePreview />
    </>
  )
}
