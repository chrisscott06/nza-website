# NZA Design Handoff — current state

> **Companion to `nza-brief.md`.**
> The brief tells the researcher what NZA is and what we want back. This document tells them **what's actually built, what's locked, and where we're genuinely stuck.**
> **Last updated:** April 2026 (v2 — aligned to `uploads/nza-design-system.md`).

---

## 1. The website prototype as it currently stands

**File:** [`nza-website.html`](nza-website.html)

**Important:** the prototype on disk is **v1**, against the *previous* set of design assumptions (NZA pink, Playfair, ten-screen scroll, assembly-stack diagram). It's being kept for reference and will be parked as `nza-website-v1.html` while we build a v2 against the locked system.

The locked v2 system is documented in [`uploads/nza-design-system.md`](uploads/nza-design-system.md) — that document is the spec of record. This handoff section will be updated when v2 is on disk.

### What v2 will be (per locked spec)

A single document with **five distinct screens**, paper/navy alternation, each labelled `[data-screen-label]` in the DOM. Not a continuous scroll; one viewport per screen, with the Approach screen using a click-to-reveal grid to keep within one viewport.

| # | Screen | Canvas | State |
|---|---|---|---|
| 00 | **Home** — hero with GHG Protocol scope landscape illustration, sequenced reveal | navy | **Locked content; building** |
| 01 | **Capabilities** — connected-system circular diagram | navy | **Locked content; diagram being drawn bespoke by Chris.** Wireframe scaffold while we wait. |
| 02 | **Approach** — 3×2 capability grid with click-to-reveal inset panel | paper | **Locked content; building** |
| 03 | **Products** — NZ:AI / PABLO / decodED | navy | **Pending — not yet drafted** |
| 04 | **Clients** — selected work, evidence-led | paper | **Pending — not yet drafted** |

**Motion in place:** none on disk yet. Locked: hero sequenced reveal (~2.2s, six layers, then holds); Capabilities diagram sequenced reveal (~2s, centre then arcs then ring); Approach click-to-reveal inset panel (max-height 0→500px, 360ms cubic-bezier).

**Layout language:** ~720–880px text measure centred in a 1280px content frame, generous vertical rhythm (96–160px between sections), 8px grid throughout, hairline rules over container backgrounds.

---

## 2. Design system foundations — what's codified

These are real files, fully built out. **Note: tokens and previews are still on the v1 (pink/Playfair) palette and will be migrated to v2 (coral/DM Serif/Söhne) — flagged in §3.**

### Tokens & rules

- [`colors_and_type.css`](colors_and_type.css) — the canonical token file. Imports Stolzl, defines colour variables, type scale, spacing scale, radii, shadows. **Currently v1; needs migration.**
- [`nza-website.css`](nza-website.css) — website-specific layer. **Currently v1.**
- [`uploads/nza-design-system.md`](uploads/nza-design-system.md) — **the locked v2 spec. This is the spec of record.**

### Type system

- [`preview/type-headings.html`](preview/type-headings.html)
- [`preview/type-body.html`](preview/type-body.html)
- [`preview/type-mixing.html`](preview/type-mixing.html) — codifies the cap-height bump rule for italic emphasis inside Stolzl headlines (currently `1.16/1.13/1.08`em; v2 spec says `1.10–1.13`em — needs adjustment).

### Colour system

- [`preview/colors-brand.html`](preview/colors-brand.html)
- [`preview/colors-gradients.html`](preview/colors-gradients.html) — **will be deprecated; v2 spec has no gradients**
- [`preview/colors-themes.html`](preview/colors-themes.html)
- [`preview/colors-data.html`](preview/colors-data.html)

### Components

Working examples for buttons, form controls, callouts, stat cards, status badges, sub-nav, top-nav, surfaces, iconography, logo, spacing, shadows. All under [`preview/`](preview/). All currently v1; will be migrated to v2 tokens.

### Iconography

Lucide (open-source, MIT) as the working set. Sprite at [`assets/icons-sprite.svg`](assets/icons-sprite.svg). NZA may build a custom set later.

### Logo

