import { defineNuxtModule, addPlugin, addImportsDir, addComponentsDir, createResolver } from '@nuxt/kit'
import type { CookiePolicyConfig, PolicyConfig, TranslationConfig } from './runtime/utils/types'

export interface ModuleOptions {
  /**
   * c15t backend mode.
   * - 'hosted': Use consent.io managed backend (recommended)
   * - 'offline': Browser-local storage only, no backend
   * - 'self-hosted': Your own c15t backend instance
   */
  mode: 'hosted' | 'offline' | 'self-hosted'

  /**
   * Backend URL for hosted or self-hosted mode.
   * e.g. 'https://my-instance.c15t.dev'
   */
  backendURL?: string

  /**
   * Consent categories to present to the user.
   * @default ['necessary', 'measurement', 'marketing']
   */
  consentCategories?: Array<'necessary' | 'functionality' | 'measurement' | 'marketing' | 'experience'>

  /**
   * Override the detected country code, bypassing geo-detection.
   * Useful in dev/test to simulate specific jurisdictions.
   * @example 'DE' — always show GDPR banner
   */
  countryOverride?: string

  /**
   * Enable iframe blocking. Iframes with data-category="marketing"
   * etc. will be blocked until consent is granted.
   * @default true
   */
  iframeBlocking?: boolean

  /**
   * Regional policy packs evaluated in offline mode.
   * Each pack defines the consent model (opt-in / opt-out / none), categories,
   * and UI to show for a matched country/region. c15t picks the first
   * matching pack using region > country > default precedence.
   *
   * Ignored when `mode !== 'offline'`. In hosted mode the backend resolves
   * the appropriate pack based on visitor location.
   *
   * Use `policyPackPresets` from `c15t` for built-in packs (GDPR, CCPA,
   * Quebec, IAB TCF, no-banner fallback) or provide custom `PolicyConfig[]`.
   *
   * @example
   * ```ts
   * import { policyPackPresets } from 'c15t'
   *
   * export default defineNuxtConfig({
   *   c15t: {
   *     mode: 'offline',
   *     policyPacks: [
   *       policyPackPresets.europeOptIn(),
   *       policyPackPresets.californiaOptOut(),
   *       policyPackPresets.worldNoBanner(),
   *     ],
   *   },
   * })
   * ```
   *
   * @see https://c15t.com/docs/frameworks/javascript/policy-packs
   */
  policyPacks?: PolicyConfig[]

  /**
   * Enable Nuxt Scripts integration.
   * Adds useC15tScriptTrigger() composable for consent-gated script loading.
   * @default true (if @nuxt/scripts is installed)
   */
  nuxtScripts?: boolean

  /**
   * Cookie policy table configuration.
   * Drives the <C15tCookiePolicy> component and useCookiePolicy() composable.
   */
  cookiePolicy?: CookiePolicyConfig

  /**
   * Translation overrides for consent UI text.
   * Merged with c15t's built-in English translations.
   * @example
   * ```ts
   * translations: {
   *   translations: {
   *     de: {
   *       common: { acceptAll: 'Alle akzeptieren' },
   *       cookieBanner: { title: 'Datenschutz' },
   *     },
   *   },
   *   defaultLanguage: 'de',
   * }
   * ```
   */
  translations?: TranslationConfig

  /**
   * Inject a prefetch script into <head> that starts the consent API
   * request early, before the main JS bundle loads. Only applies to
   * hosted/self-hosted modes.
   * @default true
   */
  prefetchScript?: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-c15t',
    configKey: 'c15t',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },

  defaults: {
    mode: 'hosted',
    iframeBlocking: true,
    nuxtScripts: true,
    prefetchScript: true,
  },

  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Validate config
    if (options.mode !== 'offline' && !options.backendURL) {
      console.warn('[nuxt-c15t] No backendURL provided. Falling back to offline mode.')
      options.mode = 'offline'
    }

    // Pass options to runtime via runtimeConfig.
    // Use Object.assign to replace (not defu-merge) the config, so arrays
    // aren't concatenated with stale defaults and new keys aren't dropped.
    nuxt.options.runtimeConfig.public.c15t = Object.assign(
      nuxt.options.runtimeConfig.public.c15t || {},
      {
        mode: options.mode,
        backendURL: options.backendURL ?? '',
        consentCategories: options.consentCategories ?? ['necessary', 'measurement', 'marketing'],
        countryOverride: options.countryOverride ?? '',
        iframeBlocking: options.iframeBlocking ?? true,
        policyPacks: options.policyPacks && options.policyPacks.length > 0 ? options.policyPacks : null,
        cookiePolicy: options.cookiePolicy ?? {},
        translations: options.translations ?? {},
        prefetchScript: options.prefetchScript ?? true,
      },
    )

    // Register client-only plugin (c15t is entirely client-side)
    addPlugin({
      src: resolver.resolve('./runtime/plugin.client'),
      mode: 'client',
    })

    // Auto-import composables
    addImportsDir(resolver.resolve('./runtime/composables'))

    // Auto-import components
    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      prefix: 'C15t',
    })
  },
})
