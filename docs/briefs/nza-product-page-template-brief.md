# Brief: NZA product page template (PABLO · NZ:AI · decodED)

**For:** Claude Code (implementation)
**Scope:** One shared template, populated three times — `/pablo`, `/nz-ai`, `/decoded`
**Date:** 9 June 2026
**Status:** Concept locked, ready for build

This brief defines the **product page template** that gets used for PABLO, NZ:AI, and decodED. The structure is identical across all three; the content (screens, copy, accent colours, illustrations) varies per product.

The template borrows its structural patterns from the Impilo website (`impilo.health`) — specifically the platform-preview hero, the centred transition headline, the *"let's show you how we do it"* CTA section, and the four-step request-demo flow. Visual identity is NZA's, not Impilo's.

This brief assumes the navigation system brief (`nza-navigation-brief.md`) is already implemented. The three product page routes (`/pablo`, `/nz-ai`, `/decoded`) already exist as stubs from that brief and will now be populated.

---

## What you're building

A single reusable product page template with five sections:

1. **Hero** — product name + tagline + one-liner on the left; browser-window frame with cycling product screenshots on the right.
2. **Centred transition headline** — large statement that bridges the hero and the explainer below, with a hard colour cut from the product's dark canvas into a light section.
3. **"Let's show you how we do it"** — large headline with an inline Request Demo pill button.
4. **Four numbered steps** — the request-demo flow. Each step has a number, icon, bold headline with verb highlights, body copy, and a square-framed illustration on the right.
5. **Closer / credibility section** — client logos or supporting badges, depending on the product.

The template is implemented once. Each product imports it and supplies its own data via a props/config pattern.

---

## Visual system reminders

Use existing NZA design tokens and the per-product palettes defined in the nav brief:

| Product | Page background | Primary accent | Light section background |
|---|---|---|---|
| PABLO | Aubergine `#1F0F2E` | Violet `#7A74FF` (light variant `#B79CFF` for visibility on dark) | Cream `#FAF5EB` |
| NZ:AI | Deep navy `#0A1628` | Teal `#0F9888` (light variant `#5FDDC4` for visibility on dark) | Cream `#FAF5EB` |
| decodED | Cream-warm `#F3EFE3` (note: light by default) | Deep green `#0F5D43` | Cream `#FAF5EB` or stays in same cream-warm |

**Note on decodED:** decodED's page is *light by default* (cream-warm background), unlike PABLO and NZ:AI which are dark. This means the hard cut between dark hero and light section doesn't apply to decodED in the same way. See **Section 7 — decodED variations** for how the template adapts.

**Typography:**
- Stolzl for display (product name, section headlines, step headlines, nav)
- DM Serif Display italic for accent words and taglines
- Inter for body copy
- IBM Plex Mono for labels, step numbers, micro-copy

**Animation easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (standard NZA settled-arrival curve)

---

## Section 1 — Hero

### Layout
- Full viewport height (~92vh, leaving the nav)
- Two-column grid on desktop: ~45% / 55% (text left / browser frame right)
- On mobile, stacks: text on top, browser frame beneath

### Left column

Vertically centred. Contains:

1. **Section micro-label** in mono uppercase, accent colour, ~11px, letter-spacing 0.2em
   - PABLO: `SOFTWARE`
   - NZ:AI: `INTELLIGENCE PLATFORM`
   - decodED: `EDUCATION PLATFORM`

2. **Product name** — Stolzl, ~72px desktop / 56px tablet / 44px mobile, font-weight 500, cream on dark / deep green on cream
   - PABLO: `PABLO.`
   - NZ:AI: `NZ:AI.`
   - decodED: `decodED.`

3. **Tagline** in DM Serif Display italic, accent colour, ~26px
   - PABLO: *"Half-hourly intelligence. Real impact."*
   - NZ:AI: *"Net zero intelligence, built around you."*
   - decodED: *"Climate action, decoded for education."*

