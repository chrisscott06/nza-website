import { ApproachGrid } from '../components/ApproachGrid'

export function ApproachScreen() {
  return (
    <section className="screen canvas-paper" id="approach" data-screen-label="03 Approach">
      <div className="frame">
        <header className="approach-header reveal-layer" data-d="0">
          <div className="approach-header-left">
            <div className="eyebrow">
              <span className="orbit-marker" aria-hidden="true" />
              03 · Approach
            </div>
            <h2 className="headline">
              Six capabilities, <em>one</em> approach.
            </h2>
          </div>
          <div className="approach-header-right">
            <img
              className="three-lens-mark reveal-layer reveal-slow"
              data-d="3"
              src="/assets/three-lens-mark.png"
              alt="Three lenses: data visualisation, digital tool creation, strategy development - the NZA approach mark."
            />
          </div>
        </header>

        <ApproachGrid />
      </div>
    </section>
  )
}
