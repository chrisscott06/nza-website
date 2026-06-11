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
  /** New simple single-string headline (PABLO June 2026 redesign).
   *  When provided, renders directly without the prefix/verb/suffix
   *  highlight pattern. Other products still use the three-part split. */
  headline?: string
  headlinePrefix: string
  highlightedVerb: string
  headlineSuffix: string
  body: string
  illustrationConcept: string
  /** Opt this step into the scrollytelling pattern: text-block is
   *  3x viewport tall so the user scrolls through it, and the
   *  animation's phases advance based on scroll progress (rather
   *  than firing on a timer). Per Chris's June 2026 direction:
   *  scroll #1 reveals text, scroll #2 fires the first animation,
   *  scroll #3 swaps to the next animation, etc. Off by default;
   *  steps without animations stay 100vh. */
  scrollytell?: boolean
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

  // IntersectionObserver with a narrow active-band in the middle of
  // the viewport. The old threshold:0.45 approach broke once we made
  // scrollytell steps 300vh tall - a 300vh block can never reach 45%
  // intersection at a 100vh viewport (max possible = 33%). Switching
  // to rootMargin: -40% top + -40% bottom shrinks the IO root rect
  // to a 20vh-tall band in the middle of the viewport; a block is
  // active when its bounding rect intersects that band. Works for
  // both 100vh and 300vh text-blocks identically.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = textRefs.current.findIndex((el) => el === entry.target)
            if (index !== -1) setActiveIndex(index)
          }
        }
      },
      { threshold: 0, rootMargin: '-40% 0px -40% 0px' },
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
              'product-step-text-block' +
              (i === activeIndex ? ' is-active' : '') +
              (step.scrollytell ? ' product-step-text-block--scrollytell' : '')
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
              {/* Impilo-style step header (PABLO June 2026 redesign):
                  ICON on the left, NUMBER on the right (justify-between),
                  a hairline rule below the meta row, then the headline.
                  Replaces the inline-stacked icon+number row the steps
                  used before. */}
              <div className="product-step-meta">
                <span className="product-step-icon" aria-hidden="true">
                  <ProductIcon name={step.iconName} />
                </span>
                <span className="product-step-number">{step.number}.</span>
              </div>
              <div
                className="product-step-rule"
                aria-hidden="true"
              />
              <h3 className="product-step-headline">
                {/* When a step provides the new simple `headline` field
                    we render it directly; otherwise we fall back to the
                    legacy prefix + highlighted verb + suffix pattern
                    other products still use. */}
                {step.headline ? (
                  step.headline
                ) : (
                  <>
                    {step.headlinePrefix}
                    <span className="step-verb">{step.highlightedVerb}</span>
                    {step.headlineSuffix}
                  </>
                )}
              </h3>
              <p className="product-step-body">{step.body}</p>

              {/* Inline illustration shown ONLY on mobile via CSS -
                  the shared sticky frame on desktop replaces this. */}
              <div className="product-step-inline-illustration">
                <ProductIllustration
                  concept={step.illustrationConcept}
                  stepIndex={i}
                />
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
              <ProductIllustration
                concept={step.illustrationConcept}
                stepIndex={i}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
