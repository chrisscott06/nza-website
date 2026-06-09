import { useEffect } from 'react'
import { PabloLogo } from '../components/svg/PabloLogo'
import { useContextClass } from '../hooks/useContextClass'

/**
 * PABLO product page - 8 sections of editorial + interactive charts.
 *
 * The chart engine (pablo-charts.js) is a self-contained IIFE that
 * looks up DOM elements by ID, mounts hand-built SVG charts, and runs
 * an IntersectionObserver to fire animations when sections scroll in.
 * It's loaded via a script tag injected after first paint so the
 * targets exist when the IIFE runs.
 *
 * Body classes:
 *   pablo-page    bespoke pablo.css ground colour + chrome scoping
 *   on-navy       site-wide on-navy fg colours
 *   context-pablo SiteNav reads this to adapt its bg + logo recolour
 *
 * The old per-page FloatingNav has been replaced by the site-wide
 * <SiteNav> mounted in App.tsx, which adapts to the page via
 * context-pablo (chunk 3 onwards).
 */
export function PabloPage() {
  useContextClass(['pablo-page', 'on-navy', 'context-pablo'])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = '/pablo-charts.js'
    script.async = false
    document.body.appendChild(script)

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script)
    }
  }, [])

  return (
    <>
      {/* ========== HERO - bill explosion animation ========== */}
      <header className="p-section" id="hero" data-screen-label="00 PABLO Hero">
        <div className="pablo-frame">
          <div className="p-hero">
            <div className="p-hero-text">
              <div className="p-eyebrow p-reveal" data-d="0">04 · Products / PABLO</div>
              <h1 className="p-hero-headline p-reveal" data-d="1">
                Your electricity bill is <em>hiding</em> sixteen charges from you.
              </h1>
              <p className="p-hero-sub p-reveal" data-d="2">
                PABLO decomposes commercial electricity costs to the half-hour,
                models every intervention against real demand, and projects a
                detailed investment case over the project's lifecycle.
              </p>
            </div>

            <div className="p-hero-visual p-reveal" data-d="3">
              <div className="p-hero-wordmark">
                <PabloLogo className="p-logo-mini" />
                <span>Energy intelligence platform</span>
              </div>
              <svg id="bill-explosion" viewBox="0 0 700 500" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" />
            </div>
          </div>
        </div>
      </header>

      {/* ========== SECTION 1 - DECOMPOSITION DEEP-DIVE ========== */}
      <section className="p-section" id="decomposition" data-screen-label="01 Decomposition">
        <div className="pablo-frame">
          <div className="p-decomp" id="decompSection">
            <div className="p-decomp-head">
              <div className="p-eyebrow p-reveal" data-d="0">01 · See your costs</div>
              <h2 className="p-headline p-reveal" data-d="1">
                Sixteen components. Each escalating at its own rate. Each costing something different.
              </h2>
              <p className="p-body p-reveal" data-d="2">
                A <em style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic', color: 'var(--p-coral)' }}>p/kWh rate</em> is a lie of omission.
                The real bill is DUoS by RAG band, TNUoS residual and locational, BSUoS, Capacity Market
                levy, CfD and RO subsidies, FIT, CCL, supplier margin - each with its own published rate,
                each escalating independently. PABLO decomposes every charge against real half-hourly
                consumption, then projects the stack forward at component-specific rates.
                The result is the only forecast that doesn't pretend network charges grow at the same
                speed as wholesale.
              </p>
            </div>

            <div className="p-decomp-vis p-reveal" data-d="3">
              <svg id="decompChart" viewBox="0 0 1100 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '400px', display: 'block' }} />
              <div className="p-decomp-legend">
                <span><i style={{ background: 'var(--p-violet)' }} />DUoS</span>
                <span><i style={{ background: '#A18AFF' }} />TNUoS</span>
                <span><i style={{ background: 'var(--p-amber)' }} />BSUoS / CM</span>
                <span><i style={{ background: '#FFC36B' }} />CfD · RO · FIT</span>
                <span><i style={{ background: 'var(--p-coral)' }} />CCL</span>
                <span><i style={{ background: '#FF8FAA' }} />Supplier margin</span>
                <span><i style={{ background: 'var(--p-chart-grid)' }} />Wholesale</span>
              </div>
            </div>
            <p className="p-caption">DUoS · TNUoS · BSUoS · CM · CfD · RO · FIT · CCL · Supplier margin · Wholesale</p>
          </div>
        </div>
      </section>

      {/* ========== SECTION 2 - STRATEGIC TRANSITION ========== */}
      <section className="p-section" id="transition">
        <div className="pablo-frame">
          <div className="p-transition">
            <div className="p-transition-rule p-reveal" data-d="0" />
            <h2 className="p-headline p-reveal" data-d="1">
              Once the bill is <em>legible</em>, every intervention can be modelled against the real cost stack.
            </h2>
            <p className="p-body p-reveal" data-d="2">
              Most energy strategy work uses flat rates and simple paybacks. PABLO doesn't.
              With every cost component decomposed and forecast independently, every intervention -
              solar, storage, capacity reform, electrification - is modelled against the bill structure
              that's actually changing. A solar array doesn't just offset wholesale; it changes DUoS exposure
              and capacity charge profiles. A battery doesn't just store energy; it arbitrages the gap
              between Red and Green DUoS bands. Once the bill is decomposed, the strategy becomes specific.
            </p>
            <div className="p-transition-rule bottom p-reveal" data-d="3" />
          </div>
        </div>
      </section>

      {/* ========== SECTION 3 - TEST AN INTERVENTION ========== */}
      <section className="p-section" id="test" data-screen-label="03 Test an intervention">
        <div className="pablo-frame">
          <div className="p-decomp-head">
            <div className="p-eyebrow p-reveal" data-d="0">02 · See your solutions</div>
            <h2 className="p-headline p-reveal" data-d="1">Test an intervention.</h2>
            <p className="p-body p-reveal" data-d="2">
              Add solar. Add a battery. Set a peak-shave limit. The load curve and the battery dispatch
              reorganise around the changes - modelled at half-hourly resolution against your real demand.
              Solar and storage aren't two features; they're one coupled system.
            </p>
          </div>

          <div className="p-test p-reveal" data-d="3">
            <div className="p-test-canvas" id="testCanvas">
              <div className="p-test-chart-top">
                <svg id="loadChart" viewBox="0 0 1100 240" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }} />
              </div>

              <div className="p-test-toggles">
                <button type="button" className="p-test-toggle" data-tog="solar" aria-pressed="false">
                  <span className="p-test-toggle-box" aria-hidden="true" />
                  <span>
                    <span className="p-test-toggle-name">Solar</span>
                    <span className="p-test-toggle-cap">250 kWp</span>
                  </span>
                </button>
                <button type="button" className="p-test-toggle" data-tog="battery" aria-pressed="false">
                  <span className="p-test-toggle-box" aria-hidden="true" />
                  <span>
                    <span className="p-test-toggle-name">Battery</span>
                    <span className="p-test-toggle-cap">500 kWh / 250 kW</span>
                  </span>
                </button>
                <button type="button" className="p-test-toggle" data-tog="peak" aria-pressed="false">
                  <span className="p-test-toggle-box" aria-hidden="true" />
                  <span>
                    <span className="p-test-toggle-name">Peak-shave</span>
                    <span className="p-test-toggle-cap">200 kW limit</span>
                  </span>
                </button>
              </div>

              <div className="p-test-chart-bot">
                <svg id="batteryChart" viewBox="0 0 1100 180" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }} />
              </div>

              <div className="p-test-derived idle" id="testDerived">
                <div className="p-test-derived-item">
                  <span className="p-test-derived-label">Today's peak demand</span>
                  <span className="p-test-derived-vals">
                    <span className="p-test-derived-from">412 kW</span>
                    <span className="p-test-derived-arrow">→</span>
                    <span className="p-test-derived-to">412 kW</span>
                  </span>
                </div>
                <div className="p-test-derived-item">
                  <span className="p-test-derived-label">Daily import</span>
                  <span className="p-test-derived-vals">
                    <span className="p-test-derived-from">4,200 kWh</span>
                    <span className="p-test-derived-arrow">→</span>
                    <span className="p-test-derived-to">4,200 kWh</span>
                  </span>
                </div>
                <div className="p-test-derived-item">
                  <span className="p-test-derived-label">Daily import cost</span>
                  <span className="p-test-derived-vals">
                    <span className="p-test-derived-from">£874</span>
                    <span className="p-test-derived-arrow">→</span>
                    <span className="p-test-derived-to">£874</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION 4 - LIFECYCLE PICTURE ========== */}
      <section className="p-section" id="lifecycle" data-screen-label="04 Lifecycle">
        <div className="pablo-frame">
          <div className="p-decomp-head">
            <div className="p-eyebrow p-reveal" data-d="0">03 · See your future</div>
            <h2 className="p-headline p-reveal" data-d="1">
              The lifecycle case, <em>defended</em> over the right horizon.
            </h2>
            <p className="p-body p-reveal" data-d="2">
              Not a 25-year template. The right lifecycle for the asset under consideration -
              10 years for a battery, 25 for solar, 40 for an electrified heat strategy.
              Replacement cycles modelled. Degradation curves applied. Each cost component
              escalating at its own rate. Every parameter visible. Change the discount rate, the
              lifecycle horizon, the replacement assumption - the case redraws in real time.
              PABLO produces the only investment case that holds up when an investor, a finance
              director, or a regulator opens the methodology.
            </p>
          </div>

          <div className="p-lifecycle p-reveal" data-d="3">
            <div className="p-lifecycle-canvas">
              <div className="p-lifecycle-chart">
                <svg id="lifecycleChart" viewBox="0 0 900 380" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }} />
              </div>
              <div id="paybackMarker" className="p-lifecycle-payback" style={{ display: 'none' }}>Payback · Y7</div>
            </div>

            <aside className="p-params" id="lifecycleParams">
              <div className="p-params-head">Assumptions</div>
              <div className="p-param">
                <div className="p-param-label">
                  <span>Lifecycle horizon</span>
                  <span className="p-param-value" id="paramHorizonVal">25 yr</span>
                </div>
                <input type="range" id="paramHorizon" min="10" max="40" step="5" defaultValue="25" />
              </div>
              <div className="p-param">
                <div className="p-param-label">
                  <span>Discount rate</span>
                  <span className="p-param-value" id="paramDiscountVal">5.0%</span>
                </div>
                <input type="range" id="paramDiscount" min="0" max="100" step="5" defaultValue="50" />
              </div>
              <div className="p-param">
                <div className="p-param-label">
                  <span>Network escalation</span>
                  <span className="p-param-value" id="paramNetworkVal">4.5%</span>
                </div>
                <input type="range" id="paramNetwork" min="0" max="80" step="5" defaultValue="45" />
              </div>
              <div className="p-param">
                <div className="p-param-label">
                  <span>Wholesale escalation</span>
                  <span className="p-param-value" id="paramWholesaleVal">2.5%</span>
                </div>
                <input type="range" id="paramWholesale" min="0" max="80" step="5" defaultValue="25" />
              </div>
            </aside>
          </div>
          <p className="p-caption">BAU · With intervention · Replacement events · Degradation · Payback</p>
        </div>
      </section>

      {/* ========== SECTION 5 - BREADTH CANVAS ========== */}
      <section className="p-section" id="breadth" data-screen-label="05 Breadth canvas">
        <div className="pablo-frame">
          <div className="p-decomp-head">
            <div className="p-eyebrow p-reveal" data-d="0">Breadth</div>
            <h2 className="p-headline p-reveal" data-d="1">
              Six modules. <em>One</em> instrument.
            </h2>
            <p className="p-body p-reveal" data-d="2">
              Every module runs on the same data, the same tariffs, the same lifecycle assumptions.
              A change in one is reflected in every other. Watch any of them in turn.
            </p>
          </div>

          <div className="p-breadth p-reveal" data-d="3">
            <div className="p-breadth-canvas" id="breadthCanvas">
              <div className="p-breadth-stage" id="breadthStage" />
            </div>

            <div className="p-breadth-controls">
              <div className="p-breadth-dots" id="breadthDots" role="tablist" />
              <button type="button" className="p-breadth-pause" id="breadthPause" aria-label="Pause auto-cycle">
                <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                  <rect x="0" y="0" width="3" height="12" />
                  <rect x="7" y="0" width="3" height="12" />
                </svg>
              </button>
            </div>

            <div className="p-breadth-label">
              <span className="p-breadth-label-name" id="breadthLabelName">Network connection</span>
              <span className="p-breadth-label-text" id="breadthLabelText">Drop the supply capacity band. The 25-year saving appears.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION 6 - WHY PABLO ========== */}
      <section className="p-section" id="why" data-screen-label="06 Why PABLO">
        <div className="pablo-frame">
          <div className="p-why">
            <div>
              <div className="p-eyebrow p-reveal" data-d="0">Why PABLO</div>
              <h2 className="p-headline p-reveal" data-d="1">
                <em>Built</em> for the decision, not the operation.
              </h2>
              <p className="p-body p-reveal" data-d="2">
                PABLO is the analytical foundation underneath any energy strategy. It exists to be
                interrogated before procurement, defended in front of a board, and handed over with
                confidence to whoever ends up running the asset. Every assumption is visible, every
                dispatch logic is exposed, every methodology is auditable. PABLO opens the black box
                that most building owners would otherwise have to take on faith.
              </p>
            </div>

            <ul className="p-why-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="p-why-item p-reveal" data-d="0">
                <div className="p-why-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3v18" /></svg></div>
                <div className="p-why-body">
                  <h4>UK tariff depth</h4>
                  <p>PABLO decomposes commercial electricity bills into every constituent charge - DUoS by RAG band, TNUoS residual and locational, BSUoS, Capacity Market, CfD, RO, FIT, CCL, supplier margin. No other building-level tool models UK network charges at this resolution. Every intervention is modelled against the real cost stack, not a flat rate.</p>
                </div>
              </li>
              <li className="p-why-item p-reveal" data-d="1">
                <div className="p-why-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 18l6-12 4 8 3-5 5 9" /></svg></div>
                <div className="p-why-body">
                  <h4>Half-hourly resolution</h4>
                  <p>Every calculation runs at half-hourly granularity against the site's actual demand profile. Solar dispatch, battery charge/discharge, peak shaving, arbitrage - all modelled period by period, not as monthly or annual averages.</p>
                </div>
              </li>
              <li className="p-why-item p-reveal" data-d="2">
                <div className="p-why-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21V8M9 21V3M15 21V12M21 21V6" /></svg></div>
                <div className="p-why-body">
                  <h4>Independent escalation</h4>
                  <p>Each cost component escalates at its own rate over the lifecycle projection. Network charges, wholesale prices, levies, and supplier margins don't move in lockstep, and PABLO doesn't pretend they do. Published rates where available; projection assumptions explicit and adjustable.</p>
                </div>
              </li>
              <li className="p-why-item p-reveal" data-d="3">
                <div className="p-why-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="6" width="16" height="12" rx="1" /><rect x="20" y="10" width="2" height="4" /><path d="M8 12h8" /></svg></div>
                <div className="p-why-body">
                  <h4>Battery dispatch integrity</h4>
                  <p>PABLO's LP solver dispatches batteries with real-world constraints: round-trip efficiency, depth of discharge, cycle life, degradation cost from CAPEX, maximum daily cycles, warranty limits. No simultaneous charge and discharge. No cheating the physics.</p>
                </div>
              </li>
              <li className="p-why-item p-reveal" data-d="4">
                <div className="p-why-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16v16H4z" /><path d="M4 9h16M9 4v16" /></svg></div>
                <div className="p-why-body">
                  <h4>Decision-grade design</h4>
                  <p>The output is a defensible investment case, not a control signal. Built for figuring out the right answer before anyone has to operate it. When the asset is eventually deployed and run by an EMS provider, a flexibility aggregator, or an in-house team, the strategy that's being executed is one PABLO has already made fully transparent.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ========== SECTION 7 - WHO PABLO IS FOR ========== */}
      <section className="p-section" id="who" data-screen-label="07 Who it's for">
        <div className="pablo-frame">
          <div className="p-eyebrow p-reveal" data-d="0">Who it's for</div>
          <div className="p-who p-reveal" data-d="1">
            <div className="p-who-block">
              <h4>MEP consultants &amp; energy advisors</h4>
              <p>Running building assessments and recommending interventions worth millions. The pain point: spreadsheets and rules of thumb to make decisions of that scale. PABLO matches the complexity of the problem.</p>
            </div>
            <div className="p-who-block">
              <h4>Sustainability consultants</h4>
              <p>Developing decarbonisation roadmaps and electrification strategies. The pain point: electricity is the critical pathway, but cost modelling is typically crude. PABLO models the real cost implications with confidence.</p>
            </div>
            <div className="p-who-block">
              <h4>Building owners &amp; estate managers</h4>
              <p>Making investment decisions on solar, batteries, electrification - usually based on proposals from providers each presenting their own numbers. PABLO is the tool that lets you interrogate a tender response, running every proposal through the same lifecycle model against your actual demand.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION 8 - CTA ========== */}
      <section className="p-section" id="pablo-cta" data-screen-label="08 CTA">
        <div className="pablo-frame">
          <div className="p-cta">
            <h2 className="p-headline p-reveal" data-d="0">See PABLO with <em>your</em> data.</h2>
            <p className="p-cta-body p-reveal" data-d="1">
              Book a demo and we'll run a real building's half-hourly profile through PABLO.
              The bill decomposed. The interventions tested. The lifecycle case projected.
              Forty-five minutes. No pitch deck.
            </p>
            <a className="p-cta-button p-reveal" data-d="2" href="mailto:hello@netzeroadvisory.example?subject=PABLO%20demo">
              Book a demo
              <span aria-hidden="true">→</span>
            </a>
            <p className="p-cta-trust p-reveal" data-d="3">
              Built by NZA Consultancy. The energy intelligence platform behind NZA's smart energy
              and behind-the-meter strategy work.
            </p>
          </div>
        </div>
      </section>

      <footer
        className="footer"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '32px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          color: 'var(--p-fg-3)',
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          borderTop: '1px solid var(--p-rule-soft)',
        }}
      >
        <span>NZA · Net Zero Advisory · PABLO</span>
        <span>© 2026</span>
      </footer>
    </>
  )
}
