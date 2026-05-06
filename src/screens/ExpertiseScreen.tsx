export function ExpertiseScreen() {
  return (
    <section className="screen canvas-navy" id="capabilities" data-screen-label="02 Expertise">
      <div className="frame">
        <div className="capabilities">
          <div className="capabilities-text">
            <div className="eyebrow">
              <span className="orbit-marker" aria-hidden="true" />
              02 · Expertise
            </div>
            <h2 className="headline">
              Buildings expertise, <em>systems thinking.</em>
            </h2>
            <p className="lede">
              NZA's foundation is in building physics, systems engineering and energy
              markets. With that, we integrate climate exposure, carbon accounting,
              supply-chain emissions, and the digital tools to model all of it together.
              The result is a practice positioned where most can't reach: across the
              technical, the financial, and the strategic edges of the same connected
              challenge.
            </p>
          </div>
          <div className="diagram diagram-ghg" aria-hidden="true">
            {/* GHG Protocol value-chain diagram lands in stage 4 */}
          </div>
        </div>
      </div>
    </section>
  )
}
