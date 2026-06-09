import { useEffect, useRef, useState } from 'react'

/**
 * Stylised browser window frame containing three product screens that
 * cross-fade between each other on a 4.5-second hold cycle.
 *
 * - Hold = HOLD_MS per screen
 * - Cross-fade = CROSSFADE_MS
 * - Hover pauses; mouse-leave resumes
 * - Progress segments at the bottom are clickable to jump + reset timer
 * - If a screen's `src` PNG fails to load (or is omitted), the
 *   placeholder renders in its slot - so the page degrades gracefully
 *   while Chris is still preparing the real screenshots
 *
 * Brief: docs/briefs/nza-product-page-template-brief.md (Section 1)
 */

// Hold + crossfade times. Chris's notes:
//   4500ms (original brief spec) -> too slow, user waits on a panel
//   2250ms (half) -> too quick, doesn't give time to read each screen
//   3300ms (this) -> middle of the two, reads as deliberate
// Crossfade extended 600ms -> 900ms for the smoother fade he asked for.
const HOLD_MS = 3300
const CROSSFADE_MS = 900

export type BrowserFrameScreen = {
  /** Path to the PNG. If absent or fails to load, placeholder renders. */
  src?: string
  /** Short label rendered in the placeholder if `src` is missing/broken. */
  shortLabel: string
  /** Alt text on the rendered <img>. */
  alt: string
}

type Props = {
  screens: BrowserFrameScreen[]
}

export function BrowserFrame({ screens }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  // Per-screen broken flag, set when an <img> onError fires.
  const [broken, setBroken] = useState<Record<number, boolean>>({})
  // Cycle key forces remount of the progress fill animation when
  // jumping/restarting a segment.
  const [cycleKey, setCycleKey] = useState(0)
  const timerRef = useRef<number | null>(null)

  function clearTimer() {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }
  function scheduleAdvance() {
    clearTimer()
    timerRef.current = window.setTimeout(() => {
      setActiveIndex((i) => (i + 1) % screens.length)
      setCycleKey((k) => k + 1)
    }, HOLD_MS)
  }

  useEffect(() => {
    if (paused) return
    scheduleAdvance()
    return () => clearTimer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, paused])

  function jumpTo(index: number) {
    if (index === activeIndex) {
      setCycleKey((k) => k + 1)
    } else {
      setActiveIndex(index)
      setCycleKey((k) => k + 1)
    }
  }

  if (screens.length === 0) {
    return null
  }

  return (
    <div
      className="browser-frame"
      role="presentation"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="browser-frame-chrome" aria-hidden="true">
        <div className="browser-frame-dots">
          <span className="browser-frame-dot" />
          <span className="browser-frame-dot" />
          <span className="browser-frame-dot" />
        </div>
        <div className="browser-frame-urlbar" />
      </div>

      <div className="browser-frame-screen">
        {screens.map((screen, i) => {
          const isActive = i === activeIndex
          const isBroken = broken[i] === true
          // Render <img> only if src is provided AND not yet flagged
          // as broken. Otherwise render the placeholder in this slot.
          if (screen.src && !isBroken) {
            return (
              <img
                key={`img-${i}`}
                className={'browser-frame-img' + (isActive ? ' is-active' : '')}
                src={screen.src}
                alt={screen.alt}
                loading={i === 0 ? 'eager' : 'lazy'}
                onError={() => setBroken((b) => ({ ...b, [i]: true }))}
              />
            )
          }
          return (
            <div
              key={`ph-${i}`}
              className={'browser-frame-placeholder' + (isActive ? ' is-active' : '')}
              aria-label={screen.alt}
              role="img"
            >
              <div className="browser-frame-placeholder-inner">
                <span className="browser-frame-placeholder-num">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="browser-frame-placeholder-label">
                  {screen.shortLabel}
                </span>
                <span className="browser-frame-placeholder-hint">
                  Screenshot coming soon
                </span>
              </div>
            </div>
          )
        })}

        <div className="browser-frame-progress">
          {screens.map((_, i) => {
            const isActive = i === activeIndex
            return (
              <button
                key={i}
                type="button"
                className={
                  'browser-frame-progress-segment' +
                  (isActive ? ' is-active' : '') +
                  (isActive && paused ? ' is-paused' : '')
                }
                aria-label={`View screen ${i + 1} of ${screens.length}`}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => jumpTo(i)}
              >
                <span
                  className="browser-frame-progress-fill"
                  key={isActive ? cycleKey : undefined}
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export const BROWSER_FRAME_HOLD_MS = HOLD_MS
export const BROWSER_FRAME_CROSSFADE_MS = CROSSFADE_MS
