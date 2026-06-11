import { useMemo, useState } from 'react'
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

/**
 * PABLO Section 04 ("Test every option") - Energy Flows interventions.
 *
 * Per nza-pablo-sections-03-04-05-brief.md: a real interactive
 * widget where the visitor toggles Solar / Wind / Battery on and
 * off and watches the stacked area chart re-stack in real time.
 * NO auto-play - "the interactivity IS the animation."
 *
 * 168 hourly points (7 days x 24 hours). Stack order bottom-up:
 *   Solar -> Wind -> Battery (discharge) -> Grid Import
 * Demand line drawn on top.
 *
 * Toggle math per the brief:
 *   solarAtI    = state.solar    ? solarFull[i]    : 0
 *   windAtI     = state.wind     ? windFull[i]     : 0
 *   batteryAtI  = state.battery  ? batteryFull[i]  : 0
 *   gen         = max(0, solar) + max(0, wind) + max(0, battery)
 *   charging    = battery < 0 ? -battery : 0
 *   gridImport  = max(0, demand - gen) + charging
 *
 * Scenario summary below the chart updates live:
 *   Grid Import  weekly sum * 52 weeks    rounded to the nearest 10 MWh
 *   Annual Cost  Grid Import * GBP0.22/kWh   rounded to nearest GBP5k
 *   Self-Supply  gen / demand * 100        rounded to whole %
 *   "saved" tag  baseline cost - current   only shown when savings > GBP10k
 *
 * State label "INTERVENTION MODELLING" top-right per the brief's
 * universal rules.
 *
 * No reduced-motion handling needed - the chart only re-renders on
 * user input. Recharts' isAnimationActive can be left on; users who
 * prefer reduced motion just won't see the transitions but the
 * static state is fine.
 */

const N_POINTS = 168 // 7 days * 24 hours
const DAYS = 7
const HOURS_PER_DAY = 24

/* === SYNTHETIC PROFILES =============================================
   168-point arrays following the brief's shape rules. Generated
   deterministically at module load so React's strict-mode double
   render doesn't change the values. */

const DEMAND: number[] = (() => {
  const arr: number[] = []
  for (let i = 0; i < N_POINTS; i++) {
    const day = Math.floor(i / HOURS_PER_DAY) /* 0..6, Mon-Sun */
    const hour = i % HOURS_PER_DAY
    const isWeekend = day >= 5
    /* Bell-shaped daytime peak around 1-2pm, low overnight. Weekend
       reduced to ~half the peak. */
    const peak = isWeekend ? 25 : 55
    const baseline = isWeekend ? 7 : 12
    /* sin-based bell, peaks at hour 13.5. */
    const t = (hour - 13.5) / 6
    const profile = Math.max(0, 1 - t * t)
    /* Small jitter for organic feel. */
    const jitter = Math.sin(i * 0.7) * 1.2
    arr.push(Math.max(baseline, baseline + (peak - baseline) * profile + jitter))
  }
  return arr.map((v) => Math.round(v * 10) / 10)
})()

const SOLAR_FULL: number[] = (() => {
  const arr: number[] = []
  for (let i = 0; i < N_POINTS; i++) {
    const day = Math.floor(i / HOURS_PER_DAY)
    const hour = i % HOURS_PER_DAY
    /* Bell curve centred at noon. Solar only during daylight (6am - 8pm). */
    if (hour < 6 || hour > 20) {
      arr.push(0)
      continue
    }
    const peak = day === 3 ? 22 : 38 /* day 3 is cloudy (Thursday) */
    const t = (hour - 13) / 5
    const profile = Math.max(0, 1 - t * t)
    arr.push(peak * profile)
  }
  return arr.map((v) => Math.round(v * 10) / 10)
})()

const WIND_FULL: number[] = (() => {
  const arr: number[] = []
  for (let i = 0; i < N_POINTS; i++) {
    const day = Math.floor(i / HOURS_PER_DAY)
    const hour = i % HOURS_PER_DAY
    /* Variable - average 12 kW with sin-based variation. Stormy
       mid-week (day 2) bumps it up. */
    const baseline = day === 2 ? 22 : 12
    const variation = Math.sin(i * 0.5) * 5 + Math.cos(i * 0.31) * 3
    /* Slightly higher overnight. */
    const overnight = hour < 6 || hour > 22 ? 4 : 0
    arr.push(Math.max(0, baseline + variation + overnight))
  }
  return arr.map((v) => Math.round(v * 10) / 10)
})()

