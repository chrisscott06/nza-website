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
            SECTIONS 4-7 land in subsequent chunks
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
