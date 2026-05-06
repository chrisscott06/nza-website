# NZA Website — Design System & Brief

**Status:** Active build. Home, Capabilities, and Approach screens are content-locked. Products and Clients pages are pending. The Capabilities diagram is being drawn bespoke by Chris and is not yet in the asset set.

**Reading order:** Voice and visual rules first (they apply to everything). Then per-screen specifications. Then the open work at the end.

---

## 1. Project context

NZA Consultancy Ltd is a UK-based net zero advisory firm operating in the built environment sector. The practice combines engineering experience with bespoke digital tools and runs long-term partnerships with clients rather than discrete project engagements.

The website is for a procurement director, sustainability lead, or estates director at:

- A university or further-education institution with a complex mixed-age estate
- A real-estate developer or owner with a portfolio across asset classes
- A construction or contracting business with a large scope-3 footprint
- An MEP consultancy or design firm wanting net zero capability layered on theirs

The website needs to do three jobs:
1. Make NZA distinctive in a market full of generic sustainability consultancies
2. Make the work credible to someone who knows their domain (engineers, finance directors, board sustainability committees)
3. Build the foundation for the products NZA is bringing to market — PABLO, NZ:AI, decodED — without selling them prematurely

The website is **not** a brochure for everything NZA can do. It's an argument for *why NZA does it the way it does it*. Specificity wins over breadth.

---

## 2. Voice rules

These are non-negotiable. Every word on the website should pass these tests.

### Always

- **Specific over general.** "We build a 30-year capital plan with retrofit phased to lease expiries" beats "we deliver bespoke insights." Generic claims are what we're trying to escape.
- **Engineering register.** NZA's heritage is engineering. The voice should sound like an engineer who can write — confident, technically literate, allergic to fluff.
- **Long-term partnership framing.** NZA works *alongside* clients in *long-term partnerships*. The work compounds. Reports become tools; tools become platforms; platforms become co-built. This is structural, not a tagline.
- **Italic-on-key-word as the typographic signature.** A single emphasised word in DM Serif Display italic, rendered in coral, set inside a Stolzl Light headline. Use it once per major heading. The italicised word is *the word that does the work* — the contrarian word, the word being redefined, the word the headline pivots on. Examples: *decode* in the hero, *one* in "Six capabilities, one approach", *platforms* in "Co-built platforms".

### Never

- **Don't use *decarbonising* as a verb.** "Decarbonising the building" is banned. Use *the work*, *the path*, *the strategy*, *moving the building*, *changing it*. As a noun ("decarbonisation strategy") it's fine. The verb form is the one to avoid.
- **Don't use *not-X* constructions to make a point.** "We work with engineers, not in their place" is OK because it's a partnership claim. But "we build platforms, not just reports" or "tools that get used, not filed away" is the pattern to avoid — say what NZA does, not what it isn't. The reader gets it without spelling out the alternative.
- **Don't lead with sustainability buzzwords.** *Decarbonisation journey, sustainability transformation, ESG-aligned, net zero pathway* etc. are fine in context but should never be the headline. NZA's positioning earns the right to use technical language directly.
- **Don't claim things every consultancy claims.** "Bespoke insights", "tailored solutions", "industry-leading expertise" — all banned. If a competitor's website says it, NZA's website should not.

### Signature phrases (use sparingly, never twice on the same screen)

These have emerged as patterns. Each can carry a card or a section but loses power if repeated:

- *Survives contact with [a finance director / reality / a board meeting]* — the pragmatism move. Used once on Whole-estate strategy ("plan that survives contact with a finance director"). Could appear once more elsewhere if the context is right; not more than twice across the whole site.
- *Engineered with — not behind — the MEP team* / *works alongside the engineers, not in their place* — the partnership-with-engineers framing. Variations of this are used in capabilities 01 and 02.
- *Clients interrogate the model, not the report* — the active-asset framing. Used in Smart energy strategy. Echoes elsewhere as "tools that get used" or "a platform, not a deliverable".
- *Innovative-where-it-pays alongside off-the-shelf-where-it-matters* — the Blue Sky balance. Used in Behind-the-meter strategy.
- *Real X, not spreadsheet-stranded analysis* — the rigour-vs-desk-job move. Used in Climate resilience.
- *Not a deliverable; an asset* — the work-that-compounds claim. Used in Co-built platforms.

### Sentence shapes that work

