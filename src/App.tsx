import { Routes, Route } from 'react-router-dom'
import { WebsitePage } from './routes/WebsitePage'
import { ExpertisePage } from './routes/ExpertisePage'
import { ApproachPage } from './routes/ApproachPage'
import { PabloPage } from './routes/PabloPage'
import { NzAiPage } from './routes/NzAiPage'
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
      </Routes>
      {/* Dev-only floating preview launcher; auto-removed in `npm run build`. */}
      <DevicePreview />
    </>
  )
}
