import type { AllConsentNames, NetworkBlockerConfig } from 'c15t'

export type { NetworkBlockerConfig } from 'c15t'

/** A single domain rule for the network blocker. */
export type NetworkBlockerRule = NetworkBlockerConfig['rules'][number]

/** Information about a blocked network request. */
export type BlockedRequestInfo = Parameters<NonNullable<NetworkBlockerConfig['onRequestBlocked']>>[0]

/**
 * Serializable subset of NetworkBlockerConfig that can live in nuxt.config.
 * The `onRequestBlocked` callback is registered at runtime via
 * `setNetworkBlocker()` from useC15t().
 */
export interface NetworkBlockerModuleConfig {
  /** Whether blocking is active. @default true */
  enabled?: boolean
  /** Log each blocked request to the console. @default true */
  logBlockedRequests?: boolean
  /** Domain rules that gate outgoing requests by consent category. */
  rules: NetworkBlockerRule[]
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
  networkBlocker: NetworkBlockerModuleConfig | null
  cookiePolicy: CookiePolicyConfig
  translations: TranslationConfig
  prefetchScript: boolean
}
