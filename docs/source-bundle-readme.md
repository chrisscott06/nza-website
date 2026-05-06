# NZA Design System

A design system for **Net Zero Advisory (NZA)** — a UK sustainability and energy consultancy whose deliverables are interactive digital reports, slide decks, and energy/carbon analytics tools.

This system was built from:
- `chrisscott06/nza-molson-cir` — the Molson Group UK Carbon Inventory Report (React 19 + Vite + Tailwind 4 interactive report). Acts as the canonical NZA report template.
- `uploads/24024-NZA-XX-XX-RP-X-2003_P03 - EMS Strategy Report.pdf` — Hartpury Energy Management System Strategy Report (PDF, 25 pages).
- `uploads/24024-NZA-XX-XX-RP-X-6000_P02  - Climate Resilience & Adaptation Study.pdf` — Climate Resilience & Adaptation Study.

NZA's work spans interactive digital reports, blue-sky energy strategies, climate resilience studies, and a custom energy cost modelling tool called **PABLO**.

---

## Index

| File / Folder | Purpose |
|---|---|
| `README.md` | This document — context, content fundamentals, visual foundations, iconography. |
| `SKILL.md` | Cross-compatible skill manifest for Claude Code / Agent Skills. |
| `colors_and_type.css` | All CSS variables — color, type, spacing, radii, shadow, motion. |
| `fonts/` | Stolzl OTF files (six weights). |
| `assets/` | Logos, icon sprite, favicon. |
| `preview/` | One HTML card per design-system concept (rendered in Design System tab). |
| `ui_kits/report/` | UI kit recreating the NZA interactive digital report — landing, sub-nav, stat cards, callouts, deep-dive surfaces. |
| `ui_kits/pdf-report/` | UI kit recreating the static PDF report layout (cover, contents, body pages). |

---

## Brand context

**Net Zero Advisory (NZA)** is a small UK sustainability consultancy. Their primary deliverables are:

1. **Interactive digital reports** — single-page React apps hosted on Vercel that turn what would historically have been a PDF into a navigable, chart-driven web experience. The Molson UK Carbon Inventory and EOC Net Zero Report are the canonical examples.
2. **Static engineering reports** — formal landscape-format PDFs (e.g. EMS Strategy, Climate Resilience & Adaptation) with cover, document issue register, executive summary, narrative chapters and figures. Branded NZA, often co-branded with the client.
3. **PABLO** — a bespoke energy cost modelling tool (separate codebase) used by NZA consultants and shared with clients as an interactive companion to written reports.

Co-branding is the norm: most artefacts pair the NZA logo with the client's logo (e.g. `NZA × Molson`, `NZA × Hartpury`).

The voice is *senior-engineering-advisor*: technical, financially literate, opinionated about what's worth doing, sceptical of greenwash, and confident enough to tell a client where the real money or the real carbon actually is.

---

## CONTENT FUNDAMENTALS

How NZA writes.

### Voice
- **Third-person, never first-person "we".** Reports talk about the client and about the data. NZA itself is referred to by name when it appears at all (e.g. "NZA proposes…", "NZA has developed PABLO"). The Molson CLAUDE.md is explicit: *"No first-person 'we'."*
- **Plain professional register.** Closer to a methodology document than a marketing essay. Short sentences. Three paragraphs maximum per page intro.
- **Direct claims, no hedging language.** "Molson's footprint is concentrated in a single place, and concentrated by an order of magnitude" — not "Molson's footprint may be relatively concentrated." Strip qualitative judgment language ("honestly classified", "it's worth noting") from data sentences.
- **No filler clauses.** Banned phrases include *"This is the part…"*, *"What this means is…"*, *"It's worth noting that…"*.
- **No self-promotion inside the deliverable.** Sales framing ("NZA can support this review directly") does not belong in a reporting page; it belongs in a separate proposal.
- **Forward-looking sections are scoped.** "Looking ahead" / "Next steps" are about *what would sharpen the next data cycle*, not decarbonisation lectures.

### Tone examples (lifted from live source)

> **Hero, Molson UK Carbon Inventory:**  
> "Molson Group's UK carbon footprint for FY25 is 1,657,427 tonnes of CO₂ equivalent. Almost all of it — 98% — sits in one place: the plant equipment Molson sells and rents into the UK market…"

> **Closing line of executive summary, EMS Strategy:**  
> "This report sets out how Hartpury moves from analysis to action — the financial case, the procurement options, the questions to ask, and a six-month roadmap to reach a decision on its preferred delivery partner."

> **Risk framing, EMS Strategy:**  
> "A well-designed EMS can unlock major operational, financial, and reputational benefits; a poorly designed one can lead to underperformance, higher costs, and costly fixes."

