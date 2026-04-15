<script setup lang="ts">
import { useC15t, computed } from '#imports'

const { activeUI, isLoading, translations, saveConsents, setActiveUI } = useC15t()

function acceptAll() {
  saveConsents('all')
}

function acceptNecessary() {
  saveConsents('necessary')
}

function openPreferences() {
  setActiveUI('dialog')
}

const t = computed(() => {
  const raw = translations.value as Record<string, Record<string, string>> | null
  return {
    title: raw?.cookieBanner?.title ?? 'We value your privacy',
    description: raw?.cookieBanner?.description ?? 'This site uses cookies to improve your browsing experience, analyze site traffic, and show personalized content.',
    acceptAll: raw?.common?.acceptAll ?? 'Accept All',
    rejectAll: raw?.common?.rejectAll ?? 'Reject All',
    customize: raw?.common?.customize ?? 'Customize',
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="!isLoading && activeUI === 'banner'"
      role="dialog"
      aria-label="Cookie consent"
    >
      <slot
        :accept-all="acceptAll"
        :accept-necessary="acceptNecessary"
        :open-preferences="openPreferences"
        :translations="t"
      >
        <div class="c15t-banner">
          <div class="c15t-banner__content">
            <p class="c15t-banner__title">
              {{ t.title }}
            </p>
            <p class="c15t-banner__description">
              {{ t.description }}
            </p>
          </div>
          <div class="c15t-banner__actions">
            <button class="c15t-btn c15t-btn--secondary" @click="acceptNecessary">
              {{ t.rejectAll }}
            </button>
            <button class="c15t-btn c15t-btn--secondary" @click="openPreferences">
              {{ t.customize }}
            </button>
            <button class="c15t-btn c15t-btn--primary" @click="acceptAll">
              {{ t.acceptAll }}
            </button>
          </div>
        </div>
      </slot>
    </div>
  </Teleport>
</template>

<style>
.c15t-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: #fff;
  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 0.875rem;
}

.c15t-banner__content {
  flex: 1;
  min-width: 0;
}

.c15t-banner__title {
  margin: 0 0 0.25rem;
  font-weight: 600;
  color: #111827;
}

.c15t-banner__description {
  margin: 0;
  color: #374151;
}

.c15t-banner__actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.c15t-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-family: inherit;
  line-height: 1.25;
}

.c15t-btn--primary {
  border: none;
  background: #111827;
  color: #fff;
}

.c15t-btn--secondary {
  border: 1px solid #d1d5db;
  background: #fff;
  color: #374151;
}
</style>
