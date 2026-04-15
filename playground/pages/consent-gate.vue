<script setup lang="ts">
const { has, setConsent } = useC15t()
const hasMarketing = has('marketing')
const hasMeasurement = has('measurement')
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold mb-1">
        Consent Gate
      </h2>
      <p class="text-sm text-gray-500 mb-4">
        <code>&lt;C15tConsentGate&gt;</code> conditionally renders any content based on consent.
        Unlike <code>&lt;C15tIframe&gt;</code>, it works with any children — not just iframes.
      </p>
    </div>

    <div class="flex gap-2">
      <UButton
        size="xs"
        :color="hasMarketing ? 'success' : 'error'"
        variant="soft"
        @click="setConsent('marketing', !hasMarketing)"
      >
        marketing: {{ hasMarketing ? 'on' : 'off' }}
      </UButton>
      <UButton
        size="xs"
        :color="hasMeasurement ? 'success' : 'error'"
        variant="soft"
        @click="setConsent('measurement', !hasMeasurement)"
      >
        measurement: {{ hasMeasurement ? 'on' : 'off' }}
      </UButton>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <div>
        <h3 class="text-sm font-semibold mb-2">Single condition</h3>
        <C15tConsentGate condition="marketing">
          <UCard>
            <div class="text-sm text-green-700">
              Marketing content is visible! This could be a third-party widget, social embed, etc.
            </div>
          </UCard>
        </C15tConsentGate>
      </div>

      <div>
        <h3 class="text-sm font-semibold mb-2">AND condition</h3>
        <C15tConsentGate :condition="{ and: ['marketing', 'measurement'] }">
          <UCard>
            <div class="text-sm text-green-700">
              Both marketing AND measurement are granted. Full tracking enabled.
            </div>
          </UCard>
        </C15tConsentGate>
      </div>

      <div>
        <h3 class="text-sm font-semibold mb-2">OR condition</h3>
        <C15tConsentGate :condition="{ or: ['marketing', 'measurement'] }">
          <UCard>
            <div class="text-sm text-green-700">
              Either marketing OR measurement is granted.
            </div>
          </UCard>
        </C15tConsentGate>
      </div>

      <div>
        <h3 class="text-sm font-semibold mb-2">Custom fallback slot</h3>
        <C15tConsentGate condition="marketing">
          <UCard>
            <div class="text-sm text-green-700">Marketing widget loaded!</div>
          </UCard>

          <template #fallback="{ conditionLabel }">
            <UCard class="bg-amber-50">
              <div class="text-sm text-amber-700">
                Please enable <strong>{{ conditionLabel }}</strong> cookies to see this widget.
              </div>
            </UCard>
          </template>
        </C15tConsentGate>
      </div>
    </div>

    <UCard>
      <h3 class="font-semibold mb-2">Code</h3>
      <pre class="text-xs overflow-x-auto" v-pre>&lt;C15tConsentGate condition="marketing"&gt;
  &lt;ThirdPartyWidget /&gt;

  &lt;template #fallback="{ conditionLabel }"&gt;
    &lt;p&gt;Enable {{ conditionLabel }} to see this&lt;/p&gt;
  &lt;/template&gt;
&lt;/C15tConsentGate&gt;</pre>
    </UCard>
  </div>
</template>
