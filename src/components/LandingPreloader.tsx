import { useEffect, useRef, useState } from 'react'

/**
 * Cream preloader screen. Full-viewport overlay that sits on top of the
 * navy hero until either:
 *   - the 4-second sequence completes and auto-transitions out, OR
 *   - the user scrolls manually (auto-transition cancelled, overlay
 *     pinned for the rest of the session)
 *
 * Sequence (filled in across chunks 2-6):
 *   0.0s - 2.0s   Mark fills with navy from the bottom upward, percentage
 *                 counter ticks 0 -> 100%, soft-edged feather on the rising
 *                 fill so it doesn't look like a hard sweep
 *   2.0s - 3.5s   "NET ZERO" typewriter in navy, "ADVISORY" typewriter in
 *                 coral, letter-by-letter
 *   ~4.0s         Cream screen slides up, navy hero takes over
 *
 * Background carries a 4-blob field at heavy blur with co-prime durations
 * so the pattern never visibly loops. Tonal blobs (cream-on-cream) carry
 * the texture, with coral and navy accents drifting through.
 *
 * Brief: docs/briefs/landing-page-brief.md
 */
export function LandingPreloader() {
  // Track whether the preloader should still be on screen. Two ways to
  // dismiss: the 4s auto-transition timer, or any manual scroll.
  const [dismissed, setDismissed] = useState(false)
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

    // Auto-transition fallback - fires at the brief's ~4s mark unless
    // a scroll fired first.
    const autoTimer = window.setTimeout(dismiss, 4000)

    return () => {
      window.removeEventListener('wheel', onScroll)
      window.removeEventListener('touchstart', onScroll)
      window.removeEventListener('keydown', onScroll)
      window.clearTimeout(autoTimer)
    }
  }, [])

  return (
    <div
      className={'landing-preloader' + (dismissed ? ' is-dismissed' : '')}
      aria-hidden={dismissed}
      role="presentation"
    >
      {/* Sequence layers land in chunks 2-6 */}
      <div className="landing-preloader-inner">
        {/* Mark - hollow at rest, fills with navy from the bottom */}
        {/* Percentage counter */}
        {/* Wordmark (NET ZERO + ADVISORY) */}
        {/* Scroll affordance */}
      </div>
    </div>
  )
}
