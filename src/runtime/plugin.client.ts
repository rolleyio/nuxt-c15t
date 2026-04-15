import { defineNuxtPlugin, useRuntimeConfig, useHead } from '#app'
import { getOrCreateConsentRuntime, mergeTranslationConfigs, buildPrefetchScript } from 'c15t'
import type { C15tStore } from './utils/store'
import type { C15tRuntimeConfig } from './utils/types'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public.c15t as C15tRuntimeConfig

  const modeConfig = config.mode === 'offline'
    ? { mode: 'offline' as const }
    : { mode: 'hosted' as const, backendURL: config.backendURL }

  const { consentStore } = getOrCreateConsentRuntime({
    ...modeConfig,
    consentCategories: config.consentCategories,
    ...(config.countryOverride && { overrides: { country: config.countryOverride } }),
    iframeBlockerConfig: config.iframeBlocking ? {} : { disableAutomaticBlocking: true },
  }, {
    pkg: 'nuxt-c15t',
    version: '1.0.0',
  })

  // Apply custom translations once the store finishes async init.
  // Can't pass at init time — getOrCreateConsentRuntime doesn't merge them.
  // Can't apply synchronously — initConsentManager resets translationConfig.
  if (config.translations?.translations && Object.keys(config.translations.translations).length > 0) {
    const customTranslations = config.translations
    const customLangs = Object.keys(customTranslations.translations!)

    // Re-apply custom translations whenever the store re-inits (e.g. after
    // setLanguage triggers initConsentManager which resets translationConfig).
    // Only apply if our languages are missing — prevents infinite loops.
    consentStore.subscribe((state) => {
      if (state.isLoadingConsentInfo) return
      const currentLangs = Object.keys(state.translationConfig?.translations || {})
      const missing = customLangs.some(l => !currentLangs.includes(l))
      if (missing) {
        const merged = mergeTranslationConfigs(state.translationConfig, customTranslations)
        consentStore.getState().setTranslationConfig(merged)
      }
    })
  }

  // Inject prefetch script for hosted/self-hosted modes
  if (config.prefetchScript && config.mode !== 'offline' && config.backendURL) {
    const scriptContent = buildPrefetchScript({
      backendURL: config.backendURL,
      ...(config.countryOverride && { overrides: { country: config.countryOverride } }),
    })
    useHead({
      script: [{ innerHTML: scriptContent, tagPosition: 'head' }],
    })
  }

  return {
    provide: {
      c15tStore: consentStore as unknown as C15tStore,
    },
  }
})
