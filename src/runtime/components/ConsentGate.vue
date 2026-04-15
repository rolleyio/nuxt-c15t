<script setup lang="ts">
import type { AllConsentNames, HasCondition } from 'c15t'
import { useC15t, computed } from '#imports'

const props = defineProps<{
  /** Consent condition required to show content */
  condition: HasCondition<AllConsentNames>
}>()

const { has, translations } = useC15t()
const hasConsent = has(props.condition)

const conditionLabel = computed(() => {
  const raw = translations.value as Record<string, Record<string, Record<string, string>>> | null
  if (typeof props.condition === 'string') {
    return raw?.consentTypes?.[props.condition]?.title ?? props.condition
  }
  return 'required'
})

const frameText = computed(() => {
  const raw = translations.value as Record<string, Record<string, string>> | null
  const title = raw?.frame?.title ?? 'Accept {category} consent to view this content.'
  return title.replace('{category}', conditionLabel.value)
})
</script>

<template>
  <slot v-if="hasConsent" />
  <slot v-else name="fallback" :condition-label="conditionLabel" :has-consent="hasConsent">
    <div class="c15t-consent-gate">
      <p class="c15t-consent-gate__title">
        {{ frameText }}
      </p>
    </div>
  </slot>
</template>

<style>
.c15t-consent-gate {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  font-family: system-ui, -apple-system, sans-serif;
}

.c15t-consent-gate__title {
  margin: 0 0 0.5rem;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
}

.c15t-consent-gate__description {
  margin: 0;
  color: #6b7280;
  font-size: 0.8125rem;
}
</style>
