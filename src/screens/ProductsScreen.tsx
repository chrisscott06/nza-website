import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
    /* Homepage products section is back on cream (Chris reverted v2
       chunk C). Use the dark-text variant so the wordmark reads on
       the cream surface. White-text variant stays in use on the
       actual /nz-ai product page where the canvas is dark navy. */
    logoSrc: '/assets/logos/nzai-logo-dark.svg',
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
/* Time after activation before a card is considered "fully open" -
   matching the box-border draw (~620ms) + reveal content fade-in.
   Per Chris: "if you click on it, it should take you to the page,
   but only once it's fully loaded." Below this threshold, clicks on
   the already-active card are no-ops (the open animation is still
   running and a navigation would feel jarring). At or past it,
   another click navigates to the product page. */
const FULLY_OPEN_MS = 650

export function ProductsScreen() {
  const [active, setActive] = useState<ProductId | null>(null)
  const leaveTimerRef = useRef<number | null>(null)
  /* Timestamp of when the current `active` card first became active.
     Refreshed in a useEffect whenever active changes (so hover-in,
     hover-out-then-in, or tap all reset the clock). */
  const activeStartedAtRef = useRef<number | null>(null)
  const navigate = useNavigate()

  // Per-card random draw-origin so the bounding box doesn't always
  // start tracing from exactly top-centre - feels more organic
  // (Chris: "could we just offset it slightly... a random percentage
  // ... so it feels a bit more organic"). Computed once on mount so
  // the same card always uses the same origin within a session, but
  // refreshing the page reshuffles. Range 30-70% of the top edge.
  const drawOriginsX = useMemo(
    () => PRODUCTS.map(() => 30 + Math.random() * 40),
    [],
  )

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
  /* Click handler with two modes:
       1. Card NOT active yet OR a different card active -> just
          activate. (Used to be toggle; Chris fixed that earlier so
          clicks never close.)
       2. Card already active AND fully open (>= FULLY_OPEN_MS since
          it activated) -> navigate to the product page. Per Chris:
          "if you click on it, it should take you to the page, but
          only once it's fully loaded." The explicit Explore link in
          the reveal panel still routes at any moment for users who
          want the obvious path.
     Below the threshold (animation still running), the second click
     is just a no-op to avoid jarring mid-animation navigation. */
  function activateOrNavigate(id: ProductId, href: string) {
    cancelLeaveTimer()
    if (active === id) {
      const startedAt = activeStartedAtRef.current
      if (startedAt !== null && performance.now() - startedAt >= FULLY_OPEN_MS) {
        navigate(href)
      }
      return
    }
    setActive(id)
  }

  // Track when the active card first became active, so the
  // "fully open" check above is accurate. Re-runs on every active
  // change (hover in/out/in, tap, etc.).
  useEffect(() => {
    activeStartedAtRef.current = active === null ? null : performance.now()
  }, [active])

  // Click-OFF handler: tapping anywhere that isn't inside an open
  // product card closes the open card. Bound to document so it
  // catches taps on the section background, the page chrome, etc.
  // Especially important for the mobile accordion (no hover state
  // there - the only way to close an expanded card is to click off).
  useEffect(() => {
    if (active === null) return
    function onDocClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null
      if (!target) return
      if (target.closest('.product-card')) return
      cancelLeaveTimer()
      setActive(null)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [active])

  return (
    <section
      className="screen canvas-paper products-section in-view"
      id="products"
      data-screen-label="Products"
    >
      {/* PIN WRAPPER - same scrollytelling pattern as the coral
          "How we work" section. Outer .products-section is now a
          250vh scroll runway; this inner .products-section-pin is
          position: sticky; top: 0; height: 100vh so the cream
          products view LOCKS to the viewport for ~150vh of scroll.
          User scrolls in, the pin engages, they get the consistent
          "land on the white" moment, then keep scrolling to leave it.
          Mobile drops the pin entirely - just content-tall. */}
      <div className="products-section-pin">
      <div className="frame">
        <div className="products-intro-block">
          <MaskReveal as="h2" className="products-heading" delay={0}>
            Our products
          </MaskReveal>
          <MaskReveal as="p" className="products-intro" delay={200}>
            Three tools we've built to help organisations move on net zero -
            each one solving a different piece of the puzzle.
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
                  style={
                    {
                      '--draw-origin-x': `${drawOriginsX[i]}%`,
                    } as CSSProperties
                  }
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
                    onClick={() => activateOrNavigate(p.id, p.href)}
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
                      it's invisible until activation. The inner
                      wrapper is required on mobile for the
                      grid-template-rows 0fr -> 1fr accordion trick to
                      animate smoothly (interpolating max-height
                      alone caused the jittery height stretch Chris
                      flagged). Desktop ignores the wrapper - the
                      reveal is opacity-only there. */}
                  <div
                    className="product-card-reveal"
                    aria-hidden={!isActive}
                  >
                    <div className="product-card-reveal-inner">
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
                    </div>{/* end .product-card-reveal-inner */}
                  </div>
                </div>
              </MaskReveal>
            )
          })}
        </div>
      </div>
      </div>{/* end .products-section-pin */}
    </section>
  )
}
