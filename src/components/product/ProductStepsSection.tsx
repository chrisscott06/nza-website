import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductIcon } from './ProductIcons'
import { ProductIllustration } from './ProductIllustrations'

/**
 * The four-step "how it works" section, using Impilo's shared-frame
 * scrollytelling pattern.
 *
 * Mechanic:
 *   - LEFT column: four text blocks stacked, each ~100vh tall.
 *   - RIGHT column: ONE big frame, position: sticky for the section's
 *     entire scroll range. Inside the frame, four illustrations are
 *     absolutely stacked - only one is opacity:1 at a time.
 *   - As the user scrolls and one text block crosses the ~50% viewport
 *     midline, that step becomes "active" and its illustration
 *     cross-fades to the front in the shared frame. Frame chrome
 *     (border + bg) stays put for the whole journey.
 *
 * On mobile (<1024px) the sticky doesn't make sense - the layout
 * collapses to a single column where each text block is followed by
 * its own inline illustration block. The shared frame is hidden via
 * CSS.
 */

export type StepData = {
  number: string
  iconName: string
  headlinePrefix: string
  highlightedVerb: string
  headlineSuffix: string
  body: string
  illustrationConcept: string
}

type Props = {
  steps: StepData[]
  /** Request Demo pill pinned at the top-right of the shared frame. */
  requestDemoHref: string
  requestDemoLabel: string
}

export function ProductStepsSection({
  steps,
  requestDemoHref,
  requestDemoLabel,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const textRefs = useRef<(HTMLDivElement | null)[]>([])

  // One IntersectionObserver shared across all four text blocks. When a
  // block crosses ~50% visibility, mark it active so the shared frame
  // shows that step's illustration. Multiple thresholds smooth the
  // handoff between adjacent blocks.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            const index = textRefs.current.findIndex((el) => el === entry.target)
            if (index !== -1) setActiveIndex(index)
          }
        }
      },
      { threshold: [0.45, 0.5, 0.55] },
    )
    textRefs.current.forEach((el) => {
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [steps.length])

  return (
    <div className="product-steps-grid">
      <div className="product-steps-text-col">
        {steps.map((step, i) => (
          <div
            key={i}
            ref={(el) => {
              textRefs.current[i] = el
            }}
            className={
              'product-step-text-block' + (i === activeIndex ? ' is-active' : '')
            }
          >
            {/* Text content is sticky WITHIN its 100vh-tall block -
                so as the user scrolls, the text pins at top-22vh
                instead of just scrolling past. Combined with the
                shared sticky frame on the right, both columns are
                page-locked together during a step's scroll range,
                then both flip to the next step's content as the
                block boundary passes (Impilo's page-lock feel). */}
            <div className="product-step-text-sticky">
              <div className="product-step-meta">
                <span className="product-step-icon" aria-hidden="true">
                  <ProductIcon name={step.iconName} />
                </span>
                <span className="product-step-number">{step.number}.</span>
              </div>
              <h3 className="product-step-headline">
                {step.headlinePrefix}
                <span className="step-verb">{step.highlightedVerb}</span>
                {step.headlineSuffix}
              </h3>
              <p className="product-step-body">{step.body}</p>

              {/* Inline illustration shown ONLY on mobile via CSS -
                  the shared sticky frame on desktop replaces this. */}
              <div className="product-step-inline-illustration">
                <ProductIllustration concept={step.illustrationConcept} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SHARED STICKY FRAME (desktop only via CSS).
          Holds all four illustrations absolutely stacked; one is
          opacity:1 at a time based on activeIndex. The Request Demo
          pill is pinned at the top-right INSIDE the frame, so it
          stays visible the whole time the section is in view (the
          frame is sticky for the full four-step scroll range). */}
      <div className="product-steps-frame-col">
        <div className="product-steps-frame">
          <Link
            to={requestDemoHref}
            className="product-steps-request-pill"
            aria-label={requestDemoLabel}
          >
            {requestDemoLabel}
            <span aria-hidden="true"> →</span>
          </Link>
          {steps.map((step, i) => (
            <div
              key={i}
              className={
                'product-steps-frame-illustration' +
                (i === activeIndex ? ' is-active' : '')
              }
              aria-hidden="true"
            >
              <ProductIllustration concept={step.illustrationConcept} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
