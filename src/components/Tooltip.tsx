import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import '../styles/tooltip.css'

/**
 * Tooltip - inline reference popover used to expand on a term inside
 * body copy without sending the reader away. First (and currently only)
 * use is the decodED manifesto's "climate action plan" reference, which
 * surfaces a DfE Sustainability and Climate Change Strategy summary plus
 * a "Read on gov.uk" link.
 *
 * Behaviour (redesigned per Chris, July 2026):
 *   - The TRIGGER no longer navigates. It's a button, not a link -
 *     hovering (desktop) OR clicking/tapping (any device) opens the
 *     popover. The reader only leaves for gov.uk if they actively click
 *     the link INSIDE the popover.
 *   - Desktop (hover-capable): hover the trigger or the popover to keep
 *     it open; a short close-grace covers the trigger -> popover transit
 *     so the footer link stays reachable.
 *   - Touch / any device: tap the trigger to toggle the popover. Tap
 *     anywhere outside (or press Escape) to close. This is what makes
 *     the popover usable on touch, where the previous hover-only version
 *     suppressed it entirely.
 *
 * The popover is styled in decodED's palette (cream card, deep-green
 * text, hairline green border, orange link) so it reads as part of the
 * site rather than a browser-default tooltip - see tooltip.css.
 *
 * Use:
 *   <Tooltip
 *     label="climate action plan"
 *     body="Long-form explanation."
 *     footerHref="https://example.com"
 *     footerText="Read on gov.uk"
 *   />
 *
 * Spec origin: docs/briefs/nza-manifestos-and-solutions-brief.md
 * Movement 2, revised July 2026.
 */

export interface TooltipProps {
  /** Inline trigger text, e.g. "climate action plan". Rendered inside a
   *  button - it opens the popover, it does NOT navigate. */
  label: ReactNode
  /** Body paragraph shown inside the popover. */
  body: string
  /** Optional footer link target (e.g. "Read on gov.uk"). This is the
   *  ONLY navigation out of the popover; opens in a new tab. */
  footerHref?: string
  /** Optional footer link label. Required if `footerHref` is set. */
  footerText?: string
}

/* Time the popover stays alive after the cursor leaves the trigger,
   before the cursor reaches the popover. 180ms covers the typical
   trigger -> popover transit without holding the popover open long
   enough to feel sticky. */
const CLOSE_GRACE_MS = 180

export function Tooltip({ label, body, footerHref, footerText }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<number | undefined>(undefined)
  const wrapRef = useRef<HTMLSpanElement | null>(null)
  /* matchMedia check happens once at mount. Hover open/close only apply
     on hover-capable pointers; touch relies on click-to-toggle. */
  const hoverCapable = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    hoverCapable.current = window.matchMedia(
      '(hover: hover) and (pointer: fine)',
    ).matches
  }, [])

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current !== undefined) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = undefined
    }
  }, [])

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer])

  const handleEnter = () => {
    if (!hoverCapable.current) return
    clearCloseTimer()
    setOpen(true)
  }

  const handleLeave = () => {
    if (!hoverCapable.current) return
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_GRACE_MS)
  }

  const handleTriggerClick = () => {
    clearCloseTimer()
    setOpen((curr) => !curr)
  }

  /* When open, close on any click/tap outside the wrapper, or on
     Escape. The trigger button lives inside the wrapper, so its own
     click never trips the outside-close (it toggles via its handler). */
  useEffect(() => {
    if (!open) return
    const onDocPointer = (e: MouseEvent) => {
      const target = e.target as Node | null
      if (wrapRef.current && target && wrapRef.current.contains(target)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('click', onDocPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onDocPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <span
      ref={wrapRef}
      className={'tooltip-wrap' + (open ? ' is-open' : '')}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        className="tooltip-trigger"
        aria-expanded={open}
        onClick={handleTriggerClick}
      >
        {label}
      </button>
      {open && (
        <span className="tooltip-popover" role="tooltip">
          <span className="tooltip-popover-caret" aria-hidden="true" />
          <span className="tooltip-popover-body">{body}</span>
          {footerHref && footerText && (
            <a
              className="tooltip-popover-link"
              href={footerHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {footerText}
              <span aria-hidden="true"> ↗</span>
            </a>
          )}
        </span>
      )}
    </span>
  )
}
