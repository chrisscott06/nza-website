import { useEffect, useState } from 'react'

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
 * over ~700ms. The frame itself stays static. Loops continuously.
 *
 * Implementation: the component renders TWO stacked spans (current +
 * next) inside an overflow-hidden frame. A CSS animation translates
 * the stack upward by one row. On animation completion, React
 * advances `index`; the re-render makes the new "current" word match
 * the position that was "next" before, so the swap looks seamless.
 * Using `key={index}` on the stack restarts the animation cleanly
 * each cycle without any backward-scroll glitch.
 *
 * Reduced motion: animation disabled via media query; the first word
 * stays visible permanently.
 */

const WORDS = [
  'decarbonisation',
  'climate complexity',
  'energy markets',
  'digital intelligence',
] as const

const CYCLE_MS = 2500

export function SlotMachineWord() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => i + 1)
    }, CYCLE_MS)
    return () => window.clearInterval(id)
  }, [])

  const currentWord = WORDS[index % WORDS.length]
  const nextWord = WORDS[(index + 1) % WORDS.length]

  return (
    <span className="slot-frame">
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