### Casing & punctuation
- **Sentence case for headings.** "From baseline to action", "Beyond Stage 1", "BAU and Net Zero target setting" — never Title Case Like This.
- **Eyebrows are ALL CAPS, widely letter-spaced** (`tracking-widest`, `0.18em`), used to label sections above the title — e.g. `UK CARBON INVENTORY · FY25`.
- **Numbers always carry units.** `tCO₂e`, `kVA`, `kW`, `£`. Currency uses £ sterling. Subscript₂ is rendered properly, not `tCO2e`.
- **Em-dashes (—) for asides and reframes**, not hyphens. "Almost all of it — 98% — sits in one place."
- **No emoji.** Anywhere. Reports are formal engineering deliverables.
- **No exclamation marks** in body copy.

### Vocabulary
- **Climate-maturity tiers use named labels, never numbers.** The four labels are *Validated · Aligned · Indicative · Unaligned*. The phrase "Tier 1/2/3/4" is reserved for **GHG Protocol data quality grading** and only ever means that.
- **Data-quality terminology:** activity-based (best) → supplier-specific → industry-average → proxy → spend-based (worst).
- **Theme names** for thematic carbon reporting: Estate · Travel & Transport (sometimes "Movement") · Supply Chain & Investments · Products & Equipment.

---

## VISUAL FOUNDATIONS

### Palette mood
A **two-canvas system**: near-black `#0A0A0B` for hero / landing surfaces, and warm cream `#F5F1E8` for explainer / methodology surfaces. Mid-tones use deep navy `#0D1A2E` (Inventory section) and Molson slate `#1F2935` (Map / Breakdown / Next Steps).

The accent is **Molson Teal `#009FA0`** — a saturated cyan-green that reads as decisive and "energy/data" without being playful. NZA's own corporate teal `#3a7d7e` is darker and used in NZA-only contexts.

The **NZA brand mark itself** carries an orange-to-pink-to-purple **horizon gradient** (sun setting over a stylised mountain). This gradient is *expressive*, used as a logo only — never as a UI background, never under body text. It stands in deliberate contrast to the otherwise restrained palette.

Theme colors are saturated but never neon: red `#E05A4E`, amber `#F2A93B`, purple `#7C62BC`, teal `#009FA0`. They appear as 1-px chart strokes, 18%-opacity tinted backgrounds for active pills, and 2-px borders on theme-coded hero ribbons.

### Type
Three-family stack:
- **Stolzl** — geometric, slightly humanist sans. The brand's hero face. H1s use **Stolzl Book (400)**, H3/H4 use **Stolzl Medium (500)**, eyebrows + buttons use **Stolzl Medium 12 px with 0.18em letter-spacing uppercase**.
- **DM Serif Display** — used at H2 only, for editorial moments and hero subtitles ("UK Carbon Inventory" under "Molson Group"). Adds warmth and report-publication gravitas without going full broadsheet.
- **DM Sans** — body face. 16 px / 14 px / 12.5 px. Weight 400 throughout body, 500 for emphasis.
- **JetBrains Mono** — numerical displays in stat cards, data tables.

Body copy is set tight — `leading-relaxed` over `text-[0.8rem]` (12.8 px). Inline emphasis uses *colour change* (muted secondary → primary) rather than bold weight.

### Spacing
Spacing follows a 4-px base. Section padding `4rem` vertical. Cards use a 24 px gutter, 12–16 px internal padding. Page max-width `max-w-7xl` (1280 px). The viewport-centred `app-7xl` utility exists specifically because nested scrollbars otherwise nudge inner columns 7.5 px out of alignment with the main nav.

### Backgrounds
- **No images, no full-bleed photography, no hand-drawn illustrations** as background. The brand's backgrounds are flat colour fields.
- **No gradients** in the UI chrome (the NZA logo gradient is the one exception).
- **No repeating patterns or textures.**
- Section transitions are *colour-block*: a deep-navy band for Inventory, a slate-grey band for Next Steps, a cream band for Explainers.

### Animation
- **Subtle, fast, opacity-driven.** Page transitions are `framer-motion` opacity fades (`duration: 0.35–0.55s`, ease-in-out). Items slide in from a 12 px offset on first paint, staggered ~0.07s apart.
- **No bounces. No spring overshoot. No stagger longer than 0.3s total.**
- One ambient animation: the **map-pulse-ring** — a 1.6 s breathing outline on the selected site marker on the UK map (`r: 16 → 44`, opacity `0.8 → 0`). Otherwise the page stays still.

