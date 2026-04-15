<script setup lang="ts">
import { ref, watch } from 'vue'
import type { AllConsentNames, ConsentType } from 'c15t'
import { useC15t } from '#imports'

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
        :translations="translations"
        :toggle="toggle"
        :save-custom="saveCustom"
        :accept-all="acceptAll"
        :close="closeDialog"
      >
        <!-- Fallback: minimal unstyled preferences dialog -->
        <div
          style="
            position: fixed;
            inset: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.4);
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 0.875rem;
          "
          @click.self="closeDialog"
        >
          <div
            style="
              background: #fff;
              border-radius: 0.75rem;
              padding: 1.5rem;
              max-width: 32rem;
              width: 100%;
              max-height: 80vh;
              overflow-y: auto;
              box-shadow: 0 20px 40px rgba(0,0,0,0.15);
            "
          >
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h2 style="margin: 0; font-size: 1.125rem; color: #111827;">
                {{ translations.consentManagerDialog.title }}
              </h2>
              <button
                style="background: none; border: none; cursor: pointer; font-size: 1.25rem; color: #6b7280;"
                :aria-label="translations.common.close"
                @click="closeDialog"
              >
                &times;
              </button>
            </div>

            <p style="color: #6b7280; margin: 0 0 1rem;">
              {{ translations.consentManagerDialog.description }}
            </p>

            <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
              <label
                v-for="ct in displayedConsents"
                :key="ct.name"
                style="
                  display: flex;
                  align-items: flex-start;
                  gap: 0.75rem;
                  padding: 0.75rem;
                  border: 1px solid #e5e7eb;
                  border-radius: 0.5rem;
                "
              >
                <input
                  type="checkbox"
                  :checked="consents[ct.name]"
                  :disabled="ct.disabled"
                  style="margin-top: 0.15rem;"
                  @change="toggle(ct.name, ($event.target as HTMLInputElement).checked)"
                >
                <div>
                  <div style="font-weight: 500; color: #111827;">
                    {{ translations.consentTypes[ct.name]?.title ?? ct.description }}
                  </div>
                  <div style="font-size: 0.8125rem; color: #6b7280; margin-top: 0.125rem;">
                    {{ translations.consentTypes[ct.name]?.description ?? '' }}
                  </div>
                  <div
                    v-if="ct.disabled"
                    style="font-size: 0.75rem; color: #9ca3af; margin-top: 0.125rem;"
                  >
                    Always active
                  </div>
                </div>
              </label>
            </div>

            <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
              <button
                style="
                  padding: 0.5rem 1rem;
                  border: 1px solid #d1d5db;
                  border-radius: 0.375rem;
                  background: #fff;
                  color: #374151;
                  cursor: pointer;
                  font-size: 0.875rem;
                "
                @click="saveCustom"
              >
                {{ translations.common.save }}
              </button>
              <button
                style="
                  padding: 0.5rem 1rem;
                  border: none;
                  border-radius: 0.375rem;
                  background: #111827;
                  color: #fff;
                  cursor: pointer;
                  font-size: 0.875rem;
                "
                @click="acceptAll"
              >
                {{ translations.common.acceptAll }}
              </button>
            </div>
          </div>
        </div>
      </slot>
    </div>
  </Teleport>
</template>
