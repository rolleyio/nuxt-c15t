import type { AllConsentNames, PolicyConfig } from 'c15t'

export type { PolicyConfig } from 'c15t'

/**
 * Offline-mode policy configuration. Mirrors c15t's OfflinePolicyConfig,
 * restricted to the JSON-serializable subset that survives runtimeConfig.
 *
 * Ignored when `mode !== 'offline'`. In hosted mode the backend resolves
 * the appropriate pack based on visitor location.
 *
 * @see https://c15t.com/docs/frameworks/javascript/policy-packs
 */
export interface PolicyPackModuleConfig {
  /**
   * Policy packs evaluated in offline mode using region > country > default
   * precedence. Use `policyPackPresets` from `c15t` to get built-in
   * GDPR / CCPA / etc. packs, or provide your own `PolicyConfig[]`.
   *
   * @example
   * ```ts
   * import { policyPackPresets } from 'c15t'
   *
   * c15t: {
   *   mode: 'offline',
   *   policyPacks: [
   *     policyPackPresets.europeOptIn(),
   *     policyPackPresets.californiaOptOut(),
   *     policyPackPresets.worldNoBanner(),
   *   ],
   * }
   * ```
   */
  policyPacks: PolicyConfig[]
}

/**
 * A single cookie entry in the cookie policy table.
 */
export interface CookieEntry {
  /** Cookie name or pattern (e.g. '_ga', '_fbp') */
  name: string
  /** Who sets this cookie */
  vendor: string
  /** Consent category this cookie belongs to */
  category: AllConsentNames
  /** Human-readable purpose */
  purpose: string
  /** Retention period (e.g. '2 years', 'Session', '30 minutes') */
  duration: string
  /** Cookie type */
  type: 'HTTP' | 'HTML Local Storage' | 'Pixel' | 'IndexedDB'
}

/**
 * A known vendor in the cookie registry.
 */
export interface VendorDefinition {
  /** Vendor identifier (e.g. 'google-analytics', 'meta-pixel') */
  id: string
  /** Display name (e.g. 'Google Analytics') */
  name: string
  /** Privacy policy URL */
  privacyPolicyUrl: string
  /** Cookies this vendor sets */
  cookies: CookieEntry[]
}

/**
 * Cookie policy configuration in nuxt.config.
 */
export interface CookiePolicyConfig {
  /**
   * Vendor IDs to include in the cookie policy table.
   * Each must match a VendorDefinition.id in the registry.
   * @example ['google-analytics', 'meta-pixel', 'posthog']
   */
  vendors?: string[]

  /**
   * Custom cookies to include alongside vendor cookies.
   * Use this for first-party cookies (session, auth, etc.)
   */
  cookies?: CookieEntry[]
}

/**
 * Translation overrides for consent UI text.
 * Keyed by language code (e.g. 'en', 'de', 'fr').
 */
export interface TranslationConfig {
  /** Translation strings keyed by language code */
  translations?: Record<string, Record<string, unknown>>
  /** Default language code */
  defaultLanguage?: string
  /** Disable automatic language detection from browser */
  disableAutoLanguageSwitch?: boolean
}

/**
 * Resolved runtime config passed via runtimeConfig.public.c15t
 */
export interface C15tRuntimeConfig {
  mode: 'hosted' | 'offline' | 'self-hosted'
  backendURL: string
  consentCategories: AllConsentNames[]
  countryOverride: string
  iframeBlocking: boolean
  policyPacks: PolicyConfig[] | null
  cookiePolicy: CookiePolicyConfig
  translations: TranslationConfig
  prefetchScript: boolean
}
