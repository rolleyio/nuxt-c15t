import { describe, it, expect } from 'vitest'
import { parseC15tCookieValue, useC15tConsent } from '../src/runtime/server/utils/useC15tConsent'
import type { H3Event } from 'h3'

/**
 * Tests for the real parseC15tCookieValue implementation shipped in
 * src/runtime/server/utils/useC15tConsent.ts. Pointing at the source (not
 * a copy) means any drift in the cookie encoding will surface here.
 */

describe('parseC15tCookieValue', () => {
  it('parses empty string', () => {
    expect(parseC15tCookieValue('')).toEqual({})
  })

  it('parses string without colons as empty', () => {
    expect(parseC15tCookieValue('no-colons-here')).toEqual({})
  })

  it('parses simple key:value pairs', () => {
    const result = parseC15tCookieValue('c.necessary:1,c.marketing:0,c.measurement:1')
    expect(result).toEqual({
      consents: {
        necessary: true,
        marketing: false,
        measurement: true,
      },
    })
  })

  it('expands shortened keys', () => {
    const result = parseC15tCookieValue('c.necessary:1,i.ts:12345')
    expect(result).toEqual({
      consents: { necessary: true },
      consentInfo: { timestamp: '12345' },
    })
  })

  it('handles null values (empty string after colon)', () => {
    const result = parseC15tCookieValue('c.necessary:1,c.marketing:')
    expect(result).toEqual({
      consents: { necessary: true, marketing: null },
    })
  })

  it('handles non-boolean string values', () => {
    const result = parseC15tCookieValue('i.sid:abc-123')
    expect(result).toEqual({
      consentInfo: { subjectId: 'abc-123' },
    })
  })
})

/**
 * Minimal H3Event stub — we only exercise the cookie-reading paths.
 */
function makeEvent(cookieHeader: string): H3Event {
  return {
    node: {
      req: {
        headers: { cookie: cookieHeader },
      },
      res: {},
    },
    context: {},
  } as unknown as H3Event
}

describe('useC15tConsent (H3)', () => {
  it('returns empty consents when no cookie is present', () => {
    const { consents, has } = useC15tConsent(makeEvent(''))
    expect(consents).toEqual({})
    expect(has('necessary')).toBe(false)
  })

  it('reads consents from the c15t cookie', () => {
    const ev = makeEvent('c15t=' + encodeURIComponent('c.necessary:1,c.measurement:1,c.marketing:0'))
    const { consents, has } = useC15tConsent(ev)
    expect(consents).toEqual({ necessary: true, measurement: true, marketing: false })
    expect(has('necessary')).toBe(true)
    expect(has('marketing')).toBe(false)
  })

  it('evaluates OR / AND conditions', () => {
    const ev = makeEvent('c15t=' + encodeURIComponent('c.necessary:1,c.measurement:1,c.marketing:0'))
    const { has } = useC15tConsent(ev)
    expect(has({ or: ['marketing', 'measurement'] })).toBe(true)
    expect(has({ or: ['marketing', 'experience'] })).toBe(false)
    expect(has({ and: ['necessary', 'measurement'] })).toBe(true)
    expect(has({ and: ['necessary', 'marketing'] })).toBe(false)
  })

  it('ignores unrelated cookies', () => {
    const ev = makeEvent('foo=bar; baz=qux')
    const { consents } = useC15tConsent(ev)
    expect(consents).toEqual({})
  })
})
