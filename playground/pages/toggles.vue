<script setup lang="ts">
const { consents, setConsent, resetConsents, has, getDisplayedConsents } = useC15t()

const categories = ['measurement', 'marketing', 'functionality'] as const
</script>

<template>
  <div>
    <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.75rem;">
      Individual Consent Toggles
    </h2>
    <p style="color: #6b7280; font-size: 0.875rem; margin: 0 0 1.5rem;">
      Use <code>setConsent(name, value)</code> to grant or revoke individual categories.
      Use <code>resetConsents()</code> to clear everything.
    </p>

    <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem;">
      <div
        v-for="cat in categories"
        :key="cat"
        style="display: flex; align-items: center; justify-content: space-between; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;"
      >
        <div>
          <div style="font-weight: 500; text-transform: capitalize;">{{ cat }}</div>
          <div style="font-size: 0.75rem; color: #6b7280; margin-top: 0.125rem;">
            consents.{{ cat }} = {{ consents[cat] ?? 'undefined' }}
          </div>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button
            style="padding: 0.375rem 0.75rem; border: none; border-radius: 0.375rem; background: #d1fae5; color: #065f46; cursor: pointer; font-size: 0.8125rem;"
            @click="setConsent(cat, true)"
          >
            Grant
          </button>
          <button
            style="padding: 0.375rem 0.75rem; border: none; border-radius: 0.375rem; background: #fee2e2; color: #991b1b; cursor: pointer; font-size: 0.8125rem;"
            @click="setConsent(cat, false)"
          >
            Revoke
          </button>
        </div>
      </div>

      <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; background: #f9fafb;">
        <div style="font-weight: 500; margin-bottom: 0.25rem;">necessary</div>
        <div style="font-size: 0.75rem; color: #6b7280;">
          Always <code>true</code> — cannot be revoked. consents.necessary = {{ consents.necessary ?? 'undefined' }}
        </div>
      </div>
    </div>

    <button
      style="padding: 0.5rem 1rem; border: 1px solid #ef4444; border-radius: 0.375rem; background: #fff; color: #ef4444; cursor: pointer; font-size: 0.875rem;"
      @click="resetConsents()"
    >
      Reset all consents
    </button>

    <section style="margin-top: 2rem;">
      <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem;">
        getDisplayedConsents()
      </h3>
      <p style="color: #6b7280; font-size: 0.8125rem; margin: 0 0 0.75rem;">
        Returns the consent types configured for display, with metadata from c15t.
      </p>
      <pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; font-size: 0.75rem; overflow-x: auto;">{{ JSON.stringify(getDisplayedConsents(), null, 2) }}</pre>
    </section>
  </div>
</template>
