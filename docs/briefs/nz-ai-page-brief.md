# NZ:AI Page — Implementation Brief for Co-Work

A dedicated `/nz-ai` route within the NZA marketing site, structurally parallel to `/pablo`. This brief covers what to build, what copy to use, what visual placeholders to leave for later, and which house rules from `CLAUDE.md` apply with particular force.

The proposition, voice, structural sequence, and visual placeholder specification all come from `NZ_AI_Web_Page_Copy_v8.md`, which is the authoritative source for content. This document translates that copy into a build brief that fits inside the existing site architecture.

---

## 1. Scope

Build the NZ:AI product page at `/nz-ai`, accessible from the Products section of the home page and from the global nav.

The page lives at the same architectural level as `/pablo`. It uses the same shell, the same typography system, the same component patterns, the same scroll and reveal behaviours, and the same responsive boundary (`--bp-phone` at 600px).

The NZ:AI page is distinct from `/pablo` in tone and content but identical in structural language. A visitor arriving from PABLO should feel they are in the same brand world.

---

## 2. What to build, section by section

The page has eight scroll-stops. Each maps to a section component. Placeholders are flagged where the final visual asset is not yet available.

### Section 1 — Hero

Single-screen hero. Two-column or stacked depending on viewport.

- **Headline:** *Bespoke platforms that give your team the granular data to act on. Built around how your organisation actually works.* Italic emphasis on "act on" per the typographic fingerprint rule.
- **Supporting line:** *Real decarbonisation is a team effort. It needs granular data, the right people seeing it, and the ability to act on what they see.*
- **CTA:** *Start a conversation →* — anchors to the closing section / contact form.
- **Visual placeholder:** the hero animation (a single chart that morphs through forms — bar chart, tree map, waterfall, trajectory, drill-down). For the launch build, use a static placeholder card the same shape and aspect ratio the animation will eventually occupy. A simple navy card with a thin coral rule and the label `[hero animation placeholder]` is sufficient.
- **Eyebrow / brand mark:** *NZ:AI · Net Zero Advisory and Intelligence*

### Section 2 — The Opportunity

Editorial section. Centred or left-aligned text with the before/after visual to one side or below depending on viewport.

- **Headline:** *You can't meaningfully change what you can't meaningfully see.* Italic emphasis on "see".
- **Body:** Two paragraphs from v8 Section 01.
- **Visual placeholder:** the before/after split. A side-by-side card pair, left card greyscale and chaotic-looking, right card clean and structured, both placeholders. Label both with `[before/after placeholder]`.

### Section 3 — What It Is

Editorial section. Type-led.

- **Headline:** *A platform built entirely for the way your organisation works.* Italic emphasis on "you".
- **Body:** Three paragraphs from v8 Section 02. Note the third paragraph about historic data — preserve the conditional phrasing ("Where the relationship supports it") exactly.
- **Visual placeholder:** the bespoke configuration sequence. A single card showing four small frames in sequence, each labelled with a fictional client name (e.g. "Northgate Properties", "Ashford Schools", "Penwick Group", "Linfield Estates"). Frame border colour shifts between each. Label `[bespoke configuration sequence placeholder]`.

### Section 4 — How It Works

Three-card section. Discovery / Build / Stewardship.

- **Section headline:** *Three phases. One relationship. Shaped to you.* Italic emphasis on "you".
- **Three cards:** Discovery, Build, Stewardship — copy lifted from v8 Section 03. Each card has a number (01 / 02 / 03), a title, body text, and where present an italic closing line (Stewardship has the ownership line).
- **Discovery card** is visually weighted heavier than the others — wider, taller, or differently styled — to reflect that it is where the substantive work happens. The PABLO page's card pattern should be the reference.
- **Stewardship card** must include the closing italic line on platform ownership in full: *"You own your platform — code, data, methodology, and the architecture that holds it together — whether or not you continue the partnership. Stewardship is what keeps it methodologically current and lets your team get more from it as you grow."*
- **Visual placeholder:** the three-phase diagram sits below the three cards. A single horizontal element with three nodes connected by a flow line, Discovery node larger than the others, Discovery and Build visually overlapping. Use the existing line-icon style. Label `[three-phase diagram placeholder]` if no time to produce a static SVG; otherwise a simple vector version is fine for launch.

### Section 5 — What It Does For Your Team

Three-tile section. Each tile pairs a screenshot placeholder with two lines of copy.

- **Section headline:** *Different people. Different questions. One source of truth.* Italic emphasis on "questions".
- **Three tiles**, each with:
  - A short bold lead line
  - A 2-3 sentence body
