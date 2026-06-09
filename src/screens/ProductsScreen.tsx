import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MaskReveal } from '../components/MaskReveal'

/**
 * Products section - cream slot in the homepage flow that breaks the
 * navy of the hero + Get in touch above and below.
 *
 * Layout (per Chris's revision):
 *   - Centred heading "Our products" at the hero-headline size in
 *     Stolzl Book coral (treats this as the chapter title)
 *   - Short body intro below in Stolzl Thin
 *   - Three product logos as a triptych using the full frame width
 *   - At rest: just the three logos, no chrome
 *
 * Interaction (per Chris):
 *   - Hover or click any logo to activate. Clicking the LOGO itself
 *     does NOT navigate - it's only the Explore link inside the
 *     revealed panel that routes through to the product page.
 *   - When active: a coral bounding box animates in (grows from the
 *     centre horizontally outward, "from both left and right"), then
 *     the question + promise float in beneath the logo, then the
 *     Explore link appears.
 *   - Click again (or move the cursor away) to deactivate.
 *
 * Staggered MaskReveal on initial scroll-into-view so the three
 * logos appear one after another.
 */

type ProductId = 'pablo' | 'nzai' | 'decoded'

type Product = {
  id: ProductId
  name: string
  href: string
  logoSrc: string
  alt: string
  question: string
  promise: string
}

const PRODUCTS: Product[] = [
  {
    id: 'pablo',
    name: 'PABLO',
    href: '/pablo',
    logoSrc: '/assets/logos/pablo-logo.svg',
    alt: 'PABLO',
    question: 'Want to cut your electricity costs?',
    promise:
      'PV, battery and load optimisation modelling for sites that want to spend less on energy.',
  },
  {
    id: 'nzai',
    name: 'NZ:AI',
    href: '/nz-ai',
    logoSrc: '/assets/logos/nzai-logo.svg',
    alt: 'NZ:AI',
    question: 'Want to make sense of complex carbon data?',
    promise:
      'An AI advisory partnership for teams who have client relationships but need net zero depth.',
  },
  {
    id: 'decoded',
    name: 'decodED',
    href: '/decoded',
    logoSrc: '/assets/logos/decoded-logo.svg',
    alt: 'decodED',
    question: 'Running climate action in education?',
    promise:
      'A hosted platform helping schools, universities and trusts move from carbon data to climate strategy.',
  },
]

// Grace period before mouse-leave deactivates - lets the user move the
// cursor down from the logo onto the reveal panel without losing it.
const LEAVE_GRACE_MS = 150

export function ProductsScreen() {
  const [active, setActive] = useState<ProductId | null>(null)
  const leaveTimerRef = useRef<number | null>(null)

  function cancelLeaveTimer() {
    if (leaveTimerRef.current !== null) {
      window.clearTimeout(leaveTimerRef.current)
      leaveTimerRef.current = null
    }
  }
  function activate(id: ProductId) {
    cancelLeaveTimer()
    setActive(id)
  }
  function scheduleDeactivate() {
    cancelLeaveTimer()
    leaveTimerRef.current = window.setTimeout(() => {
      setActive(null)
      leaveTimerRef.current = null
    }, LEAVE_GRACE_MS)
  }
  function toggle(id: ProductId) {
    cancelLeaveTimer()
    setActive((curr) => (curr === id ? null : id))
  }

  return (
    <section
      className="screen canvas-paper products-section in-view"
      id="products"
      data-screen-label="Products"
    >
      <div className="frame">
        <div className="products-intro-block">
          <MaskReveal as="h2" className="products-heading" delay={100}>
            Our products
          </MaskReveal>
          <MaskReveal as="p" className="products-intro" delay={300}>
            Three tools to help organisations move from climate ambition into
            climate action - each one solving a different piece of the puzzle.
          </MaskReveal>
        </div>

        <div className="products-triptych">
          {PRODUCTS.map((p, i) => {
            const isActive = active === p.id
            return (
              <MaskReveal
                as="div"
                key={p.id}
                className="products-triptych-cell"
                delay={500 + i * 300}
              >
                <div
                  className={
                    'product-card' + (isActive ? ' is-active' : '')
                  }
                  onMouseEnter={() => activate(p.id)}
                  onMouseLeave={scheduleDeactivate}
                >
                  {/* Bounding box - hidden at rest, animates in via
                      scaleX from centre when .is-active. */}
                  <span className="product-card-box" aria-hidden="true" />

                  {/* The logo itself - clicking it toggles the reveal
                      without navigating. Acts as a button. */}
                  <button
                    type="button"
                    className="product-card-logo-button"
                    onClick={() => toggle(p.id)}
                    aria-expanded={isActive}
                    aria-label={
                      isActive
                        ? `Hide ${p.name} details`
                        : `Show ${p.name} details`
                    }
                  >
                    <img
                      src={p.logoSrc}
                      alt={p.alt}
                      className="product-card-logo"
                    />
                  </button>

                  {/* Reveal panel - hidden at rest, max-height + opacity
                      grow when active. The Explore link inside is the
                      ONLY navigation; click logo doesn't route. */}
                  <div
                    className="product-card-reveal"
                    aria-hidden={!isActive}
                  >
                    <p className="product-card-question">{p.question}</p>
                    <p className="product-card-promise">{p.promise}</p>
                    <Link to={p.href} className="product-card-explore">
                      Explore {p.name}
                      <span aria-hidden="true"> →</span>
                    </Link>
                  </div>
                </div>
              </MaskReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
