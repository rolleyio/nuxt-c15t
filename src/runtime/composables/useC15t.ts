import { computed, ref, onMounted, onScopeDispose } from 'vue'
import type { AllConsentNames, ConsentState, ConsentStoreState, ActiveUI, HasCondition, TranslationConfig } from 'c15t'
import { has as evaluateCondition, detectBrowserLanguage } from 'c15t'
import { useRuntimeConfig } from '#app'
import { useC15tStore } from '../utils/store'
import type { C15tRuntimeConfig } from '../utils/types'

/** Resolved translation strings for the active language */
export interface ResolvedTranslations {
  common: {
    acceptAll: string
    rejectAll: string
    customize: string
    save: string
    close: string
    [key: string]: string
  }
  cookieBanner: {
    title: string
    description: string
    [key: string]: string
  }
  consentManagerDialog: {
    title: string
    description: string
    [key: string]: string
  }
  consentTypes: Record<string, { title: string; description: string }>
  [key: string]: unknown
}

/** Default English translations used during SSR and before store initialises */
const defaultTranslations: ResolvedTranslations = {
  common: {
    acceptAll: 'Accept All',
    rejectAll: 'Reject All',
    customize: 'Customize',
    save: 'Save Settings',
    close: 'Close',
  },
  cookieBanner: {
    title: 'We value your privacy',
    description: 'This site uses cookies to improve your browsing experience, analyze site traffic, and show personalized content.',
  },
  consentManagerDialog: {
    title: 'Privacy Settings',
    description: 'Customize your privacy settings here. You can choose which types of cookies and tracking technologies you allow.',
  },
  consentTypes: {
    necessary: { title: 'Strictly Necessary', description: 'These cookies are essential for the website to function properly and cannot be disabled.' },
    functionality: { title: 'Functionality', description: 'These cookies enable enhanced functionality and personalization of the website.' },
    marketing: { title: 'Marketing', description: 'These cookies are used to deliver relevant advertisements and track their effectiveness.' },
    measurement: { title: 'Analytics', description: 'These cookies help us understand how visitors interact with the website and improve its performance.' },
    experience: { title: 'Experience', description: 'These cookies help us provide a better user experience and test new features.' },
  },
}

// Module-level shared state — single source of truth across all useC15t() calls.
// Safe because the plugin is client-only; on the server these stay at defaults.
const consents = ref<Partial<ConsentState>>({})
const activeUI = ref<ActiveUI>('none')
const isLoading = ref(true)
const hasConsented = ref(false)
const translationConfig = ref<TranslationConfig | null>(null)
const activeLanguage = ref<string | undefined>(undefined)

// Track subscription so only one is active at a time
let unsubscribe: (() => void) | undefined
let subscriberCount = 0

/**
 * Primary composable for c15t consent management.
 *
 * Provides reactive consent state and actions for checking, granting,
 * and revoking consent categories.
 *
 * All state is shared across components — calling useC15t() in multiple
 * components returns the same reactive refs.
 *
 * @example
 * ```vue
 * <script setup>
 * const { consents, has, saveConsents, activeUI, setActiveUI } = useC15t()
 *
 * // Check a single category
 * const hasMeasurement = has('measurement')
 *
 * // Accept all
 * function acceptAll() {
 *   saveConsents('all')
 * }
 * </script>
 * ```
 */
