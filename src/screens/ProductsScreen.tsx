import { Link } from 'react-router-dom'
import { PabloLogo } from '../components/svg/PabloLogo'

/**
 * Products screen - 1×3 row of product cards previewing each destination
 * page (PABLO / NZ:AI / decodED). Each card has a small product-specific
 * accent dot and an embedded logo or wordmark.
 *
 * Source: nza-website.html lines 1302-1399.
 */
export function ProductsScreen() {
  return (
    <section className="screen canvas-navy" id="products" data-screen-label="04 Products">
      <div className="frame">
        <header className="products-header">
          <div className="products-header-left">
            <div className="eyebrow reveal-layer" data-d="0">
              <span className="orbit-marker" aria-hidden="true" />
              04 · Products
            </div>
            <h2 className="headline reveal-layer" data-d="1">
              <em>Intelligence</em>, not just advice.
            </h2>
          </div>
          <div className="products-header-right reveal-layer" data-d="2">
            <p className="lede">
              NZA is moving from advisory to intelligence - from
              static report, to dynamic systems that keep working long after
              the engagement ends. Three things sit alongside the consulting
              practice: a digital tool, a way of working, and a movement we're
              building openly. Each one is part of the same shift.
            </p>
          </div>
        </header>

        <div className="product-cards" data-density="editorial" data-variant="cards">
          {/* Card 1 - PABLO · indigo accent. Slow staggered float-in
              via reveal-layer reveal-float; data-d slot 3 (400ms delay)
              follows the header (slots 0/1/2). */}
          <Link
            className="product-card reveal-layer reveal-float"
            data-d="3"
            data-accent="indigo"
            to="/pablo"
            aria-label="Meet PABLO - the energy intelligence platform"
          >
            <div className="product-card-rule" aria-hidden="true" />
            <div className="product-card-tag">
              <span className="product-card-dot" aria-hidden="true" />
              The model
            </div>
            <h3 className="product-card-name product-card-name--logo">
              <span className="sr-only">PABLO</span>
              <PabloLogo className="pablo-logo" />
            </h3>
            <p className="product-card-tagline">See your energy clearly.</p>
            <p className="product-card-desc">
              PABLO decomposes commercial electricity costs to the half-hour,
              models every intervention against real demand, and projects a
              detailed investment case over the project's lifecycle. The energy
              intelligence platform that powers NZA's smart energy and
              behind-the-meter strategy work.
            </p>
            <span className="product-card-cta">
              Meet PABLO
              <span className="product-card-arrow" aria-hidden="true">→</span>
            </span>
          </Link>

          {/* Card 2 - NZ:AI · coral accent (the colon is the coral moment) */}
          <a
            className="product-card reveal-layer reveal-float"
            data-d="5"
            data-accent="coral"
            href="#"
            aria-label="How NZ:AI works - Net Zero Intelligence partnership model"
          >
            <div className="product-card-rule" aria-hidden="true" />
            <div className="product-card-tag">
              <span className="product-card-dot" aria-hidden="true" />
              The framework
            </div>
            <h3 className="product-card-name">
              NZ<span className="nzai-colon">:</span>AI
            </h3>
            <p className="product-card-tagline">Net Zero Intelligence, built around you.</p>
            <p className="product-card-desc">
              Every NZ:AI engagement produces a bespoke greenhouse gas inventory
              and net zero strategy - delivered as a living digital system the
              client owns, not a static report filed annually. AI makes it
              possible to build something tailored for every client; partnership
              makes it work.
            </p>
            <span className="product-card-cta">
              How it works
              <span className="product-card-arrow" aria-hidden="true">→</span>
            </span>
          </a>

          {/* Card 3 - decodED · amber accent */}
          <a
            className="product-card reveal-layer reveal-float"
            data-d="7"
            data-accent="amber"
            href="#"
            aria-label="Try your postcode - decodED Climate Action platform"
          >
            <div className="product-card-rule" aria-hidden="true" />
            <div className="product-card-tag">
              <span className="product-card-dot" aria-hidden="true" />
              The movement
            </div>
            <h3 className="product-card-name">
              <span className="decoded-base">decod</span><span className="decoded-ed">ED</span>
            </h3>
            <p className="product-card-tagline">Climate action, decoded for education.</p>
            <p className="product-card-desc">
              A platform for the 33,000 nurseries, schools, colleges and
              universities required to produce a Climate Action Plan. decodED
              turns a postcode into a working baseline across decarbonisation,
              adaptation, biodiversity, and climate education - using open data
              and the people who know the site to build something credible from
              a standing start.
            </p>
            <span className="product-card-cta">
              Try your postcode
              <span className="product-card-arrow" aria-hidden="true">→</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
