import { useState } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { NzaWordmark } from './svg/NzaWordmark'
import { MobileNavMenu } from './MobileNavMenu'

export type NavLink = {
  /** Anchor target (without the leading `#`) - e.g. "home", "capabilities". */
  id: string
  /** Display label in the nav. */
  label: string
}

export const WEBSITE_NAV_LINKS: NavLink[] = [
  { id: 'home', label: 'Home' },
  { id: 'capabilities', label: 'Expertise' },
  { id: 'approach', label: 'Approach' },
  { id: 'products', label: 'Products' },
  { id: 'clients', label: 'Clients' },
]

type Props = {
  /** Currently active link `id`, or null if none should highlight. */
  activeId: string | null
  /** Where the logo should link to. Default `#home`. */
  homeHref?: string
  /** Custom href builder; defaults to `#${id}` for in-page anchors. */
  hrefFor?: (link: NavLink) => string
  /** Hook intercept for click - e.g. for smooth-scroll. */
  onLinkClick?: (link: NavLink, event: React.MouseEvent<HTMLAnchorElement>) => void
  links?: NavLink[]
}

export function FloatingNav({
  activeId,
  homeHref = '#home',
  hrefFor = (link) => `#${link.id}`,
  onLinkClick,
  links = WEBSITE_NAV_LINKS,
}: Props) {
  // <600px: pill becomes logo + hamburger; tap opens MobileNavMenu overlay.
  // >=600px: classic pill with the link list visible inline.
  const isPhone = useMediaQuery('(max-width: 599px)')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="nav">
        <div className={'nav-shell' + (isPhone ? ' nav-shell--phone' : '')}>
          <a className="nav-mark" href={homeHref} aria-label="NZA - Net Zero Advisory · home">
            <NzaWordmark className="nav-logo" />
          </a>
          {isPhone ? (
            <button
              type="button"
              className="nav-hamburger"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="4" y1="7"  x2="20" y2="7"  />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>
          ) : (
            <div className="nav-links">
              {links.map((link) => (
                <a
                  key={link.id}
                  className={'nav-link' + (activeId === link.id ? ' active' : '')}
                  href={hrefFor(link)}
                  onClick={(e) => onLinkClick?.(link, e)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>
      {isPhone && menuOpen && (
        <MobileNavMenu
          links={links}
          activeId={activeId}
          onClose={() => setMenuOpen(false)}
          onLinkClick={onLinkClick}
          hrefFor={hrefFor}
        />
      )}
    </>
  )
}
