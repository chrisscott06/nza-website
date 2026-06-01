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
            SECTIONS 2-7 land in subsequent chunks
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
