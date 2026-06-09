/**
 * Singleton signal for the landing preloader's dismissal state.
 *
 * MaskReveal instances on the LandingHero opt into "wait for the
 * preloader to clear before revealing" via the `waitForPreloader`
 * prop. They check `preloaderState.dismissed` synchronously on mount
 * (in case the preloader has already dismissed - e.g., when the user
 * returns to / after visiting /pablo or /nz-ai), and listen for the
 * `nza:preloader-dismissed` window event in case it hasn't yet.
 *
 * The LandingPreloader component is responsible for two things:
 *   1. Resetting `preloaderState.dismissed = false` on mount, so a
 *      fresh visit to / re-enables the wait.
 *   2. Setting `preloaderState.dismissed = true` AND dispatching the
 *      `nza:preloader-dismissed` window event when it dismisses
 *      (either via the auto-timeout or a manual scroll/touch/key).
 *
 * Putting this in a module-level singleton (rather than React context)
 * keeps the API trivial - any component can import and read the flag
 * or listen for the event without prop-drilling.
 */
export const preloaderState = {
  dismissed: false,
}

export const PRELOADER_DISMISSED_EVENT = 'nza:preloader-dismissed'
