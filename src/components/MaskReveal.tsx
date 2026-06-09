import { useEffect, useRef, useState } from 'react'
import type { ReactNode, ElementType } from 'react'

/**
 * MaskReveal - site-wide upward-mask reveal motion utility.
 *
 * Wraps any block of text (heading, paragraph, anything). The wrapped
 * content starts fully translated below the wrapper's visible area
 * (parent has overflow: hidden), and on viewport entry slides up into
 * position via a translateY animation with the brand "settled
 * arrival" easing. Reads as the text being placed onto the page with
 * a slight upward parallax landing, per Chris's brief.
 *
 *   - Fires ONCE on first viewport entry per instance (IntersectionObserver
 *     disconnects after the trigger).
 *   - Multiple instances stack staggered via the `delay` prop - put
 *     elements in document order with progressively larger delays for
 *     the eyebrow → headline → sub-line → CTA cascade.
 *   - Respects prefers-reduced-motion (snaps to visible, no transform).
 *
 * Wraps the inner content in a child span/div that does the actual
 * translate; the outer element provides the overflow clip. The outer
 * defaults to <div> but can be promoted to a semantic tag (h1/h2/p)
 * via the `as` prop so heading semantics aren't lost to a wrapping
 * div.
 *
 * Single shared IntersectionObserver instance per page would be a
 * future optimisation; for now each MaskReveal has its own (cheap
 * enough at the scale of a typical page section).
 */

type Props = {
  children: ReactNode
  /** Delay in ms before this instance's reveal begins, after the
   *  IntersectionObserver fires. Use to stagger sequential text
   *  blocks - eyebrow at 0, headline at 100, sub-line at 200, etc. */
  delay?: number
  /** Semantic outer tag (e.g. h1, h2, p). Defaults to div. */
  as?: ElementType
  /** Extra classnames added to the outer wrapper. */
  className?: string
  /** IntersectionObserver threshold (default 0.15 - fires when ~15%
   *  of the element is in view, generous enough to trigger before
   *  the content is fully on screen). */
  threshold?: number
}

export function MaskReveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
  threshold = 0.15,
}: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            obs.disconnect()
            break
          }
        }
      },
      { threshold },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={'mask-reveal' + (revealed ? ' is-revealed' : '') + (className ? ' ' + className : '')}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      <span className="mask-reveal-inner">{children}</span>
    </Tag>
  )
}
