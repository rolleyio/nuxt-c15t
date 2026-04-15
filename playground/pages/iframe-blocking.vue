<script setup lang="ts">
const { has, setConsent } = useC15t()
const hasMarketing = has('marketing')
const hasMeasurement = has('measurement')
</script>

<template>
  <div>
    <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.75rem;">
      Iframe Blocking
    </h2>
    <p style="color: #6b7280; font-size: 0.875rem; margin: 0 0 1.5rem;">
      Use <code>&lt;C15tIframe&gt;</code> to gate iframes behind consent.
      The iframe only loads when the required consent category is granted.
      A placeholder is shown in the meantime.
    </p>

    <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
      <button
        style="padding: 0.375rem 0.75rem; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 0.8125rem;"
        :style="{ background: hasMarketing ? '#d1fae5' : '#fee2e2', color: hasMarketing ? '#065f46' : '#991b1b' }"
        @click="setConsent('marketing', !hasMarketing)"
      >
        marketing: {{ hasMarketing ? 'granted' : 'denied' }}
      </button>
      <button
        style="padding: 0.375rem 0.75rem; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 0.8125rem;"
        :style="{ background: hasMeasurement ? '#d1fae5' : '#fee2e2', color: hasMeasurement ? '#065f46' : '#991b1b' }"
        @click="setConsent('measurement', !hasMeasurement)"
      >
        measurement: {{ hasMeasurement ? 'granted' : 'denied' }}
      </button>
    </div>

    <div style="display: grid; gap: 1.5rem; grid-template-columns: 1fr 1fr;">
      <div>
        <h3 style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">
          Marketing iframe (YouTube)
        </h3>
        <C15tIframe
          src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
          category="marketing"
          width="100%"
          height="200"
          style="border: none; display: block; border-radius: 0.5rem; overflow: hidden;"
          title="YouTube embed"
        />
      </div>

      <div>
        <h3 style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">
          Measurement iframe
        </h3>
        <C15tIframe
          src="https://example.com"
          category="measurement"
          width="100%"
          height="200"
          style="border: none; display: block; border-radius: 0.5rem; overflow: hidden;"
          title="Analytics embed"
        />
      </div>
    </div>

    <section style="margin-top: 2rem;">
      <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem;">Code</h3>
      <pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; font-size: 0.75rem; overflow-x: auto;">&lt;C15tIframe
  src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
  category="marketing"
  width="560"
  height="315"
  title="YouTube video"
/&gt;</pre>
    </section>
  </div>
</template>
