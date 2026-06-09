import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { NzaLogoWide } from './svg/NzaLogoWide'

/**
 * Site-wide sticky navigation. Renders on every page above the route
 * content. Reads body.context-* classes (added by useContextClass per
 * page) to adapt its background tint, logo colour, and CTA variant.
 *
 * Chunks so far:
 *   2 - shell + sticky + layout
 *   3 - logo recolour per context
 *   4 - dropdowns (this chunk): "Our products" + "About us"
 *
 * Next: chunk 5 - CTA per-context variants; chunk 6 - mobile menu;
 * chunk 7 - product/about/clients stubs; chunk 8 - verification.
 *
 * Brief: docs/briefs/nza-navigation-brief.md
 */

const CONTACT_HREF = 'mailto:chrisscott@thenza.co.uk?subject=NZA%20Get%20in%20touch'

type OpenMenu = 'products' | 'about' | null

const CLOSE_GRACE_MS = 150

export function SiteNav() {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null)
  // Timer used to delay the close so the user can move the cursor
  // from the trigger down onto the panel without losing it.
  const closeTimerRef = useRef<number | null>(null)

  function cancelCloseTimer() {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  function openDropdown(menu: OpenMenu) {
    cancelCloseTimer()
    setOpenMenu(menu)
  }

  function scheduleClose() {
    cancelCloseTimer()
    closeTimerRef.current = window.setTimeout(() => {
      setOpenMenu(null)
      closeTimerRef.current = null
    }, CLOSE_GRACE_MS)
  }

  // Escape key closes any open dropdown.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        cancelCloseTimer()
        setOpenMenu(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Cleanup any pending close timer on unmount.
  useEffect(() => () => cancelCloseTimer(), [])

  return (
    <nav className="site-nav" aria-label="Site">
      <div className="site-nav-inner">
        <Link
          className="site-nav-logo"
          to="/"
          aria-label="Net Zero Advisory - home"
        >
          <NzaLogoWide />
        </Link>

        <div className="site-nav-right">
          <ul className="site-nav-items">
            {/* OUR PRODUCTS */}
            <li
              className="site-nav-item"
              onMouseEnter={() => openDropdown('products')}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                className="site-nav-trigger"
                aria-haspopup="menu"
                aria-expanded={openMenu === 'products'}
                onClick={() =>
                  setOpenMenu((m) => (m === 'products' ? null : 'products'))
                }
              >
                Our products
                <span className="site-nav-chevron" aria-hidden="true" />
              </button>
              {openMenu === 'products' && (
                <div className="site-nav-dropdown" role="menu">
                  <Link
                    to="/pablo"
                    className="site-nav-dropdown-item"
                    role="menuitem"
                    onClick={() => setOpenMenu(null)}
                  >
                    <span
                      className="site-nav-dropdown-swatch site-nav-dropdown-swatch--pablo"
                      aria-hidden="true"
                    />
                    PABLO
                  </Link>
                  <Link
                    to="/nz-ai"
                    className="site-nav-dropdown-item"
                    role="menuitem"
                    onClick={() => setOpenMenu(null)}
                  >
                    <span
                      className="site-nav-dropdown-swatch site-nav-dropdown-swatch--nzai"
                      aria-hidden="true"
                    />
                    NZ:AI
                  </Link>
                  <Link
                    to="/decoded"
                    className="site-nav-dropdown-item"
                    role="menuitem"
                    onClick={() => setOpenMenu(null)}
                  >
                    <span
                      className="site-nav-dropdown-swatch site-nav-dropdown-swatch--decoded"
                      aria-hidden="true"
                    />
                    decodED
                  </Link>
                </div>
              )}
            </li>

            {/* ABOUT US */}
            <li
              className="site-nav-item"
              onMouseEnter={() => openDropdown('about')}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                className="site-nav-trigger"
                aria-haspopup="menu"
                aria-expanded={openMenu === 'about'}
                onClick={() =>
                  setOpenMenu((m) => (m === 'about' ? null : 'about'))
                }
              >
                About us
                <span className="site-nav-chevron" aria-hidden="true" />
              </button>
              {openMenu === 'about' && (
                <div className="site-nav-dropdown" role="menu">
                  <Link
                    to="/approach"
                    className="site-nav-dropdown-item"
                    role="menuitem"
                    onClick={() => setOpenMenu(null)}
                  >
                    Our approach
                  </Link>
                  <Link
                    to="/expertise"
                    className="site-nav-dropdown-item"
                    role="menuitem"
                    onClick={() => setOpenMenu(null)}
                  >
                    Our expertise
                  </Link>
                  <Link
                    to="/about"
                    className="site-nav-dropdown-item"
                    role="menuitem"
                    onClick={() => setOpenMenu(null)}
                  >
                    Who we are
                  </Link>
                </div>
              )}
            </li>

            {/* WHO WE WORK WITH (flat link) */}
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
