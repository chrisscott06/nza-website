/**
 * Client carousel data. Each entry has a logo (greyscale at rest,
 * coral-tinted on hover via CSS filters), plus full popover content.
 *
 * Source: nza-website.html lines 2018-2139 (CLIENT_DATA array).
 */
export type Client = {
  name: string
  logoSrc: string
  /** Full-colour version shown in the popover. */
  logoCoralSrc: string
  sector: string
  context: string
  what: string
  capabilities: string[]
  /** Period · engagement type · location, separated by `·`. */
  footer: string
}

export const CLIENTS: Client[] = [
  {
    name: 'Inspired Villages',
    logoSrc: '/assets/clients/inspired-villages.svg',
    logoCoralSrc: '/assets/clients/coral/inspired-villages.svg',
    sector: 'DEVELOPER & OPERATOR',
    context:
      "One of the UK's leading developers of later-living communities, backed by NatWest Pension Fund. Building 34 purpose-built villages for over 8,000 residents.",
    what:
      'NZA is embedded in the Inspired Villages team across their growing portfolio. We develop site energy strategies and microgrid solutions — combining solar, storage and grid capacity into integrated designs — and run their group greenhouse gas inventory and GRESB reporting. Bespoke digital tools turn estate-wide energy and carbon data into something the business can act on.',
    capabilities: ['Smart energy strategy', 'Behind-the-meter strategy', 'Carbon accounting & pathways', 'Co-built platforms'],
    footer: '2022– · Long-term partnership · Group-wide engagement',
  },
  {
    name: 'Ben Pentreath',
    logoSrc: '/assets/clients/ben-pentreath.svg',
    logoCoralSrc: '/assets/clients/coral/ben-pentreath.svg',
    sector: 'ARCHITECTURE & INTERIORS',
    context:
      "One of the UK's most celebrated classical architects, best known as the lead architect on the Duchy of Cornwall's Poundbury masterplan.",
    what:
      "NZA delivered Ben Pentreath's first carbon inventory — a complex undertaking that extended well beyond building fabric to include the practice's interior design business. Because the practice procures furniture, fabrics and fittings on behalf of clients, we conducted a detailed supply chain analysis of materials sourcing — giving them a genuinely comprehensive picture of the practice's footprint for the first time.",
    capabilities: ['Carbon accounting & pathways'],
    footer: '2022–23 · Specialist support · UK',
  },
  {
    name: "Eckersley O'Callaghan",
    logoSrc: '/assets/clients/eckersley-ocallaghan.svg',
    logoCoralSrc: '/assets/clients/coral/eckersley-ocallaghan.svg',
    sector: 'STRUCTURAL ENGINEERING',
    context:
      "One of the world's foremost structural and façade engineers — known for groundbreaking work in glass, including some of the most iconic Apple stores worldwide.",
    what:
      "Working alongside Kurb Carbon, NZA developed EOC's global net zero strategy — helping a practice operating at the frontier of design and engineering take credible action on its carbon impact.",
    capabilities: ['Carbon accounting & pathways'],
    footer: '2024– · Global engagement · In partnership with Kurb Carbon',
  },
  {
    name: 'Exeter College',
    logoSrc: '/assets/clients/exeter-college.svg',
    logoCoralSrc: '/assets/clients/coral/exeter-college.svg',
    sector: 'FURTHER EDUCATION',
    context:
      "Devon's leading further education college — rated Outstanding by Ofsted, educating around 12,000 students across its Exeter city campus.",
    what:
      "NZA delivered the College's first carbon inventory and carbon management plan, plus a comprehensive estate decarbonisation strategy. We also supported a successful grant application through the Salix Public Sector Decarbonisation Scheme — securing over £1.8m in funding to accelerate delivery.",
    capabilities: ['Whole-estate strategy', 'Carbon accounting & pathways'],
    footer: '2023–24 · Specialist support · Exeter, UK',
  },
  {
    name: 'Cardiff Metropolitan University',
    logoSrc: '/assets/clients/cardiff-metropolitan-university.svg',
    logoCoralSrc: '/assets/clients/coral/cardiff-metropolitan-university.svg',
    sector: 'HIGHER EDUCATION',
    context:
      'A globally-active university with a strong international research profile, particularly in sport-related subjects.',
    what:
      "NZA developed Cardiff Met's estate decarbonisation strategy and continues to support delivery of their 2030 Carbon Management Plan. The University is now delivering its Halving the Half initiative — combining live energy data with operational knowledge to systematically identify and reduce energy waste, building a culture of continuous improvement across campus.",
    capabilities: ['Whole-estate strategy', 'Carbon accounting & pathways'],
    footer: '2023–25 · Long-term partnership · Cardiff, UK',
  },
  {
    name: 'Hartpury University',
    logoSrc: '/assets/clients/hartpury-university.svg',
    logoCoralSrc: '/assets/clients/coral/hartpury-university.svg',
    sector: 'HIGHER EDUCATION',
    context:
      'A unique 360-hectare rural campus in Gloucestershire — home to a working commercial farm, ten elite sports academies, and specialist programmes in agriculture, equine science and sport.',
    what:
      "NZA developed a Blue Sky energy strategy for the campus — one that reflects both Hartpury's institutional ambitions and the opportunities of their rural landholding. The work positions Hartpury as a potential rural energy demonstrator, and we are now supporting Hartpury as the strategy moves from concept towards delivery.",
    capabilities: ['Smart energy strategy', 'Behind-the-meter strategy', 'Whole-estate strategy'],
    footer: '2024– · Long-term partnership · Gloucestershire, UK',
  },
  {
    name: 'Diocese of Oxford',
    logoSrc: '/assets/clients/diocese-of-oxford.svg',
    logoCoralSrc: '/assets/clients/coral/diocese-of-oxford.svg',
    sector: 'RELIGIOUS ESTATE',
    context:
      'The largest diocese in the Church of England — responsible for over 800 churches and hundreds of clergy properties across Oxfordshire, Berkshire and Buckinghamshire.',
    what:
      "NZA worked on the Diocese's clergy houses, assessing the optimal retrofit pathway for one property in depth and developing a methodology that can be rolled out across the wider estate. Part of a longer-term commitment to help the Diocese plan and invest in decarbonising a unique and irreplaceable portfolio.",
    capabilities: ['Whole-estate strategy'],
    footer: '2024–25 · Specialist support · South-East England',
  },
  {
    name: 'Atkins Realis',
    logoSrc: '/assets/clients/atkins-realis.svg',
    logoCoralSrc: '/assets/clients/coral/atkins-realis.svg',
    sector: 'ENGINEERING CONSULTANCY',
    context:
      'A global engineering and project management consultancy, operating across infrastructure, energy, defence and the built environment.',
    what:
      "NZA brings specialist energy and carbon expertise to Atkins Realis projects — particularly detailed energy analytics and energy economics for major developments. We complement Atkins Realis's broader technical capability with focused knowledge of carbon strategy, net zero planning and building performance.",
    capabilities: ['Smart energy strategy', 'Carbon accounting & pathways'],
    footer: '2022– · Specialist sub-consultant · Global',
  },
  {
    name: 'Royal Wimbledon Golf Club',
    logoSrc: '/assets/clients/royal-wimbledon-golf-club.svg',
    logoCoralSrc: '/assets/clients/coral/royal-wimbledon-golf-club.svg',
    sector: 'SPORT & LEISURE',
    context:
      "Founded in 1865, Royal Wimbledon is the third-oldest golf club in England — its Royal prefix granted by Queen Victoria in 1882.",
    what:
      "NZA produced the club's initial estate decarbonisation strategy through a bespoke digital platform — laying the foundation for a credible, evidence-led emissions and estate strategy.",
    capabilities: ['Smart energy strategy', 'Whole-estate strategy', 'Co-built platforms'],
    footer: '2024– · Long-term partnership · London, UK',
  },
  {
    name: 'Molson Group',
    logoSrc: '/assets/clients/molson-group.svg',
    logoCoralSrc: '/assets/clients/coral/molson-group.svg',
    sector: 'CONSTRUCTION EQUIPMENT',
    context:
      "The UK's largest independent dealer of new and used construction equipment — and Hyundai's biggest European dealer. Thirteen locations, seventy-plus engineers, and supply chains as complex as any in the construction sector.",
    what:
      "NZA delivered Molson's first carbon inventory — a significant undertaking given that supply chain emissions account for around 99.9% of their total. We are now extending the work to Molson's US business, building both the inventory and the net zero strategy across the group.",
    capabilities: ['Carbon accounting & pathways'],
    footer: '2025– · Long-term partnership · UK & US',
  },
  {
    name: 'Torquay Academy',
    logoSrc: '/assets/clients/torquay-academy.svg',
    logoCoralSrc: '/assets/clients/coral/torquay-academy.svg',
    sector: 'SECONDARY EDUCATION',
    context:
      "A modern secondary school in Torbay — sitting in a contemporary building with energy bills that punch well above its weight.",
    what:
      "NZA was brought in to optimise the school's running costs and reduce its energy consumption. We helped the Academy secure over £2 million in grant funding through the Salix Public Sector Decarbonisation Scheme to transform the heating infrastructure, and built a digital twin of the existing system to optimise the specification of the new heat pump installation before any procurement — ensuring delivery on budget and to performance.",
    capabilities: ['Smart energy strategy', 'Behind-the-meter strategy', 'Co-built platforms'],
    footer: '2024–25 · Specialist support · Torbay, UK',
  },
  {
    name: 'Ocean Property Services',
    logoSrc: '/assets/clients/ocean-property-services.svg',
    logoCoralSrc: '/assets/clients/coral/ocean-property-services.svg',
    sector: 'ESTATE AGENCY',
    context:
      "Bristol's largest independent estate agency — over 40 years in the city, eleven offices and a team of more than 150 people.",
    what:
      "NZA delivered Ocean's first full carbon inventory and SBTi submission, giving the business a clear picture of its emissions for the first time. We are now in a longer-term partnership exploring how Ocean's unique influence over Bristol's housing market can accelerate energy efficiency improvements across the homes they sell and let.",
    capabilities: ['Carbon accounting & pathways', 'Co-built platforms'],
    footer: '2022– · Long-term partnership · Bristol, UK',
  },
]

/** Lower-case word stop list when building initials fallbacks. */
export function clientInitials(name: string): string {
  return name
    .replace(/&/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => !/^(of|the|and|for)$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}
