import { computed, shallowRef, onMounted, onScopeDispose } from '#imports'
import type { AllConsentNames, ConsentStoreState, ActiveUI, HasCondition, NetworkBlockerConfig } from 'c15t'
import { has as evaluateCondition, allConsentNames } from 'c15t'
import { useC15tStore } from '../utils/store'

// Single reactive snapshot of the store state, shared across all useC15t() calls.
const storeState = shallowRef<ConsentStoreState | null>(null)

let unsubscribe: (() => void) | undefined
let subscriberCount = 0

/**
 * Primary composable for c15t consent management.
 *
 * Thin reactive wrapper around c15t's consent store.
 * All state comes directly from c15t.
 */
export function useC15t() {
  const store = useC15tStore()

  onMounted(() => {
    if (!store) return

    subscriberCount++
    if (subscriberCount === 1) {
      unsubscribe = store.subscribe(() => {
        storeState.value = store.getState()
      })
    }
    storeState.value = store.getState()
  })

  onScopeDispose(() => {
    subscriberCount--
    if (subscriberCount === 0) {
      unsubscribe?.()
      unsubscribe = undefined
    }
  })

  // --- Reactive state (computed from store snapshot) ---

  const consents = computed(() => storeState.value?.consents ?? {})
  const activeUI = computed<ActiveUI>(() => storeState.value?.activeUI ?? 'none')
  const isLoading = computed(() => storeState.value?.isLoadingConsentInfo ?? true)
  const hasConsented = computed(() => storeState.value?.hasConsented() ?? false)
  const consentTypes = computed<ConsentStoreState['consentTypes']>(() => storeState.value?.consentTypes ?? [])
  const legalLinks = computed<ConsentStoreState['legalLinks'] | null>(() => storeState.value?.legalLinks ?? null)
  const locationInfo = computed<ConsentStoreState['locationInfo']>(() => storeState.value?.locationInfo ?? null)
  const consentInfo = computed(() => storeState.value?.consentInfo as { time: number, subjectId: string, externalId?: string | null, type: string } | null ?? null)

  const translations = computed(() => {
    const tc = storeState.value?.translationConfig
    if (!tc?.translations) return null
    const lang = storeState.value?.overrides?.language ?? tc.defaultLanguage ?? 'en'
    return tc.translations[lang] ?? tc.translations.en ?? null
  })

  // --- Methods ---

  function has(condition: HasCondition<AllConsentNames>) {
    return computed(() => {
      const current = storeState.value?.consents
      if (!current) return false
      return evaluateCondition(condition, current)
    })
  }

  async function saveConsents(type: 'all' | 'custom' | 'necessary') {
    await store?.getState().saveConsents(type)
  }

  function setConsent(name: AllConsentNames, value: boolean) {
    store?.getState().setConsent(name, value)
  }

  function setSelectedConsent(name: AllConsentNames, value: boolean) {
    store?.getState().setSelectedConsent(name, value)
  }

  function setActiveUI(ui: ActiveUI, options?: { force?: boolean }) {
    store?.getState().setActiveUI(ui, options)
  }

  function resetConsents() {
    store?.getState().resetConsents()
  }

  function getDisplayedConsents() {
    return store?.getState().getDisplayedConsents() ?? []
  }

  function setLanguage(language: string) {
    store?.getState().setLanguage(language)
  }

  function identifyUser(user: { id: string, identityProvider?: string }) {
    store?.getState().identifyUser(user)
  }

  function onConsentChanged(listener: (payload: unknown) => void) {
    return store?.getState().subscribeToConsentChanges(listener) ?? (() => {})
  }

  function setNetworkBlocker(config: NetworkBlockerConfig | undefined) {
    store?.getState().setNetworkBlocker(config)
  }

  return {
    allConsentNames,
    // Reactive state
    consents,
    activeUI,
    isLoading,
    hasConsented,
    consentTypes,
    legalLinks,
    locationInfo,
    consentInfo,
    translations,
    // Methods
    has,
    saveConsents,
    setConsent,
    setSelectedConsent,
    setActiveUI,
    resetConsents,
    getDisplayedConsents,
    setLanguage,
    identifyUser,
    onConsentChanged,
    setNetworkBlocker,
  }
}
