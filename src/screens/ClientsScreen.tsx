import { CLIENTS, clientInitials } from '../data/clients'
import { NzaWordmark } from '../components/svg/NzaWordmark'

/**
 * Clients screen — static logo row plus terminus marker and footer.
 *
 * Stage 5 layers an auto-rotating carousel and a click-to-open popover
 * on top. For now the row renders all 12 logos in document order so
 * stage 3's visual parity check works.
 *
 * Source: nza-website.html lines 1408-1462.
 */
export function ClientsScreen() {
  return (
    <section className="screen canvas-paper screen-clients" id="clients" data-screen-label="05 Clients">
      <div className="frame">
        <header className="clients-header">
          <div className="eyebrow reveal-layer" data-d="0">
            <span className="orbit-marker" aria-hidden="true" />
            05 · Clients
          </div>
          <h2 className="headline reveal-layer" data-d="1">
            Who we <em>work</em> with.
          </h2>
          <p className="lede reveal-layer" data-d="2">
            Long-term partnerships across universities, real-estate developers,
            contractors, MEP consultancies, and beyond. Click any logo to read
            what we worked on together.
          </p>
        </header>

        <div className="clients-carousel reveal-layer" data-d="3">
          <button className="carousel-arrow carousel-arrow-prev" id="clientsPrev" aria-label="Previous">
            ←
          </button>
          <div className="carousel-viewport" id="clientsViewport">
            <div className="carousel-track" id="clientsTrack">
              {CLIENTS.map((c, i) => (
                <button key={i} className="client-cell" data-client={i} type="button">
                  <span className="client-logo">
                    {c.logoSrc ? (
                      <img src={c.logoSrc} alt={c.name} className="client-logo-img" />
                    ) : (
                      <span className="client-logo-initials">{clientInitials(c.name)}</span>
                    )}
                  </span>
                  <span className="client-name">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
          <button className="carousel-arrow carousel-arrow-next" id="clientsNext" aria-label="Next">
            →
          </button>
        </div>

        {/* Hidden progress tracker — referenced by carousel JS in stage 5 */}
        <span id="clientsProgress" style={{ display: 'none' }} aria-hidden="true" />

        <div className="clients-terminus reveal-layer" data-d="4" aria-hidden="true">
          <span className="clients-terminus-line" />
          <span className="clients-terminus-circle" />
        </div>

        <footer className="footer clients-footer">
          <NzaWordmark className="footer-nza-logo" ariaLabel="NZA Net Zero Advisory" />
          <span className="footer-copy">© 2026</span>
        </footer>
      </div>
    </section>
  )
}
