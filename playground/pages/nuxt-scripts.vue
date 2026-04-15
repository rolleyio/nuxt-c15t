<script setup lang="ts">
const { has, setConsent } = useC15t()
const hasMeasurement = has('measurement')
const hasMarketing = has('marketing')

// Google Analytics — loads only after measurement consent
const gaScript = useScript('https://www.googletagmanager.com/gtag/js?id=G-DEMO12345', {
  trigger: useC15tScriptTrigger('measurement'),
})

// Meta Pixel — loads only after marketing consent
const metaScript = useScript('https://connect.facebook.net/en_US/fbevents.js', {
  trigger: useC15tScriptTrigger('marketing'),
})
</script>

<template>
  <div>
    <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.75rem;">
      Nuxt Scripts Integration
    </h2>
    <p style="color: #6b7280; font-size: 0.875rem; margin: 0 0 1.5rem;">
      Use <code>useC15tScriptTrigger(condition)</code> as the <code>trigger</code> option for
      <code>useScript()</code>. Scripts remain unloaded until consent is granted.
    </p>

    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <!-- GA Script -->
      <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
          <div>
            <div style="font-weight: 500;">Google Analytics</div>
            <div style="font-size: 0.75rem; color: #6b7280;">
              Requires <code>measurement</code> consent
            </div>
          </div>
          <span
            style="padding: 0.25rem 0.625rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500;"
            :style="{
              background: gaScript.status.value === 'loaded' ? '#d1fae5' : gaScript.status.value === 'loading' ? '#fef3c7' : '#f3f4f6',
              color: gaScript.status.value === 'loaded' ? '#065f46' : gaScript.status.value === 'loading' ? '#92400e' : '#6b7280',
            }"
          >
            {{ gaScript.status.value }}
          </span>
        </div>
        <button
          style="padding: 0.375rem 0.75rem; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 0.8125rem;"
          :style="{ background: hasMeasurement ? '#d1fae5' : '#fee2e2', color: hasMeasurement ? '#065f46' : '#991b1b' }"
          @click="setConsent('measurement', true)"
        >
          {{ hasMeasurement ? 'measurement: granted' : 'Grant measurement consent →' }}
        </button>
      </div>

      <!-- Meta Pixel -->
      <div style="padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
          <div>
            <div style="font-weight: 500;">Meta Pixel</div>
            <div style="font-size: 0.75rem; color: #6b7280;">
              Requires <code>marketing</code> consent
            </div>
          </div>
          <span
            style="padding: 0.25rem 0.625rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500;"
            :style="{
              background: metaScript.status.value === 'loaded' ? '#d1fae5' : metaScript.status.value === 'loading' ? '#fef3c7' : '#f3f4f6',
              color: metaScript.status.value === 'loaded' ? '#065f46' : metaScript.status.value === 'loading' ? '#92400e' : '#6b7280',
            }"
          >
            {{ metaScript.status.value }}
          </span>
        </div>
        <button
          style="padding: 0.375rem 0.75rem; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 0.8125rem;"
          :style="{ background: hasMarketing ? '#d1fae5' : '#fee2e2', color: hasMarketing ? '#065f46' : '#991b1b' }"
          @click="setConsent('marketing', true)"
        >
          {{ hasMarketing ? 'marketing: granted' : 'Grant marketing consent →' }}
        </button>
      </div>
    </div>

    <section style="margin-top: 2rem;">
      <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem;">Code</h3>
      <pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; font-size: 0.75rem; overflow-x: auto;">const gaScript = useScript(
  'https://www.googletagmanager.com/gtag/js?id=G-XXXXXX',
  { trigger: useC15tScriptTrigger('measurement') }
)

const metaScript = useScript(
  'https://connect.facebook.net/en_US/fbevents.js',
  { trigger: useC15tScriptTrigger('marketing') }
)</pre>
    </section>
  </div>
</template>