4. **One-liner body** in Inter, ~18px, cream at 75% opacity (or deep green at 75% for decodED), max-width ~440px
   - PABLO: *"Bespoke energy analytics and optimisation software. PABLO brings intelligence to how buildings consume, generate, and trade energy — turning complexity into clear, actionable insight."*
   - NZ:AI: *"An AI-native advisory platform for organisations who need to map their carbon, set a credible trajectory, and act on what they find — with technical depth and tools their teams will actually use."*
   - decodED: *"A platform for schools, colleges, universities and trusts to understand their estates and act on climate. From postcode to plan in minutes."*

5. **Get in touch CTA** — outlined on dark pages (PABLO, NZ:AI), solid-filled on light pages (decodED). Uses the product accent. (See nav brief for CTA spec — same pattern applies here.)

### Right column — the browser frame and cycling screenshots

A stylised browser window frame containing a rotating series of product screenshots. The frame is:

- **Width:** ~600px on desktop (scales down on tablet and mobile, capped at ~88% viewport width)
- **Aspect ratio of the inner screen area:** 16:10 (so a 600px wide frame has a 375px tall screen area)
- **Frame chrome:**
  - Three small dots in the top-left (traffic-light style — but in neutral grey, not the realistic Mac colours) at ~10px each, gap ~6px
  - A subtle URL-bar shape across the top — rounded rectangle, ~70% of the frame width, semi-transparent fill, no actual URL text
  - Frame border: 0.5px hairline in the product's accent colour at 30% opacity
  - Border-radius: 8px on the outer frame
  - Drop shadow: soft, low — `0 24px 64px -16px rgba(0,0,0,0.4)` on dark pages, `0 24px 48px -16px rgba(0,0,0,0.12)` on light
- **Frame background colour:** product canvas colour at slightly elevated brightness (~5% lighter than page background) so the frame *reads* as an object on the canvas, not just a screenshot floating

### The cycling animation

Inside the browser frame, three product screenshots cross-fade between each other:

- Each screen displays for **4.5 seconds**
- Cross-fade transition between screens: **600ms** with the standard easing
- After the third screen, return to the first — continuous loop
- **On hover over the frame:** pause the rotation
- **Auto-resume** when the cursor leaves the frame

### Progress indicator

At the bottom of the browser frame (inside the frame, just above the lower border), a thin horizontal progress indicator:

- Three thin segments of equal width, separated by 4px gaps
- Each segment is 3px tall, ~50px wide, semi-transparent (accent colour at 20% opacity)
- The currently-active segment fills with the accent colour at full opacity over the 4.5-second hold period (so the segment *fills* as time passes, like a horizontal progress bar)
- When the next screen takes over, the previous segment empties back to 20% and the next begins to fill

Clicking a segment jumps directly to that screen and resets the timer.

### Screenshots per product

Reference assets to be supplied by Chris (PNG, 1600×1000 native, 2× retina available). Paths:

**PABLO** — `/public/images/products/pablo/`
1. `screen-01-site-workspace.png` — Site overview / Hartpury workspace (map + project panels + financial overview)
2. `screen-02-energy-flows.png` — Solar configurator with energy flows chart
3. `screen-03-financial-case.png` — Financial case with payback chart

**NZ:AI** — `/public/images/products/nzai/`
1. `screen-01-inventory-map.png` — Global emissions inventory with map
2. `screen-02-strategy-interventions.png` — Strategy interventions waterfall
3. `screen-03-data-quality.png` — Data quality explainer with journey chart

**decodED** — `/public/images/products/decoded/`
1. `screen-01-site-loaded.png` — Postcode entry → Exeter College site loaded on map with site info panel
2. `screen-02-3d-buildings.png` — 3D buildings detail view
3. `screen-03-future-view.png` — Future view (climate risk / biodiversity / dashboard) — may include subtle "coming soon" badge

If any screenshot is not yet available, Claude Code should use a placeholder rectangle in the product's accent colour at 8% opacity with a "Screen coming soon" label in mono micro-copy. This is acceptable for first build.

### Hero background motion (PABLO and NZ:AI only)

PABLO and NZ:AI heroes have a quiet ambient blob field behind the content, same technique as the landing page hero (heavy blur, slow drift, co-prime animation durations). Per-product tuning:

- **PABLO:** 4 blobs — two deep aubergine variants (slightly lighter and slightly darker than the canvas), one violet at 18% opacity, one warm amber at 8% opacity. Blur 110px.
- **NZ:AI:** 4 blobs — two navy variants, one teal at 18% opacity, one mint at 10% opacity. Blur 100px.