### Hover & press states
- **Buttons** — solid teal background with `--bg-dark` text. Hover state shifts to a slightly lifted shadow; no colour change. Focus uses a 2 px `--molson-teal` ring.
- **Pill / nav links** — colour-only transitions: muted `#B8C4D8` → accent teal `#009FA0`. Active state additionally tints the background `rgba(0, 159, 160, 0.18)`.
- **Toggles & checkboxes** — empty state shows the brand-accent *outline* (so it reads as a deliberate CTA, not chrome); ticked state fills with brand accent and a `#0A0A0B` check mark.
- **Press / active** — opacity drop or background darken; **never a transform / scale shrink.** No squish.
- **Logo nav** — `.logo-muted` class: `filter: grayscale(1) brightness(0.4); opacity: 0.8;` → on hover, `filter: none; opacity: 1.` Logos in the nav are deliberately quiet.

### Borders, shadows, transparency
- **Hairline borders** — 0.5 px or 1 px, mostly `rgba(255,255,255,0.10)` on dark and `rgba(0,0,0,0.10)` on light. The system avoids 2 px+ borders.
- **Cards on dark** carry no shadow — only a 1 px white-10% border and a `bg-white/5` tint. The card depth comes from the tint, not from a drop shadow.
- **Cards on light** use a soft `0 1px 2px rgba(10,14,23,0.08)` plus a 1 px hairline.
- **Modals** use `0 24px 60px rgba(10,14,23,0.20)` and a 1 px white-15% border on dark.
- **Tinted callouts** (the `Callout` component) layer a `~10%` opacity of the tone color over the base, with a `~35%` opacity border in the same tone.
- **Sleek scrollbars** — 6 px wide, `rgba(255,255,255,0.18)` thumb on dark / `rgba(0,0,0,0.18)` on light, fully transparent track. Inherited everywhere via the `.sleek-scroll` utility.

### Corner radii
- `4 px` — pills, small inputs, segmented toggles.
- `6 px` — callouts, methodology drawer.
- `8 px` — cards.
- `12 px` — modals, larger feature cards.
- `999 px` — fully-rounded pills (chart-grouping switch, theme tabs, primary CTA buttons).

### Layout rules
- **Two-column hero** is the canonical landing pattern: narrative left (`max-w-[520px]`), interactive chart right (fills).
- **Sub-tab strips** sit immediately under the main nav, all use the same chrome: `border-b`, `padding 1.5 px y / 6 px x`, pills `text-[0.72rem]` with `font-heading 500` when active and `400` when inactive.
- **Fixed top nav**, transparent on the landing page (white logos at 50% opacity), white-90% with a hairline bottom border on every other page.
- **No floating elements** beyond the top nav. No FABs, no toasters in the main UI.

---

## ICONOGRAPHY

NZA's icon language is **Lucide React** — uniform 1.35–2 px stroke, line icons (no fill), used at 11–16 px in pills and 14–18 px in cards. The Molson report imports *every* icon directly from `lucide-react` (`Info`, `AlertTriangle`, `Lightbulb`, `CheckCircle`, `ArrowRight`, `Layers`, `BarChart3`, `Check`, `HelpCircle`, `ChevronDown`, …).

In this design system Lucide is loaded **from CDN** (no local sprite). Use it via:

```html
<script src="https://unpkg.com/lucide@latest"></script>
<i data-lucide="arrow-right"></i>
<script>lucide.createIcons();</script>
```

Or by name in JSX with `lucide-react`.

**A small SVG sprite ships with the report** at `assets/icons-sprite.svg` containing five social/external glyphs (Bluesky, Discord, Documentation, GitHub, Social, X) — copied from the report's `public/icons.svg`. These are *only* used for the report-footer-style social row; they are not the main icon language.

**Brand & client logos** ship as flat SVGs in `assets/`:
- `nza-logo.svg` — NZA wordmark + sun-over-mountain gradient mark.
- `molson-logo.svg` — Molson wordmark.
- `molson-group.svg` — Molson "Molson Group" lockup.
- `favicon.svg` — site favicon.

**Custom-drawn iconography** is rare and reserved for content-specific moments — e.g. the inventory map's per-site markers, the trajectory chart's BAU/SBTi line endcaps. A single hand-drawn `Excavator.jsx` exists in the report codebase for the Products & Equipment theme; otherwise, custom shapes are inline SVG generated by the chart libraries (Recharts, D3).

**No emoji. No unicode-symbol icons** (✓, ✕, ◐ are used as text fallbacks for *data-quality status*, alongside coloured dots, but never as decorative icons).

**No icon font.** The Stolzl font files only carry letterforms.
