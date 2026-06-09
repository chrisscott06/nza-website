import { useEffect, useRef, useState } from 'react'
import { ProductIcon } from './ProductIcons'
import { ProductIllustration } from './ProductIllustrations'

/**
 * One step in the four-step section.
 *
 * The brief specifies a coordinated arrival when the step scrolls into
 * view: icon + step number fade in together, then headline mask-
 * reveals after ~120ms, then body after another ~80ms, then the
 * illustration frame fades in ~200ms after that.
 *
 * Implementation: one IntersectionObserver on the row root. When the
 * row crosses the threshold, .is-revealed is added to the root and
 * CSS animations on each child fire with their own animation-delays.
 * This is more precise than per-element MaskReveals (which fire on
 * each element's own viewport entry, depending on scroll speed).
 */

type Props = {
  number: string
  iconName: string
  headlinePrefix: string
  highlightedVerb: string
  headlineSuffix: string
  body: string
  illustrationConcept: string
}

export function ProductStep({
  number,
  iconName,
  headlinePrefix,
  highlightedVerb,
  headlineSuffix,
  body,
  illustrationConcept,
}: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = rootRef.current
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
      // Fires when ~25% of the row is in viewport - enough that the
      // user has scrolled into the step intentionally before the
      // arrival animation starts. Threshold tuned to feel
      // natural without being too late.
      { threshold: 0.25 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={rootRef}
      className={'product-step' + (revealed ? ' is-revealed' : '')}
    >
      <div className="product-step-text">
        <div className="product-step-meta product-step-fade">
          <span className="product-step-icon" aria-hidden="true">
            <ProductIcon name={iconName} />
          </span>
          <span className="product-step-number">{number}.</span>
        </div>
        <h3 className="product-step-headline product-step-rise">
          {headlinePrefix}
          <span className="step-verb">{highlightedVerb}</span>
          {headlineSuffix}
        </h3>
        <p className="product-step-body product-step-rise product-step-rise--late">
          {body}
        </p>
      </div>

      <div className="product-step-illustration-col">
        <div className="product-step-illustration product-step-fade product-step-fade--late">
          <ProductIllustration concept={illustrationConcept} />
        </div>
      </div>
    </div>
  )
}