decodED's hero has no blob field (light background, simpler treatment).

---

## Section 2 — Centred transition headline

A short, confident statement that bridges the hero and the request-demo explainer below. Always centred. Always with a hard colour cut beneath it into the light section.

### Layout
- Full-width section, centred content
- Vertical padding: ~140px top, ~100px bottom
- Background: same as the product's hero (aubergine for PABLO, deep navy for NZ:AI, cream-warm for decodED)
- Beneath this section: a **hard transition** to a light section (cream `#FAF5EB`). No gradient, no fade — a clean colour cut.

### Content per product

Stolzl 500, ~64px desktop / 48px mobile, cream on dark / deep green on cream-warm. Two-line max.

**PABLO:**
> *Allowing you to focus on what matters.*

**NZ:AI:**
> *Helping you act with confidence.*

**decodED:**
> *Making climate action achievable.*

Beneath each: a small mono micro-label, accent colour, ~11px, uppercase, letter-spacing 0.2em.

- PABLO: `WHY PABLO`
- NZ:AI: `WHY NZ:AI`
- decodED: `WHY DECODED`

The micro-label sits *above* the headline (~28px gap to the headline below). Hero arrival animation: upward mask-reveal (see landing-page brief) applied to the headline as it enters the viewport.

---

## Section 3 — "Let's show you how we do it" CTA

The bridging moment between the value statement above and the four-step explainer below. Borrows Impilo's structural device of placing a pill button *inline* in the headline.

### Layout
- Full-width section on a **cream background** (`#FAF5EB`)
- Vertical padding: ~120px top, ~120px bottom
- Centred, single-line composition (wraps to two lines on tablet / three lines on mobile)

### Content

Stolzl 500, ~56px desktop / 40px mobile, deep navy (`#1a2540`) text.

**The headline reads (left to right):**

> "Let's show you" [PILL BUTTON: *Request Demo*] "how we do it"

The **Request Demo pill button** sits inline in the middle of the headline:
- Pill shape, ~999px border-radius
- Padding: 14px 28px
- Border: 0.5px solid in the product accent colour (violet for PABLO, teal for NZ:AI, deep green for decodED)
- Background: transparent at rest, fills with the accent colour on hover (white text on hover)
- Text: Stolzl 500, ~20px (smaller than the surrounding headline so it reads as inset)
- Vertically aligned to the headline's text baseline

On click: opens the contact / demo request flow (placeholder route `/contact?product={product}` for first build).

### Section background motion

None. This section is a clean cream pause between two busier sections.

---

## Section 4 — Four numbered steps

The core explainer. Replicates the Impilo "01. First, Impilo identifies and qualifies patients..." pattern with NZA's visual identity.

### Layout

- Full-width section on **cream background** (`#FAF5EB`)
- Each step is a two-column row: text left (~45% width), illustration right (~55% width)
- Vertical spacing between steps: ~120px
- Section total vertical padding: ~80px top, ~140px bottom
- On mobile, columns stack: text on top, illustration beneath

### Per-step structure (left column, text)

Each step contains:

1. **A small icon glyph** in the top-left of the text column, ~32px square, deep navy stroke 1.5px (or deep green for decodED), outline style. The icon represents the step's action. Icon source: Tabler Icons or custom. See per-product icon mapping below.

2. **Step number** in the top-right of the text column (top-aligned with the icon), Stolzl 500, ~14px, deep navy at 60% opacity, mono-tabular numerals. Format: `01.` `02.` `03.` `04.`

3. **Bold headline** beneath the icon row, Stolzl 500, ~38px desktop / 28px mobile, deep navy (or deep green for decodED). Multi-line allowed. **Specific verbs are highlighted in the product accent colour** (see verb list per product below).

4. **Body paragraph** beneath the headline, Inter regular, ~17px, deep navy at 70% opacity, max-width ~440px, line-height 1.55. Body copy for the first build is intentionally minimal — one to two sentences per step. Real product copy will replace these in iteration.

### Per-step structure (right column, illustration)

A **square frame** containing a line-art illustration of the step's concept:

