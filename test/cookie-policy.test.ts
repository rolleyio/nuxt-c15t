import { describe, it, expect } from 'vitest'
import { vendorRegistry } from '../src/runtime/utils/vendor-registry'
import type { CookieEntry, CookiePolicyConfig } from '../src/runtime/utils/types'
import type { AllConsentNames } from 'c15t'

/**
 * Tests the cookie policy resolution logic (extracted from useCookiePolicy).
 * This tests the pure data transformation without Vue reactivity.
 */

const categoryLabels: Record<string, string> = {
  necessary: 'Strictly Necessary',
  functionality: 'Functionality',
  measurement: 'Measurement & Analytics',
  marketing: 'Marketing & Advertising',
  experience: 'Experience & Personalization',
}

interface CookiePolicyGroup {
  category: string
  label: string
  cookies: CookieEntry[]
}

function resolveCookiePolicy(config: CookiePolicyConfig) {
  const cookies: CookieEntry[] = []

  if (config.vendors?.length) {
    for (const vendorId of config.vendors) {
      const vendor = vendorRegistry.find(v => v.id === vendorId)
      if (vendor) {
        cookies.push(...vendor.cookies)
      }
    }
  }

  if (config.cookies?.length) {
    cookies.push(...config.cookies)
  }

  const categoryOrder: AllConsentNames[] = ['necessary', 'functionality', 'measurement', 'marketing', 'experience']
  const groups: CookiePolicyGroup[] = []

  for (const category of categoryOrder) {
    const catCookies = cookies.filter(c => c.category === category)
    if (catCookies.length > 0) {
      groups.push({
        category,
        label: categoryLabels[category] ?? category,
        cookies: catCookies,
      })
    }
  }

  return { allCookies: cookies, groups }
}

describe('cookie policy resolution', () => {
  it('resolves vendor cookies by ID', () => {
    const { allCookies } = resolveCookiePolicy({ vendors: ['google-analytics'] })
    expect(allCookies.length).toBeGreaterThan(0)
    expect(allCookies.every(c => c.vendor === 'Google Analytics')).toBe(true)
  })

  it('resolves multiple vendors', () => {
    const { allCookies } = resolveCookiePolicy({ vendors: ['google-analytics', 'meta-pixel'] })
    const vendors = new Set(allCookies.map(c => c.vendor))
    expect(vendors.has('Google Analytics')).toBe(true)
    expect(vendors.has('Meta')).toBe(true)
  })

  it('ignores unknown vendor IDs', () => {
    const { allCookies } = resolveCookiePolicy({ vendors: ['nonexistent-vendor'] })
    expect(allCookies).toHaveLength(0)
  })

  it('includes custom cookies', () => {
    const custom: CookieEntry = {
      name: 'session_id',
      vendor: 'This website',
      category: 'necessary',
      purpose: 'Session management',
      duration: 'Session',
      type: 'HTTP',
    }
    const { allCookies } = resolveCookiePolicy({ cookies: [custom] })
    expect(allCookies).toContainEqual(custom)
  })

  it('merges vendor and custom cookies', () => {
    const custom: CookieEntry = {
      name: 'theme',
      vendor: 'This website',
      category: 'functionality',
      purpose: 'Theme preference',
      duration: '1 year',
      type: 'HTML Local Storage',
    }
    const { allCookies } = resolveCookiePolicy({
      vendors: ['google-analytics'],
      cookies: [custom],
    })
    expect(allCookies.some(c => c.name === '_ga')).toBe(true)
    expect(allCookies.some(c => c.name === 'theme')).toBe(true)
  })

  it('groups cookies by category in correct order', () => {
    const { groups } = resolveCookiePolicy({
      vendors: ['google-analytics', 'meta-pixel', 'stripe'],
    })
    const categories = groups.map(g => g.category)
    // necessary (stripe) should come before measurement (GA) which should come before marketing (Meta)
    expect(categories.indexOf('necessary')).toBeLessThan(categories.indexOf('measurement'))
    expect(categories.indexOf('measurement')).toBeLessThan(categories.indexOf('marketing'))
  })

  it('applies correct labels to groups', () => {
    const { groups } = resolveCookiePolicy({ vendors: ['google-analytics'] })
    const measurementGroup = groups.find(g => g.category === 'measurement')
    expect(measurementGroup?.label).toBe('Measurement & Analytics')
  })

  it('omits empty categories', () => {
    const { groups } = resolveCookiePolicy({ vendors: ['google-analytics'] })
    // GA only has measurement cookies, so no marketing/necessary/etc groups
    expect(groups).toHaveLength(1)
    expect(groups[0].category).toBe('measurement')
  })

  it('returns empty results for empty config', () => {
    const { allCookies, groups } = resolveCookiePolicy({})
    expect(allCookies).toHaveLength(0)
    expect(groups).toHaveLength(0)
  })
})
