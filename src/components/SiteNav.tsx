import { Link } from 'react-router-dom'
import { NzaLogoWide } from './svg/NzaLogoWide'

/**
 * Site-wide sticky navigation. Renders on every page above the route
 * content. Reads body.context-* classes (added by useContextClass per
 * page) to adapt its background tint, logo colour, and CTA variant.
 *
 * Chunk 2 of the nav rebuild: shell + sticky + layout. The dropdown
 * triggers are inert buttons here - chunk 4 wires up the hover-open
 * panels. The CTA is the dark-context outlined treatment for now;
 * chunk 5 adds the per-context solid-fill variant.
 *
 * Mobile (<768px): nav items hidden, only logo + CTA visible. The
 * mobile menu overlay lands in chunk 6.
 *
 * Brief: docs/briefs/nza-navigation-brief.md
 */

const CONTACT_HREF = 'mailto:chrisscott@thenza.co.uk?subject=NZA%20Get%20in%20touch'

export function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Site">
      <div className="site-nav-inner">
        <Link className="site-nav-logo" to="/" aria-label="Net Zero Advisory - home">
          <NzaLogoWide />
        </Link>

        <div className="site-nav-right">
          <ul className="site-nav-items">
            <li className="site-nav-item">
              <button
                type="button"
                className="site-nav-trigger"
                aria-haspopup="menu"
                aria-expanded="false"
              >
                Our products
                <span className="site-nav-chevron" aria-hidden="true" />
              </button>
            </li>
            <li className="site-nav-item">
              <button
                type="button"
                className="site-nav-trigger"
                aria-haspopup="menu"
                aria-expanded="false"
              >
                About us
                <span className="site-nav-chevron" aria-hidden="true" />
              </button>
            </li>
            <li className="site-nav-item">
              <Link className="site-nav-link" to="/clients">
                Who we work with
              </Link>
            </li>
          </ul>
          <a className="site-nav-cta" href={CONTACT_HREF}>
            Get in touch
          </a>
        </div>
      </div>
    </nav>
  )
}