- Square frame: ~440px × 440px on desktop (scales proportionally smaller on mobile)
- Border: 0.5px solid in the product's accent colour at ~40% opacity
- Border-radius: 12px
- Interior background: cream at slightly elevated brightness (~`#FCF8EE`) — subtle, not screaming
- Padding inside the frame: 48px on all sides
- The illustration itself: line-art in the product's accent colour at full opacity, ~280px max dimension, centred in the frame

For the first build, illustrations can be **placeholder line-art** (simple geometric forms suggesting the step's concept). Final illustrations are pending from design (Leo Morgan / dawn.design). The brief specifies what each illustration should depict so Claude Code can mock something credible.

### PABLO — steps and content

**Step 01.** Icon: `ti-map` (Tabler map icon)
- Headline: *First, PABLO **maps** every load on your site.*
- Highlighted verb: **maps** (violet)
- Body: *Every building, every meter, every connection. Half-hourly data, real measurements, no industry-average estimates.*
- Illustration concept: line-art of a site boundary with building outlines and small dots for meters / connection points

**Step 02.** Icon: `ti-bolt`
- Headline: *Then PABLO **models** the interventions.*
- Highlighted verb: **models** (violet)
- Body: *Solar, battery, flex services. Test every combination. Find what works and what doesn't.*
- Illustration concept: line-art of solar panels, battery, and a load curve, connected by thin lines

**Step 03.** Icon: `ti-currency-pound`
- Headline: *Next, PABLO **builds** the financial case.*
- Highlighted verb: **builds** (violet)
- Body: *Costs, savings, payback. Year-by-year, line-by-line. A case your finance director will read.*
- Illustration concept: line-art of a payback curve with a marked break-even point

**Step 04.** Icon: `ti-rocket`
- Headline: *Finally, you **deploy** the strategy.*
- Highlighted verb: **deploy** (violet)
- Body: *From spreadsheet to substation. PABLO stays with you through implementation and monitoring.*
- Illustration concept: line-art of a building with energy flows visualised around it

### NZ:AI — steps and content

**Step 01.** Icon: `ti-map-2`
- Headline: *First, NZ:AI **maps** your carbon inventory.*
- Highlighted verb: **maps** (teal)
- Body: *Real data, real sources. Activity-based where we can, spend-based only where we must. No industry averages dressed up as facts.*
- Illustration concept: line-art of a world map with emission dots

**Step 02.** Icon: `ti-target`
- Headline: *Then NZ:AI **sets** the trajectory.*
- Highlighted verb: **sets** (teal)
- Body: *Targets that align with the science and the business. Credible, costed, and time-bound.*
- Illustration concept: line-art of a downward-sloping trajectory chart with milestones

**Step 03.** Icon: `ti-list-check`
- Headline: *Next, NZ:AI **plans** the interventions.*
- Highlighted verb: **plans** (teal)
- Body: *Every action, costed and timed. From quick wins to capex-heavy retrofits. Sequenced by impact and cost.*
- Illustration concept: line-art of a waterfall / cascade chart with stacked intervention bars

**Step 04.** Icon: `ti-chart-line`
- Headline: *Finally, NZ:AI **tracks** the journey.*
- Highlighted verb: **tracks** (teal)
- Body: *Year-on-year, in language your stakeholders speak. Audit-ready data. Story-ready insight.*
- Illustration concept: line-art of a multi-year tracking chart

### decodED — steps and content

**Step 01.** Icon: `ti-map-pin`
- Headline: *First, **enter** the postcode.*
- Highlighted verb: **enter** (orange)
- Body: *From address to estate in seconds. decodED pulls in your buildings, your boundaries, your fuel data.*
- Illustration concept: line-art of a postcode-pin dropping onto a stylised UK outline

**Step 02.** Icon: `ti-building`
- Headline: *Then decodED **maps** your estate.*
- Highlighted verb: **maps** (orange)
- Body: *Every building, every floor, every fuel. 3D massing, real footprints, accurate areas.*
- Illustration concept: line-art of clustered building blocks in axonometric view

**Step 03.** Icon: `ti-chart-pie`
- Headline: *Next, decodED shows the **impact**.*
- Highlighted verb: **impact** (orange)
- Body: *Carbon, cost, climate risk. All in one view. With benchmarks against similar estates.*
- Illustration concept: line-art of three intersecting circles labelled subtly with carbon / cost / risk

**Step 04.** Icon: `ti-list-numbers`
- Headline: *Finally, decodED helps you **plan** the action.*
- Highlighted verb: **plan** (orange)
- Body: *Concrete steps your team can take. Sequenced, prioritised, and tracked.*
- Illustration concept: line-art of a sequenced list with checkboxes

### Verb-highlighting implementation

The highlighted verb should be wrapped in a `<span class="step-verb">` with the colour applied per page context (set via CSS variable). The colour:

- PABLO: `--step-verb-colour: #7A74FF;`
- NZ:AI: `--step-verb-colour: #0F9888;`
- decodED: `--step-verb-colour: #E8743C;` (orange, not deep green — the orange is the highlight colour for decodED, deep green is the body)

The verb stays the same Stolzl 500 weight as the rest of the headline. Only the colour changes.

### Step arrival animation

Each step animates in as it enters the viewport (Intersection Observer with ~30% threshold):

1. The icon and step number fade in together (~400ms)
2. ~120ms later, the headline mask-reveals upward
3. ~80ms after the headline starts, the body paragraph mask-reveals upward
4. ~200ms after the body starts, the square frame fades in (~600ms) with the illustration drawing/fading in inside it

Total per-step entry: ~1.4 seconds. Subtle, layered.

---

## Section 5 — Closer / credibility

The final section before the footer. Provides social proof and rounds out the page.

### Layout

- Full-width section on a **darker band** — back to the product's canvas colour (aubergine for PABLO, deep navy for NZ:AI, cream-warm for decodED — yes, decodED stays light here)
- Hard colour cut from the cream section above into this band
- Vertical padding: ~140px top, ~120px bottom
- Centred composition

### Content structure

1. **Section micro-label** in mono uppercase, accent colour, ~11px, letter-spacing 0.2em
   - PABLO: `WHO'S USING PABLO`
   - NZ:AI: `WHO TRUSTS NZ:AI`
   - decodED: `JOIN THE PILOT`

2. **Centred headline** Stolzl 500, ~52px desktop / 38px mobile, cream on dark / deep green on light
   - PABLO: *Real estates. Real savings.*
   - NZ:AI: *Real organisations. Real progress.*
   - decodED: *Be part of the early decodED programme.*

3. **Subheading** Inter regular, ~18px, cream at 70% opacity (or deep green at 70%), centred, max-width ~520px
   - PABLO: *PABLO is helping commercial sites across the UK turn complexity into clear, costed action.*
   - NZ:AI: *NZ:AI partners with organisations who are serious about acting on climate, not just reporting on it.*
   - decodED: *decodED is currently in early development with select education partners. Get in touch to join the pilot programme.*

4. **Client logo row** (PABLO and NZ:AI only) — horizontal row of client logos, monochrome in cream at 60% opacity, ~36px tall. List per product:
   - PABLO: Hartpury, IVG, Molson, RWGC, Zeal (placeholders if not all available — Claude Code can mock with stylised wordmark blocks)
   - NZ:AI: Hartpury, EOC, IVG, Molson (same)
   - decodED: No client logo row — instead, a single CTA button.

5. **Closing CTA** — *Get in touch* pill button, centred, large (~16px text, padding ~14px 32px), using the product's accent colour:
   - PABLO: outlined violet, fills violet on hover, white text on hover
   - NZ:AI: outlined teal, fills teal on hover
   - decodED: solid orange fill (decodED's section is light, so the solid-fill rule applies)

### Section background motion

Returns the ambient blob field for PABLO and NZ:AI (matching the hero treatment). decodED stays still.

---

## Section 6 — Footer

Uses the same footer specified in the landing-page brief (three big contact icons + minimal legal). No per-product variation needed in the footer. Just inherit from the existing site footer component.

---

## Section 7 — decodED variations

Because decodED's canvas is **light by default** (cream-warm) rather than dark, the template adapts in a few specific ways:

| Element | PABLO / NZ:AI behaviour | decodED behaviour |
|---|---|---|
| Hero background | Dark canvas with blob field | Cream-warm canvas, no blob field |
| Hero text colour | Cream | Deep green |
| Hero CTA button | Outlined accent | **Solid-filled orange** |
| Centred transition headline section | Dark → hard cut → cream | Cream-warm → light cream (subtle cut, not high contrast) |
| "Let's show you" CTA section | Cream background | Stays cream (no change) |
| Four steps section | Cream background | Stays cream-warm or transitions to cream |
| Closer / credibility | Dark band | **Stays light** — cream-warm |
| Footer | Default | Default |

The principle: **decodED's page reads as a calmer, lighter, education-flavoured variant** of the same template. The hard dark/light contrasts that drive PABLO and NZ:AI don't apply — decodED is uniformly warm-cream throughout, with subtle background shifts between sections rather than hard cuts.

This makes decodED feel distinct from the other two products without breaking the template. It also matches the education sector aesthetic (warmer, less "tech product," more "thoughtful institution").

---

## Section 8 — Mobile behaviour

Specific breakpoints and adaptations:

### Hero
- Below 1024px: columns stack. Text first, browser frame beneath.
- Below 768px: browser frame scales down to ~88% viewport width, retains 16:10 inner aspect.
- Below 480px: micro-label, product name, tagline, one-liner, CTA stack tightly with reduced spacing.

### Centred transition headline
- Below 768px: headline reduces to ~40px, micro-label stays ~11px.

### "Let's show you" inline CTA
- Below 768px: the headline wraps so the pill sits on its own line — "Let's show you" / [PILL] / "how we do it" — stacked. The pill stays the same size, centred between the two text lines.

### Four steps
- Below 1024px: text and illustration columns stack. Text on top, illustration beneath, max-width centred.
- Below 768px: step numbers shrink to ~12px, headlines reduce to ~26px.

### Closer
- Below 768px: client logo row wraps to two lines as needed.

### Browser frame animation
- On mobile, the cycle continues but the progress indicator moves slightly lower in the frame to remain visible. Tap (not hover) pauses; tap again to resume.

---

## Section 9 — Implementation patterns

### Template component structure

Recommended pattern: a single `<ProductPage>` component that accepts a product config object as props:

```js
{
  slug: 'pablo',
  microLabel: 'SOFTWARE',
  name: 'PABLO.',
  tagline: 'Half-hourly intelligence. Real impact.',
  oneLiner: '...',
  accentColour: '#7A74FF',
  accentColourLight: '#B79CFF',
  canvasColour: '#1F0F2E',
  isLight: false, // true for decodED
  heroScreens: [
    { src: '/images/products/pablo/screen-01-site-workspace.png', alt: '...' },
    // ...
  ],
  transition: {
    micro: 'WHY PABLO',
    headline: 'Allowing you to focus on what matters.'
  },
  steps: [
    {
      number: '01',
      icon: 'ti-map',
      headline: 'First, PABLO maps every load on your site.',
      highlightedVerb: 'maps',
      body: '...',
      illustrationConcept: 'site-boundary-with-meters'
    },
    // ...
  ],
  closer: {
    micro: "WHO'S USING PABLO",
    headline: 'Real estates. Real savings.',
    subheading: '...',
    clients: ['Hartpury', 'IVG', 'Molson', 'RWGC', 'Zeal']
  }
}
```

The component reads the config and renders all five sections. The three product pages (`/pablo`, `/nz-ai`, `/decoded`) each import the component and supply their config.

### Why this structure

- **Single source of truth for the template** — bugs get fixed in one place
- **Each product's config is editable independently** — copy refinements don't risk breaking the template
- **Adding a fourth product later is trivial** — write a new config, point a route at it
- **Per-product context detection** (for the adaptive nav, see nav brief) is handled by setting a body class based on `config.slug`

### Reduced motion

Respect `prefers-reduced-motion`:
- Hero rotation: shows the first screen only, no cycling
- Mask-reveals: text appears immediately, no animation
- Blob fields: pause animation
- Step arrival: items fade in immediately, no stagger

### Accessibility

- All product screens have meaningful `alt` text (e.g. *"PABLO site workspace showing Hartpury University with map, load profile, and financial overview"*)
- The browser frame is decorative — wrap in `role="presentation"` so screen readers focus on the screens themselves
- The progress indicator segments are buttons with `aria-label="View screen 2"` etc.
- The Request Demo pill button has proper focus styles (focus ring matching the accent colour at 40% opacity)
- All step illustrations have descriptive `alt` text or `aria-label` if SVG
- Heading hierarchy: hero name = h1, transition headline = h2, "Let's show you" = h2, each step headline = h3, closer headline = h2

---

## Section 10 — Files and assets

**Pending from Chris:**
- 9 product screenshots (3 per product), saved to `/public/images/products/{pablo|nzai|decoded}/screen-{01|02|03}-{description}.png`. Native resolution 1600×1000, 2× version available for retina.
- Final client logos for the closer (PABLO and NZ:AI). If not yet available, Claude Code mocks stylised wordmark blocks as placeholders.
- Final step illustrations (4 per product, 12 total). For first build, Claude Code creates placeholder line-art per the descriptions above. Real illustrations are pending from Leo Morgan / dawn.design.

**Already in design system / shipped:**
- NZA design tokens (cream, navy, coral, type stack)
- Per-product palettes from the navigation brief
- Tabler Icons (referenced for step icons)
- Existing nav system (this template inherits the adaptive nav)

---

## Out of scope (explicitly)

These are intentionally not part of this brief:

- **Real product UI work for decodED or NZ:AI** — the screenshots provided by Chris are taken from existing or in-development product builds. This brief does not build those products.
- **The contact / demo request flow** — Request Demo pill buttons link to a placeholder `/contact?product={slug}` route. The actual demo capture form / flow is a separate brief.
- **Case study / Our Work pages** — Client logos in the closer can link to placeholder client pages but those pages are separate.
- **CMS / dynamic content** — copy in this brief is hard-coded into the page configs. If a CMS-driven version is needed later, that's a refactor.
- **A/B testing infrastructure** — the brief specifies one version per product. Variants are out of scope.

---

## Acceptance criteria

A working implementation should pass all of these:

1. Three product pages exist at `/pablo`, `/nz-ai`, `/decoded`, each rendering the full five-section template
2. The hero shows the product name, tagline, one-liner, CTA, and a browser frame with three rotating screens
3. The browser frame cross-fades between three screens every 4.5 seconds, with a progress indicator at the bottom
4. Hovering the browser frame pauses the rotation; leaving resumes it
5. The progress indicator segments are clickable and jump to the corresponding screen
6. The centred transition headline appears with the hard colour cut beneath (or subtle for decodED)
7. The "Let's show you how we do it" headline has an inline Request Demo pill button that opens `/contact?product={slug}` on click
8. Four numbered steps render with the locked copy, verb highlighting, icons, and square frame illustrations
9. Each step arrives with the staggered animation (icon → headline → body → illustration) when scrolled into view
10. The closer section shows the section label, headline, subheading, client logo row (or pilot CTA for decodED), and a final Get in touch CTA
11. The adaptive nav (from the nav brief) correctly identifies the product context on each page and applies the appropriate accent colours and treatments
12. decodED renders with its light-canvas variations (cream-warm throughout, solid-fill CTAs, no blob fields)
13. PABLO and NZ:AI render with their dark-canvas treatments (blob fields, outlined CTAs in hero, hard cuts to cream sections)
14. Mobile breakpoints render correctly across all five sections
15. `prefers-reduced-motion` is respected throughout
16. All interactive elements have proper focus states, ARIA labels, and keyboard navigation
17. Lighthouse target: 90+ across performance, accessibility, best practices, SEO on all three pages

---

## Questions Claude Code should raise rather than guess

- Whether the existing site uses Next.js, Vite, or another framework — the component pattern should match
- The exact path convention for image assets (`/public/images/products/{slug}/` is the default, adjust if the codebase uses a different structure)
- Whether Tabler Icons is already installed as a dependency, or if step icons need a different icon source
- The exact contact route URL — `/contact?product={slug}` is the default placeholder, confirm before linking
- Whether client logos for PABLO and NZ:AI exist as SVG assets in the codebase, and what their paths are
- Whether Chris's NZA brand mark or wordmark should appear anywhere on the product pages (current brief says no — the page is the product's identity, not NZA's. But raise if uncertain.)

---

*End of brief.*
