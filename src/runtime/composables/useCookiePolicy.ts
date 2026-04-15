import { computed } from '#imports'
import { useRuntimeConfig } from '#app'
import { allConsentNames } from 'c15t'
import type { AllConsentNames } from 'c15t'
import { useC15t } from './useC15t'
import { vendorRegistry } from '../utils/vendor-registry'
import type { CookieEntry, CookiePolicyConfig } from '../utils/types'

export interface CookiePolicyGroup {
  category: AllConsentNames
  label: string
  cookies: CookieEntry[]
}

/**
 * Returns resolved cookie policy data for rendering a cookie policy table.
 *
 * Merges cookies from declared vendors (via the vendor registry) with
 * any custom cookies defined in the module config, grouped by consent category.
 * Category labels come from c15t's translations.
 */
export function useCookiePolicy() {
  const config = useRuntimeConfig().public.c15t as { cookiePolicy: CookiePolicyConfig }
  const policyConfig = config.cookiePolicy ?? {}
  const { translations } = useC15t()

  const allCookies = computed<CookieEntry[]>(() => {
    const cookies: CookieEntry[] = []

    if (policyConfig.vendors?.length) {
      for (const vendorId of policyConfig.vendors) {
        const vendor = vendorRegistry.find(v => v.id === vendorId)
        if (vendor) {
          cookies.push(...vendor.cookies)
        }
        else if (import.meta.dev) {
          console.warn(`[nuxt-c15t] Unknown vendor "${vendorId}" in cookiePolicy.vendors. Available: ${vendorRegistry.map(v => v.id).join(', ')}`)
        }
      }
    }

    if (policyConfig.cookies?.length) {
      cookies.push(...policyConfig.cookies)
    }

    return cookies
  })

  const groups = computed<CookiePolicyGroup[]>(() => {
    const result: CookiePolicyGroup[] = []

    // Read labels from c15t's translations
    const raw = translations.value as Record<string, Record<string, Record<string, string>>> | null
    const consentTypes = raw?.consentTypes

    for (const category of allConsentNames) {
      const cookies = allCookies.value.filter(c => c.category === category)
      if (cookies.length > 0) {
        result.push({
          category,
          label: consentTypes?.[category]?.title ?? category,
          cookies,
        })
      }
    }

    return result
  })

  return {
    allCookies,
    groups,
  }
}
