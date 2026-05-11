import { useEffect, useState } from 'react'
import { GhgProtocolDiagram } from '../components/svg/GhgProtocolDiagram'
import { useGhgReveal } from '../hooks/useGhgReveal'
import { useMediaQuery } from '../hooks/useMediaQuery'
import {
  EXPERTISE_ZONES,
  zoneCenterPct,
  zoneLeftPct,
  zoneRightPct,
  type ZoneId,
} from '../data/expertiseZones'

/**
 * Expertise (02) - GHG-protocol diagram with interactive zones.
 *
 * Desktop: four zone labels above the SVG. Hover/focus/click a label
 * to highlight the corresponding zone of the illustration with a coral
 * radial glow and reveal a panel of body copy anchored to the zone's
 * x-slice. Cross-fade between zones; Esc + tap-outside dismiss.
 *
 * Mobile (<600px): SVG hidden entirely. Four expandable cards stack
 * below the body, each <details> opening to show the same zone body
 * copy. Multiple cards can be open simultaneously (not accordion-style).
 *
 * Brief: docs/briefs/expertise-page-brief.md
 */
export function ExpertiseScreen() {
  const [activeZone, setActiveZone] = useState<ZoneId | null>(null)
  const isPhone = useMediaQuery('(max-width: 599px)')
  useGhgReveal()

  // Esc dismisses any open panel.
  useEffect(() => {
    if (!activeZone) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setActiveZone(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeZone])

  const active = EXPERTISE_ZONES.find((z) => z.id === activeZone) ?? null

  return (
    <section className="screen canvas-navy" id="capabilities" data-screen-label="02 Expertise">
      <div className="frame">
        <div className="capabilities">
          <div className="capabilities-text">
            <div className="eyebrow reveal-layer" data-d="0">
              <span className="orbit-marker" aria-hidden="true" />
              02 · Expertise
            </div>
            <h2 className="headline reveal-layer" data-d="1">
              Buildings expertise, <em>systems thinking.</em>
            </h2>
            <p className="lede reveal-layer" data-d="2">
              NZA's foundation is in building physics, systems engineering and energy
              markets. From there we work outward - across the wider networks,
              decisions and markets that shape every estate - with the digital tools
              to model all of it together.
            </p>

            {/* Mobile-only: four expandable cards. Hidden on >=600px via CSS;
                the desktop GHG interactive carries the same content over there. */}
            <div className="ghg-zone-cards" aria-label="Expertise zones">
              {EXPERTISE_ZONES.map((z) => (
                <details key={z.id} className="ghg-zone-card">
                  <summary>{z.label}</summary>
                  <p>{z.body}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Desktop interactive zone diagram. CSS hides this whole block on
              phone (<600). The mobile-only cards above carry the same content. */}
          <div
            className={'ghg-interactive' + (activeZone ? ' has-active' : '')}
            onMouseLeave={() => setActiveZone(null)}
          >
            <div className="ghg-zone-labels" role="tablist" aria-label="Expertise zones">
              {EXPERTISE_ZONES.map((z) => (
                <button
                  key={z.id}
                  id={`ghg-zone-label-${z.id}`}
                  type="button"
                  role="tab"
                  className={'ghg-zone-label' + (activeZone === z.id ? ' is-active' : '')}
                  aria-selected={activeZone === z.id}
                  aria-controls={`ghg-zone-panel-${z.id}`}
                  onMouseEnter={() => !isPhone && setActiveZone(z.id)}
                  onFocus={() => setActiveZone(z.id)}
                  onClick={() => setActiveZone(activeZone === z.id ? null : z.id)}
                >
                  {z.label}
                </button>
              ))}
            </div>

            <div className="ghg-stage">
              {/* Radial coral glow clipped to the active zone's x-slice. */}
              <div
                className={'ghg-zone-glow' + (active ? ' is-on' : '')}
                style={
                  active
                    ? {
                        '--glow-left': `${zoneLeftPct(active)}%`,
                        '--glow-right': `${100 - zoneRightPct(active)}%`,
                        '--glow-center': `${zoneCenterPct(active)}%`,
                      } as React.CSSProperties
                    : undefined
                }
                aria-hidden="true"
              />

              <GhgProtocolDiagram />

              {/* Panel anchored to active zone. Positioned via CSS variables
                  so the cross-fade between zones is a smooth slide + content
                  swap rather than a full dismiss/re-mount. */}
              <div
                className={'ghg-zone-panel' + (active ? ' is-on' : '')}
                role="region"
                id={active ? `ghg-zone-panel-${active.id}` : undefined}
                aria-labelledby={active ? `ghg-zone-label-${active.id}` : undefined}
                style={
                  active
                    ? ({
                        '--panel-center': `${zoneCenterPct(active)}%`,
                      } as React.CSSProperties)
                    : undefined
                }
              >
                {active && (
                  <>
                    <h3 className="ghg-zone-panel-heading">{active.label}</h3>
                    <p className="ghg-zone-panel-body">{active.body}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