const BATTERY_FULL: number[] = (() => {
  const arr: number[] = []
  for (let i = 0; i < N_POINTS; i++) {
    const hour = i % HOURS_PER_DAY
    /* Charging early morning (2am-7am): negative 5-10 kW.
       Discharging evening peak (5pm-9pm): positive 15-20 kW.
       Idle other hours. */
    if (hour >= 2 && hour < 7) {
      arr.push(-(6 + Math.sin(i * 1.3) * 2))
    } else if (hour >= 17 && hour < 21) {
      arr.push(15 + Math.sin(i * 0.9) * 3)
    } else {
      arr.push(0)
    }
  }
  return arr.map((v) => Math.round(v * 10) / 10)
})()

/* X-axis ticks at the START of each day. */
const X_TICKS = Array.from({ length: DAYS }, (_, i) => i * HOURS_PER_DAY)
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const formatDay = (i: number) => DAY_LABELS[Math.floor(i / HOURS_PER_DAY)] ?? ''

const AXIS_TICK = {
  fontSize: 10,
  fill: 'rgba(26, 37, 64, 0.62)',
  fontFamily: 'Stolzl, system-ui, sans-serif',
  fontWeight: 300,
}

/* Baseline = everything off, grid import covers full demand. Used
   for the "saved" tag. */
const BASELINE_WEEKLY_GRID_KWH = DEMAND.reduce((s, v) => s + v, 0)
const BASELINE_ANNUAL_COST_GBP = BASELINE_WEEKLY_GRID_KWH * 52 * 0.22

/* === COMPONENT ====================================================== */

type ToggleState = { solar: boolean; wind: boolean; battery: boolean }

