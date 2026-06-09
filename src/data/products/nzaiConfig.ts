import type { ProductPageConfig } from '../../components/product/ProductPage'

const CLIENT_LOGO_BASE = '/assets/clients'

export const nzaiConfig: ProductPageConfig = {
  slug: 'nzai',
  contextClass: 'context-nzai',
  isLight: false,

  palette: {
    canvas: '#0A1628',
    cream: '#FAF5EB',
    accent: '#0F9888',
    accentLight: '#5FDDC4',
    canvasElevated: 'rgba(95, 221, 196, 0.06)',
    stepVerbColour: '#0F9888',
  },

  hero: {
    microLabel: 'INTELLIGENCE PLATFORM',
    name: 'NZ:AI.',
    tagline: 'Net zero intelligence, built around you.',
    oneLiner:
      'An AI-native advisory platform for organisations who need to map their carbon, set a credible trajectory, and act on what they find - with technical depth and tools their teams will actually use.',
    ctaLabel: 'Get in touch',
    ctaHref: 'mailto:chrisscott@thenza.co.uk?subject=NZ%3AAI%20-%20Get%20in%20touch',
    screens: [
      {
        src: '/images/products/nzai/screen-01-inventory-map.png',
        shortLabel: 'Inventory map',
        alt: 'NZ:AI global emissions inventory with world map',
      },
      {
        src: '/images/products/nzai/screen-02-strategy-interventions.png',
        shortLabel: 'Strategy view',
        alt: 'NZ:AI strategy interventions waterfall chart',
      },
      {
        src: '/images/products/nzai/screen-03-data-quality.png',
        shortLabel: 'Data quality',
        alt: 'NZ:AI data quality explainer with journey chart',
      },
    ],
  },

  transition: {
    microLabel: 'WHY NZ:AI',
    headline: 'Helping you act with confidence.',
  },

  letsShow: {
    leadingText: "Let's show you",
    pillLabel: 'Request Demo',
    pillHref: '/contact?product=nzai',
    trailingText: 'how we do it',
  },

  steps: [
    {
      number: '01',
      iconName: 'ti-map-2',
      headlinePrefix: 'First, NZ:AI ',
      highlightedVerb: 'maps',
      headlineSuffix: ' your carbon inventory.',
      body:
        'Real data, real sources. Activity-based where we can, spend-based only where we must. No industry averages dressed up as facts.',
      illustrationConcept: 'world-map-emission-dots',
    },
    {
      number: '02',
      iconName: 'ti-target',
      headlinePrefix: 'Then NZ:AI ',
      highlightedVerb: 'sets',
      headlineSuffix: ' the trajectory.',
      body:
        'Targets that align with the science and the business. Credible, costed, and time-bound.',
      illustrationConcept: 'trajectory-chart-milestones',
    },
    {
      number: '03',
      iconName: 'ti-list-check',
      headlinePrefix: 'Next, NZ:AI ',
      highlightedVerb: 'plans',
      headlineSuffix: ' the interventions.',
      body:
        'Every action, costed and timed. From quick wins to capex-heavy retrofits. Sequenced by impact and cost.',
      illustrationConcept: 'waterfall-cascade-chart',
    },
    {
      number: '04',
      iconName: 'ti-chart-line',
      headlinePrefix: 'Finally, NZ:AI ',
      highlightedVerb: 'tracks',
      headlineSuffix: ' the journey.',
      body:
        'Year-on-year, in language your stakeholders speak. Audit-ready data. Story-ready insight.',
      illustrationConcept: 'multi-year-tracking-chart',
    },
  ],

  closer: {
    microLabel: 'WHO TRUSTS NZ:AI',
    headline: 'Real organisations. Real progress.',
    subhead:
      'NZ:AI partners with organisations who are serious about acting on climate, not just reporting on it.',
    clientLogos: [
      {
        src: `${CLIENT_LOGO_BASE}/hartpury-university.svg`,
        alt: 'Hartpury University',
      },
      {
        src: `${CLIENT_LOGO_BASE}/eckersley-ocallaghan.svg`,
        alt: "Eckersley O'Callaghan",
      },
      {
        src: `${CLIENT_LOGO_BASE}/inspired-villages.svg`,
        alt: 'Inspired Villages',
      },
      {
        src: `${CLIENT_LOGO_BASE}/molson-group.svg`,
        alt: 'Molson Group',
      },
    ],
    ctaLabel: 'Get in touch',
    ctaHref: 'mailto:chrisscott@thenza.co.uk?subject=NZ%3AAI%20-%20Get%20in%20touch',
  },
}
