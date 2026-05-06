import { NzaWordmark } from './svg/NzaWordmark'

export type NavLink = {
  /** Anchor target (without the leading `#`) — e.g. "home", "capabilities". */
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
  /** Hook intercept for click — e.g. for smooth-scroll. Return `false` to allow default browser nav. */
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
  return (
    <nav className="nav">
      <div className="nav-shell">
        <a className="nav-mark" href={homeHref} aria-label="NZA - Net Zero Advisory · home">
          <NzaWordmark className="nav-logo" />
        </a>
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
      </div>
    </nav>
  )
}
