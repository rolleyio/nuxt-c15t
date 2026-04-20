import type { H3Event } from 'h3'
import { getHeader, parseCookies } from 'h3'
import type { AllConsentNames } from 'c15t'

/**
 * Shorthand map used by c15t's cookie encoding. If c15t changes this encoding
 * (it hasn't in any 2.x release so far) the `server-consent.test.ts` round-trip
 * test will fail loudly.
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

/**
 * Parse the compact `key:value,key:value` payload c15t writes into the cookie.
 * Exported so tests can exercise it directly.
 */
export function parseC15tCookieValue(raw: string): Record<string, unknown> {
  if (!raw.includes(':')) return {}

  const flat: Record<string, string> = {}
  for (const pair of raw.split(',')) {
    const colonIndex = pair.indexOf(':')
    if (colonIndex === -1) continue
    flat[pair.substring(0, colonIndex)] = pair.substring(colonIndex + 1)
  }

  const expanded: Record<string, string> = {}
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.')
    const expandedParts = parts.map(k => REVERSE_KEY_MAP[k] || k)
    expanded[expandedParts.join('.')] = value
  }

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

export type ConsentCondition = AllConsentNames | { or: AllConsentNames[] } | { and: AllConsentNames[] }

export interface ServerConsentReader {
  consents: Record<string, boolean>
  has(condition: ConsentCondition): boolean
}

/**
 * Server-side reader for consent state from the request cookie.
 *
 * Auto-imported in server routes/middleware/API handlers. Works with h3's
 * event object — pass it explicitly, or rely on Nuxt's request context.
 *
 * @example
 * ```ts
 * // server/middleware/analytics.ts
 * export default defineEventHandler((event) => {
 *   const consent = useC15tConsent(event)
 *   if (consent.has('measurement')) {
 *     // inject analytics
 *   }
 * })
 * ```
 */
export function useC15tConsent(event: H3Event): ServerConsentReader {
  let consents: Record<string, boolean> = {}

  // Prefer h3's parseCookies (handles encoding) but fall back to raw header
  // if needed — some middleware configurations strip cookies from `event.node.req`.
  let raw: string | undefined
  try {
    raw = parseCookies(event).c15t
  }
  catch {
    const header = getHeader(event, 'cookie') ?? ''
    const match = header.split(';').find(c => c.trim().startsWith('c15t='))
    if (match) {
      raw = decodeURIComponent(match.trim().substring(5))
    }
  }

  if (raw) {
    const parsed = parseC15tCookieValue(raw)
    const rawConsents = parsed.consents as Record<string, boolean> | undefined
    if (rawConsents) {
      consents = rawConsents
    }
  }

  function has(condition: ConsentCondition): boolean {
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

  return { consents, has }
}
