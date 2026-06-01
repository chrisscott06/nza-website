import { useEffect } from 'react'
import { FloatingNav, type NavLink } from '../components/FloatingNav'

// NZ:AI links back to the website's anchors. "Products" stays active.
const NZ_AI_NAV_LINKS: NavLink[] = [
  { id: 'home', label: 'Home' },
  { id: 'capabilities', label: 'Expertise' },
  { id: 'approach', label: 'Approach' },
  { id: 'products', label: 'Products' },
  { id: 'clients', label: 'Clients' },
]

/**
 * NZ:AI product page - bespoke carbon intelligence platform.
 *
 * Architectural sibling of /pablo: same shell, same FloatingNav with
 * anchor-routing back to the website, same body class scoping pattern
 * (here: `nz-ai-page` + `on-navy`), same responsive boundary
 * (--bp-phone at 600px).
 *
 * Voice: third-person throughout; v8 "we" instances rewritten per
 * CLAUDE.md and the brief's no-first-person rule.
 *
 * AI mention budget: exactly three across the page - Discovery card,
 * Stewardship card, brand name itself. No more.
 *
 * Visual assets are scaffolds for launch - navy cards with thin coral
 * rule + monospace label, sized at the final asset's aspect ratio so
 * the layout doesn't shift on visual delivery.
 *
 * Source: docs/briefs/nz-ai-page-brief.md
 * Copy:   docs/briefs/nz-ai-copy-v8.md
 */
