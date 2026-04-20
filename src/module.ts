import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import {
  defineNuxtModule,
  addPlugin,
  addImportsDir,
  addServerImportsDir,
  addComponentsDir,
  addRouteMiddleware,
  addTemplate,
  addTypeTemplate,
  addServerHandler,
  createResolver,
  hasNuxtModule,
} from '@nuxt/kit'
import type { CookiePolicyConfig, NetworkBlockerModuleConfig, TranslationConfig } from './runtime/utils/types'

export interface ModuleOptions {
  /**
   * c15t backend mode.
   * - 'hosted': consent.io managed backend
   * - 'offline': browser-local storage, no backend
   * - 'self-hosted': your own c15t backend instance
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
   * Block outgoing network requests (fetch + XMLHttpRequest) that target
   * third-party tracking endpoints until the matching consent category is
   * granted. Complements iframe and script blocking by catching beacons
   * fired from already-loaded code.
   *
   * To register an `onRequestBlocked` callback, call `setNetworkBlocker()`
   * from `useC15t()` at runtime — nuxt.config values must be serializable.
   *
   * @example
   * ```ts
   * networkBlocker: {
   *   rules: [
   *     { id: 'ga', domain: 'google-analytics.com', category: 'measurement' },
   *     { id: 'fb', domain: 'facebook.com', category: 'marketing', pathIncludes: '/tr' },
   *   ],
   * }
   * ```
   */
  networkBlocker?: NetworkBlockerModuleConfig

  /**
   * Enable Nuxt Scripts integration. Only takes effect when
   * @nuxt/scripts is installed.
   * @default true
   */
  nuxtScripts?: boolean

  /**
   * Cookie policy table configuration.
   * Drives the <C15tCookiePolicy> component and useCookiePolicy() composable.
   */
  cookiePolicy?: CookiePolicyConfig

  /**
   * Translation overrides for consent UI text.
   * Merged with c15t's built-in English translations at runtime.
   *
   * Large translation bundles are shipped via a virtual template
   * (not runtimeConfig) so they can be tree-shaken and don't bloat
   * the SSR payload.
   */
  translations?: TranslationConfig

  /**
   * Inject a prefetch script into <head> that starts the consent API
   * request early, before the main JS bundle loads. Only applies to
   * hosted/self-hosted modes.
   * @default true
   */
  prefetchScript?: boolean

  /**
   * CSP nonce to apply to the injected prefetch <script>. Required when
   * running under a strict Content-Security-Policy without 'unsafe-inline'.
   *
   * Can be a static string, or `true` to read the nonce from
   * runtimeConfig.public.cspNonce at request time.
   */
  cspNonce?: string | true

  /**
   * Expose a server proxy at /api/c15t/* forwarding to backendURL.
   * Use when you want all consent traffic to go through your own origin
   * (e.g. to avoid third-party cookies). Off by default.
   * @default false
   */
  serverProxy?: boolean

  /**
   * Base path for the server proxy. Only applies when serverProxy is enabled.
   * @default '/api/c15t'
   */
  serverProxyPath?: string
}

// Runtime hook contracts — exposed so other modules can type-check their hook handlers.
export interface ModuleRuntimeHooks {
  /** Fires once on the client when the c15t store is ready. */
  'c15t:ready': (ctx: { mode: 'hosted' | 'offline' | 'self-hosted' }) => void | Promise<void>
}

