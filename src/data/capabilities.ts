/**
 * Approach screen capability content. Each card has copy for the
 * closed state (title + icon) plus the expanded panel (lead, body,
 * three-lens explainers).
 *
 * Source: nza-website.html lines 1833-1876 (capContent object).
 * Card #6 ("Co-built platforms") carries the navy-register disrupt
 * variant — the only place navy + coral appears on the paper canvas.
 */
export type Capability = {
  id: number
  title: string
  /** When true, expanded panel uses the navy-register disrupt variant. */
  disrupt?: boolean
  /** Title contains a coral-italic emphasised word (e.g. "platforms"). */
  titleHasEmphasis?: boolean
  desc: string
  data: string
  tools: string
  strategy: string
}

export const CAPABILITIES: Capability[] = [
  {
    id: 1,
    title: 'Whole-estate strategy',
    desc:
      "Strategic decarbonisation across mixed and complex estates. NZA works alongside the people running the estate — estates teams, designers, contractors, sustainability leads, and finance — turning scattered information into clear investment decisions.",
    data:
      "Building the evidence base when there isn't one. First-principles energy modelling from building physics, operational schedules and partial records. Filling data gaps and surfacing what's actually happening across an estate.",
    tools:
      "Bespoke digital twins of the estate. Centralised energy and carbon data, scenario modelling for retrofits, renewables and storage. The estate dataset stops being a folder of spreadsheets and becomes a working model.",
    strategy:
      "Investment sequencing for the interventions that pay back. Fabric, generation, storage, electrification — held in one plan, phased to capital cycles. Funding application support to bring external grants into delivery. Defensible to the board.",
  },
  {
    id: 2,
    title: 'Smart energy strategy',
    desc:
      "Smart energy strategy lives at the meeting point of three things — what the building demands, what the grid can deliver, and what the market makes possible. NZA brings a deep understanding of energy economics, DNO engagement, and behind-the-meter technologies to every part of that work, from technical analysis to procurement support.",
    data:
      "Load shape analysis, bill decomposition, generation potential. Half-hourly demand profiling against tariff structure. Real-world degradation curves and dispatch behaviours for solar, storage, EV and heat.",
    tools:
      "Bespoke energy intelligence platforms. Modelling demand, generation and storage as one integrated system. Scenario testing for capacity reform, demand-side response, and grid connection options. The tools clients keep using long after the engagement ends.",
    strategy:
      "Blue Sky energy strategies grounded in technical and commercial reality. Generation, storage, electrified transport and electrified heat — chosen, sized and sequenced as integrated investments. Optimised grid connections, capacity reduction, and the commercial routes to value.",
  },
  {
    id: 3,
    title: 'Financial intelligence',
    desc:
      "Bringing economic literacy to energy and decarbonisation decisions. NZA sits client-side on investment decisions — combining engineering analysis, energy market knowledge, and lifecycle thinking to help organisations get genuine value from their capital.",
    data:
      "Techno-economic modelling that holds up. Lifecycle cost analysis, scenario sensitivities, escalation rates that reflect what's actually happening in the markets. Building the financial picture under each technical option.",
    tools:
      "Investment cases the client can interrogate. Bespoke financial models with assumptions visible and parameters editable. Auditable end to end.",
    strategy:
      "Procurement support and grant funding strategy. Building the data pack, reviewing tender responses, sitting alongside the client through market outreach to make sure the investment delivers. A track record of bringing external grants — Salix and others — into delivery.",
  },
  {
    id: 4,
    title: 'Carbon accounting & pathways',
    desc:
      "Inventory and pathway done as one piece of work. Where the footprint sits today, what business-as-usual looks like tomorrow, and the trajectory required to align.",
    data:
      "From global footprint to specific supplier data. Activity-based Scope 1, 2 and 3 inventories with data-quality grading and a transparent path from sector averages to primary data. The breadth of the supply chain made visible — and interrogable.",
    tools:
      "Living inventory dashboards built with NZ:AI. Year-on-year tracking, trajectory modelling, scope 3 hot-spot mapping. A tool the client uses.",
    strategy:
      "SBTi-aligned trajectories, costed reduction priorities, target-setting that holds up. Reduction pathways tied to operational decisions and capital cycles. Audit-ready strategies, ready for disclosure.",
  },
  {
    id: 5,
    title: 'Climate resilience',
    desc:
      "Real physical risk, grounded in the institutional knowledge of teams who know the buildings. Climate exposure modelled with rigour, then translated into adaptation plans the people running the estate can actually act on.",
    data:
      "Asset-level exposure across the estate. Climate scenario modelling, hazard projections from UKCP18, historical site events, and the operational knowledge of the people running the buildings — turning generic climate data into site-specific risk.",
    tools:
      "Living digital risk registers. Tracked, traced, scenario-tested. Portfolio-wide vulnerability dashboards and disclosure-ready reporting that update with the climate science.",
    strategy:
      "Adaptation planning, prioritised investment in physical interventions, disclosure strategy. Action on the risks that matter most, with the evidence to back the calls that get made.",
  },
  {
    id: 6,
    title: 'Co-built platforms',
    titleHasEmphasis: true,
    disrupt: true,
    desc:
      "The capability behind every other capability. NZA builds bespoke digital platforms with clients — tools designed for the specific job, built around the client's domain knowledge and NZA's own engineering.",
    data:
      "Whatever the platform needs. Activity data, climate scenarios, market signals, building specifications, supplier records — connected, structured, and made queryable. Visualisations the client can interrogate, not just inherit.",
    tools:
      "Built to keep working. Decision tools, dashboards, simulators, calculators, risk registers — whatever a real problem demands, structured so the team can keep using and improving it.",
    strategy:
      "A platform that survives the engagement. Built for a real decision, integrated into how the team works, picked up by the people who need it. Not a deliverable; an asset.",
  },
]
