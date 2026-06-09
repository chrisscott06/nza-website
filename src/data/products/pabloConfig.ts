import type { ProductPageConfig } from '../../components/product/ProductPage'

const CLIENT_LOGO_BASE = '/assets/clients'

export const pabloConfig: ProductPageConfig = {
  slug: 'pablo',
  contextClass: 'context-pablo',
  isLight: false,

  palette: {
    canvas: '#1F0F2E',
    cream: '#FAF5EB',
    accent: '#7A74FF',
    accentLight: '#B79CFF',
    canvasElevated: 'rgba(255, 252, 246, 0.05)',
    stepVerbColour: '#7A74FF',
  },

  hero: {
    microLabel: 'SOFTWARE',
    name: 'PABLO.',
    tagline: 'Half-hourly intelligence. Real impact.',
    oneLiner:
      'Bespoke energy analytics and optimisation software. PABLO brings intelligence to how buildings consume, generate, and trade energy - turning complexity into clear, actionable insight.',
    ctaLabel: 'Get in touch',
    ctaHref: 'mailto:chrisscott@thenza.co.uk?subject=PABLO%20-%20Get%20in%20touch',
    screens: [
      {
        src: '/images/products/pablo/screen-01-site-workspace.png',
        shortLabel: 'Site workspace',
        alt: 'PABLO site workspace showing Hartpury University with map, project panels and financial overview',
      },
      {
        src: '/images/products/pablo/screen-02-energy-flows.png',
        shortLabel: 'Energy flows',
        alt: 'PABLO solar configurator with energy flows chart',
      },
      {
        src: '/images/products/pablo/screen-03-financial-case.png',
        shortLabel: 'Financial case',
        alt: 'PABLO financial case showing the payback curve',
      },
    ],
  },

  transition: {
    microLabel: 'WHY PABLO',
    headline: 'Allowing you to focus on what matters.',
  },

  letsShow: {
    leadingText: "Let's show you",
    pillLabel: 'Request Demo',
    pillHref: '/contact?product=pablo',
    trailingText: 'how we do it',
  },

  steps: [
    {
      number: '01',
      iconName: 'ti-map',
      headlinePrefix: 'First, PABLO ',
      highlightedVerb: 'maps',
      headlineSuffix: ' every load on your site.',
      body:
        'Every building, every meter, every connection. Half-hourly data, real measurements, no industry-average estimates.',
      illustrationConcept: 'site-boundary-with-meters',
    },
    {
      number: '02',
      iconName: 'ti-bolt',
      headlinePrefix: 'Then PABLO ',
      highlightedVerb: 'models',
      headlineSuffix: ' the interventions.',
      body:
        'Solar, battery, flex services. Test every combination. Find what works and what does not.',
      illustrationConcept: 'solar-battery-load',
    },
    {
      number: '03',
      iconName: 'ti-currency-pound',
      headlinePrefix: 'Next, PABLO ',
      highlightedVerb: 'builds',
      headlineSuffix: ' the financial case.',
      body:
        'Costs, savings, payback. Year-by-year, line-by-line. A case your finance director will read.',
      illustrationConcept: 'payback-curve-breakeven',
    },
    {
      number: '04',
      iconName: 'ti-rocket',
      headlinePrefix: 'Finally, you ',
      highlightedVerb: 'deploy',
      headlineSuffix: ' the strategy.',
      body:
        'From spreadsheet to substation. PABLO stays with you through implementation and monitoring.',
      illustrationConcept: 'building-energy-flows',
    },
  ],

  closer: {
    microLabel: "WHO'S USING PABLO",
    headline: 'Real estates. Real savings.',
    subhead:
      'PABLO is helping commercial sites across the UK turn complexity into clear, costed action.',
    clientLogos: [
      {
        src: `${CLIENT_LOGO_BASE}/hartpury-university.svg`,
        alt: 'Hartpury University',
      },
      {
        src: `${CLIENT_LOGO_BASE}/inspired-villages.svg`,
        alt: 'Inspired Villages',
      },
      {
        src: `${CLIENT_LOGO_BASE}/molson-group.svg`,
        alt: 'Molson Group',
      },
      {
        src: `${CLIENT_LOGO_BASE}/royal-wimbledon-golf-club.svg`,
        alt: 'Royal Wimbledon Golf Club',
      },
    ],
    ctaLabel: 'Get in touch',
    ctaHref: 'mailto:chrisscott@thenza.co.uk?subject=PABLO%20-%20Get%20in%20touch',
  },
}
