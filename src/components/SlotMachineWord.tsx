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
 * Each word holds for ~1.8s, then the next word slides up into
 * position over 700ms while the frame width simultaneously stretches
 * or squashes to fit. The width pre-transitions during the rotation
 * (not after) so by the time the new word lands the frame is already
 * the right size - per Chris: "by the time the text lands, the box
 * is already the right width".
 *
 * Two-tick architecture:
 *   - rotIndex   advances every 2500ms (drives the rotation animation
 *                 and which word pair is rendered)
 *   - widthIndex advances 1800ms after each rotIndex tick (drives
 *                 the frame width). Width tick is offset so it fires
 *                 just before the rotation animation begins, meaning
 *                 width and rotation animate simultaneously rather
 *                 than width-after-rotation.
 *
 * Width is measured from a hidden span that inherits the frame's
 * box layout exactly (same padding + transparent 1px border to
 * mirror the visible frame's dashed border). offsetWidth gives the
 * exact width the frame needs to be to hold each word.
 *
 * Reduced motion: animation disabled; first word stays permanently.
 */

const WORDS = [
  'decarbonisation',
  'climate complexity',
  'energy markets',
  'digital intelligence',
] as const

const CYCLE_MS = 2500
// Width tick fires WIDTH_OFFSET_MS into each cycle - timed to coincide
// with the slot-rotate animation delay so width and rotation animate
// together (not width-after-rotation).
const WIDTH_OFFSET_MS = 1800

export function SlotMachineWord() {
  const measureRef = useRef<HTMLSpanElement>(null)
  const [rotIndex, setRotIndex] = useState(0)
  const [widthIndex, setWidthIndex] = useState(0)
  const [widths, setWidths] = useState<number[]>([])

  // Rotation tick - drives the rendered word pair + the CSS animation key.
  useEffect(() => {
    const id = window.setInterval(() => {
      setRotIndex((i) => i + 1)
    }, CYCLE_MS)
    return () => window.clearInterval(id)
  }, [])

  // Width tick - offset WIDTH_OFFSET_MS after each rotation tick so the
  // width transition starts as the rotation begins (not after it).
  useEffect(() => {
    let intervalId: number | null = null
    const firstTickId = window.setTimeout(() => {
      setWidthIndex((i) => i + 1)
      intervalId = window.setInterval(() => {
        setWidthIndex((i) => i + 1)
      }, CYCLE_MS)
    }, WIDTH_OFFSET_MS)

    return () => {
      window.clearTimeout(firstTickId)
      if (intervalId !== null) window.clearInterval(intervalId)
    }
  }, [])

  // Measure each word's natural rendered width. Re-runs on mount,
  // when fonts finish loading (Stolzl may load async), and on
  // window resize (font-size scales with viewport via clamp).
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
      document.fonts.ready.then(measureAll)
    }

    const onResize = () => measureAll()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const currentWord = WORDS[rotIndex % WORDS.length]
  const nextWord = WORDS[(rotIndex + 1) % WORDS.length]
  // Width pre-targets the NEXT word (the one about to roll in) so the
  // frame stretches/squashes to fit the new word as the rotation
  // happens, settling at the correct size by the moment the new word
  // is in place.
  const targetWidth = widths[widthIndex % WORDS.length]

  return (
    <span
      className="slot-frame"
      style={targetWidth ? { width: `${targetWidth}px` } : undefined}
    >
      {/* Hidden width measurer - absolute-positioned out of the
          frame's flow so it doesn't affect the frame's natural
          size. Matches the frame's box (padding + transparent 1px
          border, box-sizing border-box) so offsetWidth gives the
          exact natural rendered width including the frame's chrome. */}
      <span
        ref={measureRef}
        className="slot-measurer"
        aria-hidden="true"
      />
      {/* key on the stack forces a fresh DOM each rotation cycle,
          restarting the CSS animation from translateY(0) without any
          reverse-rotation glitch when wrapping from the last word
          back to the first. */}
      <span key={rotIndex} className="slot-stack">
        <span className="slot-word">{currentWord}</span>
        <span className="slot-word">{nextWord}</span>
      </span>
    </span>
  )
}
