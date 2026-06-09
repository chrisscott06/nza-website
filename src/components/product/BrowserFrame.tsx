import { useEffect, useRef, useState } from 'react'

/**
 * Stylised browser window frame containing three product screens that
 * cross-fade between each other on a 4.5-second hold cycle.
 *
 * - Hold = HOLD_MS per screen
 * - Cross-fade = CROSSFADE_MS
 * - Hover pauses; mouse-leave resumes from the current screen with the
 *   timer reset
 * - Progress segments at the bottom of the frame are clickable to jump
 *   directly to that screen + reset the timer
 *
 * Brief: docs/briefs/nza-product-page-template-brief.md (Section 1)
 */

const HOLD_MS = 4500
const CROSSFADE_MS = 600 // also referenced in CSS

export type BrowserFrameScreen = {
  /** Path to the PNG. If absent, a placeholder is rendered. */
  src?: string
  /** Short label rendered in the placeholder if `src` is missing. */
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
  // Cycle key forces remount of the progress fill animation when jumping
  // to a specific screen, so the segment restarts cleanly.
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

  // Schedule the next advance whenever the active screen changes.
  // Pause halts via state read so we don't need to clear/restart manually.
  useEffect(() => {
    if (paused) return
    scheduleAdvance()
    return () => clearTimer()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, paused])

  function jumpTo(index: number) {
    if (index === activeIndex) {
      // Restart the current screen's timer + animation
      setCycleKey((k) => k + 1)
    } else {
      setActiveIndex(index)
      setCycleKey((k) => k + 1)
    }
  }

  return (
    <div
      className="browser-frame"
      role="presentation"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Chrome - dots + URL bar */}
      <div className="browser-frame-chrome" aria-hidden="true">
        <div className="browser-frame-dots">
          <span className="browser-frame-dot" />
          <span className="browser-frame-dot" />
          <span className="browser-frame-dot" />
        </div>
        <div className="browser-frame-urlbar" />
      </div>

      {/* Screen viewport - layered images that cross-fade */}
      <div className="browser-frame-screen">
        {screens.map((screen, i) => {
          const isActive = i === activeIndex
          if (screen.src) {
            return (
              <img
                key={i}
                className={'browser-frame-img' + (isActive ? ' is-active' : '')}
                src={screen.src}
                alt={screen.alt}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            )
          }
          return (
            <div
              key={i}
              className={'browser-frame-placeholder' + (isActive ? ' is-active' : '')}
              aria-label={screen.alt}
              role="img"
            >
              <span className="browser-frame-placeholder-label">
                {screen.shortLabel}
              </span>
            </div>
          )
        })}

        {/* Progress segments at the bottom of the viewport */}
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
                aria-label={`View screen ${i + 1}`}
                onClick={() => jumpTo(i)}
              >
                <span
                  className="browser-frame-progress-fill"
                  /* key cycles the animation when jumping/restarting */
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
