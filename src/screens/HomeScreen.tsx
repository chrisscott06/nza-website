export function HomeScreen() {
  return (
    <section className="screen canvas-navy" id="home" data-screen-label="01 Home">
      <div className="frame">
        <div className="hero">
          <div className="hero-text">
            <div className="eyebrow eyebrow-hero">
              <span className="orbit-marker" aria-hidden="true" />
              01 · Home
            </div>
            <h1 className="headline">
              We <em>decode decarbonisation</em> for the built environment.
            </h1>
            <p className="lede">
              NZA is a specialist sustainability consultancy for the people who design,
              build and operate buildings and estates. We work at the intersection of
              the energy transition, climate change and digital intelligence — turning
              the complex into clear, practical action.
            </p>
          </div>
          <div className="hero-visual" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
