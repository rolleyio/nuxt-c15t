<script setup lang="ts">
import { useC15t } from '#imports'

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
</script>

<template>
  <Teleport to="body">
    <div
      v-if="!isLoading && activeUI === 'banner'"
      role="dialog"
      aria-label="Cookie consent"
    >
      <!--
        Headless mode: the default slot receives all actions so consumers
        can provide their own UI. The fallback renders a minimal unstyled banner.
      -->
      <slot
        :accept-all="acceptAll"
        :accept-necessary="acceptNecessary"
        :open-preferences="openPreferences"
        :translations="translations"
      >
        <div
          style="
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 1rem;
            background: #fff;
            border-top: 1px solid #e5e7eb;
            box-shadow: 0 -2px 8px rgba(0,0,0,0.08);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 0.875rem;
          "
        >
          <div>
            <p style="margin: 0 0 0.25rem; font-weight: 600; color: #111827;">
              {{ translations.cookieBanner.title }}
            </p>
            <p style="margin: 0; color: #374151;">
              {{ translations.cookieBanner.description }}
            </p>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-shrink: 0;">
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
              @click="acceptNecessary"
            >
              {{ translations.common.rejectAll }}
            </button>
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
              @click="openPreferences"
            >
              {{ translations.common.customize }}
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
      </slot>
    </div>
  </Teleport>
</template>
