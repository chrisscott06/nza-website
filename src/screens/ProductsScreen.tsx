import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MaskReveal } from '../components/MaskReveal'

/**
 * Products section - cream slot in the homepage flow that breaks the
 * navy of the hero + Get in touch above and below.
 *
 * Layout (per Chris's revisions):
 *   - Centred heading "Our products" at the hero-headline size in
 *     Stolzl Book coral. Body intro below in Stolzl Thin.
 *   - Three product logos in a triptych using the full frame width.
 *     At rest each logo renders as a NAVY SILHOUETTE so all three
 *     read uniform (per Chris - the bright PABLO gradient otherwise
 *     overpowers the muted teal + green of the other two).
 *   - Each card has fixed height pre-reserved so the section DOESN'T
 *     grow on hover; reveal content fades in over that reserved space.
 *
 * Interaction:
 *   - Hover OR click a card to activate.
 *   - The bounding box draws in via two halves - one clockwise from
 *     top centre, one anticlockwise - meeting at the bottom centre.
 *   - Border colour is product-specific (PABLO orange, NZ:AI teal,
 *     decodED green) via the --accent CSS var.
 *   - The logo silhouette fades to its original full-colour version.
 *   - Reveal content fades in - question (italic in accent-text
 *     colour), promise (Stolzl Thin), Explore link.
 *   - Clicking the LOGO does NOT navigate. Only the Explore link
 *     routes through.
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
                  data-id={p.id}
                  onMouseEnter={() => activate(p.id)}
                  onMouseLeave={scheduleDeactivate}
                >
                  {/* Bounding box - two halves, each drawing from top
                      centre. .product-card-box-half--left animates
                      anticlockwise; --right animates clockwise; they
                      meet at the bottom centre. */}
                  <span
                    className="product-card-box-half product-card-box-half--left"
                    aria-hidden="true"
                  />
                  <span
                    className="product-card-box-half product-card-box-half--right"
                    aria-hidden="true"
                  />

                  {/* LOGO - silhouette at rest (navy via mask-image),
                      original colours when active. Crossfade between
                      the two layers. Button wrapper toggles activation
                      without navigating. */}
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
                    <span className="product-card-logo-stack">
                      <span
                        className="product-card-logo-silhouette"
                        style={{
                          WebkitMaskImage: `url('${p.logoSrc}')`,
                          maskImage: `url('${p.logoSrc}')`,
                        }}
                        aria-hidden="true"
                      />
                      <img
                        src={p.logoSrc}
                        alt={p.alt}
                        className="product-card-logo"
                      />
                    </span>
                  </button>

                  {/* Reveal panel - takes layout space always (so the
                      card height is fixed), but opacity:0 at rest so
                      it's invisible until activation. */}
                  <div
                    className="product-card-reveal"
                    aria-hidden={!isActive}
                  >
                    <p className="product-card-question">{p.question}</p>
                    <p className="product-card-promise">{p.promise}</p>
                    <Link
                      to={p.href}
                      className="product-card-explore"
                      tabIndex={isActive ? 0 : -1}
                    >
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
