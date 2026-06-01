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
 * (--bp-phone at 600px), same reveal layer + snap-paging behaviours.
 *
 * Content is distinct from PABLO. Visual placeholders for the hero
 * animation, before/after split, three-phase diagram, and three drill/
 * scenario/report screenshots are honest scaffolds (navy card with
 * coral rule + label) awaiting production assets, per the brief.
 *
 * Voice: third-person throughout; the v8 copy's "we" instances are
 * rewritten per CLAUDE.md.
 * AI mention count: exactly three, per the brief - Discovery card,
 * Stewardship card, plus the brand name "NZ:AI" itself.
 *
 * Source: docs/briefs/NZ_AI_Implementation_Brief_for_CoWork.md +
 * NZ_AI_Web_Page_Copy_v8.md (the latter is the authoritative copy).
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

      {/* Sections land in subsequent chunks (chunk 2 onward). This shell
          is committed first so the route is reachable and the nav + body
          scoping are wired before content lands. */}
      <main className="nz-ai-shell" id="nz-ai-top">
        <div className="nz-ai-frame">
          <p style={{ padding: '120px 0', textAlign: 'center', color: 'var(--fg-on-navy-2)' }}>
            NZ:AI - sections coming online in the next chunks.
          </p>
        </div>
      </main>
    </>
  )
}