export interface ModuleBuildHooks {
  /** Fires during module setup, allowing other modules to mutate options. */
  'c15t:config': (options: ModuleOptions) => void | Promise<void>
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
    serverProxy: false,
    serverProxyPath: '/api/c15t',
  },

  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Let other modules mutate our options before we resolve them.
    // @ts-expect-error — hook name is added via module augmentation below.
    await nuxt.callHook('c15t:config', options)

    // Validate config
    if (options.mode !== 'offline' && !options.backendURL) {
      console.warn('[nuxt-c15t] No backendURL provided. Falling back to offline mode.')
      options.mode = 'offline'
    }

    // Read our own package version — plugin was hardcoding '1.0.0'.
    const pkgUrl = fileURLToPath(new URL('../package.json', import.meta.url))
    const pkg = JSON.parse(readFileSync(pkgUrl, 'utf8')) as { version: string }

    // Runtime config — kept small. Translations live in a virtual template
    // so they don't inflate the SSR payload (they can be large per-language).
    nuxt.options.runtimeConfig.public.c15t = Object.assign(
      nuxt.options.runtimeConfig.public.c15t || {},
      {
        mode: options.mode,
        backendURL: options.backendURL ?? '',
        consentCategories: options.consentCategories ?? ['necessary', 'measurement', 'marketing'],
        countryOverride: options.countryOverride ?? '',
        iframeBlocking: options.iframeBlocking ?? true,
        networkBlocker: options.networkBlocker ?? null,
        cookiePolicy: options.cookiePolicy ?? {},
        prefetchScript: options.prefetchScript ?? true,
        version: pkg.version,
        cspNonce: options.cspNonce === true ? '' : (options.cspNonce ?? ''),
        readCspNonceFromRuntimeConfig: options.cspNonce === true,
        scriptsIntegration: Boolean(options.nuxtScripts && hasNuxtModule('@nuxt/scripts')),
        serverProxy: Boolean(options.serverProxy),
        serverProxyPath: options.serverProxyPath ?? '/api/c15t',
      },
    )

    // Virtual template for translations. Code does:
    //   import { translations } from '#build/nuxt-c15t-translations.mjs'
    addTemplate({
      filename: 'nuxt-c15t-translations.mjs',
      write: true,
      getContents: () => {
        const t = options.translations ?? {}
        return `export const translations = ${JSON.stringify(t)}\nexport default translations\n`
      },
    })

    // Client plugin (c15t runtime is client-only).
    addPlugin({
      src: resolver.resolve('./runtime/plugin.client'),
      mode: 'client',
    })

    // Auto-import composables (app scope).
    addImportsDir(resolver.resolve('./runtime/composables'))

    // Auto-import the server-side composable (Nitro scope).
    addServerImportsDir(resolver.resolve('./runtime/server/utils'))

    // Auto-import components.
    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      prefix: 'C15t',
    })

    // Optional route middleware for gating pages by consent. Not registered
    // as global — users opt in per-page via definePageMeta({ middleware: 'c15t-consent' })
    // or via route rules.
    addRouteMiddleware({
      name: 'c15t-consent',
      path: resolver.resolve('./runtime/middleware/c15t-consent'),
      global: false,
    })

    // Opt-in server proxy to avoid cross-origin cookie issues.
    if (options.serverProxy) {
      if (options.mode === 'offline' || !options.backendURL) {
        console.warn('[nuxt-c15t] serverProxy is enabled but mode is offline or backendURL is missing. Proxy will not be registered.')
      }
      else {
        const proxyPath = options.serverProxyPath ?? '/api/c15t'
        addServerHandler({
          route: `${proxyPath}/**`,
          handler: resolver.resolve('./runtime/server/handlers/proxy'),
        })
      }
    }

    // Devtools integration — register a custom tab pointing at our runtime page.
    // Hook isn't in NuxtHooks' public type but is dispatched at runtime by @nuxt/devtools.
    // @ts-expect-error — devtools hook lives outside the core NuxtHooks type.
    nuxt.hook('devtools:customTabs', (tabs: Array<Record<string, unknown>>) => {
      tabs.push({
        name: 'nuxt-c15t',
        title: 'c15t Consent',
        icon: 'carbon:policy',
        view: {
          type: 'iframe',
          src: '/__c15t_devtools',
        },
      })
    })
    // Register a plain server handler that renders a small devtools page
    // — only mounted in dev.
    if (nuxt.options.dev) {
      addServerHandler({
        route: '/__c15t_devtools',
        handler: resolver.resolve('./runtime/server/handlers/devtools'),
      })
    }

    // Augment types:
    //   - NuxtConfig/NuxtOptions.c15t (config-key autocomplete)
    //   - NuxtApp.$c15tStore (runtime injection)
    //   - RuntimeHooks for c15t:config / c15t:ready
    addTypeTemplate({
      filename: 'types/nuxt-c15t.d.ts',
      getContents: () => `// Auto-generated by nuxt-c15t
import type { ModuleOptions, ModuleBuildHooks, ModuleRuntimeHooks } from 'nuxt-c15t'
import type { C15tStore } from 'nuxt-c15t/runtime/utils/store'

declare module '@nuxt/schema' {
  interface NuxtConfig {
    c15t?: Partial<ModuleOptions>
  }
  interface NuxtOptions {
    c15t?: ModuleOptions
  }
  interface NuxtHooks extends ModuleBuildHooks {}
  interface RuntimeNuxtHooks extends ModuleRuntimeHooks {}
}

declare module '#app' {
  interface NuxtApp {
    $c15tStore: C15tStore | null
  }
  interface RuntimeNuxtHooks extends ModuleRuntimeHooks {}
}

export {}
`,
    })
  },
})
