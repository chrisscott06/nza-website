/**
 * Step-icon glyphs for the product page template's four-step section.
 *
 * Tabler-style outline icons rendered inline as <svg>. Used a hand-built
 * set rather than adding tabler-icons as a dependency since each icon
 * appears in exactly one place + the brief lists the specific glyphs
 * needed across the three products.
 *
 * All icons are 24x24 viewBox, stroke-only (the wrapper applies
 * stroke-width + colour). Each icon is exported by Tabler-style key
 * (e.g. `ti-map`, `ti-bolt`) so the configs can reference them by
 * the same string the brief specifies.
 */

import type { ReactNode } from 'react'

const ICONS: Record<string, ReactNode> = {
  // ============================================================
  // PABLO step icons
  // ============================================================
  'ti-map': (
    <>
      <path d="M3 7l6 -3l6 3l6 -3v13l-6 3l-6 -3l-6 3v-13" />
      <path d="M9 4v13" />
      <path d="M15 7v13" />
    </>
  ),
  'ti-bolt': (
    <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11z" />
  ),
  'ti-currency-pound': (
    <>
      <path d="M17 6.072a4 4 0 0 0 -4 -2.072a4 4 0 0 0 -4 4v8a4 4 0 0 1 -2 4h12" />
      <path d="M7 13h6" />
    </>
  ),
  'ti-rocket': (
    <>
      <path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3" />
      <path d="M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3" />
      <circle cx="15" cy="9" r="1" />
    </>
  ),
  // ============================================================
  // NZ:AI step icons
  // ============================================================
  'ti-map-2': (
    <>
      <path d="M9 4v13" />
      <path d="M15 7v5.5" />
      <path d="M3 7l6 -3l6 3l6 -3v10" />
      <path d="M16 22l5 -5" />
      <path d="M21 21.5v-4.5h-4.5" />
    </>
  ),
  'ti-target': (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  'ti-list-check': (
    <>
      <path d="M3.5 5.5l1.5 1.5l2.5 -2.5" />
      <path d="M3.5 11.5l1.5 1.5l2.5 -2.5" />
      <path d="M3.5 17.5l1.5 1.5l2.5 -2.5" />
      <path d="M11 6l9 0" />
      <path d="M11 12l9 0" />
      <path d="M11 18l9 0" />
    </>
  ),
  'ti-chart-line': (
    <>
      <path d="M4 19l16 0" />
      <path d="M4 15l4 -6l4 2l4 -5l4 4" />
    </>
  ),
  // ============================================================
  // decodED step icons
  // ============================================================
  'ti-map-pin': (
    <>
      <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
      <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
    </>
  ),
  'ti-building': (
    <>
      <path d="M3 21l18 0" />
      <path d="M9 8l1 0" />
      <path d="M9 12l1 0" />
      <path d="M9 16l1 0" />
      <path d="M14 8l1 0" />
      <path d="M14 12l1 0" />
      <path d="M14 16l1 0" />
      <path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16" />
    </>
  ),
  'ti-chart-pie': (
    <>
      <path d="M10 3.2a9 9 0 1 0 10.8 10.8a1 1 0 0 0 -1 -1h-6.8a2 2 0 0 1 -2 -2v-7a.9 .9 0 0 0 -1 -.8" />
      <path d="M15 3.5a9 9 0 0 1 5.5 5.5h-4.5a1 1 0 0 1 -1 -1v-4.5" />
    </>
  ),
  'ti-list-numbers': (
    <>
      <path d="M11 6h9" />
      <path d="M11 12h9" />
      <path d="M12 18h8" />
      <path d="M4 16a2 2 0 1 1 4 0c0 .591 -.5 1 -1 1.5l-3 2.5h4" />
      <path d="M6 10v-6l-2 2" />
    </>
  ),
}

export function ProductIcon({ name }: { name: string }) {
  const icon = ICONS[name]
  if (!icon) return null
  return (
    <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
      {icon}
    </svg>
  )
}
