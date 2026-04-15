<script setup lang="ts">
import type { AllConsentNames } from 'c15t'
import { useC15t, computed } from '#imports'

const props = defineProps<{
  /** The iframe URL — only loaded when consent is granted */
  src: string
  /** Consent category required to load this iframe */
  category: AllConsentNames
}>()

const { has, translations } = useC15t()
const hasConsent = has(props.category)

const categoryTitle = computed(() => {
  const raw = translations.value as Record<string, Record<string, Record<string, string>>> | null
  return raw?.consentTypes?.[props.category]?.title ?? props.category
})
</script>

<template>
  <div>
    <slot :has-consent="hasConsent" :category-title="categoryTitle">
      <iframe
        v-if="hasConsent"
        :src="props.src"
        v-bind="$attrs"
      />
      <div
        v-else
        v-bind="$attrs"
        class="c15t-iframe-placeholder"
      >
        <p class="c15t-iframe-placeholder__title">
          {{ categoryTitle }} consent required
        </p>
        <p class="c15t-iframe-placeholder__description">
          This content is blocked until you grant {{ categoryTitle.toLowerCase() }} consent.
        </p>
      </div>
    </slot>
  </div>
</template>

<style>
.c15t-iframe-placeholder {
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
  min-height: 200px;
}

.c15t-iframe-placeholder__title {
  margin: 0 0 0.5rem;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
}

.c15t-iframe-placeholder__description {
  margin: 0;
  color: #6b7280;
  font-size: 0.8125rem;
}
</style>
