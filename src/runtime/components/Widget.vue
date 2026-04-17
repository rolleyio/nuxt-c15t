<script setup lang="ts">
import type { AllConsentNames, ConsentType } from 'c15t'
import { useC15t, ref, computed, onMounted, watch } from '#imports'

const {
  consents,
  translations,
  setSelectedConsent,
  saveConsents,
  getDisplayedConsents,
  isLoading,
} = useC15t()

const displayedConsents = ref<ConsentType[]>([])

function refresh() {
  displayedConsents.value = getDisplayedConsents() as ConsentType[]
}

onMounted(refresh)
watch(isLoading, (loading) => {
  if (!loading) refresh()
})

function toggle(name: AllConsentNames, value: boolean) {
  setSelectedConsent(name, value)
}

function saveCustom() {
  saveConsents('custom')
}

function acceptAll() {
  saveConsents('all')
}

function rejectAll() {
  saveConsents('necessary')
}

const t = computed(() => {
  const raw = translations.value as Record<string, Record<string, string>> | null
  return {
    title: raw?.consentManagerDialog?.title ?? 'Privacy Settings',
    description: raw?.consentManagerDialog?.description ?? 'Customize your privacy settings here.',
    save: raw?.common?.save ?? 'Save Settings',
    acceptAll: raw?.common?.acceptAll ?? 'Accept All',
    rejectAll: raw?.common?.rejectAll ?? 'Reject All',
  }
})

function consentTypeLabel(name: string) {
  const raw = translations.value as Record<string, Record<string, Record<string, string>>> | null
  return raw?.consentTypes?.[name]?.title ?? name
}

function consentTypeDescription(name: string) {
  const raw = translations.value as Record<string, Record<string, Record<string, string>>> | null
  return raw?.consentTypes?.[name]?.description ?? ''
}
</script>

<template>
  <div class="c15t-widget">
    <slot
      :displayed-consents="displayedConsents"
      :consents="consents"
      :translations="t"
      :toggle="toggle"
      :save-custom="saveCustom"
      :accept-all="acceptAll"
      :reject-all="rejectAll"
    >
      <div class="c15t-widget__header">
        <h3 class="c15t-widget__title">
          {{ t.title }}
        </h3>
        <p class="c15t-widget__description">
          {{ t.description }}
        </p>
      </div>

      <div class="c15t-widget__consents">
        <label
          v-for="ct in displayedConsents"
          :key="ct.name"
          class="c15t-widget-consent"
        >
          <input
            type="checkbox"
            class="c15t-widget-consent__checkbox"
            :checked="(consents as Record<string, boolean>)[ct.name]"
            :disabled="ct.disabled"
            @change="toggle(ct.name, ($event.target as HTMLInputElement).checked)"
          >
          <div class="c15t-widget-consent__text">
            <div class="c15t-widget-consent__label">
              {{ consentTypeLabel(ct.name) }}
            </div>
            <div class="c15t-widget-consent__description">
              {{ consentTypeDescription(ct.name) }}
            </div>
          </div>
        </label>
      </div>

      <div class="c15t-widget__actions">
        <button
          class="c15t-btn c15t-btn--secondary"
          @click="rejectAll"
        >
          {{ t.rejectAll }}
        </button>
        <button
          class="c15t-btn c15t-btn--secondary"
          @click="saveCustom"
        >
          {{ t.save }}
        </button>
        <button
          class="c15t-btn c15t-btn--primary"
          @click="acceptAll"
        >
          {{ t.acceptAll }}
        </button>
      </div>
    </slot>
  </div>
</template>

<style>
.c15t-widget {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 0.875rem;
  color: #111827;
}

.c15t-widget__header {
  margin-bottom: 1rem;
}

.c15t-widget__title {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 600;
}

.c15t-widget__description {
  margin: 0;
  color: #6b7280;
  font-size: 0.8125rem;
}

.c15t-widget__consents {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-bottom: 1.25rem;
}

.c15t-widget-consent {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
}

.c15t-widget-consent__checkbox {
  margin-top: 0.15rem;
}

.c15t-widget-consent__label {
  font-weight: 500;
}

.c15t-widget-consent__description {
  font-size: 0.8125rem;
  color: #6b7280;
  margin-top: 0.125rem;
}

.c15t-widget__actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}
</style>
