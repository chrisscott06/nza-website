import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Capability } from '../data/capabilities'

type Props = {
  cap: Capability
  isOpen: boolean
  onClose: () => void
}

const TRANSITION_MS = 360
const SWIPE_DOWN_THRESHOLD = 80

/** Split first sentence (heavier ink) + body. */
function splitLead(s: string): { lead: string; body: string } {
  const m = s.match(/^([^.!?]+[.!?])\s+(.+)$/s)
  if (!m) return { lead: s, body: '' }
  return { lead: m[1], body: m[2] }
}

/**
 * Phone-only full-screen modal for an Approach capability.
 *
 * Replaces the desktop in-place expanded panel at <600px. The desktop
 * pattern (overlay growing inside the cap-grid) doesn't translate to
 * phone - the grid is single-column, so an overlay would just cover
 * the card it grew from with no visual context. A modal is what users
 * expect on a phone for "drill into this thing" anyway.
 *
 *   - Slides up from the bottom edge with a fade (CSS class .is-open).
 *   - Header bar: round back button (44x44), capability title in
 *     DM Serif at 18px.
 *   - Body: scroll-y if the content overflows the viewport. Sleek
 *     scrollbar via .sleek-scroll.
 *     Lead sentence (DM Serif 24px), body paragraph, three lens sections
 *     stacked vertically (each: icon + Stolzl head + body).
 *   - Card #6 (disrupt) variant: the panel goes navy with cream text and
 *     keeps the coral accents - same register as the desktop disrupt.
 *   - Body scroll-locked while open.
 *   - Close: back button, Esc, swipe-down (touchstart/touchend Y delta
 *     > 80px), backdrop-touch.
 */
export function MobileApproachModal({ cap, isOpen, onClose }: Props) {
  const { lead, body } = splitLead(cap.desc)

  // Body scroll lock.
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  // Esc to close.
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Swipe-down to close. Track touch start Y; on touch end, if the user
  // has dragged the finger down more than the threshold, dismiss.
  const touchStartYRef = useRef<number | null>(null)
  function onTouchStart(e: React.TouchEvent) {
    touchStartYRef.current = e.touches[0]?.clientY ?? null
  }
  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStartYRef.current
    touchStartYRef.current = null
    if (start == null) return
    const end = e.changedTouches[0]?.clientY ?? start
    if (end - start > SWIPE_DOWN_THRESHOLD) onClose()
  }

  return createPortal(
    <div
      className={
        'mobile-cap-modal' +
        (isOpen ? ' is-open' : '') +
        (cap.disrupt ? ' disrupt' : '')
      }
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-cap-modal-title"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="mobile-cap-modal-backdrop" onClick={onClose} />
      <div className="mobile-cap-modal-panel sleek-scroll">
        <header className="mobile-cap-modal-header">
          <button
            type="button"
            className="mobile-cap-modal-back"
            onClick={onClose}
            aria-label="Back to all capabilities"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h2 id="mobile-cap-modal-title" className="mobile-cap-modal-title">
            {cap.titleHasEmphasis ? (
              <>
                Co-built <em>platforms</em>
              </>
            ) : (
              cap.title
            )}
          </h2>
        </header>

        <div className="mobile-cap-modal-body">
          <div className="mobile-cap-modal-icon" aria-hidden="true">
            <img src={`/assets/${cap.icon}.svg`} alt="" />
          </div>

          <p className="mobile-cap-modal-lead">{lead}</p>
          {body && <p className="mobile-cap-modal-desc">{body}</p>}

          <div className="mobile-cap-modal-lenses">
            <Lens
              iconSrc="/assets/lens-data.svg"
              label="Data visualisation"
              text={cap.data}
            />
            <Lens
              iconSrc="/assets/icon-digital-brain.svg"
              label="Digital tool creation"
              text={cap.tools}
            />
            <Lens
              iconSrc="/assets/icon-target-dot.svg"
              label="Strategy development"
              text={cap.strategy}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function Lens({ iconSrc, label, text }: { iconSrc: string; label: string; text: string }) {
  const { lead, body } = splitLead(text)
  return (
    <section className="mobile-cap-modal-lens">
      <header className="mobile-cap-modal-lens-head">
        <span className="mobile-cap-modal-lens-icon" aria-hidden="true">
          <img src={iconSrc} alt="" />
        </span>
        <span className="mobile-cap-modal-lens-label">{label}</span>
      </header>
      <p className="mobile-cap-modal-lens-text">
        {body ? (
          <>
            <span className="lead">{lead}</span> {body}
          </>
        ) : (
          lead
        )}
      </p>
    </section>
  )
}

// Re-export the timing constant so the parent can match its own
// state-machine timeout to the CSS transition.
export const MOBILE_CAP_MODAL_TRANSITION_MS = TRANSITION_MS
