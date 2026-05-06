import { CAPABILITIES } from '../data/capabilities'
import { CAPABILITY_ICONS, ArrowRightIcon } from '../components/svg/CapabilityIcons'

/**
 * Approach screen — 6-card capability grid in its closed state.
 *
 * Card #6 carries the `disrupt` modifier (navy register, coral italic
 * emphasis on `platforms`) — the only place navy + coral appears on
 * the paper canvas. It bridges to the Products screen.
 *
 * Click-to-expand interaction lands in stage 4 via useFlipCardExpand.
 */
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
              alt="Three lenses: data visualisation, digital tool creation, strategy development — the NZA approach mark."
            />
          </div>
        </header>

        {/*
          Capability grid wrap holds both the closed-state grid and
          (later) the absolutely-positioned expanded overlay. Wrap is
          position: relative so the overlay can fill the grid rect.
        */}
        <div className="cap-grid-wrap reveal-layer" data-d="2">
          <div className="cap-grid" id="capGrid">
            {CAPABILITIES.map((cap) => {
              const Icon = CAPABILITY_ICONS[cap.id - 1]
              return (
                <button
                  key={cap.id}
                  className={'cap-card' + (cap.disrupt ? ' disrupt' : '')}
                  data-cap={cap.id}
                  type="button"
                >
                  <div className="cap-card-top">
                    <span className="cap-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span className="cap-num">{String(cap.id).padStart(2, '0')}</span>
                  </div>
                  <div className="cap-card-foot">
                    <h3 className="cap-title">
                      {cap.titleHasEmphasis ? (
                        <>
                          Co-built <em>platforms</em>
                        </>
                      ) : (
                        cap.title
                      )}
                    </h3>
                    <span className="cap-arrow" aria-hidden="true">
                      <ArrowRightIcon />
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
          {/*
            Expanded overlay placeholder. Lives inside .cap-grid-wrap so
            it can fill the grid rect when stage 4's useFlipCardExpand
            opens it. Hidden by default.
          */}
          <div className="cap-expanded" id="capExpanded" hidden>
            <div className="cap-expanded-top-half">
              <div className="cap-expanded-header-icon">
                <span className="cap-icon" id="capExpIcon" aria-hidden="true" />
                <span className="cap-expanded-num" id="capExpNum">01</span>
              </div>
              <div className="cap-expanded-descriptor">
                <button className="cap-expanded-close" id="capExpClose" type="button" aria-label="Close">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
                <p className="cap-expanded-desc-lead" id="capExpDescLead" />
                <p className="cap-expanded-desc-body" id="capExpDescBody" />
              </div>
            </div>
            <div className="cap-expanded-lenses">
              <div className="cap-expanded-lens">
                <div className="cap-expanded-lens-head">
                  <span className="lens-mark data" aria-hidden="true">
                    <img src="/assets/icon-data-layers.svg" alt="" />
                  </span>
                  Data visualisation
                </div>
                <p id="capExpData" />
              </div>
              <div className="cap-expanded-lens">
                <div className="cap-expanded-lens-head">
                  <span className="lens-mark tools" aria-hidden="true">
                    <img src="/assets/icon-digital-brain.svg" alt="" />
                  </span>
                  Digital tool creation
                </div>
                <p id="capExpTools" />
              </div>
              <div className="cap-expanded-lens">
                <div className="cap-expanded-lens-head">
                  <span className="lens-mark strategy" aria-hidden="true">
                    <img src="/assets/icon-target-dot.svg" alt="" />
                  </span>
                  Strategy development
                </div>
                <p id="capExpStrategy" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