- **Tile 1 — Drill from a headline number to a single decision.** Body from v8 Section 04 tile 1. Closing line *"Every figure auditable. Every assumption visible."* should land as a separate two-sentence note at the foot of the tile.
- **Tile 2 — Model the change you're considering, before you commit to it.** Body from v8 Section 04 tile 2.
- **Tile 3 — Automate the reporting that currently eats your time.** Body from v8 Section 04 tile 3.
- **Visual placeholder:** each tile has a screenshot above the copy. For the launch build, use a navy placeholder card with a coral rule and a label — `[drill-down view placeholder]`, `[scenario tool placeholder]`, `[report export placeholder]`.

### Section 6 — Who It's For

Editorial section with a sector tile grid below.

- **Section headline:** *Organisations that want to do more than report.* Italic emphasis on "more".
- **Body:** Two paragraphs from v8 Section 05.
- **Sector tile grid:** six to eight custom line-icon tiles representing the sectors named in the body (property, contractors, design and engineering, education, developers, operators, plus space for one or two more). Use the existing lucide-style 1.35–2px stroke icon language. If specific sector icons aren't ready, neutral placeholder tiles each with a short label are fine for launch.
- **Quiet link below the body:** *See who we work with →* routing to `#clients` on the home page (the existing Clients section).

### Section 7 — Why Now

Editorial section. Type-led.

- **Headline:** *The pressure has tipped. The tools have caught up.* Italic emphasis on "caught up".
- **Body:** Two paragraphs from v8 Section 06.
- **Visual placeholder:** optional. If included, two converging trendlines (pressure up, cost of bespoke intelligence down) in the existing line-icon style. If skipped for launch, the words carry it.

### Section 8 — Closing CTA

- **Headline:** *Let's work out if it's the right fit.* Italic emphasis on "fit".
- **Body:** Paragraph from v8 CTA section.
- **CTA:** *Start a conversation →* — links to the contact form / email / Calendly (functional decision pending).
- **No visual.** The section ends on whitespace.

---

## 3. Routing and navigation

- New route: `/nz-ai` — handled by react-router-dom 6, sitting alongside `/` and `/pablo`.
- `vercel.json` SPA rewrite already covers this; no infrastructure change needed.
- **Home page Products section:** add an NZ:AI card alongside the existing PABLO card, with a brief headline (*"Net Zero Advisory and Intelligence"*) and a short one-liner taken from the Section 1 supporting line. The card links to `/nz-ai`.
- **Global nav:** add an NZ:AI entry in the same position the PABLO entry sits.
- **DecodED placeholder:** if DecodED is not yet ready as a third product card, leave the existing Products section structure intact and just add NZ:AI. Don't introduce a DecodED card in this build.

---

## 4. Voice and content rules

These are the rules from `CLAUDE.md` that apply with particular force to this page. They're worth re-stating because the v8 copy was written before these were known and a small number of phrases will need to be checked against them at build time.

- **No first-person "we" in user-facing copy.** Speak about the work, the data, the client. **This means the v8 copy will need to be lightly edited at build time** — phrases like "we use AI to build", "we work fast", and similar are present in the source copy and need to be reworked into impersonal or third-person forms before going on the page. Examples:
  - *"We can move fast or take our time"* → *"The pace can move fast or stay slow"*
  - *"AI lets us build quickly"* → *"AI accelerates the build"*
  - *"What we commit to is direction, methodology stewardship..."* → *"What the partnership commits to is direction, methodology stewardship..."*
  - The editorial pass on this rule should be done by whoever is implementing the build. Where the rephrase weakens the line meaningfully, flag it to Chris for sign-off rather than guessing.
- **No emoji anywhere.** Already absent from the v8 copy; preserve.
- **No gradients in UI chrome.** The logo gradient is logo-only.
- **Coral is for moments, never surfaces.** Italic emphasis, rule lines, accent dots, the Stewardship card italic ownership line. Never as a fill for a card, button, or section background on this page.
- **Italic emphasis is the typographic fingerprint.** Every `<em>` on this page renders as DM Serif Display italic in coral (`#F75A55`), bumped 1.10–1.15em. The italic words have been flagged in each section above.
- **Lucide-style line icons only.** 1.35–2px stroke, 11–18px sizes. No icon fonts, no fill icons, no decorative unicode.

---

## 5. The AI mention budget

The v8 copy contains exactly three AI mentions, deliberately. This rule must be preserved in implementation:

1. In Section 4 Discovery card: *"AI lets us build quickly. The partnership work — understanding your organisation properly — is what takes the time, and it's what makes the rest of it stick."* (Subject to the "no first-person we" rewrite above — likely lands as *"AI accelerates the build. The partnership work — understanding your organisation properly — is what takes the time, and it's what makes the rest of it stick."*)
2. In Section 4 Stewardship card: *"...because the rate at which AI is changing what's possible means a fixed list would be obsolete within months."*
3. In the brand name itself — NZ:AI.

That's it. If any other AI mentions creep in during build (in microcopy, in alt text, in nav labels), strip them. The page proposition is the human work AI enables, not AI itself.

