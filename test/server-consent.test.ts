import { describe, it, expect } from 'vitest'

/**
 * Tests the cookie parsing logic from useC15tConsent.server.ts
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

function hasConsent(
  consents: Record<string, boolean>,
  condition: string | { or: string[] } | { and: string[] },
): boolean {
  if (typeof condition === 'string') return consents[condition] === true
  if ('or' in condition) return condition.or.some(c => consents[c] === true)
  if ('and' in condition) return condition.and.every(c => consents[c] === true)
  return false
}

describe('cookie parsing', () => {
  it('parses empty string', () => {
    expect(parseCookieValue('')).toEqual({})
  })

  it('parses string without colons as empty', () => {
    expect(parseCookieValue('no-colons-here')).toEqual({})
  })

  it('parses simple key:value pairs', () => {
    const result = parseCookieValue('c.necessary:1,c.marketing:0,c.measurement:1')
    expect(result).toEqual({
      consents: {
        necessary: true,
        marketing: false,
        measurement: true,
      },
    })
  })

  it('expands shortened keys', () => {
    const result = parseCookieValue('c.necessary:1,i.ts:12345')
    expect(result).toEqual({
      consents: { necessary: true },
      consentInfo: { timestamp: '12345' },
    })
  })

  it('handles null values (empty string after colon)', () => {
    const result = parseCookieValue('c.necessary:1,c.marketing:')
    expect(result).toEqual({
      consents: { necessary: true, marketing: null },
    })
  })

  it('handles non-boolean string values', () => {
    const result = parseCookieValue('i.sid:abc-123')
    expect(result).toEqual({
      consentInfo: { subjectId: 'abc-123' },
    })
  })
})

describe('server-side has()', () => {
  const consents = { necessary: true, measurement: true, marketing: false }

  it('checks single category', () => {
    expect(hasConsent(consents, 'necessary')).toBe(true)
    expect(hasConsent(consents, 'measurement')).toBe(true)
    expect(hasConsent(consents, 'marketing')).toBe(false)
  })

  it('checks OR condition', () => {
    expect(hasConsent(consents, { or: ['measurement', 'marketing'] })).toBe(true)
    expect(hasConsent(consents, { or: ['marketing', 'functionality'] })).toBe(false)
  })

  it('checks AND condition', () => {
    expect(hasConsent(consents, { and: ['necessary', 'measurement'] })).toBe(true)
    expect(hasConsent(consents, { and: ['measurement', 'marketing'] })).toBe(false)
  })

  it('handles unknown categories as false', () => {
    expect(hasConsent(consents, 'experience')).toBe(false)
  })

  it('handles empty consents', () => {
    expect(hasConsent({}, 'necessary')).toBe(false)
    expect(hasConsent({}, { or: ['necessary'] })).toBe(false)
  })
})
