import { Routes, Route } from 'react-router-dom'

function ScaffoldHome() {
  return (
    <main style={{ padding: '120px 48px 56px' }}>
      <div className="frame">
        <div className="eyebrow" style={{ marginBottom: 24 }}>
          Stage 01 · Scaffold
        </div>
        <h1 className="h-display" style={{ marginBottom: 24 }}>
          NZA scaffold <em>loaded.</em>
        </h1>
        <p className="lede" style={{ maxWidth: 640 }}>
          Stolzl, Inter Tight and DM Serif Display should all be live above.
          The italic word renders DM Serif coral; the rest of the headline
          is Stolzl Light. Design tokens, fonts and page CSS are wired up.
          Screens get ported in next.
        </p>
      </div>
    </main>
  )
}

function ScaffoldPablo() {
  return (
    <main style={{ padding: '120px 48px 56px', background: 'var(--ink-navy)', minHeight: '100vh' }}>
      <div className="frame" style={{ color: 'var(--fg-on-navy-1)' }}>
        <div className="eyebrow" style={{ color: 'var(--fg-on-navy-3)', marginBottom: 24 }}>
          Stage 01 · /pablo placeholder
        </div>
        <h1 className="h-display">PABLO route reachable.</h1>
      </div>
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ScaffoldHome />} />
      <Route path="/pablo" element={<ScaffoldPablo />} />
    </Routes>
  )
}
