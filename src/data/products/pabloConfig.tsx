import type { ProductPageConfig } from '../../components/product/ProductPage'

const CLIENT_LOGO_BASE = '/assets/clients'

export const pabloConfig: ProductPageConfig = {
  slug: 'pablo',
  contextClass: 'context-pablo',
  isLight: false,

  palette: {
    canvas: '#1F0F2E',
    cream: '#FAF5EB',
    /* Swapped from pale violet (#B79CFF / #7A74FF) to the brand coral
       per Chris - the pale purple wasn't sitting right on the aubergine.
       Coral on aubergine reads as a confident NZA-family identity. */
    accent: '#DC4844',
    accentLight: '#F75A55',
    canvasElevated: 'rgba(247, 90, 85, 0.05)',
    stepVerbColour: '#F75A55',
  },

  hero: {
    microLabel: 'SOFTWARE',
    name: 'PABLO',
    logoSrc: '/assets/logos/pablo-logo.svg',
    /* Tagline updated per Chris - was "Half-hourly intelligence. Real
       impact." Now a punchier promise that frames PABLO as the answer
       to "energy is confusing." */
    tagline: 'Make energy make sense',
    oneLiner:
      'Your electricity bill is more complex than you think. PABLO breaks it down - and shows you what to do about it.',
    /* CTA updated per nza-pablo-page-brief.md Change 3 - "Get in
       Touch" -> "Book a demo" on every PABLO-page CTA (hero + closer).
       The site-wide nav CTA stays "GET IN TOUCH". */
    ctaLabel: 'Book a demo',
    ctaHref: 'mailto:chrisscott@thenza.co.uk?subject=PABLO%20-%20Book%20a%20demo',
    screens: [
      {
        /* Real PABLO home / site workspace screen. */
        src: '/images/products/pablo/pablo-home.png',
        shortLabel: 'Site workspace',
        alt: 'PABLO site workspace showing the home view with map, project panels and financial overview',
      },
      {
        /* Real PABLO energy flows screen. */
        src: '/images/products/pablo/pablo-flow.png',
        shortLabel: 'Energy flows',
        alt: 'PABLO energy flows view',
      },
      {
        /* Real PABLO financial case screen. */
        src: '/images/products/pablo/pablo-financial.png',
        shortLabel: 'Financial case',
        alt: 'PABLO financial case showing the payback curve and savings breakdown',
      },
      {
        /* Real PABLO optimisation screen - bonus 4th panel since the
           BrowserFrame supports any number of cycles. */
        src: '/images/products/pablo/pablo-optimise.png',
        shortLabel: 'Optimisation',
        alt: 'PABLO optimisation view',
      },
    ],
  },

  /* SECTION 2 - Manifesto (full-viewport "why" takeover, replaces the
     old `transition` two-liner per the manifestos brief Movement 2).
     Italic emphasis on "Where" per Movement 2's locked emphasis
     list (Chunk 3 of the manifestos brief). */
  manifesto: {
    microLabel: 'WHY PABLO',
    headline: (
      <>
        <em>Where</em> the energy market, the grid, and your building meet.
      </>
    ),
    body:
      'Commercial electricity is one of the most complex purchases an organisation makes - dynamic markets, more than a dozen separate charges, regulation that keeps moving. PABLO sits at the intersection where the market, the grid, and what happens behind the meter overlap. It turns that complexity into clarity - and gives you the confidence to invest in solar, storage, electrification, and the energy transition.',
    linkText: 'Read our full mission',
    linkHref: '/about',
    accentColor: 'pablo',
  },

  letsShow: {
    leadingText: "Let's show you",
    pillLabel: 'Request Demo',
    pillHref: '/contact?product=pablo',
    trailingText: 'how we do it',
  },

  /* Five "how it works" sections per nza-pablo-page-brief.md Change 1.
     Copy is LOCKED - do not paraphrase. Section verbs (breaks down /
     models / separates / test / builds) are the coral-highlighted
     words in each headline; the prefix + suffix render in cream
     around them. Icons are interim placeholders - per the brief, real
     illustrations will be supplied as SVG exports in a follow-up. */
  /* Step headlines split into prefix / highlightedVerb / suffix so the
     verb word renders in PABLO's coral via the template's `.step-verb`
     class (driven by `palette.stepVerbColour` above). Verb-only colour,
     no italic. Per Chris's feedback after Chunk 2 of the manifestos
     brief - on-screen text is identical to the previous `headline`
     single-string form; only the colour highlight is new. Bodies are
     unchanged. */
  steps: [
    {
      number: '01',
      iconName: 'ti-receipt',
      headlinePrefix: '',
      highlightedVerb: 'Break down',
      headlineSuffix: ' your bill',
      body:
        "All PABLO needs is your load shape and a copy of your electricity bill. From those two inputs, it builds a complete picture of your demand and breaks out your costs into every constituent charge.",
      illustrationConcept: 'bill-decomposition',
    },
    {
      number: '02',
      iconName: 'ti-activity',
      headlinePrefix: '',
      highlightedVerb: 'Understand',
      headlineSuffix: ' your demand',
      body:
        "Explore your building's energy profile at half-hourly resolution. See where your peaks are, how weekdays differ from weekends, where the patterns and anomalies hide. Then play with it - model the impact of electrifying heat, installing EV chargers, or shifting your peaks.",
      illustrationConcept: 'demand-profile-half-hourly',
    },
    {
      number: '03',
      iconName: 'ti-currency-pound',
      headlinePrefix: "See what's actually ",
      highlightedVerb: 'driving',
      headlineSuffix: ' cost',
      body:
        "Your electricity rate isn't one number - it's built from over a dozen separate charges, each escalating at a different rate. PABLO separates every component, shows you which charges are rising fastest, and projects them forward.",
      illustrationConcept: 'charges-stack',
    },
    {
      number: '04',
      iconName: 'ti-flask',
      headlinePrefix: '',
      highlightedVerb: 'Test',
      headlineSuffix: ' every option',
      body:
        'Solar, wind, battery storage, peak shaving, tariff arbitrage, flexibility revenue. Change an input and watch everything respond - the energy flows, the cost stack, the financial case. See the battery cycling, the solar feeding in, the picture shifting in real time.',
      illustrationConcept: 'options-sandbox',
    },
    {
      number: '05',
      iconName: 'ti-chart-bar',
      headlinePrefix: '',
      highlightedVerb: 'Build',
      headlineSuffix: ' the investment case',
      body:
        'Layer interventions together, compare scenarios side by side, and see the full financial case over the asset lifetime. The analytical confidence to recommend a strategy - or to challenge one.',
      illustrationConcept: 'investment-case-stack',
    },
  ],

  /* Closer restructured per nza-pablo-page-brief.md Change 2:
     - microLabel omitted (the old "WHO'S USING PABLO" pink eyebrow
       is dropped entirely)
     - subhead replaced with the combined audience + value line that
       used to sit at the bottom of the page sign-off
     - clientLogos -> caseStudies: 3 expandable cards (Hartpury / IVG
       / RWGC), Molson dropped per the brief
     - ctaLabel "Get in touch" -> "Book a demo" */
  closer: {
    headline: 'Real estates. Real savings.',
    subhead:
      'Built for energy consultants, sustainability advisors, and building owners who need to understand the true cost of electricity - and the real value of the solutions. PABLO turns complexity into clear, costed action.',
    caseStudies: [
      {
        id: 'hartpury',
        logoSrc: `${CLIENT_LOGO_BASE}/hartpury-university.svg`,
        alt: 'Hartpury University',
        companyName: 'Hartpury University',
        body:
          "PABLO was used to analyse Hartpury's site load and optimise their grid connection - saving over GBP250,000 a year in network charges and rising, while enabling them to move forward with their electrification strategy with confidence.",
      },
      {
        id: 'inspired-villages',
        logoSrc: `${CLIENT_LOGO_BASE}/inspired-villages.svg`,
        alt: 'Inspired Villages',
        companyName: 'Inspired Villages',
        body:
          "PABLO is being used to model IVG's entire portfolio - providing clarity on their energy spend and developing a microgrid strategy that delivers energy resilience, supports IVG's net zero ambitions, and benefits residents directly.",
      },
      {
        id: 'royal-wimbledon',
        /* Swapped to the -2 variant Chris added which includes the
           wordmark alongside the crest, so the case-studies row
           reads consistently (all three logos now include their
           company name and we no longer need to render the name
           separately beneath each). */
        logoSrc: `${CLIENT_LOGO_BASE}/royal-wimbledon-golf-club-2.svg`,
        alt: 'Royal Wimbledon Golf Club',
        companyName: 'Royal Wimbledon Golf Club',
        body:
          "PABLO is being used to make sense of RWGC's electricity spend, find them a better tariff, and now model a solar canopy and battery system to help power one of the oldest golf clubs in England.",
      },
    ],
    ctaLabel: 'Book a demo',
    ctaHref: 'mailto:chrisscott@thenza.co.uk?subject=PABLO%20-%20Book%20a%20demo',
  },
}
