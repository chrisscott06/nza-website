import type { ProductPageConfig } from '../../components/product/ProductPage'
import { Tooltip } from '../../components/Tooltip'

/* DfE Sustainability and Climate Change Strategy (2022) source URL +
   tooltip summary for the inline "climate action plan" link in the
   decodED manifesto. Copy locked per manifestos brief Movement 2. */
const DFE_STRATEGY_URL =
  'https://www.gov.uk/government/publications/sustainability-and-climate-change-strategy'
const DFE_TOOLTIP_BODY =
  'DfE Sustainability and Climate Change Strategy (2022). By 2025, all education settings nominate a sustainability lead and publish a climate action plan covering decarbonisation, adaptation, biodiversity, and climate education and green careers.'

export const decodedConfig: ProductPageConfig = {
  slug: 'decoded',
  contextClass: 'context-decoded',
  isLight: true,

  palette: {
    canvas: '#F3EFE3',
    cream: '#FAF5EB',
    /* Body / large type uses deep green; the orange accent drives
       verb highlights + CTAs (per brief Section 7 + Section 4 verb
       rule). */
    accent: '#0F5D43',
    accentLight: '#E8743C',
    canvasElevated: 'rgba(15, 93, 67, 0.04)',
    /* Verb highlight is orange for decodED specifically. */
    stepVerbColour: '#E8743C',
  },

  hero: {
    microLabel: 'EDUCATION PLATFORM',
    name: 'decodED',
    logoSrc: '/assets/logos/decoded-logo.svg',
    tagline: 'Climate action, decoded for education.',
    oneLiner:
      'A platform for schools, colleges, universities and trusts to understand their estates and act on climate. From postcode to plan in minutes.',
    ctaLabel: 'Get in touch',
    ctaHref: 'mailto:chrisscott@thenza.co.uk?subject=decodED%20-%20Get%20in%20touch',
    screens: [
      {
        /* Real decodED site-loaded / map screen. */
        src: '/images/products/decoded/decoded-map.png',
        shortLabel: 'Site loaded',
        alt: 'decodED with site loaded after postcode entry, showing map and site info',
      },
      {
        /* Real decodED 3D buildings detail screen. */
        src: '/images/products/decoded/decoded-map-2.png',
        shortLabel: '3D buildings',
        alt: 'decodED 3D buildings detail view',
      },
      {
        /* Real decodED dashboard / future view screen. */
        src: '/images/products/decoded/decoded-dashboard.png',
        shortLabel: 'Dashboard',
        alt: 'decodED dashboard showing climate risk, biodiversity and key metrics',
      },
      {
        /* Second dashboard view added by Chris (decoded-dashboard-2). */
        src: '/images/products/decoded/decoded-dashboard-2.png',
        shortLabel: 'Detail view',
        alt: 'decodED dashboard detail view with additional metric breakdowns',
      },
    ],
  },

  /* SECTION 2 - Manifesto (replaces the old `transition` two-liner
     per the manifestos brief Movement 2). Chunk 3 adds:
       - Italic emphasis on "right" in the headline per the brief's
         locked emphasis list.
       - Inline gov.uk hyperlink on "climate action plan" in the
         first paragraph of the body, wrapped in the Tooltip
         primitive that surfaces the DfE Sustainability and Climate
         Change Strategy summary on desktop hover. Touch users see
         the link as standard; tap opens gov.uk in a new tab.
       - Body split into two paragraphs at the natural break (was
         a single run-on string in the scaffold). */
  manifesto: {
    microLabel: 'WHY DECODED',
    headline: (
      <>
        Good data, in the <em>right</em> hands.
      </>
    ),
    body: (
      <>
        <p>
          Every educational institution in England is now required to have a{' '}
          <Tooltip
            body={DFE_TOOLTIP_BODY}
            footerHref={DFE_STRATEGY_URL}
            footerText="Read on gov.uk"
          >
            <a
              href={DFE_STRATEGY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="manifesto-inline-link"
            >
              climate action plan
            </a>
          </Tooltip>{' '}
          - covering decarbonisation, adaptation, biodiversity, and education
          and green careers. Most schools have one person carrying this.
          Decoded gives them the tools. NZA brings the expertise.
        </p>
        <p>
          And the work doesn't stop at the lead. Decoded puts granular, real,
          manageable data in the hands of everyone with a part to play -
          estates teams, teachers, students, parents. Climate action needs
          every skillset and every perspective, and the data to back them.
        </p>
      </>
    ),
    linkText: 'Read our full mission',
    linkHref: '/about',
    accentColor: 'decoded',
  },

  letsShow: {
    leadingText: "Let's show you",
    pillLabel: 'Request Demo',
    pillHref: '/contact?product=decoded',
    trailingText: 'how we do it',
  },

  steps: [
    {
      number: '01',
      iconName: 'ti-map-pin',
      headlinePrefix: 'First, ',
      highlightedVerb: 'enter',
      headlineSuffix: ' the postcode.',
      body:
        'From address to estate in seconds. decodED pulls in your buildings, your boundaries, your fuel data.',
      illustrationConcept: 'postcode-pin-uk',
    },
    {
      number: '02',
      iconName: 'ti-building',
      headlinePrefix: 'Then decodED ',
      highlightedVerb: 'maps',
      headlineSuffix: ' your estate.',
      body:
        'Every building, every floor, every fuel. 3D massing, real footprints, accurate areas.',
      illustrationConcept: 'building-cluster-axonometric',
    },
    {
      number: '03',
      iconName: 'ti-chart-pie',
      headlinePrefix: 'Next, decodED shows the ',
      highlightedVerb: 'impact',
      headlineSuffix: '.',
      body:
        'Carbon, cost, climate risk. All in one view. With benchmarks against similar estates.',
      illustrationConcept: 'three-circles-impact',
    },
    {
      number: '04',
      iconName: 'ti-list-numbers',
      headlinePrefix: 'Finally, decodED helps you ',
      highlightedVerb: 'plan',
      headlineSuffix: ' the action.',
      body:
        'Concrete steps your team can take. Sequenced, prioritised, and tracked.',
      illustrationConcept: 'sequenced-checkbox-list',
    },
  ],

  closer: {
    microLabel: 'JOIN THE PILOT',
    headline: 'Be part of the early decodED programme.',
    subhead:
      'decodED is currently in early development with select education partners. Get in touch to join the pilot programme.',
    /* No client logo row for decodED per brief. */
    ctaLabel: 'Get in touch',
    ctaHref: 'mailto:chrisscott@thenza.co.uk?subject=decodED%20-%20Get%20in%20touch',
  },
}
