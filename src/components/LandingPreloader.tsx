import { useEffect, useRef, useState } from 'react'
import { NzaMarkLayered } from './svg/NzaMarkLayered'
import { NetZeroAdvisoryLayered } from './svg/NetZeroAdvisoryLayered'
import {
  preloaderState,
  PRELOADER_DISMISSED_EVENT,
  hasPreloaderRunThisLoad,
  markPreloaderHasRunThisLoad,
} from '../lib/preloaderState'

/**
 * Cream preloader screen. Full-viewport overlay that sits on top of the
 * navy hero until either:
 *   - the 4.5-second sequence completes and auto-transitions out, OR
 *   - the user scrolls manually (auto-transition cancelled, overlay
 *     pinned for the rest of the session)
 *
 * Timing budget:
 *   0.0s - 2.0s   Mark fills with navy from the bottom upward, percentage
 *                 counter ticks 0 -> 100%
 *   2.0s - 3.0s   "NET ZERO" mask-reveal in navy (slab wipes across,
 *                 revealing the SVG wordmark as it passes)
 *   3.1s - 4.1s   "ADVISORY" mask-reveal in coral (same pattern, coral slab)
 *   4.1s - 4.5s   Hold
 *   4.5s          Cream zooms out curving toward the bottom-right of
 *                 the mark, revealing the navy hero
 *
 * The wordmark is the layered SVG (NetZeroAdvisoryLayered) at a
 * confident scale per Chris. Mask reveal: a coloured slab grows from
 * the left, covers the wordmark, then shrinks from the left as the
 * SVG behind it becomes visible - "the slab leaves the text behind".
 * Both wordmarks use the same pattern with their respective colours
 * (navy for NET ZERO, coral for ADVISORY).
 *
 * Background carries a 4-blob field at heavy blur with co-prime
 * durations so the visible pattern never loops.
 *
 * Brief: docs/briefs/landing-page-brief.md
 */
const AUTO_DISMISS_MS = 4500
const FILL_DURATION_MS = 2000

export function LandingPreloader() {
  // Once-per-load skip. If the preloader has already run since the
  // page bundle loaded (e.g. user went /pablo -> back to /), short-
  // circuit: synchronously flip preloaderState.dismissed so the hero
  // MaskReveals see "already dismissed" on their first effect run,
  // and render nothing. Hard or soft refresh reloads the JS bundle
  // and resets this flag.
  const skip = hasPreloaderRunThisLoad()
  if (skip) {
    preloaderState.dismissed = true
  }

  const [dismissed, setDismissed] = useState(skip)
  const [percent, setPercent] = useState(skip ? 100 : 0)
  const dismissedRef = useRef(skip)

  useEffect(() => {
    if (skip) {
      // Belt-and-braces - emit the event on the next microtask so any
      // listener that subscribed before the synchronous flag set still
      // receives the trigger. (preloaderState.dismissed was set during
      // render above; this is just for waitForPreloader instances that
      // weren't checking the flag synchronously.)
      Promise.resolve().then(() => {
        window.dispatchEvent(new CustomEvent(PRELOADER_DISMISSED_EVENT))
      })
      return
    }

    // Reset the singleton flag on mount so a fresh visit to / makes
    // hero MaskReveals wait again (they observe this via
    // waitForPreloader). Without the reset, navigating to /pablo and
    // back would leave dismissed=true from the previous visit and the
    // mask reveals would fire immediately on re-mount.
    preloaderState.dismissed = false

    function dismiss() {
      if (dismissedRef.current) return
      dismissedRef.current = true
      setDismissed(true)
      // Flip the singleton + emit the event so any MaskReveal that
      // opted into waitForPreloader can fire its reveal sequence now.
      preloaderState.dismissed = true
      // Mark this load as "preloader already shown" so future remounts
      // (e.g. user nav to /pablo and back) skip it.
      markPreloaderHasRunThisLoad()
      window.dispatchEvent(new CustomEvent(PRELOADER_DISMISSED_EVENT))
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
  }, [skip])

  // Skip = nothing rendered. The hero MaskReveals will see the
  // synchronously-set preloaderState.dismissed = true and reveal on
  // their first effect run.
  if (skip) return null

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

        {/* WORDMARK - three reveals back-to-back, all from the layered SVG.
            "NET"       rises up from below at 2.0s
            "ZERO"      rises up from below at 2.4s
            "ADVISORY"  mask-revealed left-to-right at 3.0s
                        (coral slab sweeps across, leaving the SVG
                        wordmark visible in its wake)
            All sized off the same SVG so weights and proportions
            stay canonical. The slot containers have overflow:hidden
            so the rise-up SVGs are clipped to their final positions. */}
        <div className="landing-wordmark">
          <span className="landing-wordmark-rise landing-wordmark-net">
            <NetZeroAdvisoryLayered show="net" />
          </span>
          <span className="landing-wordmark-rise landing-wordmark-zero">
            <NetZeroAdvisoryLayered show="zero" />
          </span>
          <span className="landing-wordmark-mask landing-wordmark-advisory">
            <NetZeroAdvisoryLayered show="advisory" />
          </span>
        </div>
      </div>
    </div>
  )
}
