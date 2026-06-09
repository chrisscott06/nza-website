# Brief: NZA navigation system (site-wide)

**For:** Claude Code (implementation)
**Scope:** Site-wide navigation header, dropdown panels, product page stubs, type and CTA system
**Date:** 9 June 2026
**Status:** Concept locked, ready for build

This brief defines the **navigation system** that sits on every page of the NZA site, including the three product page stubs at `/pablo`, `/nz-ai`, and `/decoded`. It is foundational — the rest of the site sits inside this nav.

This brief is a sibling to the landing-page brief. It can be implemented in parallel.

---

## What you're building

A sticky, adaptive navigation header that:
- Sits on every page across the NZA site
- Carries the NZA two-line logo on the left
- Has three navigation items + a Get in touch CTA on the right
- **Adapts visually** to the page context — dark backgrounds vs cream backgrounds, and per-product accent colours
- Collapses cleanly on mobile, with the NZA mark serving as the menu trigger
- Includes stub pages at `/pablo`, `/nz-ai`, and `/decoded` so the per-product nav adaptation can be seen working live

---

## Visual system reminders

Use existing NZA design tokens. Don't invent new ones.

**Brand colours:**
- Cream: canonical NZA cream
- Navy: canonical NZA navy
- Coral: `#F75A55`

**Product palettes** (introduced by this brief):
- PABLO: deep aubergine background `#1F0F2E`, violet accent `#7A74FF`
- NZ:AI: deep navy background `#0A1628`, teal accent `#0F9888` (lighter teal `#5FDDC4` for visible text on dark)
- decodED: cream-warm background `#F3EFE3`, deep green accent `#0F5D43`, orange accent `#E8743C`

**Typography in the nav:**
- Navigation items: **Stolzl**, 14px desktop / 13px tablet, font-weight 500, letter-spacing 0.01em
- CTA button: **Stolzl**, 11.5–12px, font-weight 500, letter-spacing 0.12em, uppercase
- Dropdown items: **Inter**, 15px, font-weight 500 (keep dropdown items in Inter — only top-level nav items are Stolzl)

---

## Section 1 — Logo system

### Asset
Use the existing `nza-logo-wide.svg` asset (mark + two-line "NET ZERO ADVISORY" wordmark). The SVG has four named groups that are independently styleable:
- `#mark` (or the unnamed group containing circle, bottom-triangle, mid-triangle, top-triangle paths) — the geometric icon
- `#net` — the word "NET"
- `#zero` — the word "ZERO"
- `#advisory` — the word "ADVISORY"

If the existing SVG groups are named differently, rename them to match the above for consistent CSS targeting.

### Sizing
- Desktop: logo block ~36–38px tall, scales width proportionally (full SVG is ~136px wide at 38px tall)
- Tablet: ~32px tall
- Mobile: see Section 6 (mobile uses mark-only)

### Colour adaptation — the signature move

The logo recolours based on the page context. **`#mark`, `#net`, and `#zero` always share one colour. `#advisory` is independent and uses an accent.** Per page:

| Page | mark + net + zero | advisory |
|---|---|---|
| NZA landing — navy hero section | Cream | Cream |
| NZA landing — cream client strip | Navy | **Coral** |
| NZA landing — any other cream section | Navy | **Coral** |
| PABLO page (aubergine) | Cream | Cream |
| NZ:AI page (deep navy) | Cream | Cream |
| decodED page (cream-warm) | **Deep green** `#0F5D43` | **Orange** `#E8743C` |

**Rule of thumb:** on dark backgrounds the logo is fully cream and ADVISORY stays cream. On light backgrounds the logo adopts the page's primary brand colour and ADVISORY picks up the page's accent.

Transitions between states use the standard `cubic-bezier(0.16, 1, 0.3, 1)` easing at 320ms.

---

## Section 2 — Navigation structure

Three top-level items + one button, in this exact order from left to right (after the logo):

1. **Our products ▾** (dropdown)
2. **About us ▾** (dropdown)
3. **Who we work with** (flat link — no dropdown)
4. **Get in touch** (button — see Section 4)

### Dropdown contents

**Our products** dropdown:
- PABLO → `/pablo`
- NZ:AI → `/nz-ai`
- decodED → `/decoded`

**About us** dropdown:
- Our approach → `/approach` (existing page)
- Our expertise → `/expertise` (existing page)
- Who we are → `/about` (placeholder route if not yet built)

