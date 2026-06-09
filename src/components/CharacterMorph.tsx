import { useEffect, useState } from 'react'

/**
 * Character-morph text effect: letters cycle through random glyphs and
 * resolve to the target word position by position, left-to-right.
 *
 * Pattern adapted from the leva-driven example Chris shared - same
 * `lockAt = (i / len) * 0.7 + 0.2` scheduling so each character locks
 * at a progressively later fraction of the total duration. Spaces are
 * preserved (not scrambled) so the visible rhythm matches the target.
 *
 * Used on the cream preloader for "ADVISORY" - a more deliberate reveal
 * than the clip-path wipe used for "NET ZERO", and one that reads as
 * the word being "decoded" character by character.
 *
 * The component renders the target with `visibility: hidden` during the
 * startDelayMs so layout space is already reserved when the morph
 * actually kicks in - no horizontal shift at the start of the reveal.
 */

const GLYPHS =
  '!@#$%^&*()_+-=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

type Props = {
  /** The final word the morph resolves to. */
  target: string
  /** How long the morph takes from first scramble to fully resolved. */
  durationMs: number
  /** Delay before the morph starts; component renders invisibly until then. */
  startDelayMs?: number
  className?: string
}

export function CharacterMorph({
  target,
  durationMs,
  startDelayMs = 0,
  className,
}: Props) {
  const [shown, setShown] = useState(target)
  const [started, setStarted] = useState(startDelayMs === 0)

  // startDelayMs gate - flips `started` to true after the delay, which
  // un-hides the element and kicks off the morph tick.
  useEffect(() => {
    if (startDelayMs === 0) return
    const t = window.setTimeout(() => setStarted(true), startDelayMs)
    return () => window.clearTimeout(t)
  }, [startDelayMs])

  // The morph tick - rAF-driven, runs once per frame, computes the
  // current per-position state from the global progress t.
  useEffect(() => {
    if (!started) return
    let rafId = 0
    const start = performance.now()

    function tick(now: number) {
      const t = Math.min(1, (now - start) / durationMs)
      const len = target.length
      let out = ''
      for (let i = 0; i < len; i++) {
        const tgt = target[i]
        // Each character "locks" at a progressively later fraction of
        // the duration - earlier letters resolve first, last letter
        // resolves at t = 0.9.
        const lockAt = (i / len) * 0.7 + 0.2
        if (t >= lockAt) {
          out += tgt
        } else if (tgt === ' ') {
          out += ' '
        } else {
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        }
      }
      setShown(out)
      if (t < 1) {
        rafId = requestAnimationFrame(tick)
      }
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [started, target, durationMs])

  // visibility: hidden during the start delay reserves layout space
  // (same width as the resolved target word) so the morph slot
  // doesn't shift the surrounding layout when the reveal kicks in.
  return (
    <span
      className={className}
      style={{ visibility: started ? 'visible' : 'hidden' }}
    >
      {shown}
    </span>
  )
}
