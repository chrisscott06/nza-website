import { CLIENTS, clientInitials } from '../data/clients'

type Props = {
  /**
   * `landing` renders a thin band intended to sit at the bottom of
   * the landing hero section (~52px tall). `standalone` (default)
   * renders as a fuller standalone cream section.
   */
  variant?: 'standalone' | 'landing'
}

/**
 * Cream marquee of client logos. Continuous CSS-animation slide
 * (doubled track for seamless wrap), hover-pauses for readability.
 *
 * Two variants:
 *   - 'standalone' (default) - tall cream band, used as its own
 *     section when ClientsScreen is rendered standalone
 *   - 'landing' - thin band, used at the bottom of the landing
 *     screen per Chris's revised landing layout. Smaller cells +
 *     reduced padding so it reads as a strip running along the
 *     bottom of the hero rather than a separate scroll section.
 */
export function ClientsStrip({ variant = 'standalone' }: Props) {
  const wrapperClass =
    'clients-slider' + (variant === 'landing' ? ' clients-slider--thin' : '')

  return (
    <div className={wrapperClass} aria-label="Clients we've worked with">
      <div className="clients-slider-track">
        {[...CLIENTS, ...CLIENTS].map((c, i) => (
          <div key={i} className="clients-slider-cell" aria-hidden={i >= CLIENTS.length}>
            <span className="clients-slider-logo">
              {c.logoSrc ? (
                <img
                  src={c.logoSrc}
                  alt={i < CLIENTS.length ? c.name : ''}
                  className="clients-slider-logo-img"
                />
              ) : (
                <span className="clients-slider-logo-initials">
                  {clientInitials(c.name)}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
