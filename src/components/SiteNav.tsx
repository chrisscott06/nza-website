import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NzaLogoWide, NzaLogoMark } from './svg/NzaLogoWide'
import { useMediaQuery } from '../hooks/useMediaQuery'

/**
 * Site-wide sticky navigation. Renders on every page above the route
 * content. Reads body.context-* classes (added by useContextClass per
 * page) to adapt its background tint, logo colour, and CTA variant.
 *
 * Chunks so far:
 *   2 - shell + sticky + layout
 *   3 - logo recolour per context
 *   4 - dropdowns (Our products + About us)
 *   5 - CTA variants per context
 *   6 - mobile menu (this chunk)
 *
 * Mobile rules (per brief Section 6):
 *   - The mark itself is the menu trigger (no separate hamburger)
 *   - When open the mark turns coral; tap again to close
 *   - Menu overlay slides down from top, full screen below nav
 *   - Flat layout - all sections expanded inline, no nested dropdowns
 *
 * Brief: docs/briefs/nza-navigation-brief.md
 */

const CONTACT_HREF = 'mailto:chrisscott@thenza.co.uk?subject=NZA%20Get%20in%20touch'

type OpenMenu = 'products' | 'about' | null

const CLOSE_GRACE_MS = 150

export function SiteNav() {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 767px)')
  const closeTimerRef = useRef<number | null>(null)
  const location = useLocation()

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

  // Escape closes both desktop dropdowns AND the mobile overlay.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        cancelCloseTimer()
        setOpenMenu(null)
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Close mobile menu when the route changes (link tap).
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Body scroll lock while mobile menu is open.
  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  // Cleanup any pending close timer on unmount.
  useEffect(() => () => cancelCloseTimer(), [])

  return (
    <>
      <nav className="site-nav" aria-label="Site">
        <div className="site-nav-inner">
          {isMobile ? (
            <button
              type="button"
              className={
                'site-nav-mobile-trigger' +
                (mobileOpen ? ' is-open' : '')
              }
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <NzaLogoMark />
            </button>
          ) : (
            <Link
              className="site-nav-logo"
              to="/"
              aria-label="Net Zero Advisory - home"
            >
              <NzaLogoWide />
            </Link>
          )}

          <div className="site-nav-right">
            <ul className="site-nav-items">
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
                    setOpenMenu((m) =>
                      m === 'products' ? null : 'products',
                    )
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

      {/* MOBILE MENU OVERLAY - rendered as a sibling of the nav so it
          can slide down beneath the nav bar without z-stacking issues.
          Only rendered when isMobile so desktop doesn't pay for the
          listeners. */}
      {isMobile && mobileOpen && <MobileMenuOverlay onClose={() => setMobileOpen(false)} />}
    </>
  )
}

function MobileMenuOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="site-nav-mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu">
      <div className="site-nav-mobile-menu-inner">
        <section className="site-nav-mobile-section">
          <h2 className="site-nav-mobile-label">Products</h2>
          <Link
            to="/pablo"
            className="site-nav-mobile-link"
            onClick={onClose}
          >
            <span
              className="site-nav-dropdown-swatch site-nav-dropdown-swatch--pablo"
              aria-hidden="true"
            />
            PABLO
          </Link>
          <Link
            to="/nz-ai"
            className="site-nav-mobile-link"
            onClick={onClose}
          >
            <span
              className="site-nav-dropdown-swatch site-nav-dropdown-swatch--nzai"
              aria-hidden="true"
            />
            NZ:AI
          </Link>
          <Link
            to="/decoded"
            className="site-nav-mobile-link"
            onClick={onClose}
          >
            <span
              className="site-nav-dropdown-swatch site-nav-dropdown-swatch--decoded"
              aria-hidden="true"
            />
            decodED
          </Link>
        </section>

        <section className="site-nav-mobile-section">
          <h2 className="site-nav-mobile-label">About us</h2>
          <Link
            to="/approach"
            className="site-nav-mobile-link"
            onClick={onClose}
          >
            Our approach
          </Link>
          <Link
            to="/expertise"
            className="site-nav-mobile-link"
            onClick={onClose}
          >
            Our expertise
          </Link>
          <Link
            to="/about"
            className="site-nav-mobile-link"
            onClick={onClose}
          >
            Who we are
          </Link>
        </section>

        <section className="site-nav-mobile-section">
          <Link
            to="/clients"
            className="site-nav-mobile-link"
            onClick={onClose}
          >
            Who we work with
          </Link>
        </section>

        {/* CTA pinned at the bottom of the overlay, full-width. */}
        <a
          className="site-nav-cta site-nav-mobile-cta"
          href={CONTACT_HREF}
          onClick={onClose}
        >
          Get in touch
        </a>
      </div>
    </div>
  )
}