Note: "Our clients" was previously discussed for the About dropdown but has been promoted to a top-level item (*Who we work with*). It is no longer inside About.

### Dropdown panel styling

- Background: navy at 78% opacity with `backdrop-filter: blur(20px)`
- Border: hairline `0.5px solid rgba(247, 90, 85, 0.22)` (subtle coral)
- Border-radius: 10px
- Padding: 12px
- Min-width: 200px
- Box-shadow: `0 24px 48px -16px rgba(0, 0, 0, 0.5)`
- Position: absolute, ~60px from top of nav (just beneath the bar)

### Dropdown item styling

- Padding: 10px 14px
- Border-radius: 6px (inside the panel)
- Default: cream text at 85% opacity, Inter 500, 15px
- **On hover:** background picks up `rgba(247, 90, 85, 0.1)` (subtle coral wash), text turns coral
- For the products dropdown, each item has a small (10px) circular swatch on the left:
  - PABLO: linear gradient `linear-gradient(135deg, #FFC775 0%, #F75A55 45%, #7A74FF 100%)` — the PABLO brand gradient
  - NZ:AI: solid teal `#2EC4A8`
  - decodED: solid deep green `#0F5D43`

### Dropdown behaviour

- **Open trigger:** hover on desktop, tap on mobile
- **Open animation:** fade + 4px slide-down, ~200ms
- **Close trigger:** mouse leaves the dropdown area with a ~150ms grace period (so the user doesn't lose it while moving the cursor down toward an item)
- **Close animation:** fade-out, ~150ms
- **Chevron indicator:** the chevron on the parent nav item rotates 180° when its dropdown is open

---

## Section 3 — Sticky behaviour and scroll-based adaptation

### Sticky positioning
The nav is `position: sticky; top: 0; z-index: 100;` on every page. It stays visible at all times.

### Height
- Desktop: 68px
- Mobile: 56px

### Backdrop blur on scroll

The nav has `backdrop-filter: blur(12px)` and a semi-transparent background. This causes the nav to *inherit* the colour of the section beneath it through the blur, which is the primary mechanism of the adaptive visual behaviour.

Per page-context:

| Context | nav background |
|---|---|
| Default (navy sections) | `rgba(15, 24, 40, 0.62)` |
| Cream sections | `rgba(250, 245, 235, 0.78)` |
| PABLO page | `rgba(31, 15, 46, 0.62)` |
| NZ:AI page | `rgba(10, 22, 40, 0.7)` |
| decodED page | `rgba(243, 239, 227, 0.82)` |

The nav has a 0.5px hairline bottom border that also adapts:
- Dark contexts: `rgba(237, 229, 216, 0.08)` (faint cream)
- Light contexts: `rgba(39, 51, 77, 0.1)` or `rgba(15, 93, 67, 0.12)` for decodED

### Detecting context

Two options for how Claude Code implements the per-section adaptation:

**Option A (preferred):** the page declares its context via a CSS class on the `<body>` or top-level container (e.g. `body.context-cream`, `body.context-pablo`, `body.context-nzai`, `body.context-decoded`). The nav reads the class and applies the corresponding styles.

**Option B (fallback):** use Intersection Observer on the cream sections of the landing page to switch the nav into "cream mode" when those sections cross a threshold. More fragile.

Use Option A for the landing page's section-by-section adaptation (i.e. the nav adapts as the user scrolls from navy hero into the cream client strip and back). Use Option A also for the product pages (each product page sets its own `context-*` class on the body).

---

## Section 4 — Get in touch button

The CTA button uses **two different visual treatments** depending on whether the page background is dark or light.

### On dark backgrounds (outlined)

Used on: NZA landing navy hero, PABLO page (aubergine), NZ:AI page (deep navy).

- Background: transparent
- Border: 0.5px solid (colour adapts per page — see below)
- Padding: 9px 22px
- Border-radius: 999px (full pill)
- Font: Stolzl 500, 11.5px, uppercase, letter-spacing 0.12em
- Text colour: matches border colour
- **On hover:** background fills with the accent colour, text becomes white, slight transform `translateY(-1px)`

| Page | border / text | hover fill |
|---|---|---|
| NZA navy | `#F75A55` (coral) | `#F75A55`, text white |
| PABLO aubergine | `#B79CFF` (light violet for visibility) | `#7A74FF`, text white |
| NZ:AI deep navy | `#2EC4A8` (light teal for visibility) | `#0F9888`, text white |

### On light backgrounds (solid-filled)

Used on: NZA landing cream client strip section, decodED page.

- Background: solid accent colour
- No border
- Padding: 10px 23px
- Border-radius: 999px (full pill)
- Font: Stolzl 500, 11.5px, uppercase, letter-spacing 0.12em
- Text colour: white
- **On hover:** background darkens to a deeper shade of the accent, slight transform `translateY(-1px)`

| Page | background | hover background |
|---|---|---|
| NZA cream section | `#F75A55` (coral) | `#DC4844` (darker coral) |
| decodED cream | `#E8743C` (orange) | `#C95E2C` (darker orange) |

### The principle
Outlined CTAs work on dark because the coloured outline pops against the dark canvas. On light backgrounds, the outline loses presence — the button needs to be solid-filled to claim space. This is **the adaptive CTA rule**: form (not just colour) responds to background brightness.

### Click behaviour

Initially: opens a placeholder route at `/contact` (or triggers a contact modal — Claude Code's choice based on existing site patterns). The destination behaviour is not in scope for this brief.

---

## Section 5 — Three product page stubs

Build three new top-level routes. These pages can be near-empty for now — their primary purpose is to enable the navigation's adaptive behaviour to be seen working live, and to give the product page template (separate brief) a place to land.

### `/pablo` — PABLO page stub

- Body class: `context-pablo`
- Background: `#1F0F2E` aubergine, with subtle violet blob field (similar to the navy blob field on the landing page, retuned for PABLO's palette — violet `#7A74FF` at low opacity, amber `#FFC775` at very low opacity, all heavy blur)
- Content: centred page-level headline in Stolzl 500, large (~64px), cream coloured. Placeholder text: **"PABLO — coming soon."** with a small micro-label above: **"/PABLO"** in mono, violet at 70% opacity.
- Nav: inherits context-pablo automatically

### `/nz-ai` — NZ:AI page stub

- Body class: `context-nzai`
- Background: `#0A1628` deep navy, with subtle teal blob field (teal `#0F9888` at low opacity, mint `#5FDDC4` at very low opacity, heavy blur)
- Content: same structure as PABLO. Placeholder text: **"NZ:AI — coming soon."** with micro-label: **"/NZ-AI"** in mono, teal at 70% opacity.
- Nav: inherits context-nzai automatically

### `/decoded` — decodED page stub

- Body class: `context-decoded`
- Background: `#F3EFE3` cream-warm, with very subtle green and orange blob field at low opacity
- Content: same structure. Placeholder text: **"decodED — coming soon."** in deep green `#0F5D43`. Micro-label: **"/DECODED"** in mono, orange at 70% opacity.
- Nav: inherits context-decoded automatically

### Why these stubs exist
So the navigation's adaptive behaviour can be demonstrated end-to-end without waiting for the full product page template to be built. They will be replaced with the real product pages (separate brief) but the stubs let everything else work today.

---

## Section 6 — Mobile behaviour

Below 768px viewport:

### Layout
- Nav height: 56px
- Logo collapses to **mark-only** (the circular icon, no wordmark). The mark uses just the `#mark` paths from the SVG, isolated.
- Mark size: 36px square, sits left
- Get in touch button stays visible on the right (slightly smaller — 10px text, 7px 14px padding)
- No nav items visible — they collapse into the menu overlay (triggered by tapping the mark)

### The mark as menu trigger
**The circular mark is the menu trigger** — tapping the mark opens the menu. There is no separate hamburger icon. The mark itself becomes the affordance.

When the menu is open, the mark turns coral (`#F75A55`) to indicate active state. Tap again to close.

### Menu overlay
- Slides down from the top, beneath the nav bar
- Background: `rgba(15, 24, 40, 0.97)` with `backdrop-filter: blur(20px)`
- Padding: 24px 20px
- Full-screen below the nav (height: 100vh - 56px)
- Slide-in animation: ~300ms from `translateY(-100%)` to `translateY(0)`

### Menu contents
Flat layout — no nested dropdowns on mobile. All nav items expanded inline.

**Section: Products** (uppercase mono label, 10px, coral at 85%, letter-spacing 0.2em)
- PABLO (with gradient swatch)
- NZ:AI (with teal swatch)
- decodED (with green swatch)

**Section: About us** (uppercase mono label, same styling)
- Our approach
- Our expertise
- Who we are

**Section: Who we work with** (uppercase mono label)
- (single link — could be standalone without a label, designer's call)

**Menu items:** Inter 500, 17px, cream, 12px 8px padding. On tap, the item navigates and the menu closes.

**At the bottom of the overlay:** the Get in touch button at full width, padded centred, using the appropriate page-context CTA treatment (outlined or solid depending on the page).

---

## Section 7 — Site-wide behaviours and constraints

### Reduced motion
Respect `prefers-reduced-motion: reduce`. When set:
- Backdrop blur stays but transitions become instant
- Mobile menu overlay slides at 50ms instead of 300ms
- Logo colour transitions become instant

### Accessibility
- Click targets: minimum 36px tall for nav items, 44px for mobile menu items
- Focus rings on all interactive elements (nav items, dropdown items, CTA button, mobile mark)
- ARIA labels: `aria-expanded` on dropdown triggers, `aria-haspopup` on dropdown parents, `aria-label="Open menu"` on the mobile mark
- Keyboard navigation: tab through nav items, arrow keys within dropdowns, escape closes dropdowns/menu

### Performance
- All animations use `transform` and `opacity` only (GPU-accelerated)
- The backdrop-blur is the main performance cost — test on lower-end mobile devices and consider reducing blur intensity or falling back to solid backgrounds if framerate suffers
- Logo SVG is inlined into the page (not a `<img>`), so the per-group colour changes work via CSS

---

## Files referenced

**Existing in the design system:**
- `nza-logo-wide.svg` — the two-line logo (already uploaded; ensure the four groups are named `#mark`, `#net`, `#zero`, `#advisory` for CSS targeting)

**Pending from Chris:**
- Final routes for placeholder destinations (Get in touch / contact, Our clients / case studies). For first build, link to `/contact`, `/clients` placeholders.
- Confirmation of the existing routes for `/approach`, `/expertise`, `/about`. Adjust if they're named differently in the codebase.

---

## Out of scope (explicitly)

- **The landing page content itself** — see the landing-page brief. This brief only covers the nav that sits on the landing page.
- **The Approach page, Expertise page, About / Who we are page** — these exist (or will exist) as separate work; this brief only defines the nav linking to them.
- **The product page template** — the three product pages (PABLO, NZ:AI, decodED) get full templates in a separate brief. This brief only builds *stub* pages at the three routes.
- **The page-transition loader** — the line-drawn NZA mark animating between pages — separate brief.
- **The Our Work / case studies page** linked from "Who we work with" — separate brief.

---

## Acceptance criteria

A working implementation should pass all of these:

1. The two-line NZA logo (mark + NET ZERO / ADVISORY) renders correctly at the appropriate size on desktop and tablet
2. The logo's `#mark`, `#net`, `#zero`, and `#advisory` groups recolour correctly per page context
3. **On cream sections, ADVISORY appears in coral**; on decodED, ADVISORY appears in orange
4. The three nav items (Our products, About us, Who we work with) render in Stolzl on the right side of the nav
5. Hovering Our products or About us opens the respective dropdown with the correct items and styling
6. The Get in touch button uses the outlined treatment on dark backgrounds and the solid-filled treatment on light backgrounds
7. The CTA button colour matches the page accent (coral / violet / teal / orange)
8. The nav is sticky and remains visible at all times
9. The nav background adapts via `backdrop-filter` to the section beneath it as the user scrolls
10. The three product page stubs at `/pablo`, `/nz-ai`, `/decoded` exist with correct backgrounds, body classes, and placeholder content
11. The nav adapts correctly when navigating to each product page (logo recolour, CTA accent shift, background tint)
12. On mobile (<768px), the logo collapses to the mark-only circle and acts as the menu trigger
13. Tapping the mark opens the full-screen menu overlay with all nav items expanded flat
14. The Get in touch button is visible at the bottom of the mobile menu overlay
15. `prefers-reduced-motion` is respected — transitions reduce or become instant
16. All interactive elements have appropriate focus states, ARIA labels, and keyboard navigation

---

## Questions Claude Code should raise rather than guess

- Whether the existing `nza-logo-wide.svg` has the four groups named `#mark`, `#net`, `#zero`, `#advisory` already, or if they need renaming
- Whether the existing site already has body classes for context detection or whether this needs introducing
- The exact placeholder routes for `/contact`, `/clients`, and any others not yet built — confirm before linking
- Whether the existing nav (which this brief replaces) has any tracking/analytics events attached that need preserving
- Whether the existing Approach and Expertise pages already have the `context-cream` class (or equivalent) on their bodies, or if those need adding

---

*End of brief.*
