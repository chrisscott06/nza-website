import { useEffect, useRef, useState } from 'react'
import { CAPABILITIES, type Capability } from '../data/capabilities'
import { CAPABILITY_ICONS, ArrowRightIcon } from './svg/CapabilityIcons'

/**
 * Approach 6-card grid with click-to-reveal expanded panel.
 *
 * Open: clicked card gets `is-source` (visibility hidden so the panel
 * appears to grow out of it). The overlay un-hides, gains `is-open` on
 * the next frame so its CSS transition kicks in (scale 0.97 → 1, opacity
 * 0 → 1, ~360ms). Card #6 ("Co-built platforms") triggers the navy
 * register via `disrupt` on the overlay.
 *
 * Close: remove `is-open`, wait the transition out, hide the panel,
 * un-source the card. Esc and × both close.
 *
 * Mirrors nza-website.html's openCap / closeCap (lines 1920-2011).
 */

const TRANSITION_MS = 360

/** First sentence (heavier ink) + body. Returns null if no clean break. */
function splitLead(s: string): { lead: string; body: string } {
  const m = s.match(/^([^.!?]+[.!?])\s+(.+)$/s)
  if (!m) return { lead: s, body: '' }
  return { lead: m[1], body: m[2] }
}

/** Wrap leading sentence in <span class="lead"> for the lens explainers. */
function leadify(s: string) {
  const { lead, body } = splitLead(s)
  if (!body) return s
  return (
    <>
      <span className="lead">{lead}</span> {body}
    </>
  )
}

export function ApproachGrid() {
  const [active, setActive] = useState<Capability | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const animatingRef = useRef(false)

  function openCap(cap: Capability) {
    if (animatingRef.current) return
    animatingRef.current = true
    setActive(cap)
    // Defer the is-open flip to the next frame so the entrance transition
    // fires from the scale(0.97)/opacity:0 state. requestAnimationFrame
    // alone is sometimes not enough — chain two for browsers that batch.
    requestAnimationFrame(() => requestAnimationFrame(() => setIsOpen(true)))
    window.setTimeout(() => {
      animatingRef.current = false
    }, TRANSITION_MS + 60)
  }

  function closeCap() {
    if (animatingRef.current || !active) return
    animatingRef.current = true
    setIsOpen(false)
    window.setTimeout(() => {
      setActive(null)
      animatingRef.current = false
    }, TRANSITION_MS)
  }

  // Esc to close
  useEffect(() => {
    if (!active) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCap()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  // Body flag so useSnapPaging knows to bail while the panel is open.
  useEffect(() => {
    if (active) {
      document.body.dataset.capOpen = 'true'
    } else {
      delete document.body.dataset.capOpen
    }
    return () => {
      delete document.body.dataset.capOpen
    }
  }, [active])

  return (
    <div className="cap-grid-wrap reveal-layer" data-d="2">
      <div className="cap-grid" id="capGrid">
        {CAPABILITIES.map((cap) => {
          const Icon = CAPABILITY_ICONS[cap.id - 1]
          const isSource = active?.id === cap.id
          return (
            <button
              key={cap.id}
              className={
                'cap-card' + (cap.disrupt ? ' disrupt' : '') + (isSource ? ' is-source' : '')
              }
              data-cap={cap.id}
              type="button"
              onClick={() => (active?.id === cap.id ? closeCap() : openCap(cap))}
              aria-expanded={isSource}
            >
              <div className="cap-card-top">
                <span className="cap-icon" aria-hidden="true">
                  <Icon />
                </span>
                <span className="cap-num">{String(cap.id).padStart(2, '0')}</span>
              </div>
              <div className="cap-card-foot">
                <h3 className="cap-title">
                  {cap.titleHasEmphasis ? (
                    <>
                      Co-built <em>platforms</em>
                    </>
                  ) : (
                    cap.title
                  )}
                </h3>
                <span className="cap-arrow" aria-hidden="true">
                  <ArrowRightIcon />
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {active && <CapExpanded cap={active} isOpen={isOpen} onClose={closeCap} />}
    </div>
  )
}

function CapExpanded({
  cap,
  isOpen,
  onClose,
}: {
  cap: Capability
  isOpen: boolean
  onClose: () => void
}) {
  const Icon = CAPABILITY_ICONS[cap.id - 1]
  const { lead, body } = splitLead(cap.desc)

  return (
    <div
      className={'cap-expanded' + (isOpen ? ' is-open' : '') + (cap.disrupt ? ' disrupt' : '')}
      id="capExpanded"
    >
      <div className="cap-expanded-top-half">
        <div className="cap-expanded-header-icon">
          <span className="cap-icon" id="capExpIcon" aria-hidden="true">
            <Icon />
          </span>
          <span className="cap-expanded-num" id="capExpNum">
            {String(cap.id).padStart(2, '0')}
          </span>
        </div>
        <div className="cap-expanded-descriptor">
          <button className="cap-expanded-close" id="capExpClose" type="button" aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <p className="cap-expanded-desc-lead" id="capExpDescLead">{lead}</p>
          {body && <p className="cap-expanded-desc-body" id="capExpDescBody">{body}</p>}
        </div>
      </div>
      <div className="cap-expanded-lenses">
        <div className="cap-expanded-lens">
          <div className="cap-expanded-lens-head">
            <span className="lens-mark data" aria-hidden="true">
              <img src="/assets/icon-data-layers.svg" alt="" />
            </span>
            Data visualisation
          </div>
          <p id="capExpData">{leadify(cap.data)}</p>
        </div>
        <div className="cap-expanded-lens">
          <div className="cap-expanded-lens-head">
            <span className="lens-mark tools" aria-hidden="true">
              <img src="/assets/icon-digital-brain.svg" alt="" />
            </span>
            Digital tool creation
          </div>
          <p id="capExpTools">{leadify(cap.tools)}</p>
        </div>
        <div className="cap-expanded-lens">
          <div className="cap-expanded-lens-head">
            <span className="lens-mark strategy" aria-hidden="true">
              <img src="/assets/icon-target-dot.svg" alt="" />
            </span>
            Strategy development
          </div>
          <p id="capExpStrategy">{leadify(cap.strategy)}</p>
        </div>
      </div>
    </div>
  )
}
