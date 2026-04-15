import { computed, shallowRef, onMounted, onScopeDispose } from '#imports'
import type { AllConsentNames, ConsentStoreState, ActiveUI, HasCondition } from 'c15t'
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

  const consents = computed(() => storeState.value?.consents ?? {})
  const activeUI = computed<ActiveUI>(() => storeState.value?.activeUI ?? 'none')
  const isLoading = computed(() => storeState.value?.isLoadingConsentInfo ?? true)
  const hasConsented = computed(() => storeState.value?.hasConsented() ?? false)

  const translations = computed(() => {
    const tc = storeState.value?.translationConfig
    if (!tc?.translations) return null
    const lang = storeState.value?.overrides?.language ?? tc.defaultLanguage ?? 'en'
    return tc.translations[lang] ?? tc.translations.en ?? null
  })

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

  return {
    allConsentNames,
    consents,
    activeUI,
    isLoading,
    hasConsented,
    translations,
    has,
    saveConsents,
    setConsent,
    setSelectedConsent,
    setActiveUI,
    resetConsents,
    getDisplayedConsents,
    setLanguage,
  }
}
