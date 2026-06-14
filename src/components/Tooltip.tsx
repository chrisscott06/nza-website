import { useEffect, useRef, useState, type ReactNode } from 'react'
import '../styles/tooltip.css'

/**
 * Tooltip - small hover popover used to expand on inline references
 * inside body copy. First use is the decodED manifesto's "climate
 * action plan" link, which surfaces the DfE Sustainability and
 * Climate Change Strategy summary plus a "Read on gov.uk" footer
 * link.
 *
 * Behaviour:
 *   - Desktop (hover-capable): hover the trigger or the popover to
 *     keep it open. A 180ms close grace lets the user move the
 *     cursor from the trigger to the popover without the popover
 *     vanishing mid-flight (the popover footer link would be
 *     unreachable otherwise).
 *   - Touch devices (no hover): the popover is suppressed entirely.
 *     The trigger still works as a normal link - tap opens the
 *     destination. The `@media (hover: hover) and (pointer: fine)`
 *     guard handles the pointer-feature detection in CSS, with a
 *     matchMedia check in JS so we don't even attach the listeners
 *     on touch.
 *
 * Use:
 *   <Tooltip
 *     body="Long-form explanation."
 *     footerHref="https://example.com"
 *     footerText="Read more"
 *   >
 *     <a href="https://example.com">trigger text</a>
 *   </Tooltip>
 *
 * Spec: docs/briefs/nza-manifestos-and-solutions-brief.md Movement 2
 * (decodED manifesto's gov.uk link tooltip).
 */

export interface TooltipProps {
  /** Inline trigger - typically an <a> element wrapping the text. */
  children: ReactNode
  /** Body paragraph shown inside the popover. */
  body: string
  /** Optional footer link target (e.g. "Read on gov.uk"). Renders
   *  inside the popover; opens in a new tab. */
  footerHref?: string
  /** Optional footer link label. Required if `footerHref` is set. */
  footerText?: string
}

/* Time the popover stays alive after the cursor leaves the trigger,
   before the cursor reaches the popover. 180ms covers the typical
   trigger -> popover transit without holding the popover open long
   enough to feel sticky. */
const CLOSE_GRACE_MS = 180

export function Tooltip({
  children,
  body,
  footerHref,
  footerText,
}: TooltipProps) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<number | undefined>(undefined)
  /* matchMedia check happens once at mount. We never attach hover
     listeners on touch devices - they just render the trigger as a
     normal link. */
  const hoverCapable = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    hoverCapable.current = window.matchMedia(
      '(hover: hover) and (pointer: fine)',
    ).matches
  }, [])

  useEffect(
    () => () => {
      if (closeTimer.current !== undefined) {
        window.clearTimeout(closeTimer.current)
      }
    },
    [],
  )

  const handleEnter = () => {
    if (!hoverCapable.current) return
    if (closeTimer.current !== undefined) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = undefined
    }
    setOpen(true)
  }

  const handleLeave = () => {
    if (!hoverCapable.current) return
    closeTimer.current = window.setTimeout(() => {
      setOpen(false)
    }, CLOSE_GRACE_MS)
  }

  return (
    <span
      className={'tooltip-wrap' + (open ? ' is-open' : '')}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
      {open && (
        <span
          className="tooltip-popover"
          role="tooltip"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
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
