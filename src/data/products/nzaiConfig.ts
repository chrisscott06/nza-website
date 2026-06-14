import type { ProductPageConfig } from '../../components/product/ProductPage'

const CLIENT_LOGO_BASE = '/assets/clients'

/**
 * NZ:AI product page config - v9 copy reframe.
 *
 * The shared product page TEMPLATE is unchanged - same hero with
 * cycling browser frame, same transition, same Let's-show, same
 * numbered steps, same closer. Only the copy and the step count
 * have changed.
 *
 * v9 reframes NZ:AI as a partnership rather than a product:
 *   - Tagline:    "Net zero, built as a partnership."
 *   - Stages:     Decode -> Build -> Partner (three, not four), so the
 *                 NZ:AI page mirrors the home page's three-phase voice
 *   - Voice:      First-person "we" is sanctioned on /nz-ai ONLY (v9
 *                 sign-off). Every other page on the site continues to
 *                 obey the no-we rule from CLAUDE.md.
 *
 * AI mention budget - v9 holds this to exactly three across the page:
 *   1. The brand name "NZ:AI" (microLabel + hero name)
 *   2. The hero one-liner ("AI accelerates the build...")
 *   3. The Build step body ("...built fast because AI accelerates...")
 * Future revisions must hold the budget. If a fourth mention appears,
 * the page is drifting back toward AI-as-headline rather than the
 * partnership AI enables.
 *
 * Spec: /Users/chrisscott/Downloads/NZ_AI_Web_Page_Copy_v9.md
 * (supersedes the v8 brief docs/briefs/nz-ai-copy-v8.md in full).
 *
 * Italic-emphasis fingerprint: the shared template only exposes the
 * step `highlightedVerb` slot for coral italic emphasis. v9's three
 * stage verbs (inside / actually / alongside) sit there. v9's other
 * italic moments (partnership / One / fit) render as part of the
 * template's existing italic tagline / serif headline treatment,
 * which is the closest the current template allows without
 * extending it.
 */
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
    stepVerbColour: '#F75A55',
  },

  hero: {
    /* microLabel updated per v9: NZ:AI now stands for Net Zero
       Advisory and Intelligence (not "intelligence platform"). The
       expanded form sits in the mono eyebrow above the logo. */
    microLabel: 'NET ZERO ADVISORY + INTELLIGENCE',
    name: 'NZ:AI',
    logoSrc: '/assets/logos/nzai-logo.svg',
    /* v9 hero headline. Whole line renders in DM Serif Display italic
       per the template's tagline treatment - so "partnership" reads
       italic by inclusion. v9's note on selective emphasis on
       "partnership" alone would require extending the template. */
    tagline: 'Net zero, built as a partnership.',
    /* v9 hero supporting paragraph. Contains the first AI mention
       beyond the brand name: "AI accelerates the build. The
       partnership is what makes it stick." */
    oneLiner:
      'The way Net Zero Advisory works with you to build the carbon intelligence your organisation actually needs. AI accelerates the build. The partnership is what makes it stick. Tools and strategy shaped around your data, your operations, and the way decisions actually get made - developed alongside you as your ambition grows.',
    ctaLabel: 'Get in touch',
    ctaHref: 'mailto:chrisscott@thenza.co.uk?subject=NZ%3AAI%20-%20Get%20in%20touch',
    /* Existing screens retained - v9 notes the existing platform
       screenshots are fine for launch and a morphing-chart hero
       animation is nice-to-have for later. */
    screens: [
      {
        src: '/images/products/nzai/nzai-map.png',
        shortLabel: 'Inventory map',
        alt: 'NZ:AI global emissions inventory with world map',
      },
      {
        src: '/images/products/nzai/nzai-waterfall.png',
        shortLabel: 'Strategy view',
        alt: 'NZ:AI strategy interventions waterfall chart',
      },
      {
        src: '/images/products/nzai/nzai-data-quality.png',
        shortLabel: 'Data quality',
        alt: 'NZ:AI data quality explainer with journey chart',
      },
      {
        src: '/images/products/nzai/nzai-trajectory.png',
        shortLabel: 'Trajectory',
        alt: 'NZ:AI trajectory chart with milestones',
      },
    ],
  },

  /* SECTION 2 - Manifesto (replaces the v9 bridge / transition slot
     per the manifestos brief Movement 2). v9's "Three stages. One
     relationship." was lighter-weight in the old transition spot;
     the manifesto now carries the full "why" beat at viewport scale.
     Real copy locked in Chunk 3; this is the brief's scaffold copy
     verbatim, less italic emphasis. */
  manifesto: {
    microLabel: 'WHY NZ:AI',
    headline: 'Climate action is an inside job.',
    body:
      "Real progress on net zero doesn't come from outside reports. It comes from the people inside your organisation - the ones with the relationships, the knowledge, and the context to act. NZ:AI puts NZA's expertise, AI-accelerated tools, and the data you need to act on into your hands. Decode. Build. Partner - three stages, one partnership, kept alive over time.",
    linkText: 'Read our full mission',
    linkHref: '/about',
    accentColor: 'nzai',
  },

  letsShow: {
    leadingText: "Let's show you",
    pillLabel: 'Request Demo',
    pillHref: '/contact?product=nzai',
    trailingText: 'how we do it',
  },

  /* v9 THREE STAGES - Decode, Build, Partner. Three not four (the
     prior NZ:AI config and the original template assumption was
     four; PABLO ships with five, so the template handles any count).
     Each stage's coral-italic verb sits in the highlightedVerb slot:
       01 inside    - Decode's verb
       02 actually  - Build's verb (the bespoke-vs-template distinction)
       03 alongside - Partner's verb (the relationship verb)
     The step body has its second AI mention on stage 02
     ("...built fast because AI accelerates the work..."). */
  steps: [
    {
      number: '01',
      /* ti-affiliate - the connection-forming network metaphor v9
         calls for on the Decode visual. Interim icon; v9 flags a
         richer SVG (scattered nodes gradually connecting) as a
         follow-up illustration when the production assets land. */
      iconName: 'ti-affiliate',
      headlinePrefix: 'First, we get ',
      highlightedVerb: 'inside',
      headlineSuffix: ' your organisation.',
      body:
        "Decode is the foundation. Working sessions with your team. Time inside your data, your operations, your sites or supply chain or estate - whatever shapes the carbon decisions in your business. No tools yet. Just the partnership work that makes everything that follows possible. This is the stage that can't be rushed. AI accelerates everything downstream, but the human work of understanding the organisation properly is what makes the rest of it stick.",
      illustrationConcept: 'decode-connection-forming-network',
    },
    {
      number: '02',
      /* ti-stack-2 - bespoke, layered build. v9 calls for a morphing
         platform-output cycle (dashboard / trajectory / map / supplier
         hierarchy / scenario tool) when the production asset lands.
         Static icon is fine for launch. */
      iconName: 'ti-stack-2',
      headlinePrefix: 'Then we build what your team ',
      highlightedVerb: 'actually',
      headlineSuffix: ' needs.',
      body:
        'A carbon inventory. A net zero strategy. A climate risk assessment. A digital twin. The form depends on what Decode revealed and what your team needs to make decisions with. Bespoke to your organisation, built fast because AI accelerates the work, built deep because the foundation makes it possible. Yours from day one - code, data, methodology, and the architecture that holds it together.',
      illustrationConcept: 'build-morphing-platform-outputs',
    },
    {
      number: '03',
      /* ti-infinity - continuity, compounding. v9 calls for a
         timeline-or-concentric-rings visual showing Year 1 / Year 2 /
         Year 3 expansion when the production asset lands. */
      iconName: 'ti-infinity',
      headlinePrefix: 'And we keep building, ',
      highlightedVerb: 'alongside',
      headlineSuffix: ' you.',
      body:
        'Net zero is not a project that finishes. Standards tighten. Data improves. Your organisation evolves. The partnership keeps the platform sharp and the strategy alive - methodology updates, new modules, framework support, and direct advisory whenever you need it. The rhythm is set by you. Some clients want light annual touchpoints. Others want us close in alongside their team. Either way, the platform and the partnership compound year on year.',
      illustrationConcept: 'partner-compounding-rings',
    },
  ],

  /* v9 CLOSING CTA - "Let's work out if it's the right fit."
     Closer microLabel dropped (matches PABLO's June 2026 redesign -
     the eyebrow felt redundant once headline + subhead carried the
     credibility weight).

     Closer switched from a flat clientLogos row to PABLO's
     click-to-expand caseStudies format. Three real engagements
     anchor v9's partnership claim with concrete examples - EOC's
     SBTi-aligned interventions playground, RWGC's emissions
     visualisation for members + GEO certification, and Molson's
     supply-chain embodied + operational lifecycle tool. One card
     open at a time (the template's single-expand state handles
     that automatically). */
  closer: {
    headline: "Let's work out if it's the right fit.",
    subhead:
      "Half an hour. We'll understand where you are, what you have, and what you are trying to achieve. From there, we'll work out together whether a Decode sprint is the right next step - or whether something else suits your situation better.",
    caseStudies: [
      {
        id: 'eckersley-ocallaghan',
        logoSrc: `${CLIENT_LOGO_BASE}/eckersley-ocallaghan.svg`,
        alt: "Eckersley O'Callaghan",
        companyName: "Eckersley O'Callaghan",
        body:
          "We've helped map out their carbon emissions across their nine global offices and built an interactive decarbonisation strategy that lets them play with interventions and test what happens under different scenarios, fully aligned to SBTi.",
      },
      {
        id: 'royal-wimbledon',
        /* Use the -2 variant which includes the wordmark alongside the
           crest, matching the convention PABLO uses on the same row -
           the case-studies row then reads consistently across the
           three products. */
        logoSrc: `${CLIENT_LOGO_BASE}/royal-wimbledon-golf-club-2.svg`,
        alt: 'Royal Wimbledon Golf Club',
        companyName: 'Royal Wimbledon Golf Club',
        body:
          "We're building a platform for them to visualise their energy use and emissions and show that to their members. As they put it, it will help them with their GEO certification - a tool to really manage their emissions well.",
      },
      {
        id: 'molson-group',
        logoSrc: `${CLIENT_LOGO_BASE}/molson-group.svg`,
        alt: 'Molson Group',
        companyName: 'Molson Group',
        body:
          "Molson is one of the UK's biggest construction equipment dealers. We're helping them understand their supply chain emissions through a tool that lets them see their entire product portfolio - down to the individual digger - and the embodied carbon and operational lifecycle emissions associated with each.",
      },
    ],
    ctaLabel: 'Get in touch',
    ctaHref: 'mailto:chrisscott@thenza.co.uk?subject=NZ%3AAI%20-%20Get%20in%20touch',
  },
}
