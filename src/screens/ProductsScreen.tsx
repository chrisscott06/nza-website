import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PabloLogo } from '../components/svg/PabloLogo'

/**
 * Products section per landing brief v2 Section 4 - "Our products".
 *
 * Layout: 40/60 split. Left column has the section heading + intro +
 * mono hint. Right column floats three product marks (PABLO / NZ:AI /
 * decodED, left to right by maturity) on the navy canvas with no card
 * chrome at rest.
 *
 * Interaction: hover any mark and:
 *   - The mark scales to 108%
 *   - A soft tinted bounding container materialises around it
 *   - A reveal panel grows downward with question + promise + Explore link
 *   - The other two marks recede to 40% opacity and 94% scale
 * Hover off and everything returns to the at-rest state.
 *
 * Clicking the active mark (or its Explore link) navigates to the
 * corresponding product page via React Router. Routes are wired:
 *   /pablo  -> existing full PABLO page
 *   /nz-ai  -> existing full NZ:AI page
 *   /decoded -> stub
 *
 * Idle motion: each mark has a 6s breathing cycle (~2% scale) staggered
 * via animation-delay so they don't pulse in sync.
 *
 * Brief: docs/briefs/nza-landing-page-brief-v2.md
 */

type ProductId = 'pablo' | 'nzai' | 'decoded'

type Product = {
  id: ProductId
  name: string
  href: string
  question: string
  promise: string
  exploreLabel: string
}

const PRODUCTS: Product[] = [
  {
    id: 'pablo',
    name: 'PABLO',
    href: '/pablo',
    question: 'Want to cut your electricity costs?',
    promise:
      'PV, battery and load optimisation modelling for sites that want to spend less on energy.',
    exploreLabel: 'Explore PABLO',
  },
  {
    id: 'nzai',
    name: 'NZ:AI',
    href: '/nz-ai',
    question: 'Want to make sense of complex carbon data?',
    promise:
      'An AI advisory partnership for teams who have client relationships but need net zero depth.',
    exploreLabel: 'Explore NZ:AI',
  },
  {
    id: 'decoded',
    name: 'decodED',
    href: '/decoded',
    question: 'Running climate action in education?',
    promise:
      'A hosted platform helping schools, universities and trusts move from carbon data to climate strategy.',
    exploreLabel: 'Explore decodED',
  },
]

function ProductMarkVisual({ id }: { id: ProductId }) {
  // Placeholder marks - the brief flags real marks are pending from
  // Chris. Each is a styled wordmark in the product's brand colour
  // so the colour identity reads even without bespoke iconography.
  if (id === 'pablo') {
    return <PabloLogo className="product-mark-logo product-mark-logo--pablo" />
  }
  if (id === 'nzai') {
    return (
      <span className="product-mark-wordmark product-mark-wordmark--nzai">
        NZ<span className="product-mark-nzai-colon">:</span>AI
      </span>
    )
  }
  // decoded
  return (
    <span className="product-mark-wordmark product-mark-wordmark--decoded">
      decod<span className="product-mark-decoded-ed">ED</span>
    </span>
  )
}

export function ProductsScreen() {
  const [hovered, setHovered] = useState<ProductId | null>(null)

  return (
    <section
      className="screen canvas-navy products-section in-view"
      id="products"
      data-screen-label="Products"
    >
      <div className="frame">
        <div className="products-layout">
          {/* LEFT - section heading + intro + mono hint */}
          <div className="products-text">
            <h2 className="section-heading products-heading">Our products</h2>
            <p className="subhead products-intro">
              Three tools we've built to help organisations move on net zero -
              each one solving a different piece of the puzzle.
            </p>
            <p className="products-hint">
              Hover to see what each does. Click to dive in.
            </p>
          </div>

          {/* RIGHT - three floating marks */}
          <div className="products-marks">
            {PRODUCTS.map((p) => {
              const isActive = hovered === p.id
              const isReceded = hovered !== null && hovered !== p.id
              return (
                <Link
                  key={p.id}
                  to={p.href}
                  className={
                    'product-mark' +
                    (isActive ? ' is-active' : '') +
                    (isReceded ? ' is-receded' : '')
                  }
                  data-mark={p.id}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(p.id)}
                  onBlur={() => setHovered(null)}
                  aria-label={`${p.exploreLabel} - ${p.question}`}
                >
                  <span className="product-mark-visual">
                    <ProductMarkVisual id={p.id} />
                  </span>
                  <span className="product-mark-name">{p.name}</span>
                  <span className="product-mark-reveal" aria-hidden={!isActive}>
                    <span className="product-mark-question">{p.question}</span>
                    <span className="product-mark-promise">{p.promise}</span>
                    <span className="product-mark-explore">
                      {p.exploreLabel}
                      <span aria-hidden="true">→</span>
                    </span>
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
