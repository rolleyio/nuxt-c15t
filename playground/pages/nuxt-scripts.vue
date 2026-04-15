<script setup lang="ts">
const { has, setConsent } = useC15t()
const hasMeasurement = has('measurement')
const hasMarketing = has('marketing')

const gaScript = useScript('https://www.googletagmanager.com/gtag/js?id=G-DEMO12345', {
  trigger: useC15tScriptTrigger('measurement'),
})

const metaScript = useScript('https://connect.facebook.net/en_US/fbevents.js', {
  trigger: useC15tScriptTrigger('marketing'),
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold mb-1">
        Nuxt Scripts Integration
      </h2>
      <p class="text-sm text-gray-500 mb-4">
        Use <code>useC15tScriptTrigger(condition)</code> as the <code>trigger</code> option for
        <code>useScript()</code>. Scripts remain unloaded until consent is granted.
      </p>
    </div>

    <div class="space-y-3">
      <UCard>
        <div class="flex items-center justify-between mb-2">
          <div>
            <div class="font-medium">Google Analytics</div>
            <div class="text-xs text-gray-500">Requires <code>measurement</code> consent</div>
          </div>
          <UBadge
            :color="gaScript.status.value === 'loaded' ? 'success' : gaScript.status.value === 'loading' ? 'warning' : 'neutral'"
            variant="subtle"
          >
            {{ gaScript.status.value }}
          </UBadge>
        </div>
        <UButton
          size="xs"
          :color="hasMeasurement ? 'success' : 'error'"
          variant="soft"
          @click="setConsent('measurement', true)"
        >
          {{ hasMeasurement ? 'measurement: granted' : 'Grant measurement consent' }}
        </UButton>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between mb-2">
          <div>
            <div class="font-medium">Meta Pixel</div>
            <div class="text-xs text-gray-500">Requires <code>marketing</code> consent</div>
          </div>
          <UBadge
            :color="metaScript.status.value === 'loaded' ? 'success' : metaScript.status.value === 'loading' ? 'warning' : 'neutral'"
            variant="subtle"
          >
            {{ metaScript.status.value }}
          </UBadge>
        </div>
        <UButton
          size="xs"
          :color="hasMarketing ? 'success' : 'error'"
          variant="soft"
          @click="setConsent('marketing', true)"
        >
          {{ hasMarketing ? 'marketing: granted' : 'Grant marketing consent' }}
        </UButton>
      </UCard>
    </div>

    <UCard>
      <h3 class="font-semibold mb-2">Code</h3>
      <pre class="text-xs overflow-x-auto">const gaScript = useScript(
  'https://www.googletagmanager.com/gtag/js?id=G-XXXXXX',
  { trigger: useC15tScriptTrigger('measurement') }
)</pre>
    </UCard>
  </div>
</template>
