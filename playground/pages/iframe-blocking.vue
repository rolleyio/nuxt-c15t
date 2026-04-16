<script setup lang="ts">
const { has, setConsent } = useC15t()
const hasMarketing = has('marketing')
const hasMeasurement = has('measurement')
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold mb-1">
        Iframe Blocking
      </h2>
      <p class="text-sm text-gray-500 mb-4">
        Use <code>&lt;C15tIframe&gt;</code> to gate iframes behind consent. The iframe only loads when the required consent is granted.
      </p>
    </div>

    <div class="flex gap-2">
      <UButton
        size="xs"
        :color="hasMarketing ? 'success' : 'error'"
        variant="soft"
        @click="setConsent('marketing', !hasMarketing)"
      >
        marketing: {{ hasMarketing ? 'granted' : 'denied' }}
      </UButton>
      <UButton
        size="xs"
        :color="hasMeasurement ? 'success' : 'error'"
        variant="soft"
        @click="setConsent('measurement', !hasMeasurement)"
      >
        measurement: {{ hasMeasurement ? 'granted' : 'denied' }}
      </UButton>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <div>
        <h3 class="text-sm font-semibold mb-2">
          Marketing iframe (YouTube)
        </h3>
        <C15tIframe
          src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
          category="marketing"
          width="100%"
          height="200"
          class="border-none block rounded-lg overflow-hidden"
          title="YouTube embed"
        />
      </div>

      <div>
        <h3 class="text-sm font-semibold mb-2">
          Measurement iframe
        </h3>
        <C15tIframe
          src="https://example.com"
          category="measurement"
          width="100%"
          height="200"
          class="border-none block rounded-lg overflow-hidden"
          title="Analytics embed"
        />
      </div>
    </div>

    <UCard>
      <h3 class="font-semibold mb-2">
        Code
      </h3>
      <pre class="text-xs overflow-x-auto">&lt;C15tIframe
  src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
  category="marketing"
  width="560"
  height="315"
  title="YouTube video"
/&gt;</pre>
    </UCard>

    <div>
      <h2 class="text-lg font-semibold mb-1">
        Raw iframe blocking
      </h2>
      <p class="text-sm text-gray-500 mb-4">
        For content you don't control (CMS output, third-party embeds), use <code>data-category</code> and <code>data-src</code> on a plain <code>&lt;iframe&gt;</code>. c15t sets <code>src</code> from <code>data-src</code> once consent is granted.
      </p>

      <iframe
        data-category="marketing"
        data-src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
        width="100%"
        height="300"
        class="border-none block rounded-lg overflow-hidden"
        title="YouTube embed (raw)"
      />
    </div>

    <UCard>
      <h3 class="font-semibold mb-2">
        Code
      </h3>
      <pre class="text-xs overflow-x-auto">&lt;iframe
  data-category="marketing"
  data-src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
  width="560"
  height="315"
  title="YouTube video"
/&gt;</pre>
    </UCard>
  </div>
</template>
