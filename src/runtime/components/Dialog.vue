<script setup lang="ts">
import type { AllConsentNames, ConsentType } from 'c15t'
import { useC15t, ref, computed, watch } from '#imports'

const {
  activeUI,
  consents,
  translations,
  setSelectedConsent,
  saveConsents,
  setActiveUI,
  getDisplayedConsents,
} = useC15t()

const displayedConsents = ref<ConsentType[]>([])

watch(activeUI, (ui) => {
  if (ui === 'dialog') {
    displayedConsents.value = getDisplayedConsents() as ConsentType[]
  }
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

function closeDialog() {
  setActiveUI('none')
}

const t = computed(() => {
  const raw = translations.value as Record<string, Record<string, string>> | null
  return {
    title: raw?.consentManagerDialog?.title ?? 'Privacy Settings',
    description: raw?.consentManagerDialog?.description ?? 'Customize your privacy settings here.',
    save: raw?.common?.save ?? 'Save Settings',
    acceptAll: raw?.common?.acceptAll ?? 'Accept All',
    close: raw?.common?.close ?? 'Close',
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
  <Teleport to="body">
    <div
      v-if="activeUI === 'dialog'"
      role="dialog"
      aria-label="Cookie preferences"
    >
      <slot
        :displayed-consents="displayedConsents"
        :consents="consents"
        :translations="t"
        :toggle="toggle"
        :save-custom="saveCustom"
        :accept-all="acceptAll"
        :close="closeDialog"
      >
        <div
          class="c15t-dialog__backdrop"
          @click.self="closeDialog"
        >
          <div class="c15t-dialog">
            <div class="c15t-dialog__header">
              <h2 class="c15t-dialog__title">
                {{ t.title }}
              </h2>
              <button
                class="c15t-dialog__close"
                :aria-label="t.close"
                @click="closeDialog"
              >
                &times;
              </button>
            </div>

            <p class="c15t-dialog__description">
              {{ t.description }}
            </p>

            <div class="c15t-dialog__consents">
              <label
                v-for="ct in displayedConsents"
                :key="ct.name"
                class="c15t-consent"
              >
                <input
                  type="checkbox"
                  class="c15t-consent__checkbox"
                  :checked="(consents as Record<string, boolean>)[ct.name]"
                  :disabled="ct.disabled"
                  @change="toggle(ct.name, ($event.target as HTMLInputElement).checked)"
                >
                <div class="c15t-consent__text">
                  <div class="c15t-consent__label">
                    {{ consentTypeLabel(ct.name) }}
                  </div>
                  <div class="c15t-consent__description">
                    {{ consentTypeDescription(ct.name) }}
                  </div>
                </div>
              </label>
            </div>

            <div class="c15t-dialog__actions">
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
          </div>
        </div>
      </slot>
    </div>
  </Teleport>
</template>

<style>
.c15t-dialog__backdrop {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 0.875rem;
}

.c15t-dialog {
  background: #fff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  max-width: 32rem;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.c15t-dialog__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.c15t-dialog__title {
  margin: 0;
  font-size: 1.125rem;
  color: #111827;
}

.c15t-dialog__close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  color: #6b7280;
  line-height: 1;
  padding: 0.25rem;
}

.c15t-dialog__description {
  color: #6b7280;
  margin: 0 0 1rem;
}

.c15t-dialog__consents {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.c15t-dialog__actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.c15t-consent {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
}

.c15t-consent__checkbox {
  margin-top: 0.15rem;
}

.c15t-consent__label {
  font-weight: 500;
  color: #111827;
}

.c15t-consent__description {
  font-size: 0.8125rem;
  color: #6b7280;
  margin-top: 0.125rem;
}
</style>
