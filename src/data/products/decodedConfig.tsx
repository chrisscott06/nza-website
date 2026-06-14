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

  /* Hero refreshed per manifestos brief Movement 3.1:
       - Catchline / tagline tightened to "Climate action in education."
         (brief calls this "unchanged from whatever currently ships";
         the prior tagline "Climate action, decoded for education."
         carried an extra clause and is now trimmed to match).
       - Pitch line replaced with the free-to-everyone postcode-to-plan
         line.
       - Primary CTA: "Search your postcode". No postcode-search route
         exists yet, so the href points to /contact?product=decoded
         as an interim fallback. Flag for follow-up when the postcode
         entry surface is built.
       - Secondary CTA: "Join the waitlist" - mailto so interested
         schools land directly in the inbox without a new form. */
  hero: {
    microLabel: 'EDUCATION PLATFORM',
    name: 'decodED',
    logoSrc: '/assets/logos/decoded-logo.svg',
    tagline: 'Climate action in education.',
    oneLiner:
      'Free for every nursery, school, college, and university. Search a postcode, build your digital twin, and start your climate action plan today.',
    ctaLabel: 'Search your postcode',
    ctaHref: '/contact?product=decoded',
    secondaryCtaLabel: 'Join the waitlist',
    secondaryCtaHref:
      'mailto:chrisscott@thenza.co.uk?subject=decodED%20-%20Join%20the%20waitlist',
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

  /* Five "how it works" cards per manifestos brief Movement 3.2 -
     full replacement of the previous four-card flow. Headlines are
     short action statements (Search. / Data populates. / Input what
     only you know. / Explore the four pillars. / Draft your plan.)
     with the action verb highlighted in decodED's orange via the
     existing `.step-verb` mechanism. Brief flagged italic-on-"only"
     and italic-on-"clear" as suggestions; per Chris's earlier
     instruction (no italic, theme colour on verbs), those are not
     applied and the verb-colour treatment is used consistently
     across all five cards. Em-dashes in body copy converted to
     hyphens per CLAUDE.md. */
  steps: [
    {
      number: '01',
      iconName: 'ti-search',
      headlinePrefix: '',
      highlightedVerb: 'Search',
      headlineSuffix: '.',
      body:
        'Find any educational site - or any building within one. Draw a boundary and watch your 3D model come to life.',
      illustrationConcept: 'postcode-search-3d',
    },
    {
      number: '02',
      iconName: 'ti-database',
      headlinePrefix: 'Data ',
      highlightedVerb: 'populates',
      headlineSuffix: '.',
      body:
        'Decoded pulls in useful publicly available data - building footprints, floor areas, energy performance certificates, climate projections. Your digital twin starts taking shape in seconds.',
      illustrationConcept: 'data-streams-populating',
    },
    {
      number: '03',
      iconName: 'ti-edit',
      headlinePrefix: '',
      highlightedVerb: 'Input',
      headlineSuffix: ' what only you know.',
      body:
        'Heating systems, travel patterns, overheating, flooding, biodiversity on site. A handful of straightforward questions - and the climate risk assessment - where human input matters most.',
      illustrationConcept: 'human-input-questions',
    },
    {
      number: '04',
      iconName: 'ti-layout-grid',
      headlinePrefix: '',
      highlightedVerb: 'Explore',
      headlineSuffix: ' the four pillars.',
      body:
        'Decarbonisation. Adaptation. Biodiversity. Education and green careers. Decoded walks you through each one - giving you a clear picture of your climate action plan, pillar by pillar.',
      illustrationConcept: 'four-pillars-grid',
    },
    {
      number: '05',
      iconName: 'ti-list-numbers',
      headlinePrefix: '',
      highlightedVerb: 'Draft',
      headlineSuffix: ' your plan.',
      body:
        'A credible climate action plan, ready to refine, share, and act on. Save it, build on it over time, and bring more of your team in.',
      illustrationConcept: 'action-plan-document',
    },
  ],

  /* SECTION 4.5 - "Going Further with NZA" triptych per the
     manifestos brief Movement 3.3. Sits between the how-it-works
     cards and the closer. Frames Decoded as the free foundation
     that NZA takes further over time. PABLO mention in Card 02
     gets a typographic moment via the `.pablo-mark` bold span
     per the brief's "should be its own typographic moment"
     guidance. Em-dashes converted to hyphens per CLAUDE.md. */
  goingFurther: {
    microLabel: 'GOING FURTHER WITH NZA',
    headline: 'Build your plan for free. Take it further with NZA.',
    intro:
      'The digital twin you start with Decoded - once a capability reserved for big commercial estates - is now the foundation for your institution. Free to keep, with the digital twin growing into the operating system for your whole estate as NZA works alongside you.',
    cards: [
      {
        title: 'Estate data management',
        body: (
          <p>
            Centralised data. Real-world monitoring through sub-metering and
            sensors. AI-native interrogation of your estate. The kind of
            operational visibility most institutions have never had - built on
            the same digital twin you started for free.
          </p>
        ),
      },
      {
        title: 'Energy cost optimisation',
        body: (
          <p>
            <span className="pablo-mark">PABLO</span>, NZA's energy strategy
            tool, plugs directly into your digital twin. Optimise costs, model
            renewables and storage, prepare for the energy transition. Make
            every electrification decision a confident one.
          </p>
        ),
      },
      {
        title: 'Specialist expertise',
        body: (
          <p>
            NZA's decarbonisation, climate, and biodiversity specialists work
            alongside your sustainability lead, estates team, teachers, and
            students. Detailed assessments, real engineering, and the experts
            the digital twin needs to grow.
          </p>
        ),
      },
    ],
    ctaText: 'Get in touch to find out more',
    ctaHref:
      'mailto:chrisscott@thenza.co.uk?subject=decodED%20-%20Going%20further%20with%20NZA',
  },

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