export function useC15t() {
  const config = useRuntimeConfig().public.c15t as C15tRuntimeConfig
  const configuredCategories = config.consentCategories
  const store = useC15tStore()

  function filterConsents(raw: ConsentState): Partial<ConsentState> {
    const filtered: Partial<ConsentState> = {}
    for (const key of configuredCategories) {
      if (key in raw) {
        filtered[key] = raw[key]
      }
    }
    return filtered
  }

  function sync(state: ConsentStoreState) {
    consents.value = filterConsents(state.consents)
    activeUI.value = state.activeUI
    isLoading.value = state.isLoadingConsentInfo
    hasConsented.value = state.hasConsented()
    translationConfig.value = state.translationConfig ?? null
    console.log('[c15t:sync] translationConfig languages:', Object.keys(state.translationConfig?.translations || {}), 'activeLanguage:', activeLanguage.value)
  }

  // Reference-count the subscription so it stays alive as long as any
  // component using useC15t() is mounted, and cleans up when the last unmounts.
  onMounted(() => {
    if (!store) return

    subscriberCount++
    if (subscriberCount === 1) {
      unsubscribe = store.subscribe(sync)
    }
    // Always sync on mount so late-mounting components get current state
    sync(store.getState())
  })

  onScopeDispose(() => {
    subscriberCount--
    if (subscriberCount === 0) {
      unsubscribe?.()
      unsubscribe = undefined
    }
  })

  /**
   * Resolved translations for the active language.
   * Components use this to render localised text.
   * Falls back to built-in English defaults during SSR or before store init.
   */
  const translations = computed<ResolvedTranslations>(() => {
    const tc = translationConfig.value
    if (!tc?.translations) return defaultTranslations

    // activeLanguage from setLanguage() takes priority, then auto-detect
    const lang = activeLanguage.value ?? detectBrowserLanguage(
      tc.translations,
      tc.defaultLanguage,
      tc.disableAutoLanguageSwitch,
    )
    const t = tc.translations[lang]
    if (!t) return defaultTranslations

    return {
      common: { ...defaultTranslations.common, ...t.common },
      cookieBanner: { ...defaultTranslations.cookieBanner, ...t.cookieBanner },
      consentManagerDialog: { ...defaultTranslations.consentManagerDialog, ...t.consentManagerDialog },
      consentTypes: { ...defaultTranslations.consentTypes, ...t.consentTypes },
    } as ResolvedTranslations
  })

  /**
   * Reactive check for a consent condition.
   * Re-evaluates whenever consent state changes.
   */
  function has(condition: HasCondition<AllConsentNames>) {
    return computed(() => {
      const current = consents.value
      if (!Object.keys(current).length) return false
      return evaluateCondition(condition, current as ConsentState)
    })
  }

  /**
   * Save consent preferences.
   * @param type - 'all' accepts everything, 'necessary' accepts only required, 'custom' saves current selection
   */
  async function saveConsents(type: 'all' | 'custom' | 'necessary') {
    await store?.getState().saveConsents(type)
  }

  /**
   * Set consent for a specific category and immediately persist.
   */
  function setConsent(name: AllConsentNames, value: boolean) {
    store?.getState().setConsent(name, value)
  }

  /**
   * Update selected consent without saving (for dialog checkboxes).
   */
  function setSelectedConsent(name: AllConsentNames, value: boolean) {
    store?.getState().setSelectedConsent(name, value)
  }

  /**
   * Control which consent UI is active.
   */
  function setActiveUI(ui: ActiveUI, options?: { force?: boolean }) {
    store?.getState().setActiveUI(ui, options)
  }

  /**
   * Reset all consents to defaults.
   */
  function resetConsents() {
    store?.getState().resetConsents()
  }

  /**
   * Get the consent types that should be displayed to the user.
   */
  function getDisplayedConsents() {
    return store?.getState().getDisplayedConsents() ?? []
  }

  /**
   * Change the active language for consent UI translations.
   */
  function setLanguage(language: string) {
    activeLanguage.value = language
    store?.getState().setLanguage(language)
  }

  return {
    /** Reactive consent state object */
    consents,
    /** Which UI is currently active: 'none' | 'banner' | 'dialog' */
    activeUI,
    /** Whether consent info is still loading */
    isLoading,
    /** Whether the user has given any form of consent */
    hasConsented,
    /** Resolved translations for the active language */
    translations,
    /** Check a consent condition reactively */
    has,
    /** Save consents ('all', 'necessary', or 'custom') */
    saveConsents,
    /** Set a single consent and auto-save */
    setConsent,
    /** Update selected consent without saving */
    setSelectedConsent,
    /** Control which UI is shown */
    setActiveUI,
    /** Reset all consents */
    resetConsents,
    /** Get displayable consent types */
    getDisplayedConsents,
    /** Change the active UI language */
    setLanguage,
  }
}
