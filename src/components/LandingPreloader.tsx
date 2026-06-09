import { useEffect, useRef, useState } from 'react'
import { NzaMarkLayered } from './svg/NzaMarkLayered'
import { NetZeroAdvisoryLayered } from './svg/NetZeroAdvisoryLayered'

/**
 * Cream preloader screen. Full-viewport overlay that sits on top of the
 * navy hero until either:
 *   - the 3-second sequence completes and auto-transitions out, OR
 *   - the user scrolls manually (auto-transition cancelled, overlay
 *     pinned for the rest of the session)
 *
 * Timing budget (compressed from brief's 4s to 3s per Chris):
 *   0.0s - 1.5s   Mark fills with navy from the bottom upward, percentage
 *                 counter ticks 0 -> 100%
 *   1.5s - 2.1s   "NET ZERO" typewriter in navy (0.6s left-to-right wipe)
 *   2.2s - 2.7s   "ADVISORY" typewriter in coral (0.5s left-to-right wipe)
 *   2.7s - 3.0s   Hold
 *   3.0s          Cream screen slides up, navy hero takes over
 *
 * Background carries a 4-blob field at heavy blur with co-prime
 * durations so the visible pattern never loops. Two tonal cream blobs
 * carry the texture, a coral blob (~8% opacity) drifts through, and a
 * navy blob (~6% opacity) drifts through.
 *
 * Brief: docs/briefs/landing-page-brief.md
 */
const AUTO_DISMISS_MS = 3000
const FILL_DURATION_MS = 1500

export function LandingPreloader() {
  const [dismissed, setDismissed] = useState(false)
  const [percent, setPercent] = useState(0)
  const dismissedRef = useRef(false)

  useEffect(() => {
    function dismiss() {
      if (dismissedRef.current) return
      dismissedRef.current = true
      setDismissed(true)
    }

    // Manual-scroll override - any wheel / touch / key during the
    // preloader cancels the auto-transition and lets the user drive.
    const onScroll = () => dismiss()
    window.addEventListener('wheel', onScroll, { passive: true })
    window.addEventListener('touchstart', onScroll, { passive: true })
    window.addEventListener('keydown', onScroll)

    // Auto-transition fallback - fires at 3s unless a scroll fired
    // first. Synced with the CSS animations so the slide-up coincides
    // with the wordmark settling into its final state.
    const autoTimer = window.setTimeout(dismiss, AUTO_DISMISS_MS)

    // Percentage counter - rAF-driven so it tracks the CSS mark-fill
    // animation tightly even on slower devices. Stops at 100% when
    // the fill animation completes.
    const t0 = performance.now()
    let rafId = 0
    function tick(now: number) {
      const elapsed = now - t0
      const p = Math.min(100, Math.round((elapsed / FILL_DURATION_MS) * 100))
      setPercent(p)
      if (p < 100 && !dismissedRef.current) {
        rafId = requestAnimationFrame(tick)
      }
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('wheel', onScroll)
      window.removeEventListener('touchstart', onScroll)
      window.removeEventListener('keydown', onScroll)
      window.clearTimeout(autoTimer)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      className={'landing-preloader' + (dismissed ? ' is-dismissed' : '')}
      aria-hidden={dismissed}
      role="presentation"
    >
      {/* Background blob field - four soft-blurred drifters at heavy
          blur, co-prime durations so the visible pattern never
          repeats. Decoupled from the foreground sequence - blobs run
          continuously regardless of where the preloader is in its
          timing. */}
      <div className="landing-blobs landing-blobs--cream" aria-hidden="true">
        <span className="landing-blob landing-blob--tone-1" />
        <span className="landing-blob landing-blob--tone-2" />
        <span className="landing-blob landing-blob--coral" />
        <span className="landing-blob landing-blob--navy" />
      </div>

      <div className="landing-preloader-inner">
        {/* MARK - two stacked SVG layers:
            1. "hollow" - low-opacity navy outline mark, always visible
            2. "fill" - full-opacity navy mark, clip-pathed from the
               bottom up over 1.5s via CSS keyframes
            The "glass filling with ink" effect comes from the second
            layer wiping upward over the first. */}
        <div className="landing-mark">
          <NzaMarkLayered className="landing-mark-hollow" />
          <NzaMarkLayered className="landing-mark-fill" />
        </div>

        {/* PERCENTAGE COUNTER - mono font, navy at low opacity.
            Disappears when it hits 100% (the wordmark below takes
            over the slot at that moment). */}
        <div className="landing-counter" aria-hidden="true">
          {percent < 100 ? `${percent.toString().padStart(3, '0')}%` : ''}
        </div>

        {/* WORDMARK - two typewriter reveals back-to-back.
            "NET ZERO" wipes left-to-right in navy at 1.5s
            "ADVISORY" wipes left-to-right in coral at 2.2s
            The wipes are CSS clip-path animations driven by class
            modifiers that hold the final state. */}
        <div className="landing-wordmark">
          <span className="landing-wordmark-net-zero">
            <NetZeroAdvisoryLayered show="net-zero" />
          </span>
          <span className="landing-wordmark-advisory">
            <NetZeroAdvisoryLayered show="advisory" />
          </span>
        </div>
      </div>
    </div>
  )
}
