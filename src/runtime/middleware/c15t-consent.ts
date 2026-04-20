import type { AllConsentNames, HasCondition } from 'c15t'
import { defineNuxtRouteMiddleware, navigateTo, useRequestEvent } from '#app'
import { useC15t } from '../composables/useC15t'
import { useC15tConsent } from '../server/utils/useC15tConsent'

/**
 * Route middleware that blocks navigation unless the required consent is granted.
 *
 * Page-level usage:
 * ```ts
 * definePageMeta({
 *   middleware: 'c15t-consent',
 *   c15t: { require: 'measurement', redirect: '/privacy' },
 * })
 * ```
 *
 * - Server: reads the c15t cookie from the request.
 * - Client: reads the reactive consent store.
 * - If no `c15t.require` is set on the route, the middleware is a no-op.
 */
export default defineNuxtRouteMiddleware((to) => {
  const meta = (to.meta as { c15t?: { require?: HasCondition<AllConsentNames>, redirect?: string } }).c15t
  if (!meta?.require) return

  const condition = meta.require
  let granted = false

  if (import.meta.server) {
    const event = useRequestEvent()
    if (event) {
      granted = useC15tConsent(event).has(condition as never)
    }
  }
  else {
    const { has } = useC15t()
    granted = has(condition).value
  }

  if (!granted) {
    return navigateTo(meta.redirect ?? '/')
  }
})
