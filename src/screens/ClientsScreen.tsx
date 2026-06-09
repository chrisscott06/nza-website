import { CLIENTS, clientInitials } from '../data/clients'

/**
 * Clients screen - cream ground, fast continuous logo slider.
 *
 * Stripped down per Chris (May 2026): no header copy, no popover,
 * no prev/next arrows, no footer. Just the logos sliding past at
 * pace - "it is clear who we work with".
 *
 * Implementation: CSS marquee. The track renders the full client
 * list TWICE so the second half is the seamless wrap of the first;
 * a CSS keyframe slides the track by -50% (one full set width) on a
 * linear infinite loop. Hover pauses for readability without
 * stopping the loop entirely.
 *
 * The previous useClientCarousel rAF hook + popover + arrows are no
 * longer used here. ClientPopover component is left in the repo in
 * case a future "see client details" surface wants it back.
 */
export function ClientsScreen() {
  return (
    <section
      className="screen canvas-paper clients-slider-screen"
      id="clients"
      data-screen-label="Clients"
    >
      <div className="clients-slider" aria-label="Clients we've worked with">
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
    </section>
  )
}