export function PabloSection04Animation(_props: {
  stepIndex: number
}) {
  /* All interventions start OFF per the brief - baseline state. */
  const [state, setState] = useState<ToggleState>({
    solar: false,
    wind: false,
    battery: false,
  })

  /* Per-hour data series for the chart. Recomputed when toggles
     change. Each row gives Recharts the four stacked layers plus
     the demand line value. */
  const data = useMemo(() => {
    return Array.from({ length: N_POINTS }, (_, i) => {
      const demand = DEMAND[i]
      const solarAtI = state.solar ? SOLAR_FULL[i] : 0
      const windAtI = state.wind ? WIND_FULL[i] : 0
      const batteryAtI = state.battery ? BATTERY_FULL[i] : 0
      const batteryDischarge = Math.max(0, batteryAtI)
      const batteryCharging = batteryAtI < 0 ? -batteryAtI : 0
      const gen = solarAtI + windAtI + batteryDischarge
      const gridImport = Math.max(0, demand - gen) + batteryCharging
      return {
        t: i,
        solar: solarAtI,
        wind: windAtI,
        batteryDischarge,
        gridImport,
        demand,
      }
    })
  }, [state])

  /* Weekly + annual aggregates for the scenario summary panel. */
  const summary = useMemo(() => {
    const weekGridKwh = data.reduce((s, r) => s + r.gridImport, 0)
    const annualGridKwh = weekGridKwh * 52
    const annualGridMwh = annualGridKwh / 1000
    const annualCostGbp = annualGridKwh * 0.22
    const weekDemandKwh = data.reduce((s, r) => s + r.demand, 0)
    const weekGenKwh = data.reduce(
      (s, r) => s + r.solar + r.wind + r.batteryDischarge,
      0,
    )
    const selfSupplyPct = weekDemandKwh > 0
      ? (weekGenKwh / weekDemandKwh) * 100
      : 0
    const savedAnnualGbp = BASELINE_ANNUAL_COST_GBP - annualCostGbp
    return {
      annualGridMwh: roundTo(annualGridMwh, 10), /* nearest 10 MWh */
      annualCostKgbp: roundTo(annualCostGbp / 1000, 5), /* nearest 5k */
      selfSupplyPct: Math.round(selfSupplyPct),
      savedAnnualKgbp: roundTo(savedAnnualGbp / 1000, 5),
    }
  }, [data])

  const showSaved = summary.savedAnnualKgbp >= 10

  return (
    <div className="pablo-s04">
      {/* State label */}
      <div
        className="pablo-s04-state-label is-in"
        aria-hidden="true"
      >
        <span className="pablo-s04-state-dot" />
        <span className="pablo-s04-state-text">INTERVENTION MODELLING</span>
      </div>

      <div className="pablo-s04-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 22, right: 18, bottom: 12, left: 0 }}
          >
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="rgba(26, 37, 64, 0.12)"
              vertical={false}
            />
            <XAxis
              dataKey="t"
              type="number"
              domain={[0, N_POINTS - 1]}
              ticks={X_TICKS}
              tickFormatter={formatDay}
              tick={AXIS_TICK}
              axisLine={false}
              tickLine={false}
              tickMargin={6}
              interval={0}
            />
            <YAxis
              domain={[0, 60]}
              ticks={[0, 20, 40, 60]}
              tickFormatter={(v: number) => `${v} kW`}
              tick={AXIS_TICK}
              axisLine={false}
              tickLine={false}
              width={50}
              tickMargin={4}
            />
            {/* Bottom-up stack: Solar -> Wind -> Battery discharge
                -> Grid Import. Each Area uses the same stackId. */}
            <Area
              dataKey="solar"
              stackId="flow"
              stroke="#F5C242"
              fill="#F5C242"
              fillOpacity={0.7}
              isAnimationActive={true}
              animationDuration={500}
            />
            <Area
              dataKey="wind"
              stackId="flow"
              stroke="#00AEEF"
              fill="#00AEEF"
              fillOpacity={0.6}
              isAnimationActive={true}
              animationDuration={500}
            />
            <Area
              dataKey="batteryDischarge"
              stackId="flow"
              stroke="#9B59B6"
              fill="#9B59B6"
              fillOpacity={0.6}
              isAnimationActive={true}
              animationDuration={500}
            />
            <Area
              dataKey="gridImport"
              stackId="flow"
              stroke="#95A5A6"
              fill="#95A5A6"
              fillOpacity={0.45}
              isAnimationActive={true}
              animationDuration={500}
            />
            {/* Demand line on top - traces actual building draw. */}
            <Line
              dataKey="demand"
              stroke="#1A2540"
              strokeWidth={1.6}
              dot={false}
              isAnimationActive={true}
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Toggle row - Demand is permanent / not clickable, the other
          three drive the chart re-stack on click. */}
      <div className="pablo-s04-toggles">
        <ToggleChip label="Demand" colour="#1A2540" active permanent />
        <ToggleChip
          label="Solar"
          colour="#F5C242"
          active={state.solar}
          onClick={() => setState((s) => ({ ...s, solar: !s.solar }))}
        />
        <ToggleChip
          label="Wind"
          colour="#00AEEF"
          active={state.wind}
          onClick={() => setState((s) => ({ ...s, wind: !s.wind }))}
        />
        <ToggleChip
          label="Battery"
          colour="#9B59B6"
          active={state.battery}
          onClick={() => setState((s) => ({ ...s, battery: !s.battery }))}
        />
      </div>

      {/* Summary panel - three metric cards live-updating with the
          toggle state. */}
      <div className="pablo-s04-summary">
        <SummaryCard
          label="Grid Import"
          value={`${summary.annualGridMwh.toLocaleString()} MWh`}
        />
        <SummaryCard
          label="Annual Cost"
          value={`£${summary.annualCostKgbp.toLocaleString()}k`}
          tag={
            showSaved
              ? `↓ £${summary.savedAnnualKgbp.toLocaleString()}k saved`
              : undefined
          }
        />
        <SummaryCard
          label="Self-Supply"
          value={`${summary.selfSupplyPct}%`}
        />
      </div>
    </div>
  )
}

/* === helpers ======================================================== */

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step
}

function ToggleChip({
  label,
  colour,
  active,
  permanent,
  onClick,
}: {
  label: string
  colour: string
  active: boolean
  permanent?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      className={
        'pablo-s04-toggle' +
        (active ? ' is-active' : '') +
        (permanent ? ' is-permanent' : '')
      }
      onClick={permanent ? undefined : onClick}
      aria-pressed={active}
      disabled={permanent}
      style={
        {
          ['--toggle-colour' as string]: colour,
        } as React.CSSProperties
      }
    >
      <span className="pablo-s04-toggle-swatch" />
      <span className="pablo-s04-toggle-label">{label}</span>
    </button>
  )
}

function SummaryCard({
  label,
  value,
  tag,
}: {
  label: string
  value: string
  tag?: string
}) {
  return (
    <div className="pablo-s04-summary-card">
      <div className="pablo-s04-summary-label">{label}</div>
      <div className="pablo-s04-summary-value">{value}</div>
      {tag && <div className="pablo-s04-summary-tag">{tag}</div>}
    </div>
  )
}