[`assets/nza-logo.svg`](assets/nza-logo.svg) — wordmark only.

---

## 3. What changed between v1 and v2 — and why

The v2 design system locked decisions that v1 had left open or had wrong. Surfacing the deltas because the prototype on disk reflects v1.

### Type
- **v1:** Stolzl + Playfair Display italic + Stolzl-as-body
- **v2:** Stolzl (display only) + **Söhne** (body; Inter Tight as fallback) + **DM Serif Display** (italic emphasis only, always coral, always cap-height-bumped 1.10–1.13em)

### Colour
- **v1:** NZA pink `#EE7C7B`, five-gradient expressive palette, navy + cream two-canvas
- **v2:** **Coral `#F75A55` only**, **no gradients**, paper / cream / navy three-surface system, **three lens accents** (Data navy-blue, Tools purple, Strategy teal) for taxonomic distinction only

### Surfaces
- **v1:** navy canvas end-to-end on the website
- **v2:** **paper / navy alternation** across five screens — Home navy, Capabilities navy, Approach paper, Products navy, Clients paper. The alternation is the visual rhythm.

### Site structure
- **v1:** ten scrolling screens, continuous editorial document
- **v2:** **five distinct screens**, one viewport each, with click-to-reveal compressing where needed (Approach)

### Capabilities visual
- **v1:** assembly-stack diagram (built environment → energy → data → climate, layered)
- **v2:** **connected-system circular diagram** with whole-building approach at centre, energy-systems arc above, wider-context arc below, *DATA · DIGITAL TOOLS · STRATEGY* as outer ring text. Being drawn bespoke by Chris.

### Coral usage rules (new in v2)
- **Reserved for moments, never surfaces.** Italic emphasis, the 24px coral rule before eyebrows, the 32px coral rule under capability titles, small accent dots, the active-state underline, the radial glow on the Co-built platforms card. **Never** a button fill, **never** a card or section background.
- The disruptive sixth card on Approach is the *only* place navy + coral appears on the paper Approach screen. It earns the disruption because it bridges to Products.

### Voice (sharpened in v2)
- **Don't use *decarbonising* as a verb.** ("Decarbonising the building" is banned. As a noun — "decarbonisation strategy" — it's fine.)
- **Don't use *not-X* constructions** to make a point. Say what NZA does, not what it isn't.
- **Em-dash for the strategic clause.** Triplets ("data, digital tools, and strategy") as the rhythmic move.
- **Voice on reports is third-person, never "we".** Voice on the website is plural-implied — confident, partnership-framed, but never literally "we".

---

## 4. Directional explorations — what we tried, what we kept, what we rejected

### Kept (in both v1 and v2)

- **Two-canvas system as a base** (cream + navy). Tried a third (warm grey midground) in v1; broke legibility, cut. v2 expanded this to paper / cream / navy with the third surface being a card-on-paper variant rather than a third canvas.
- **Stolzl as the display face.** Tested against Inter, Söhne, GT America. Stolzl's geometric humanism reads engineered without going into the system-font default.
- **Lucide over a custom icon set.** Tried sketching custom icons and it pulled the system toward "illustrated explainer." Reverted.

### Rejected in v1, reinstated in v2

- **6-up capability grid.** Killed in v1 because every consultancy site has one. Reinstated in v2 *with the click-to-reveal inset panel interaction* — the interaction is what saves it from generic territory. The compact card → revealed three-lens detail moves from "list of services" into "structured method made tangible."

### Rejected in v1 and still rejected

- **Gradient backgrounds on body sections.** Tried using the five-gradient palette as section backdrops; immediately tipped into eco-startup territory. v2 eliminates gradients entirely.
- **Animated entrance reveals on scroll.** Built and removed. The page felt like marketing. v2 keeps motion to two specific sequenced reveals (hero, Capabilities diagram) and one click-to-reveal (Approach).

### Newly rejected in v2

- **Pink as the signature colour.** Replaced with coral.
- **Playfair Display.** Too editorial-trendy. Replaced with DM Serif Display.
- **Continuous-scroll editorial document.** Replaced with five distinct screens.

### Untried, on the list

