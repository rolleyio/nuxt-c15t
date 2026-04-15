import { describe, it, expect } from 'vitest'
import { vendorRegistry } from '../src/runtime/utils/vendor-registry'

describe('vendorRegistry', () => {
  it('contains expected vendors', () => {
    const ids = vendorRegistry.map(v => v.id)
    expect(ids).toContain('google-analytics')
    expect(ids).toContain('meta-pixel')
    expect(ids).toContain('hotjar')
    expect(ids).toContain('stripe')
  })

  it('every vendor has a unique id', () => {
    const ids = vendorRegistry.map(v => v.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every vendor has at least one cookie', () => {
    for (const vendor of vendorRegistry) {
      expect(vendor.cookies.length, `${vendor.id} has no cookies`).toBeGreaterThan(0)
    }
  })

  it('every cookie has required fields', () => {
    for (const vendor of vendorRegistry) {
      for (const cookie of vendor.cookies) {
        expect(cookie.name, `cookie in ${vendor.id} missing name`).toBeTruthy()
        expect(cookie.vendor, `${cookie.name} missing vendor`).toBeTruthy()
        expect(cookie.category, `${cookie.name} missing category`).toBeTruthy()
        expect(cookie.purpose, `${cookie.name} missing purpose`).toBeTruthy()
        expect(cookie.duration, `${cookie.name} missing duration`).toBeTruthy()
        expect(cookie.type, `${cookie.name} missing type`).toBeTruthy()
      }
    }
  })

  it('every cookie type is a valid value', () => {
    const validTypes = ['HTTP', 'HTML Local Storage', 'Pixel', 'IndexedDB']
    for (const vendor of vendorRegistry) {
      for (const cookie of vendor.cookies) {
        expect(validTypes, `${cookie.name} has invalid type: ${cookie.type}`).toContain(cookie.type)
      }
    }
  })

  it('every cookie category is a valid consent name', () => {
    const validCategories = ['necessary', 'functionality', 'measurement', 'marketing', 'experience']
    for (const vendor of vendorRegistry) {
      for (const cookie of vendor.cookies) {
        expect(validCategories, `${cookie.name} has invalid category: ${cookie.category}`).toContain(cookie.category)
      }
    }
  })

  it('every vendor has a privacy policy URL', () => {
    for (const vendor of vendorRegistry) {
      expect(vendor.privacyPolicyUrl, `${vendor.id} missing privacy policy URL`).toMatch(/^https:\/\//)
    }
  })
})