- **Two-sentence headlines on screens after the hero.** First sentence sets up the contrarian or unfamiliar claim, second sentence pays it off. Example: *"Net zero in the built environment isn't one discipline. It's a connected system — and it has to be approached as one."* Hero gets a single-sentence headline; deeper screens earn two.
- **Em-dash for the strategic clause.** *"NZA works alongside the engineers — not in their place — building the analytical layer that turns scattered information into clear capital decisions."* The em-dash punches the differentiator.
- **Lists of three for tonal weight.** *"data, digital tools, and strategy"*; *"fabric, generation, storage, electrification"*; *"chosen, sized and sequenced as one integrated system"*. Triplets work; pairs feel thin; lists of four or more should be em-dashed asides.

---

## 3. Type system

Three faces. Each has a distinct job. None are interchangeable.

### Stolzl
- **Use:** display, headlines, eyebrows, small caps, navigation, button labels, eyebrow tags
- **Weights in active use:** Light (300) for major headlines, Book (400) for body-context display, Medium (500) for small caps and eyebrow labels
- **Letterspacing:** -0.02em on display sizes 36px+; -0.01em on smaller display; +0.18 to +0.22em (uppercase tracking) on small caps and eyebrows
- **Don't use Stolzl for body copy.** It's a display face. At 13–16px running text it tightens and tires.

### Söhne (or near-substitute Inter Tight as fallback)
- **Use:** body copy, descriptions, captions, stats, tabular data, anything 13–17px running text
- **Weights:** Light (300) for descriptions and pitches, Regular (400) for short body, Medium (500) for emphasis within body
- **Chris will pull Söhne via Adobe Fonts subscription. Until then, Inter Tight from Google Fonts is the working substitute.** Both are humanist sans serifs with similar proportions; the swap is graceful.

### DM Serif Display
- **Use:** *exclusively* for italic emphasis words inside Stolzl headlines. Never for body. Never upright. Only italic, only inside a headline, only one or two words at a time.
- **Always rendered in coral** (`#F75A55`).
- **Cap-height bump:** italic in DM Serif at the same point size as Stolzl Light reads ~10–13% smaller because of the contrast in cap height. **Bump the italic glyphs by 1.10–1.13em** of the surrounding font-size. Without this, the italic word looks weak against the Stolzl Light. With it, the italic word *lands* as the optical anchor of the headline.

### Specimen — locked headline construction

```html
<h1 class="h1">
  We <em>decode</em> decarbonisation for the built environment.
</h1>
```

```css
.h1 {
  font-family: "Stolzl", sans-serif;
  font-weight: 300;
  font-size: clamp(36px, 3.6vw, 56px);
  line-height: 1.05;
  letter-spacing: -0.02em;
}
.h1 em {
  font-family: "DM Serif Display", serif;
  font-style: italic;
  font-weight: 400;
  color: var(--coral);
  font-size: 1.10em;        /* the cap-height bump */
  letter-spacing: -0.01em;
}
```

This pattern is the typographic fingerprint of the site. Use it at every level of headline hierarchy where italic emphasis is wanted.

---

## 4. Colour system

### Brand anchors (locked)

```
--paper:      #FAF7F0     /* primary cream paper background */
--cream:      #F5F1E8     /* secondary cream for cards on paper */
--ink:        #1A1D20     /* near-black for body copy on cream */
--ink-2:      #52565C     /* mid grey for descriptions */
--ink-3:      #8D9099     /* light grey for meta/captions */
--ink-navy:   #0E1120     /* deep navy for inverted sections, hero */
--ink-navy-2: #161a2e     /* slightly lifted navy for cards on navy */
--coral:      #F75A55     /* THE coral. Not a gradient, not a range. */
--rule:       rgba(14,17,32,0.10)  /* hairline rule on cream */
--rule-soft:  rgba(14,17,32,0.06)  /* softer hairline */
--rule-dark:  rgba(245,241,232,0.14)  /* hairline rule on navy */
```

### Coral usage rules

The coral is reserved for **moments**, not surfaces. It is never:
- A button's primary fill across a whole page (use it for one CTA per screen, max)
- A background colour for a card or section (the only exception: faint radial glow on the disruptive Co-built platforms card, ~18% opacity)
- A heading colour for general H2/H3 (only the italicised emphasis words inside headlines)

