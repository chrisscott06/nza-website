import { useEffect, useRef, useState } from 'react'
import { NzaMarkLayered } from './svg/NzaMarkLayered'
import { CharacterMorph } from './CharacterMorph'

/**
 * Cream preloader screen. Full-viewport overlay that sits on top of the
 * navy hero until either:
 *   - the 4.5-second sequence completes and auto-transitions out, OR
 *   - the user scrolls manually (auto-transition cancelled, overlay
 *     pinned for the rest of the session)
 *
 * Timing budget (slowed from 3s -> 4.5s per Chris's "less rushed" call):
 *   0.0s - 2.0s   Mark fills with navy from the bottom upward, percentage
 *                 counter ticks 0 -> 100%
 *   2.0s - 2.8s   "NET ZERO" typewriter wipes in (Stolzl Medium, navy)
 *   2.9s - 4.0s   "ADVISORY" character-morphs in (Stolzl Light, coral)
 *                 - letters scramble through random glyphs and resolve
 *                   position-by-position left-to-right
 *   4.0s - 4.5s   Hold
 *   4.5s          Cream zooms out curving toward the bottom-right of
 *                 the mark, revealing the navy hero
 *
 * The "NET ZERO" half uses a CSS clip-path wipe of text rendered in
 * Stolzl Medium directly (not the SVG wordmark) - cleaner per Chris's
 * latest. The "ADVISORY" half uses CharacterMorph in Stolzl Light, coral.
 *
 * Background carries a 4-blob field at heavy blur with co-prime
 * durations so the visible pattern never loops.
 *
 * Brief: docs/briefs/landing-page-brief.md
 */
const AUTO_DISMISS_MS = 4500
const FILL_DURATION_MS = 2000
// NET ZERO clip-path wipe timing is held in landing.css (animation
// delay 2000ms, duration 800ms) - the wipe is CSS-driven so React
// doesn't need to know the exact frame.
const ADVISORY_START_MS = 2900
const ADVISORY_DURATION_MS = 1100

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

        {/* WORDMARK - two reveals back-to-back.
            "NET ZERO"  Stolzl Medium navy, clip-path wipe at 2.0s (0.8s)
            "ADVISORY"  Stolzl Light coral, character-morph at 2.9s (1.1s)
            Text-based (not SVG) so the typographic weight comes from
            the font, not the path geometry. */}
        <div className="landing-wordmark">
          <span className="landing-wordmark-net-zero">NET ZERO</span>
          <CharacterMorph
            target="ADVISORY"
            durationMs={ADVISORY_DURATION_MS}
            startDelayMs={ADVISORY_START_MS}
            className="landing-wordmark-advisory"
          />
        </div>
      </div>
    </div>
  )
}
