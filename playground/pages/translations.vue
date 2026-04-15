<script setup lang="ts">
const { translations, setLanguage, setActiveUI } = useC15t()

const languages = ['en', 'de']
</script>

<template>
  <div>
    <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.75rem;">
      Translations / i18n
    </h2>
    <p style="color: #6b7280; font-size: 0.875rem; margin: 0 0 1.5rem;">
      Switch language and re-show the banner to see translated text.
      The components read from <code>translations</code> reactively.
    </p>

    <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; align-items: center;">
      <button
        v-for="lang in languages"
        :key="lang"
        style="padding: 0.375rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: #fff; cursor: pointer; font-size: 0.8125rem; text-transform: uppercase;"
        @click="setLanguage(lang)"
      >
        {{ lang }}
      </button>
      <span style="font-size: 0.75rem; color: #6b7280;">
        acceptAll = "{{ translations.common.acceptAll }}"
      </span>
      <button
        style="padding: 0.375rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: #111827; color: #fff; cursor: pointer; font-size: 0.8125rem;"
        @click="setActiveUI('banner', { force: true })"
      >
        Re-show banner
      </button>
    </div>

    <section style="margin-bottom: 2rem;">
      <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem;">Resolved Translations (active language)</h3>
      <div style="display: grid; gap: 1rem; grid-template-columns: 1fr 1fr;">
        <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
          <h4 style="font-size: 0.875rem; font-weight: 600; margin: 0 0 0.5rem;">Banner</h4>
          <div style="font-size: 0.8125rem; color: #374151;">
            <div><strong>Title:</strong> {{ translations.cookieBanner.title }}</div>
            <div style="margin-top: 0.25rem;"><strong>Description:</strong> {{ translations.cookieBanner.description }}</div>
          </div>
        </div>
        <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
          <h4 style="font-size: 0.875rem; font-weight: 600; margin: 0 0 0.5rem;">Buttons</h4>
          <div style="font-size: 0.8125rem; color: #374151;">
            <div><strong>Accept All:</strong> {{ translations.common.acceptAll }}</div>
            <div><strong>Reject All:</strong> {{ translations.common.rejectAll }}</div>
            <div><strong>Customize:</strong> {{ translations.common.customize }}</div>
            <div><strong>Save:</strong> {{ translations.common.save }}</div>
          </div>
        </div>
        <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; grid-column: span 2;">
          <h4 style="font-size: 0.875rem; font-weight: 600; margin: 0 0 0.5rem;">Consent Types</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr)); gap: 0.5rem;">
            <div
              v-for="(ct, key) in translations.consentTypes"
              :key="key"
              style="font-size: 0.8125rem; color: #374151; padding: 0.5rem; background: #f9fafb; border-radius: 0.375rem;"
            >
              <div style="font-weight: 500;">{{ ct.title }}</div>
              <div style="color: #6b7280; font-size: 0.75rem;">{{ ct.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
