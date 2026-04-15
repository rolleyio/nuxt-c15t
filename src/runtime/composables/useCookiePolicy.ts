import { computed } from 'vue'
import { useRuntimeConfig } from '#app'
import type { AllConsentNames } from 'c15t'
import { vendorRegistry } from '../utils/vendor-registry'
import type { CookieEntry, CookiePolicyConfig } from '../utils/types'

export interface CookiePolicyGroup {
  category: AllConsentNames
  label: string
  cookies: CookieEntry[]
}

const categoryLabels: Record<AllConsentNames, string> = {
  necessary: 'Strictly Necessary',
  functionality: 'Functionality',
  measurement: 'Measurement & Analytics',
  marketing: 'Marketing & Advertising',
  experience: 'Experience & Personalization',
}

/**
 * Returns resolved cookie policy data for rendering a cookie policy table.
 *
 * Merges cookies from declared vendors (via the vendor registry) with
 * any custom cookies defined in the module config, grouped by consent category.
 *
 * @example
 * ```vue
 * <script setup>
 * const { groups, allCookies } = useCookiePolicy()
 * </script>
 *
 * <template>
 *   <div v-for="group in groups" :key="group.category">
 *     <h3>{{ group.label }}</h3>
 *     <table>
 *       <tr v-for="cookie in group.cookies" :key="cookie.name">
 *         <td>{{ cookie.name }}</td>
 *         <td>{{ cookie.vendor }}</td>
 *         <td>{{ cookie.purpose }}</td>
 *         <td>{{ cookie.duration }}</td>
 *       </tr>
 *     </table>
 *   </div>
 * </template>
 * ```
 */
export function useCookiePolicy() {
  const config = useRuntimeConfig().public.c15t as { cookiePolicy: CookiePolicyConfig }
  const policyConfig = config.cookiePolicy ?? {}

  const allCookies = computed<CookieEntry[]>(() => {
    const cookies: CookieEntry[] = []

    // Resolve vendor cookies
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

    // Add custom cookies
    if (policyConfig.cookies?.length) {
      cookies.push(...policyConfig.cookies)
    }

    return cookies
  })

  const groups = computed<CookiePolicyGroup[]>(() => {
    const categoryOrder: AllConsentNames[] = ['necessary', 'functionality', 'measurement', 'marketing', 'experience']
    const result: CookiePolicyGroup[] = []

    for (const category of categoryOrder) {
      const cookies = allCookies.value.filter(c => c.category === category)
      if (cookies.length > 0) {
        result.push({
          category,
          label: categoryLabels[category],
          cookies,
        })
      }
    }

    return result
  })

  return {
    /** All resolved cookies (vendors + custom), flat */
    allCookies,
    /** Cookies grouped by consent category, with display labels */
    groups,
  }
}
