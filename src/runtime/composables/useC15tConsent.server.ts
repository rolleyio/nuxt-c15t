import type { AllConsentNames } from 'c15t'
import { useRequestHeaders } from '#app'

/**
 * Cookie key shorthand map used by c15t's cookie encoding.
 */
const REVERSE_KEY_MAP: Record<string, string> = {
  c: 'consents',
  i: 'consentInfo',
  ts: 'timestamp',
  t: 'time',
  y: 'type',
  id: 'id',
  sid: 'subjectId',
  eid: 'externalId',
  mpf: 'materialPolicyFingerprint',
  idp: 'identityProvider',
}

function parseCookieValue(raw: string): Record<string, unknown> {
  if (!raw.includes(':')) return {}

  // Parse "key:value,key:value" format
  const flat: Record<string, string> = {}
  for (const pair of raw.split(',')) {
    const colonIndex = pair.indexOf(':')
    if (colonIndex === -1) continue
    flat[pair.substring(0, colonIndex)] = pair.substring(colonIndex + 1)
  }

  // Expand shortened keys
  const expanded: Record<string, string> = {}
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.')
    const expandedParts = parts.map(k => REVERSE_KEY_MAP[k] || k)
    expanded[expandedParts.join('.')] = value
  }

  // Unflatten into nested object
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(expanded)) {
    const keys = key.split('.')
    let current: Record<string, unknown> = result
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i]!
      if (!current[k]) current[k] = {}
      current = current[k] as Record<string, unknown>
    }
    const lastKey = keys[keys.length - 1]!
    if (value === '1') current[lastKey] = true
    else if (value === '0') current[lastKey] = false
    else if (value === '') current[lastKey] = null
    else current[lastKey] = value
  }

  return result
}

/**
 * Server-side composable to read consent state from the request cookie.
 *
 * Use this in server routes, middleware, or SSR rendering to check
 * consent without the full c15t client runtime.
 *
 * @example
 * ```ts
 * // server/middleware/analytics.ts
 * export default defineEventHandler((event) => {
 *   const consent = useC15tConsent()
 *   if (consent.has('measurement')) {
 *     // inject analytics
 *   }
 * })
 * ```
 */
export function useC15tConsent() {
  const headers = useRequestHeaders(['cookie'])
  const cookieHeader = headers.cookie ?? ''

  // Parse the c15t cookie
  let consents: Record<string, boolean> = {}
  const match = cookieHeader.split(';').find(c => c.trim().startsWith('c15t='))
  if (match) {
    const value = match.trim().substring(5) // after "c15t="
    const parsed = parseCookieValue(decodeURIComponent(value))
    const rawConsents = parsed.consents as Record<string, boolean> | undefined
    if (rawConsents) {
      consents = rawConsents
    }
  }

  function has(condition: AllConsentNames | { or: AllConsentNames[] } | { and: AllConsentNames[] }): boolean {
    if (typeof condition === 'string') {
      return consents[condition] === true
    }
    if ('or' in condition) {
      return condition.or.some(c => consents[c] === true)
    }
    if ('and' in condition) {
      return condition.and.every(c => consents[c] === true)
    }
    return false
  }

  return {
    consents,
    has,
  }
}