---

## 6. Responsive

Two tiers, per `CLAUDE.md`:

- **≥600px** — full editorial layout. Multi-column hero. Three-card How It Works. Three-tile What It Does. Sector grid in horizontal arrangement.
- **<600px** — mobile-first single-column. Cards stack. Hero animation placeholder uses a smaller variant or static fallback. Sector grid stacks or scrolls horizontally.

**Snap-paging:** gated to desktop with fine pointer via `useSnapPaging.shouldSnap()`. Mobile scrolls natively.

**Touch targets** ≥44px on phone for all interactive elements (CTAs, nav links, the quiet "See who we work with" link).

**Reduced motion:** `prefers-reduced-motion: reduce` short-circuits all animations on this page to their final state. Particularly relevant for the hero animation once it lands.

**DevicePreview check** before opening a PR — verify the page at common phone, tablet, and desktop sizes.

---

## 7. Visual placeholders — what they need to look like at launch

The page should ship without the final animations and screenshots. The placeholders need to be honest about what they are so they don't look like missing content.

- All placeholders use the same visual language: a navy card with a thin coral rule, a centred placeholder label in light grey monospace, and the same aspect ratio the final asset will occupy.
- Placeholder labels: `[hero animation]`, `[before/after view]`, `[bespoke configuration sequence]`, `[three-phase diagram]`, `[drill-down view]`, `[scenario tool]`, `[report export]`, `[trendlines]` (last one only if included).
- Placeholders are static. No "coming soon" copy, no loading spinners, no animation — they are deliberate scaffolds awaiting production assets.
- Placeholder aspect ratios should match what the final asset is intended to be, so the page layout doesn't shift on visual delivery.

When the production assets arrive, they replace placeholders one-for-one with no layout impact.

---

## 8. Footer, contact form, and CTA destination

- The closing CTA destination needs deciding. Three options on the table: a Calendly link, a contact form embedded in the page, or a `mailto:` to `chrisscott@thenza.co.uk`. **Default for launch:** `mailto:`, since the existing site uses this pattern. Replace with Calendly or form when those decisions are made.
- The page footer is the existing site footer — no changes.

---

## 9. Build approach

Recommended chunking, one commit per chunk:

1. **Route and shell.** Add `/nz-ai` to the router, create the page component, render an empty shell with the site nav and footer.
2. **Hero section (Section 1).** Headline, supporting line, CTA, hero placeholder.
3. **Opportunity + What It Is (Sections 2 and 3).** Editorial sections with placeholders.
4. **How It Works (Section 4).** Three cards with Discovery weighted, plus three-phase diagram placeholder or static SVG.
5. **What It Does (Section 5).** Three tiles with screenshot placeholders.
6. **Who It's For + Why Now + Closing CTA (Sections 6, 7, 8).** Editorial sections and the closing block.
7. **Nav, Products card, anchor wiring.** Add the NZ:AI entry to the global nav and the home Products section. Wire the "See who we work with" quiet link to `#clients` on the home page.
8. **Voice rewrite pass.** Apply the "no first-person we" rule to every line on the page. Flag anything ambiguous to Chris.
9. **Responsive and reduced-motion verification.** DevicePreview pass at phone, tablet, and desktop. Browser DevTools clean of console errors.
10. **STATUS.md update.**

---

## 10. Verification before PR

Per `CLAUDE.md`'s post-task safety checks:

1. `npm run dev` boots without console errors.
2. Visual diff against the closest reference (the PABLO page is the structural analogue) — the NZ:AI page should feel architecturally identical, content-wise distinct.
3. `prefers-reduced-motion: reduce` short-circuits any animation to final state.
4. `npm run build` produces a clean `dist/`.
5. DevicePreview pass at phone/tablet/desktop.
6. AI mention count audit — exactly three mentions, in the three places named above. No more.
7. First-person "we" audit — zero instances on the page.
8. STATUS.md updated with the completed chunks.

---

## 11. What's out of scope for this build

- The final hero animation, demo platform screenshots, and bespoke configuration sequence — all placeholders for now.
- DecodED page or DecodED Products card — separate workstream.
- Pricing — never on the page.
- Client logos and case studies — handled by the existing Clients section; the page links there via the quiet "See who we work with" link.
- Calendly or contact form embed — defer to a later chunk once the destination decision is made.
- SEO meta tags and Open Graph cards — separate pass once content is locked.

---

## 12. Source of truth

The authoritative copy and visual specification document is `NZ_AI_Web_Page_Copy_v8.md` (Chris has the file). This implementation brief translates v8 into a build plan but does not supersede it. If anything in this brief contradicts v8, v8 wins. If anything in `CLAUDE.md` contradicts v8, `CLAUDE.md` wins (specifically the "no first-person we" rule and the design system locks).

When in doubt: ask Chris.
