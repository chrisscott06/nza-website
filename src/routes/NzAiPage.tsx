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
                  can move fast or stay slow - set by you and by what the data
                  is telling us. The first cycle typically runs anywhere from
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
            SECTIONS 5-7 land in subsequent chunks
            ============================================================ */}

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
