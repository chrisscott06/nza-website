import { MarqueOverlay } from '../components/svg/MarqueOverlay'

export function HomeScreen() {
  return (
    <section className="screen canvas-navy in-view" id="home" data-screen-label="01 Home">
      {/*
        Brand-mark watermark. Oversized, soft-blurred, low-opacity cream
        silhouette anchored top-right of the home screen. Most of the mark
        bleeds upward + rightward off canvas; only the bottom-left fragment
        is visible. Sibling of .frame (not inside .hero) so it can position
        against the full screen rect.
      */}
      <div className="hero-mark" aria-hidden="true" />

      <MarqueOverlay />

      <div className="frame">
        <div className="hero">
          <div className="hero-text">
            <div className="eyebrow eyebrow-hero reveal-layer" data-d="0">
              <span className="orbit-marker" aria-hidden="true" />
              01 · Home
            </div>
            <h1 className="headline reveal-layer" data-d="1">
              We <em>decode decarbonisation</em> for the built environment.
            </h1>
            <p className="lede reveal-layer" data-d="2">
              NZA is a specialist sustainability consultancy for the people who design,
              build and operate buildings and estates. We work at the intersection of
              the energy transition, climate change and digital intelligence - turning
              the complex into clear, practical action.
            </p>
          </div>
          <div className="hero-visual" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
