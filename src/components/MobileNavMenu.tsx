import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { NavLink } from './FloatingNav'

type Props = {
  links: NavLink[]
  activeId: string | null
  onClose: () => void
  onLinkClick?: (link: NavLink, event: React.MouseEvent<HTMLAnchorElement>) => void
  hrefFor: (link: NavLink) => string
}

/**
 * Full-screen overlay menu for phone viewports (<600px). Triggered by
 * the hamburger button in FloatingNav.
 *
 * - Slides in (CSS animation: opacity + translateY) from the top.
 * - Body scroll-locked while open.
 * - Esc closes; backdrop tap closes; tapping a link closes and triggers
 *   the same onLinkClick the desktop pill nav uses (so smooth-scroll +
 *   hash update + active-state tracking all work the same way).
 *
 * Renders into document.body via portal so it sits above all page chrome
 * regardless of where in the tree the FloatingNav happens to live.
 */
export function MobileNavMenu({ links, activeId, onClose, onLinkClick, hrefFor }: Props) {
  // Lock body scroll while the menu is open.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Esc to close.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div className="mobile-nav-menu" role="dialog" aria-modal="true" aria-label="Site navigation" onClick={onClose}>
      <div className="mobile-nav-menu-shell" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="mobile-nav-menu-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <ul className="mobile-nav-menu-list">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={hrefFor(link)}
                className={'mobile-nav-menu-link' + (activeId === link.id ? ' active' : '')}
                onClick={(e) => {
                  // Run the standard handler (smooth-scroll + hash update),
                  // then close the menu. Order matters: the handler reads
                  // event.currentTarget which is still the anchor.
                  onLinkClick?.(link, e)
                  onClose()
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  )
}
