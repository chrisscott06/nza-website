import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * Slot-machine word swap. A dotted-outline frame contains a single
 * word that rotates through a locked sequence on a 2.5s cycle.
 *
 * Sequence (per brief, locked):
 *   1. decarbonisation
 *   2. climate complexity
 *   3. energy markets
 *   4. digital intelligence
 *
 * Each word holds in position for ~1.8s, then the next word slides up
 * from below the dotted frame, pushing the current word up and out
 * over ~700ms. The frame itself stays at a fixed visible-line height,
 * but its WIDTH stretches and squashes between words - sized to fit
 * each word's natural rendered width via JS measurement, with a CSS
 * width transition synchronised with the rotation.
 *
 * Width measurement uses a hidden span that inherits the frame's
 * computed font/padding/letter-spacing properties. measureRef's
 * offsetWidth gives the natural rendered width per word. Re-measures
 * on window resize because the headline font-size is viewport-scaled
 * via clamp().
 *
 * Reduced motion: animation disabled via media query; the first word
 * stays visible permanently. Frame width still measures so the
 * outline fits the visible word.
 */

const WORDS = [
  'decarbonisation',
  'climate complexity',
  'energy markets',
  'digital intelligence',
] as const

const CYCLE_MS = 2500

export function SlotMachineWord() {
  const measureRef = useRef<HTMLSpanElement>(null)
  const [index, setIndex] = useState(0)
  const [widths, setWidths] = useState<number[]>([])

  // Cycle ticker - monotonically increasing index.
  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => i + 1)
    }, CYCLE_MS)
    return () => window.clearInterval(id)
  }, [])

  // Measure each word's natural rendered width. Re-runs:
  //   - On mount (initial measurement)
  //   - When fonts finish loading (Stolzl may load async)
  //   - On window resize (font-size scales with viewport via clamp)
  // useLayoutEffect so the first measurement happens synchronously
  // before paint, avoiding a one-frame flash of un-sized frame.
  useLayoutEffect(() => {
    const measureEl = measureRef.current
    if (!measureEl) return

    function measureAll() {
      const next: number[] = []
      for (const word of WORDS) {
        measureEl!.textContent = word
        next.push(measureEl!.offsetWidth)
      }
      setWidths(next)
    }

    measureAll()

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        // Font may have swapped in - remeasure to catch the new metrics.
        measureAll()
      })
    }

    const onResize = () => measureAll()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const currentWord = WORDS[index % WORDS.length]
  const nextWord = WORDS[(index + 1) % WORDS.length]
  const currentWidth = widths[index % WORDS.length]

  return (
    <span
      className="slot-frame"
      style={currentWidth ? { width: `${currentWidth}px` } : undefined}
    >
      {/* Hidden width measurer - absolute-positioned out of the
          frame's flow so it doesn't affect the frame's natural
          size. Inherits font properties via class so the measured
          offsetWidth matches what the visible word will render to. */}
      <span
        ref={measureRef}
        className="slot-measurer"
        aria-hidden="true"
      />
      {/* key on the stack forces a fresh DOM each cycle, restarting
          the CSS animation from translateY(0) without any reverse-
          rotation glitch when wrapping from the last word back to
          the first. */}
      <span key={index} className="slot-stack">
        <span className="slot-word">{currentWord}</span>
        <span className="slot-word">{nextWord}</span>
      </span>
    </span>
  )
}