export function NzAiPage() {
  useEffect(() => {
    document.body.classList.add('nz-ai-page', 'on-navy')
    return () => {
      document.body.classList.remove('nz-ai-page', 'on-navy')
    }
  }, [])

  return (
    <>
      <FloatingNav
        activeId="products"
        homeHref="/#home"
        hrefFor={(link) => `/#${link.id}`}
        links={NZ_AI_NAV_LINKS}
      />

      <main className="nz-ai-shell">
        {/* ============================================================
            SECTION 1 - HERO
            ============================================================ */}
        <section className="nz-ai-section nz-ai-hero" id="hero">
          <div className="nz-ai-frame">
            <div className="nz-ai-hero-grid">
              <div className="nz-ai-hero-text">
                <div className="nz-ai-eyebrow">
                  <span className="nzai-mark">
                    NZ<span className="nzai-colon">:</span>AI
                  </span>
                  <span className="eyebrow-sep" aria-hidden="true" />
                  Net Zero Advisory and Intelligence
                </div>
                <h1 className="nz-ai-headline">
                  Bespoke platforms that give your team the granular data to{' '}
                  <em>act on</em>. Built around how your organisation actually
                  works.
                </h1>
                <p className="nz-ai-lede">
                  Real decarbonisation is a team effort. It needs granular data,
                  the right people seeing it, and the ability to act on what
                  they see.
                </p>
                <a
                  className="nz-ai-cta"
                  href="mailto:chrisscott@thenza.co.uk?subject=NZ%3AAI%20conversation"
                >
                  Start a conversation
                  <span className="nz-ai-cta-arrow" aria-hidden="true">→</span>
                </a>
              </div>

              {/* HERO ANIMATION PLACEHOLDER - per brief Section 7.
                  Final asset: a single chart morphing through forms
                  (bar / tree map / waterfall / trajectory / drill-down).
                  Aspect ratio held at 1.5:1 so the layout doesn't shift
                  when the production animation drops in. */}
              <div className="nz-ai-hero-visual">
                <div className="nz-ai-placeholder" role="img" aria-label="Hero animation placeholder">
                  <span className="nz-ai-placeholder-label">
                    [hero animation placeholder]
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 2 - THE OPPORTUNITY
            ============================================================ */}
        <section className="nz-ai-section" id="opportunity">
          <div className="nz-ai-frame">
            <div className="nz-ai-editorial-grid">
              <div className="nz-ai-editorial-text">
                <h2 className="nz-ai-section-headline">
                  You can't meaningfully change what you can't meaningfully{' '}
                  <em>see</em>.
                </h2>
                <p className="nz-ai-body">
                  Most organisations trying to take decarbonisation seriously are
                  working from static reports and scattered spreadsheets.
                  Numbers that are months old by the time they land.
                  Aggregations that don't tell you where to act.
                </p>
                <p className="nz-ai-body">
                  The cost of building genuinely bespoke intelligence has
                  dropped dramatically. Work that until recently required
                  enterprise-scale budgets can now be delivered as a
                  partnership, for organisations of every size.
                </p>
              </div>
              <div className="nz-ai-editorial-visual">
                <div className="nz-ai-before-after">
                  <div
                    className="nz-ai-placeholder nz-ai-placeholder--before"
                    role="img"
                    aria-label="Before state placeholder"
                  >
                    <span className="nz-ai-placeholder-label">[before]</span>
                  </div>
                  <div
                    className="nz-ai-placeholder nz-ai-placeholder--after"
                    role="img"
                    aria-label="After state placeholder"
                  >
                    <span className="nz-ai-placeholder-label">[after]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 3 - WHAT IT IS
            ============================================================ */}
        <section className="nz-ai-section" id="what-it-is">
          <div className="nz-ai-frame">
            {/* Brief flagged italic emphasis on "you" but the v8 headline
                doesn't contain a standalone "you" - italicised "your"
                instead, which carries the same personalisation axis the
                brief intended. */}
            <h2 className="nz-ai-section-headline">
              A platform built entirely for the way <em>your</em> organisation
              works.
            </h2>
            <p className="nz-ai-body">
              NZ:AI is a bespoke carbon intelligence platform, configured around
              how your organisation actually runs. Your data, your sites, your
              departments, your projects, your suppliers. Whatever the units are
              that shape how decisions get made in your business.
            </p>
            <p className="nz-ai-body">
              The result is a platform your team interrogates the way they
              think - not the way someone else's product roadmap decided they
              should. Different roles see different views. The same underlying
              numbers serve a sustainability lead, an estates team, a finance
              director, and a board.
            </p>
            {/* v8: "...we can also ingest historic data..." rewritten to
                drop the "we" while keeping the conditional opener. */}
            <p className="nz-ai-body">
              Where the relationship supports it, NZ:AI also ingests historic
              data alongside current-year - turning what you already have into
              a multi-year story rather than a starting point.
            </p>

            {/* CONFIGURATION SEQUENCE PLACEHOLDER - per brief.
                Four small frames with fictional client names, frame
                border colour shifts across the row (orange -> purple,
                echoing the GHG arrow gradient on Expertise). */}
            <div className="nz-ai-config-sequence">
              <div
                className="nz-ai-config-frame"
                style={{ '--frame-accent': '#F69247' } as React.CSSProperties}
              >
                <p className="nz-ai-config-frame-name">Northgate Properties</p>
                <p className="nz-ai-config-frame-label">[configuration 01]</p>
              </div>
              <div
                className="nz-ai-config-frame"
                style={{ '--frame-accent': '#F16B55' } as React.CSSProperties}
              >
                <p className="nz-ai-config-frame-name">Ashford Schools</p>
                <p className="nz-ai-config-frame-label">[configuration 02]</p>
              </div>
              <div
                className="nz-ai-config-frame"
                style={{ '--frame-accent': '#F0637B' } as React.CSSProperties}
              >
                <p className="nz-ai-config-frame-name">Penwick Group</p>
                <p className="nz-ai-config-frame-label">[configuration 03]</p>
              </div>
              <div
                className="nz-ai-config-frame"
                style={{ '--frame-accent': '#AF5FA0' } as React.CSSProperties}
              >
                <p className="nz-ai-config-frame-name">Linfield Estates</p>
                <p className="nz-ai-config-frame-label">[configuration 04]</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 4 - HOW IT WORKS
            Three-card section. Discovery sits full-width and weighted
            (it's where the substantive work happens); Build and
            Stewardship sit side-by-side below.
            ============================================================ */}
        <section className="nz-ai-section" id="how-it-works">
          <div className="nz-ai-frame">
            <h2 className="nz-ai-section-headline">
              Three phases. One relationship. Shaped to <em>you</em>.
            </h2>

            <div className="nz-ai-phases">
              {/* Discovery - full width, visually weighted */}
              <article className="nz-ai-phase-card nz-ai-phase-card--discovery">
                <p className="nz-ai-phase-card-num">01 Discovery</p>
                <h3 className="nz-ai-phase-card-title">
                  Where the real work happens.
                </h3>
                {/* v8: "We get inside your data..." rewritten to drop
                    the "we"s - Discovery is the subject. The pace line
                    follows the brief's exact rewrite ("The pace can move
                    fast or stay slow"). */}
                <p className="nz-ai-phase-card-body">
                  Discovery gets inside your data, your operations, and how
                  decisions actually get made in your organisation. The pace
                  can move fast or stay slow - set by you and by what the
                  data reveals. The first cycle typically runs anywhere from
                  a few months to a year, depending on where you are starting
                  from.
                </p>
                {/* AI mention #1 (of 3 budgeted on the page). Brief
                    rewrite: "AI lets us build quickly" -> "AI
                    accelerates the build". */}
                <p className="nz-ai-phase-card-body">
                  AI accelerates the build. The partnership work -
                  understanding your organisation properly - is what takes the
                  time, and it's what makes the rest of it stick.
                </p>
                <p className="nz-ai-phase-card-body">
                  You leave Discovery with an agreed methodology, a working
                  platform, and a defensible inventory.
                </p>
              </article>

              {/* Build + Stewardship side-by-side */}
              <div className="nz-ai-phase-row">
                <article className="nz-ai-phase-card">
                  <p className="nz-ai-phase-card-num">02 Build</p>
                  <h3 className="nz-ai-phase-card-title">
                    The platform takes shape.
                  </h3>
                  {/* v8: "As we learn how your organisation works..."
                      rewritten to "As the partnership learns..." */}
                  <p className="nz-ai-phase-card-body">
                    Discovery and Build run alongside each other. As the
                    partnership learns how your organisation works, the
                    platform takes shape: data architecture, ingestion,
                    configurable views, drill-down, scenario tools, automated
                    reporting. A plain-English methodology document - versioned,
                    structured to be readable by both engineers and
                    non-technical stakeholders - sits alongside the platform as
                    a deliverable in its own right.
                  </p>
                  <p className="nz-ai-phase-card-body">
                    You own it from day one. Your team uses it. Your future
                    data flows through it.
                  </p>
                </article>

                <article className="nz-ai-phase-card">
                  <p className="nz-ai-phase-card-num">03 Stewardship</p>
                  <h3 className="nz-ai-phase-card-title">
                    A relationship that keeps the platform sharp.
                  </h3>
                  {/* AI mention #2 (of 3). Two "we"/"us" rewrites:
                      "our effort, presence, and judgement" -> drop "our";
                      "What we commit to..." -> "What the partnership
                      commits to..." */}
                  <p className="nz-ai-phase-card-body">
                    An ongoing partnership that keeps the platform sharp. The
                    relationship is built around effort, presence, and
                    judgement, rather than a fixed list of deliverables -
                    because the rate at which AI is changing what's possible
                    means a fixed list would be obsolete within months. What
                    the partnership commits to is direction, methodology
                    stewardship, and the time to apply both to whatever you
                    most need.
                  </p>
                  {/* v8: "...others want us close in alongside their team"
                      rewritten to drop the "us". */}
                  <p className="nz-ai-phase-card-body">
                    In practice that means strategy reviews, framework support,
                    methodology updates pushed in without you having to ask,
                    and a defined block of advisory time for the live
                    questions. The rhythm is set by you - some clients want
                    light annual touchpoints, others want close-in support
                    alongside their team.
                  </p>
                  {/* The italic-coral ownership line in full per the
                      brief. Required to land verbatim. */}
                  <p className="nz-ai-phase-ownership">
                    You own your platform - code, data, methodology, and the
                    architecture that holds it together - whether or not you
                    continue the partnership. Stewardship is what keeps it
                    methodologically current and lets your team get more from
                    it as you grow.
                  </p>
                </article>
              </div>
            </div>

            {/* THREE-PHASE DIAGRAM - inline SVG. Discovery (larger,
                coral), Build (overlapping Discovery slightly per brief),
                Stewardship separated by a flow line. Cream stroke on
                navy, line-icon style consistent with the rest of the
                site. Hidden on phone. */}
            <div className="nz-ai-phase-diagram" aria-hidden="true">
              <svg viewBox="0 0 520 80" xmlns="http://www.w3.org/2000/svg">
                {/* Flow line from Build to Stewardship */}
                <line
                  x1="220" y1="40" x2="430" y2="40"
                  stroke="var(--rule-dark)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                {/* Discovery - the largest node, coral stroke */}
                <circle
                  cx="80" cy="40" r="32"
                  fill="none"
                  stroke="var(--coral)"
                  strokeWidth="1.5"
                />
                <text
                  x="80" y="44"
                  textAnchor="middle"
                  fontFamily="var(--font-display)"
                  fontSize="9"
                  letterSpacing="0.18em"
                  fill="var(--fg-on-navy-2)"
                  style={{ textTransform: 'uppercase' }}
                >
                  Discovery
                </text>
                {/* Build - overlapping Discovery slightly */}
                <circle
                  cx="170" cy="40" r="22"
                  fill="var(--ink-navy)"
                  stroke="var(--fg-on-navy-3)"
                  strokeWidth="1"
                />
                <text
                  x="170" y="43"
                  textAnchor="middle"
                  fontFamily="var(--font-display)"
                  fontSize="8"
                  letterSpacing="0.18em"
                  fill="var(--fg-on-navy-2)"
                  style={{ textTransform: 'uppercase' }}
                >
                  Build
                </text>
                {/* Stewardship - further along the flow line */}
                <circle
                  cx="460" cy="40" r="22"
                  fill="none"
                  stroke="var(--fg-on-navy-3)"
                  strokeWidth="1"
                />
                <text
                  x="460" y="43"
                  textAnchor="middle"
                  fontFamily="var(--font-display)"
                  fontSize="7.5"
                  letterSpacing="0.18em"
                  fill="var(--fg-on-navy-2)"
                  style={{ textTransform: 'uppercase' }}
                >
                  Stewardship
                </text>
              </svg>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 5 - WHAT IT DOES FOR YOUR TEAM
            Three tiles, each with screenshot placeholder + bold lead +
            body. Tile 1 has a quieter closing note.
            ============================================================ */}
        <section className="nz-ai-section" id="what-it-does">
          <div className="nz-ai-frame">
            <h2 className="nz-ai-section-headline">
              Different people. Different <em>questions</em>. One source of truth.
            </h2>

            <div className="nz-ai-tiles">
              {/* Tile 1 - Drill */}
              <div className="nz-ai-tile">
                <div
                  className="nz-ai-placeholder"
                  role="img"
                  aria-label="Drill-down view placeholder"
                >
                  <span className="nz-ai-placeholder-label">
                    [drill-down view placeholder]
                  </span>
                </div>
                <p className="nz-ai-tile-lead">
                  Drill from a headline number to a single decision.
                </p>
                <p className="nz-ai-tile-body">
                  Your sustainability lead can trace any figure to its source
                  document in a few clicks. Your estates team can isolate a
                  building, a site, or a contract. Your finance team can
                  interrogate a category by spend.
                </p>
                {/* The two-sentence note lands as a separate foot line
                    per brief - "Every figure auditable. Every assumption
                    visible." */}
                <p className="nz-ai-tile-note">
                  Every figure auditable. Every assumption visible.
                </p>
              </div>

              {/* Tile 2 - Model */}
              <div className="nz-ai-tile">
                <div
                  className="nz-ai-placeholder"
                  role="img"
                  aria-label="Scenario tool placeholder"
                >
                  <span className="nz-ai-placeholder-label">
                    [scenario tool placeholder]
                  </span>
                </div>
                <p className="nz-ai-tile-lead">
                  Model the change you're considering, before you commit to it.
                </p>
                <p className="nz-ai-tile-body">
                  What happens if your headcount grows by 20%? If you open a
                  new site? If you switch a supplier? Change an assumption, see
                  the impact immediately. Bring the choices in front of you to
                  life, instead of guessing.
                </p>
              </div>

              {/* Tile 3 - Automate */}
              <div className="nz-ai-tile">
                <div
                  className="nz-ai-placeholder"
                  role="img"
                  aria-label="Report export placeholder"
                >
                  <span className="nz-ai-placeholder-label">
                    [report export placeholder]
                  </span>
                </div>
                <p className="nz-ai-tile-lead">
                  Automate the reporting that currently eats your time.
                </p>
                <p className="nz-ai-tile-body">
                  PPN 0621. SECR. SBTi submissions. Board reports. Client
                  questionnaires. Generate them from the platform, tailored
                  for each audience, with every figure linked back to
                  methodology and source.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 6 - WHO IT'S FOR
            Editorial section with a sector tile grid.
            ============================================================ */}
        <section className="nz-ai-section" id="who-its-for">
          <div className="nz-ai-frame">
            <h2 className="nz-ai-section-headline">
              Organisations that want to do <em>more</em> than report.
            </h2>
            {/* v8: "where most of our work still sits" -> "where most of
                the work still sits" (drop "our"). */}
            <p className="nz-ai-body">
              NZA started in the built environment and that's where most of
              the work still sits. Property, contractors, design and
              engineering practices, education estates, developers,
              operators. But carbon decisions get made across every part of
              an organisation, and the platform is built for any organisation
              that wants to act on its data rather than just satisfy
              compliance.
            </p>
            {/* v8: "Most of our clients..." -> "Most NZA clients..." */}
            <p className="nz-ai-body">
              Most NZA clients have someone internally already leading on
              sustainability, with more ambition than the tools, depth, or
              budget allow. NZ:AI gives that person what they need to deliver
              on it - and connects them to the colleagues across estates,
              finance, operations, and leadership who hold the levers they
              need to pull.
            </p>

            {/* Sector tile grid - six tiles, one per sector named in the
                body. Lucide-style line glyphs at 22px, 1.5px stroke per
                the design system rule. */}
            <div className="nz-ai-sectors">
              <div className="nz-ai-sector-tile">
                {/* Property - building outline */}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="4" y="3" width="16" height="18" />
                  <line x1="8" y1="7" x2="10" y2="7" />
                  <line x1="14" y1="7" x2="16" y2="7" />
                  <line x1="8" y1="11" x2="10" y2="11" />
                  <line x1="14" y1="11" x2="16" y2="11" />
                  <line x1="8" y1="15" x2="10" y2="15" />
                  <line x1="14" y1="15" x2="16" y2="15" />
                </svg>
                <p className="nz-ai-sector-tile-label">Property</p>
              </div>

              <div className="nz-ai-sector-tile">
                {/* Contractors - hard hat */}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 18h16" />
                  <path d="M5 18a7 7 0 0 1 14 0" />
                  <line x1="9" y1="11" x2="9" y2="14" />
                  <line x1="15" y1="11" x2="15" y2="14" />
                </svg>
                <p className="nz-ai-sector-tile-label">Contractors</p>
              </div>

              <div className="nz-ai-sector-tile">
                {/* Design & engineering - compass */}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="7" r="2" />
                  <line x1="12" y1="9" x2="6" y2="20" />
                  <line x1="12" y1="9" x2="18" y2="20" />
                  <line x1="8" y1="16" x2="16" y2="16" />
                </svg>
                <p className="nz-ai-sector-tile-label">
                  Design &amp; engineering
                </p>
              </div>

              <div className="nz-ai-sector-tile">
                {/* Education - graduation cap */}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <polygon points="12,5 22,9 12,13 2,9" />
                  <path d="M6 11v4c0 1 2 3 6 3s6-2 6-3v-4" />
                </svg>
                <p className="nz-ai-sector-tile-label">Education</p>
              </div>

              <div className="nz-ai-sector-tile">
                {/* Developers - blueprint / layered rectangles */}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="4" y="6" width="12" height="14" />
                  <path d="M8 4h12v14" />
                </svg>
                <p className="nz-ai-sector-tile-label">Developers</p>
              </div>

              <div className="nz-ai-sector-tile">
                {/* Operators - gear */}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v3M12 19v3M22 12h-3M5 12H2M19.07 4.93l-2.12 2.12M7.05 16.95l-2.12 2.12M19.07 19.07l-2.12-2.12M7.05 7.05L4.93 4.93" />
                </svg>
                <p className="nz-ai-sector-tile-label">Operators</p>
              </div>
            </div>

            {/* Quiet link to the homepage Clients section per brief.
                Brief specifies "See who we work with" verbatim, but the
                no-first-person rule asks for a rewrite. Going with
                "See NZA's clients" - keeps the action, drops the "we",
                reads natural at link weight. Flag for Chris if he
                prefers the brief's exact wording. */}
            <a className="nz-ai-quiet-link" href="/#clients">
              See NZA's clients
              <span className="nz-ai-quiet-link-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        {/* ============================================================
            SECTION 7 - WHY NOW
            Editorial section, type-led. No visual for launch.
            ============================================================ */}
        <section className="nz-ai-section" id="why-now">
          <div className="nz-ai-frame">
            <h2 className="nz-ai-section-headline">
              The pressure has tipped. The tools have <em>caught up</em>.
            </h2>
            <p className="nz-ai-body">
              Carbon expectations have hardened on every front - procurement
              frameworks, regulated reporting, investor and client questions,
              supply chain pass-through requirements. Generic carbon tools
              were built for the world before these expectations existed.
            </p>
            <p className="nz-ai-body">
              Bespoke, granular, frictionless intelligence used to be the
              preserve of organisations with enterprise budgets. It isn't any
              more. NZ:AI is built for the gap that opened up.
            </p>
          </div>
        </section>


        {/* ============================================================
            SECTION 8 - CLOSING CTA
            ============================================================ */}
        <section className="nz-ai-section nz-ai-closing" id="contact">
          <div className="nz-ai-frame">
            <h2 className="nz-ai-section-headline">
              Let's work out if it's the right <em>fit</em>.
            </h2>
            {/* v8 ended with "we will understand / we will work out together".
                Rewritten to drop the "we"s while preserving the warmth
                via "together" - cooler than first-person but avoids the
                naff feel of pure third-person passive. */}
            <p className="nz-ai-body">
              Half an hour. Enough to understand where you are, what you have,
              and what you're aiming for - and to work out together whether a
              discovery sprint suits, or something else fits the situation
              better.
            </p>
            <a
              className="nz-ai-cta"
              href="mailto:chrisscott@thenza.co.uk?subject=NZ%3AAI%20conversation"
            >
              Start a conversation
              <span className="nz-ai-cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      </main>
    </>
  )
}
