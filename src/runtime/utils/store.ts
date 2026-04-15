import type { ConsentStoreState } from 'c15t'
import { useNuxtApp } from '#app'

/**
 * Minimal store interface matching what zustand's StoreApi provides.
 * Defined locally to avoid a direct zustand dependency.
 */
export interface C15tStore {
  getState: () => ConsentStoreState
  setState: (partial: Partial<ConsentStoreState>) => void
  subscribe: (listener: (state: ConsentStoreState, prevState: ConsentStoreState) => void) => () => void
}

/**
 * Access the c15t store provided by the client plugin.
 * Returns null during SSR since consent is a client-only concern.
 */
export function useC15tStore(): C15tStore | null {
  const nuxtApp = useNuxtApp()
  return (nuxtApp.$c15tStore as C15tStore) ?? null
}
