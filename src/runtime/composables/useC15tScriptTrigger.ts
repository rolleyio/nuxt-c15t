import { onScopeDispose } from 'vue'
import type { AllConsentNames, HasCondition } from 'c15t'
import { useC15tStore } from '../utils/store'

/**
 * Returns a Nuxt Scripts-compatible trigger that resolves when consent
 * for the given category is granted.
 *
 * @param condition - Consent condition to satisfy (e.g. 'measurement', { or: ['measurement', 'marketing'] })
 * @returns A Promise<void> that resolves when consent is granted — compatible with useScript's `trigger` option
 *
 * @example
 * ```ts
 * import { useScript } from '#imports'
 *
 * useScript('https://www.googletagmanager.com/gtm.js?id=GTM-XXXX', {
 *   trigger: useC15tScriptTrigger('measurement'),
 * })
 *
 * useScript('https://connect.facebook.net/en_US/fbevents.js', {
 *   trigger: useC15tScriptTrigger('marketing'),
 * })
 * ```
 */
export function useC15tScriptTrigger(condition: HasCondition<AllConsentNames>): Promise<void> {
  const store = useC15tStore()

  // SSR: return a never-resolving promise (scripts don't load on the server)
  if (!store) {
    return new Promise<void>(() => {})
  }

  // Already granted — resolve immediately
  if (store.getState().has(condition)) {
    return Promise.resolve()
  }

  let resolve: (() => void) | undefined
  const promise = new Promise<void>((r) => { resolve = r })

  const unsubscribe = store.subscribe(() => {
    if (store.getState().has(condition)) {
      resolve?.()
      unsubscribe()
    }
  })

  onScopeDispose(unsubscribe)

  return promise
}