It is:
- Italic emphasis words in headlines
- Eyebrow rule (the 24px line before "03 · APPROACH" eyebrows)
- The coral rule under capability titles (32px line)
- Small accent dots, hint arrows, the "+" expand cue
- The active state underline on clicked capability cards
- The faint radial glow on the navy sixth card

If a designer is reaching for coral as a fill or a chrome colour, the answer is almost always *use one of the three lens accent colours instead*.

### The three lens accent colours

These are taxonomic, used to distinguish Data / Digital tools / Strategy across the site. Restrained, not loud.

```
--lens-data:     #2F4C6B   /* deep navy-blue */
--lens-tools:    #7A5DAE   /* purple — also PABLO accent */
--lens-strategy: #3a7d7e   /* NZA teal — strategic anchor */
```

Used as small dots (6–8px), tag colour, and category marker. Never as a card background or a major chrome colour. They live alongside the coral, not in competition with it.

### On dark surfaces (navy backgrounds)

Lens dot colours brighten for legibility:
```
data    →  #8AA0C0   (lifted navy-blue)
tools   →  #B79DD9   (lifted purple)
strategy → #6EAEA9   (lifted teal)
```

### Cream / navy alternation across screens

The site uses a paper/navy alternation as the visual rhythm. Locked default:

- Home: **navy** (hero on dark canvas with the GHG illustration in cream/coral line work)
- Capabilities (the connected-system diagram): **navy** (continues the dark canvas; the diagram lives in cream and coral)
- Approach: **paper** (cream/paper canvas, the six-capability grid in cards)
- Products: **navy** (returns to dark — the products are the heroes here)
- Clients: **paper** (calm, evidence-based, work-led — the dark drama isn't needed)

This rhythm is not strict. If a screen needs to break it for a real reason, do — but the default is alternation.

---

## 5. Layout principles

- **One screen per section.** Every major section of the site should comfortably fit one viewport (or close to it). Long scrolling within a section is a sign that the section is doing too much. The Approach screen broke this rule in early drafts; the inset-panel-between-rows interaction is the fix that brings it back to one screen.
- **Generous whitespace.** Padding errs on the side of breathing room. The site should feel like an architectural document, not a marketing page.
- **Hairline rules over container backgrounds.** Sections separate by 1px coral or near-black hairlines, not by alternating background colours. Backgrounds shift at section boundaries (paper to navy), but within a section, layout is held by rules and whitespace.
- **Coral rules as section markers.** A 24px coral rule precedes section eyebrows. A 32px coral rule sits between a card title and its body. These are signature accents — use them consistently.
- **Two-column for content; three-column for taxonomies.** Hero text/visual is two-column. Capability cards are three-column (3×2 grid). Lens content is three-column (data/tools/strategy). The pattern is intuitive: prose pairs, taxonomies triple.

---

## 6. Site structure

Five screens. Each does a distinct job. Sequence matters — each screen pays off the one before it.

### Home
- **Job:** identify what NZA does and the territory it works across
- **Headline:** *"We decode decarbonisation for the built environment."* (single sentence, italic on *decode*)
- **Pitch:** "A specialist consultancy for the people who design, build and operate within the built environment sector. NZA works alongside its clients in long-term partnerships, combining engineering experience with bespoke digital tools built around each organisation to take on the parts of decarbonisation that don't have a template."
- **Visual:** GHG Protocol scope landscape illustration, recoloured for navy canvas (cream line work, coral on active scope, dark muted lavender on BVCM), with layered reveal animation
- **Background:** navy

### Capabilities
- **Job:** make the case that net zero in the built environment is a connected system
- **Headline:** *"Net zero in the built environment isn't one discipline."* (italic on *discipline*)
- **Body:** "It's a connected system. Buildings sit inside energy systems, supply chains, climate exposure, and the people who use them — and you only get the answer right when you hold all of them together. NZA works the whole system, through data, bespoke digital tools, and strategy."
- **Visual:** circular connected-system diagram with whole-building approach at the centre, two arcs of three perimeter elements (Energy systems above, Wider context below), and an outer ring of *DATA · DIGITAL TOOLS · STRATEGY* circular text. **Currently being drawn bespoke by Chris in Illustrator.** A wireframe SVG version exists in the screen01-mockup but should be treated as scaffolding, not the final illustration.
- **Background:** navy

#### Capabilities diagram structure (for when Chris hands over the SVG)

- **Centre:** WHOLE-BUILDING APPROACH (sub-label: *fabric · MEP · embodied · operation*). Axonometric building drawn in cream line work on navy, with multi-disciplinary content visible (windows for MEP, faint construction crane in background, hint of operation). One faint cream-dashed circle around the centre.
- **Top arc — Energy systems:** GENERATION (*solar · wind · AD*), GRID (*DNO · DUoS · markets*), STORAGE (*BESS · EV · flexibility*). Connected to centre with **solid coral lines** (direct, physical, measurable flows).
- **Bottom arc — Wider context:** SUPPLY CHAIN (*scope 3 · procurement · materials*), OPERATIONS (*people · use · behaviour*), CLIMATE (*physical risk · transition risk*). Connected to centre with **dashed cream lines** (influence, indirect, harder-to-measure flows).
- **Outer ring:** circular text reading **DATA · DIGITAL TOOLS · STRATEGY**. Suggests the *method* layer that wraps the whole system.
- **Faint outermost dashed ring:** atmospheric, signals "and there's more beyond this" without specifying what.

### Approach
- **Job:** show how NZA actually works the system — the data/digital tools/strategy method threaded through six capabilities
- **Headline:** *"Six capabilities, one approach."* (italic on *one*)
- **Pitch:** "Every NZA engagement runs through three lenses — **data, digital tools, and strategy**. Together they're how the capabilities below get delivered: rigorous analysis, made usable, turned into decisions."
- **Three-lens band:** Data, Digital tools, Strategy — each with its accent colour dot, definition paragraph, and one-line role tag (*Rigorous analysis* / *Made usable* / *Turned into decisions*)
- **Six-capability grid:** 3×2, click-to-reveal interaction (see §7 for the interaction pattern)
- **Background:** paper

#### Locked content for all six capabilities

The full content for each card — title, description, and three-lens detail — is in §11.

### Products *(pending)*
- **Job:** make NZ:AI, PABLO, and decodED feel like an extension of the practice, not a separate product line
- **Visual hook:** the disruptive Co-built platforms card on the Approach screen leads here — its "See the platforms →" tag is the explicit bridge
- **Background:** navy
- **Status:** not yet drafted

### Clients *(pending)*
- **Job:** evidence. Selected work, logos, case-study entry points
- **Background:** paper
- **Status:** not yet drafted

---

## 7. Interaction patterns

### Hero — held reveal

The GHG illustration sequences in over ~2.2 seconds when the hero scrolls into view. Six layers reveal in order: front, mid, back, BVCM, lines and clouds, text. Each layer fades in (~800ms easing) with ~400ms delay between layers. Text content (eyebrow, headline, pitch) reveals in parallel with delays of 100/250/400ms. After the full reveal, the illustration holds still — no autoplay loop, no continuous motion.

This is the signature interaction pattern of the site. Use it once on the hero. Don't extend it to other screens.

### Capabilities diagram — sequenced reveal

When the connected-system diagram scrolls into view, reveal sequence:
1. Centre building first (anchor)
2. Then the six perimeter nodes in clockwise sequence (~150ms apart)
3. Then the connecting lines (solid coral first, then dashed cream)
4. Outer ring text last
5. Total: ~2 seconds, then holds

### Approach — click-to-reveal grid

The interaction pattern is: 3×2 grid of compact cards always visible. Click any card to reveal that capability's three-lens detail in an inset panel that opens *between* the rows. Click again or click another card to swap; the panel content changes in place without re-collapsing.

**Implementation specifics:**
- Cards are compact: number, title, short description (3–4 lines), coral rule, hint line ("Data · Tools · Strategy" with a "+" cue)
- Active card gets a subtle coral-soft background wash and a 2px coral underline
- Inset panel opens between row 1 and row 2 of the grid (always between rows, regardless of which card was clicked)
- Panel transition: max-height 0 → 500px, 360ms cubic-bezier(0.4, 0, 0.2, 1)
- Panel contents: header with capability title and close button, then three lens blocks (Data / Tools / Strategy) in three columns
- The "+" hint flips to "−" when active
- Mobile: grid collapses to single column; inset panel opens directly below the clicked card
- Reference implementation: `approach-interactive.html` mockup

### Co-built platforms card — visual disruption

The sixth capability card (bottom-right of the grid) is visually distinct:
- Navy background instead of paper
- Faint coral radial glow in the bottom-right corner (~18% opacity)
- Italic on the word *platforms* in DM Serif coral
- Coral "See the platforms →" tag at the bottom (bridges to Products)

This card is the *only* place on the Approach screen where the navy/coral palette appears. It earns its disruption because it bridges to the Products page.

---

## 8. Mockup files — what's authoritative, what's reference

### Authoritative reference implementations

These mockups represent the locked design decisions and should be treated as the visual benchmark for those screens:

- **`screen01-mockup/mockup.html`** — Hero (Home) + Capabilities screen. The hero is locked; the Capabilities diagram in this mockup is **wireframe scaffolding only** and will be replaced by Chris's bespoke SVG when ready.
- **`approach-interactive/approach-interactive.html`** — Approach screen with the click-to-reveal grid interaction. Authoritative for content, layout, and interaction pattern.

### Reference only — design history, not what to build

- `hero-mockup/hero-mockup.html` — early hero version with placeholder text. Superseded by screen01-mockup.
- `approach-mockup/approach-mockup.html` — early Approach version, full-page layout. Superseded by approach-interactive.
- `approach-v2/approach-mockup-v2.html` — intermediate version with full-page six-card layout. Useful for showing all six cards in one view, but the click-to-reveal version is what gets built.

### Source assets

- **Stolzl font files** (six weights as OTF) — embedded in mockups, ready for use
- **GHG Protocol scope landscape SVG, recoloured for NZA palette** — `screen01-mockup/ghg-nza.svg` (or extracted from the mockup HTML)
- **Brand colour and type tokens** — see §3 and §4

---

## 9. Open work — where Chris's bespoke work will land, and where Claude Design's judgement is wanted

### Coming from Chris
- **Capabilities diagram SVG.** The connected-system illustration is being drawn bespoke. Structure is specified in §6. Until it lands, the wireframe in screen01-mockup is the placeholder.

### Where Claude Design should use judgement
- **Mobile responsive specifications.** Mockups are desktop-first. Mobile breakpoints, grid collapse rules, font scaling, and spacing reductions need design judgement.
- **Empty / loading / error states.** Not specified. Use design judgement consistent with the voice and visual rules.
- **Form treatments (contact, enquiry).** Not yet drafted. Should follow the cream-canvas-with-hairline-rules approach used elsewhere.
- **Footer.** Not specified. Should be calm, hairline-ruled, paper-on-navy or navy-on-paper depending on the page below it.
- **Accessibility.** Coral on cream meets WCAG AA at body sizes. Coral on navy is the highest-contrast pair. Lens accent colours need contrast verification at small sizes. Where in doubt, fall back to body copy in `--ink` on `--paper` rather than coloured tags.

### Where Claude Design should NOT improvise
- **Voice and headline construction.** If new copy is needed, it must follow §2. Don't write *"decarbonising"* as a verb. Don't write *not-X* constructions. Italic emphasis goes in DM Serif coral, never anywhere else.
- **Coral usage.** Don't use coral as a fill, a CTA primary, or a background. See §4.
- **Type pairing.** Stolzl + Söhne + DM Serif Display is the only type pairing on the site. No other faces. No additional weights without a real reason.
- **Capability content.** The locked content in §11 is locked. If a card needs cutting for length, cut from the description, not from the lens content. The lens content is what makes the cards distinctive.

### Pending pages
- **Products page.** Not yet drafted. Will cover NZ:AI, PABLO, decodED. The disruptive sixth card on Approach is the bridge.
- **Clients page.** Not yet drafted. Should be calm, evidence-led, work-as-the-hero.

---

## 10. Brand context (background — read once)

### NZA's positioning in one paragraph
NZA sits in the gap between conventional MEP/building-physics consultancies (who speak the building) and energy/market consultancies (who speak the grid and tariffs). Most consultancies in the built environment hold one of those languages well; NZA holds all three at once — building physics, grid mechanics, energy markets — and combines them with bespoke digital tools (PABLO, NZ:AI, decodED) and a strategic, partnership-based approach. The result is a practice that finds capacity savings brokers miss, designs in headroom MEP engineers wouldn't, and turns DNO engagement from a procurement exercise into a strategic one.

### What makes the work compound
The core insight that runs through the site: NZA's deliverables are *assets, not deliverables*. Every engagement leaves the client with a tool they can keep using — a digital twin, a living dashboard, a co-built platform. Each tool integrates with NZA's broader toolkit (PABLO etc.), so each engagement makes both the client and the broader platform stronger. This is why the practice positions itself as long-term partnerships and why "bespoke" doesn't mean "one-off".

### What NZA is not
- Not a generalist sustainability consultancy
- Not an energy broker or procurement advisor (those are the people NZA improves on)
- Not a software product company (the products serve the practice, not the other way around)
- Not an audit or assurance shop (the focus is action, not audit; though the work is audit-ready)
- Not a delivery contractor (NZA designs the strategy and the tools, others build the assets)

---

## 11. Locked content — full text for every section

### Home — hero

**Eyebrow:** NET ZERO ADVISORY

**Headline:** We *decode* decarbonisation for the built environment.

**Pitch:** A specialist consultancy for the people who design, build and operate within the built environment sector. NZA works alongside its clients in long-term partnerships, combining engineering experience with bespoke digital tools built around each organisation to take on the parts of decarbonisation that don't have a template.

### Capabilities — connected system

**Eyebrow:** 02 · CAPABILITIES

**Headline:** Net zero in the built environment isn't one *discipline.*

**Body:** It's a connected system. Buildings sit inside energy systems, supply chains, climate exposure, and the people who use them — and you only get the answer right when you hold all of them together. NZA works the whole system, through data, bespoke digital tools, and strategy.

### Approach — header and lens band

**Eyebrow:** 03 · APPROACH

**Headline:** Six capabilities, *one* approach.

**Pitch:** Every NZA engagement runs through three lenses — **data, digital tools, and strategy**. Together they're how the capabilities below get delivered: rigorous analysis, made usable, turned into decisions.

**Lens — Data**
*Tag:* DATA
*Description:* The rigorous evidence base. Activity-based GHG inventories, half-hourly profiling, scope 3 mapping, climate risk overlays. The work that grounds every claim NZA makes.
*Role:* Rigorous analysis

**Lens — Digital tools**
*Tag:* DIGITAL TOOLS
*Description:* Bespoke instruments built for each engagement. PABLO for energy modelling, NZ:AI for living digital reports, decodED for educational outreach. Tools that turn the data into something a client can interrogate.
*Role:* Made usable

**Lens — Strategy**
*Tag:* STRATEGY
*Description:* The path from analysis to action. Costed interventions, phasing, business case, financial framing, governance. The work that turns rigorous analysis into decisions a client can take.
*Role:* Turned into decisions

### Approach — six capabilities

#### 01. Whole-estate strategy

**Description:** Strategic decarbonisation planning across mixed and complex estates. NZA works alongside the engineers, building the analytical layer that turns scattered information into clear decisions about where capital pays back.

**Data:** Building the evidence base when there isn't one. First-principles energy modelling from building physics, operational schedules and partial records. Filling data gaps, surfacing what's actually happening across an estate, and visualising it as one consistent source of truth.

**Tools:** Bespoke digital twins of the estate. Centralised energy and carbon data, scenario modelling for retrofits, renewables and storage. The estate stops being a folder of spreadsheets and becomes a working model the client can interrogate.

**Strategy:** Outline business cases for the moves that actually pay back. Whole-estate sequencing — fabric, generation, storage, electrification — phased to capital cycles and lease events. The kind of plan that survives contact with a finance director.

#### 02. Smart energy strategy

**Description:** Most consultancies speak one of three languages — building physics, grid mechanics, or the energy market. NZA holds all three. That's where real capacity savings and smart infrastructure decisions live.

**Data:** Load shape analysis, bill decomposition, supply capacity benchmarking. The level of profiling that surfaces oversizing — and shows what's actually driving the bills.

**Tools:** PABLO. Portfolio load shapes against agreed supply capacity, scenario modelling for capacity reform and demand-side response, digital twins of the energy system. Clients interrogate the model, not the report.

**Strategy:** Capacity reduction plans with savings banked, outline business cases for demand-side response and resilience, and DNO engagement engineered with — not behind — the MEP team.

#### 03. Behind-the-meter strategy

**Description:** The technology and demand side of the energy transition. Generation, storage, electrified transport and electrified heat — chosen, sized and sequenced as one integrated system. NZA understands how each technology actually behaves: how batteries degrade, how heat pumps perform, how solar interacts with on-site demand. That's what makes the strategy survive contact with reality.

**Data:** Site demand profiling, generation potential modelling, technology performance benchmarks. Real-world degradation curves, dispatch behaviours, and integration constraints rather than manufacturer assumptions.

**Tools:** PABLO. Optimal mix modelling for behind-the-meter assets, dispatch and arbitrage scenarios, integration with the demand profile. Procurement and tender comparison built on the same model — apples-to-apples on competing battery quotes, with revenue stack and degradation factored in.

**Strategy:** Outline business cases for the assets that earn their place. Phased deployment plans aligned to capacity, demand, and capital cycles. Innovative-where-it-pays alongside off-the-shelf-where-it-matters — the Blue Sky thinking when it's worth it, the conventional answer when it's the right one.

#### 04. Carbon accounting & pathways

**Description:** Inventory and pathway done as one piece of work. Where the footprint sits today, what business-as-usual looks like tomorrow, and the trajectory required to align with SBTi or wider climate targets. NZA's focus is action, not audit — helping clients move from understanding to decision, with the evidence base to defend it.

**Data:** Activity-based Scope 1, 2 and 3 inventories. Supply-chain and procurement data work for scope-3-heavy clients. Data-quality grading and a transparent path from sector averages to primary data.

**Tools:** Living inventory dashboards built on NZ:AI — year-on-year tracking, trajectory modelling, scope 3 hot-spot mapping. The reporting becomes a tool the client uses, not a document filed annually.

**Strategy:** SBTi-aligned trajectories, costed reduction priorities, target-setting that survives a board meeting. Disclosure-ready outputs for CDP and similar — with the strategy to do something about them.

#### 05. Climate resilience

**Description:** Real physical risk, not spreadsheet-stranded analysis. Climate risk assessments grounded in the institutional knowledge of estates teams who actually know the buildings — combined with rigorous climate data, scenario testing and TCFD-aligned reporting. The output is a living digital risk register the organisation tracks and acts on, not an exercise filed once a year.

**Data:** Climate scenario data, asset-level exposure mapping, historical site events, and the operational knowledge of the people who run the estates. The combination is what makes the analysis real.

**Tools:** Digital risk registers — tracked, traced, scenario-tested. Portfolio-wide vulnerability dashboards, transition risk modelling, board-level reporting that doesn't require a translator.

**Strategy:** Adaptation planning, prioritisation of physical interventions, disclosure strategy aligned to TCFD and adjacent frameworks. The aim: action on the risks that actually matter, evidence on the ones that don't.

#### 06. Co-built *platforms* (visually distinct — see §7)

**Description:** The capability behind every other capability. NZA builds bespoke digital platforms with clients — tools designed for the specific job, leveraging the client's domain knowledge and NZA's own technology. A real-estate developer evaluating sites for EV charging and data centres. An MEP consultant building a custom load modeller. A scope-3-heavy manufacturer mapping supplier emissions. Each platform is purpose-built, plugs into NZA's wider toolkit, and gets stronger every time the toolkit does.

**Data:** Whatever the platform needs. Activity data, climate scenarios, market signals, building specifications, supplier records. NZA brings the rigorous data work; the client brings the institutional knowledge that no consultant can replicate from outside.

**Tools:** PABLO, NZ:AI, and decodED as the foundation. AI as the accelerant. Platforms get built fast because the building blocks already exist — and each build extends the foundation for the next.

**Strategy:** A platform that survives the engagement. Each tool is built for a real decision, integrated with the client's existing systems, and designed to be picked up and used by the team that needs it. Not a deliverable; an asset.

**Bridge tag:** "See the platforms →" (links to Products page)

---

## 12. Quick reference — the rules that catch most mistakes

If a designer is uncertain, this is the short list to check first:

1. Is *decarbonising* used as a verb anywhere? → Replace it.
2. Is there a *not-X* construction? → Rewrite to say what NZA does, drop the contrast.
3. Is coral being used as a fill or a button background? → Use coral only as a moment-accent.
4. Is italic emphasis in any face other than DM Serif coral? → Wrong.
5. Is body copy set in Stolzl? → Wrong; body is Söhne.
6. Is the screen length more than one viewport? → Compress, or use the click-to-reveal pattern.
7. Are there more than two italic emphasis words on the same screen? → One per major heading is the limit.
8. Is the headline a generic claim every consultancy makes? → Rewrite. Specificity wins.

---

**End of design system.**
