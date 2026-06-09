import { ClientsStrip } from '../components/ClientsStrip'

/**
 * Standalone Clients section - cream marquee in its own scroll slot.
 *
 * On the current homepage flow (May 2026 onward) the marquee lives
 * INSIDE the landing screen as a thin strip at the bottom, so this
 * standalone section isn't part of the main `/` flow anymore. Kept
 * around in case a future surface wants the cream marquee as its
 * own block (e.g. on a /clients overview page).
 */
export function ClientsScreen() {
  return (
    <section
      className="screen canvas-paper clients-slider-screen"
      id="clients"
      data-screen-label="Clients"
    >
      <ClientsStrip variant="standalone" />
    </section>
  )
}