- **GHG Protocol scope landscape illustration** for the Home hero. Strong editorial reference (a hand-drawn version from an EOC report NZA produced); not yet drawn for v2.
- **Products page (NZ:AI / PABLO / decodED).** No visual concept yet. The disruptive sixth card on Approach is the only existing bridge.
- **Clients page.** No visual concept yet.
- **Report covers and PABLO panels** at v2 fidelity. The locked design system covers the website; how the system flexes for reports and PABLO is partly answered, partly open.

---

## 5. Where we're stuck — the honest list

These are the questions research can earn its keep on. The v2 system answered several of v1's open questions; what remains is sharper.

### 1. Motion that doesn't tip into marketing
Two named patterns are locked: **the hero held-reveal** (~2.2s sequenced layer reveal, then holds) and **the Capabilities sequenced reveal** (~2s, centre → arcs → ring → holds). The Approach inset panel uses a 360ms cubic-bezier transition — not a "pattern", just a transition.

What other named motion patterns does the rest of the site need? Specifically: how does the **Products page** introduce three different products without three sequenced reveals competing for attention? What's the equivalent locked behaviour for **Clients** — a logo wall that earns its calm rather than feels like a screenshot?

### 2. The marketing-to-tool tonal bridge
Website is editorial. PABLO is a working tool. Reports sit between. **What's the shared grammar?** v2 locked the type system (Stolzl + Söhne + DM Serif) and the colour system (paper/navy + coral + three lens accents) — both carry across all three surfaces. But density rules, hierarchy patterns, the recurring diagrammatic element — these don't yet exist as named patterns.

### 3. Infographic vocabulary beyond what's already specified
Locked: the **GHG Protocol scope landscape** (Home hero) and the **connected-system circular diagram** (Capabilities). NZA needs at least three more concept-types: **pathways over time** (carbon trajectory, SBTi alignment), **climate risk overlays** (asset-level exposure), **energy-system flows** (load shapes, generation/storage dispatch), **building-portfolio rollups** (whole-estate views). Each probably wants a distinct visual treatment. Research should propose 3–5 directions and say which suits which surface.

### 4. The Products and Clients pages, conceptually
These are the two undrafted pages in the locked design system (§6 of the v2 spec explicitly leaves them as pending). Research can usefully shape both:
- **Products** must feel like extensions of the practice, not a separate product line. The disruptive sixth card on Approach is the bridge — what's the receiving end?
- **Clients** must be evidence-led, work-as-the-hero. Calm. What stops it being a generic logo wall?

### 5. Density without losing identity (carried from v1, still open)
A PABLO panel will have 30+ data elements on screen. A marketing section has three. **How does the system flex 10× in density without becoming two different brands?** v2 specified the type and colour systems shared across all three, but the layout / hierarchy / density rules that make a dense PABLO panel feel like the same brand as the calm marketing site are not yet pinned down.

### 6. Smaller, but worth flagging

- decodED's accent green hex is still TBD. Should it sit alongside the existing lens accents, or break out?
- We use Lucide as a working default but may want a custom set eventually. When does that decision need to be made, and what's the trigger?
- The reports use a five-colour risk system. Should that palette appear anywhere on the website, or stay strictly inside reports?
- **Mobile responsive specifications.** Mockups and the locked system are desktop-first. The connected-system diagram, the 3×2 Approach grid, and the cap-height-bumped italic headline all need mobile rules that don't lose identity.

---

## How to navigate this project

If you're the researcher opening this for the first time, in this order:

1. **`nza-brief.md`** — what NZA is, what we want back.
2. **`uploads/nza-design-system.md`** — **the locked v2 spec. This is the spec of record.**
3. **This file (`nza-handoff.md`)** — what's actually built and where we're stuck.
4. **`nza-website.html`** — the v1 prototype as it stands; useful for understanding history but **not authoritative**.
5. **`preview/colors-brand.html`** + **`preview/type-mixing.html`** — the two preview files that capture the most identity in the smallest surface.
6. **`colors_and_type.css`** — if you want to see the tokens (currently v1).
7. The rest of `preview/*.html` as needed.
