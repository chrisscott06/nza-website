/**
 * Six placeholder icons for the Approach grid. Lifted verbatim from
 * nza-website.html lines 1148-1239. Lucide-style line icons, 1.2 stroke.
 */
const baseProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.2',
} as const

export function CapEstateIcon() {
  return (
    <svg {...baseProps}>
      <rect x="3" y="13" width="5" height="8" />
      <rect x="10" y="9" width="6" height="12" />
      <rect x="18" y="11" width="4" height="10" />
      <rect x="3" y="3" width="4" height="7" />
      <rect x="16" y="3" width="5" height="5" />
      <path d="M2 21h20" />
    </svg>
  )
}

export function CapEnergyIcon() {
  return (
    <svg {...baseProps}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5v17" />
    </svg>
  )
}

export function CapFinanceIcon() {
  return (
    <svg {...baseProps}>
      <path d="M4 18V8m4 10V5m4 13V9m4 9V6" />
      <path d="M4 13l4-3 4 4 4-5 4 2" />
    </svg>
  )
}

export function CapCarbonIcon() {
  return (
    <svg {...baseProps}>
      <path d="M4 20V14m4 6V10m4 10V7m4 10v-5" />
      <path d="M3 16l4-4 4 2 4-6 4 1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 20h18" />
    </svg>
  )
}

export function CapClimateIcon() {
  return (
    <svg {...baseProps}>
      <path d="M2 13c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" strokeLinecap="round" />
      <path d="M2 17c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" strokeLinecap="round" />
      <path d="M12 3v5M9 5l3-2 3 2" />
    </svg>
  )
}

export function CapPlatformsIcon() {
  return (
    <svg {...baseProps}>
      <rect x="3.5" y="3.5" width="7" height="7" />
      <rect x="13.5" y="3.5" width="7" height="7" />
      <rect x="3.5" y="13.5" width="7" height="7" />
      <rect x="13.5" y="13.5" width="7" height="7" />
    </svg>
  )
}

export function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export const CAPABILITY_ICONS = [
  CapEstateIcon,
  CapEnergyIcon,
  CapFinanceIcon,
  CapCarbonIcon,
  CapClimateIcon,
  CapPlatformsIcon,
] as const
