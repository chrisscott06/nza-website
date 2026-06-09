import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * Slot-machine word swap. A dashed-outline box sits behind a vertically-
 * rotating word - per Chris's revised design, the TEXT and the BOX are
 * fully decoupled so neither affects the other's layout:
 *
 *   - The TEXT lives inside an overflow-hidden wrapper and only ever
 *     translates VERTICALLY (the slot-machine rotation). It never
 *     shifts left or right - the visible word stays centred to its
 *     own column, which is centred to the page.
 *
 *   - The BOX is a position-absolute overlay centred at left: 50%
 *     translateX(-50%). Its width transitions independently to match
 *     each word's measured natural width. The box grows and shrinks
 *     symmetrically from the page centre, so it stretches and
 *     squashes around the text without nudging the text or any
 *     surrounding content.
 *
 * Sequence (per brief, locked):
 *   1. decarbonisation  (always the first word on page load)
 *   2. climate complexity
 *   3. energy markets
 *   4. digital intelligence
 *
 * Two-tick architecture:
 *   - rotIndex   advances every CYCLE_MS - drives the rotation
 *                 animation and which word pair is rendered
 *   - widthIndex advances WIDTH_OFFSET_MS after each rotIndex tick -
 *                 drives the box width (fires as the rotation begins
 *                 so width and rotation animate simultaneously, not
 *                 width-after-rotation)
 *
 * INITIAL_HOLD_MS: on first mount the slot displays decarbonisation
 * and holds with no motion until this delay elapses - lets the user
 * read the first word during the opening reveal before the rotation
 * cycle begins.
 *
 * Reduced motion: animation class never applied; first word stays
 * permanently and the box width measures naturally.
 */

const WORDS = [
  'decarbonisation',
  'climate complexity',
  'energy markets',
  'digital intelligence',
] as const

const CYCLE_MS = 2500
const WIDTH_OFFSET_MS = 1800
const INITIAL_HOLD_MS = 2500

export function SlotMachineWord() {
  const measureRef = useRef<HTMLSpanElement>(null)
  const [rotIndex, setRotIndex] = useState(0)
  const [widthIndex, setWidthIndex] = useState(0)
  const [widths, setWidths] = useState<number[]>([])
  const [rotationStarted, setRotationStarted] = useState(false)

  // Start gate - holds the first word visible for INITIAL_HOLD_MS
  // with no motion, then unlocks the rotation interval.
  useEffect(() => {
    const t = window.setTimeout(() => setRotationStarted(true), INITIAL_HOLD_MS)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!rotationStarted) return
    const id = window.setInterval(() => {
      setRotIndex((i) => i + 1)
    }, CYCLE_MS)
    return () => window.clearInterval(id)
  }, [rotationStarted])

  useEffect(() => {
    if (!rotationStarted) return
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
  }, [rotationStarted])

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
  const targetWidth = widths[widthIndex % WORDS.length]

  return (
    <span className="slot-line">
      {/* Hidden width measurer - matches the slot-box's box layout
          exactly so offsetWidth gives the natural rendered width
          including its padding + transparent 1px border. */}
      <span
        ref={measureRef}
        className="slot-measurer"
        aria-hidden="true"
      />
      {/* The bounding box - absolute, centred, transitions width
          independently of the text. Stretches and squashes around
          the text without nudging the text or the surrounding
          content. */}
      <span
        className="slot-box"
        style={targetWidth ? { width: `${targetWidth}px` } : undefined}
        aria-hidden="true"
      />
      {/* The text - vertical slot-machine rotation only. The
          wrapper clips and the stack translates upward by one row
          each cycle. Stack is align-items: centre so each word
          centres within the stack and within the page-centred
          slot-line wrapper. */}
      <span className="slot-text-wrapper">
        <span
          key={rotIndex}
          className={'slot-stack' + (rotationStarted ? ' is-animating' : '')}
        >
          <span className="slot-word">{currentWord}</span>
          <span className="slot-word">{nextWord}</span>
        </span>
      </span>
    </span>
  )
}
