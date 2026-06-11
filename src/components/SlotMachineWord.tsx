import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { preloaderState, PRELOADER_DISMISSED_EVENT } from '../lib/preloaderState'

/**
 * Slot-machine word swap. Two curly braces { } flank a vertically-
 * rotating word - per Chris's "accordion" call. The braces move
 * outward and inward with the springy box-width transition, while
 * the text inside only ever translates UPWARD (slot-machine rotation
 * with no horizontal motion).
 *
 * Layout:
 *   .slot-line               position: relative wrapper
 *   .slot-braces             position: absolute, centred, flex
 *                            justify-content: space-between. Width
 *                            transitions springy. Contains the two
 *                            { } braces which sit at its left + right
 *                            edges so they accordion in/out as the
 *                            container width changes.
 *   .slot-text-wrapper       overflow-hidden wrapper, height 1.2em.
 *                            The slot-stack inside translates upward
 *                            on each cycle.
 *
 * The text and the braces are fully decoupled - text rotates
 * vertically, braces stretch horizontally, neither nudges the other.
 * Both centred to the page so nothing shifts left or right of any
 * surrounding content.
 *
 * Sequence (locked):
 *   1. decarbonisation  (initial - holds INITIAL_HOLD_MS before
 *                         cycling begins)
 *   2. climate complexity
 *   3. the energy transition
 */

const WORDS = [
  'decarbonisation',
  'climate complexity',
  'the energy transition',
] as const

/* Cycle timing tightened per Chris - rotation kicks off as
   "for your organisation." appears (its MaskReveal fires at
   1600ms after the preloader dismisses) and each subsequent
   word cycles a bit quicker.
     INITIAL_HOLD_MS 2500 -> 1600   start as line 3 reveals
     CYCLE_MS        2500 -> 2000   ~20% quicker per cycle
     WIDTH_OFFSET_MS 1800 -> 1200   matches the CSS animation
                                    delay on .slot-stack.is-animating
                                    (which had to come down too: a
                                    1800ms CSS delay + 700ms duration
                                    = 2500ms total no longer fits
                                    inside the new 2000ms cycle, so
                                    the rotation was getting hard-
                                    snapped off mid-translate). Both
                                    now sit at 1200ms so the CSS
                                    rotation completes at 1900ms,
                                    100ms before React swaps in the
                                    next word. */
const CYCLE_MS = 2000
const WIDTH_OFFSET_MS = 1200
const INITIAL_HOLD_MS = 1600

export function SlotMachineWord() {
  const measureRef = useRef<HTMLSpanElement>(null)
  const [rotIndex, setRotIndex] = useState(0)
  const [widthIndex, setWidthIndex] = useState(0)
  const [widths, setWidths] = useState<number[]>([])
  const [rotationStarted, setRotationStarted] = useState(false)

  // Start gate - waits for the preloader to dismiss, THEN holds
  // decarbonisation visible for INITIAL_HOLD_MS, THEN unlocks the
  // rotation cycle. Plus a fallback safety timer (matches the
  // MaskReveal fallback) so if the event somehow doesn't fire the
  // slot still starts cycling within reasonable time.
  useEffect(() => {
    let holdTimer: number | null = null
    let fallbackTimer: number | null = null
    let started = false

    function startHold() {
      if (started) return
      started = true
      if (fallbackTimer !== null) window.clearTimeout(fallbackTimer)
      holdTimer = window.setTimeout(() => setRotationStarted(true), INITIAL_HOLD_MS)
    }

    if (preloaderState.dismissed) {
      startHold()
      return () => {
        if (holdTimer !== null) window.clearTimeout(holdTimer)
      }
    }

    const onPreloaderDismissed = () => startHold()
    window.addEventListener(PRELOADER_DISMISSED_EVENT, onPreloaderDismissed)
    // Fallback - if the event doesn't fire within 6 seconds, kick the
    // hold off anyway.
    fallbackTimer = window.setTimeout(startHold, 6000)
    return () => {
      window.removeEventListener(PRELOADER_DISMISSED_EVENT, onPreloaderDismissed)
      if (holdTimer !== null) window.clearTimeout(holdTimer)
      if (fallbackTimer !== null) window.clearTimeout(fallbackTimer)
    }
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
      <span
        ref={measureRef}
        className="slot-measurer"
        aria-hidden="true"
      />
      {/* The curly braces wrap. Width transitions springy; the two
          { } braces sit at the left + right edges via flex
          justify-content: space-between so they accordion in/out as
          the container width changes. */}
      <span
        className="slot-braces"
        style={targetWidth ? { width: `${targetWidth}px` } : undefined}
        aria-hidden="true"
      >
        <span className="slot-brace slot-brace--left">{'{'}</span>
        <span className="slot-brace slot-brace--right">{'}'}</span>
      </span>
      {/* Text wrapper - overflow hidden, height 1.2em. Stack inside
          translates upward on each cycle. */}
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
