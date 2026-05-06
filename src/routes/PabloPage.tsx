import { FloatingNav, type NavLink } from '../components/FloatingNav'

// PABLO links back to the website's anchors. Active link is "Products".
const PABLO_NAV_LINKS: NavLink[] = [
  { id: 'home', label: 'Home' },
  { id: 'capabilities', label: 'Expertise' },
  { id: 'approach', label: 'Approach' },
  { id: 'products', label: 'Products' },
  { id: 'clients', label: 'Clients' },
]

export function PabloPage() {
  return (
    <>
      <FloatingNav
        activeId="products"
        homeHref="/#home"
        hrefFor={(link) => `/#${link.id}`}
        links={PABLO_NAV_LINKS}
      />
      <section className="screen canvas-navy" data-screen-label="00 PABLO Hero">
        <div className="frame">
          <div className="hero">
            <div className="hero-text">
              <div className="eyebrow eyebrow-hero">
                <span className="orbit-marker" aria-hidden="true" />
                04 · Products / PABLO
              </div>
              <h1 className="headline">
                Your electricity bill is <em>hiding</em> sixteen charges from you.
              </h1>
              <p className="lede">
                PABLO decomposes commercial electricity costs to the half-hour,
                models every intervention against real demand, and projects a
                detailed investment case over the project's lifecycle. Charts
                and animation land in stage 6.
              </p>
            </div>
            <div className="hero-visual" aria-hidden="true" />
          </div>
        </div>
      </section>
    </>
  )
}
