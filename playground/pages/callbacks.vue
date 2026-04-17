<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

const {
  setConsent,
  resetConsents,
  saveConsents,
  onBannerFetched,
  onConsentSet,
  onConsentChanged,
  onError,
} = useC15t()

const log = ref<string[]>([])

function append(line: string) {
  log.value = [`${new Date().toLocaleTimeString()} — ${line}`, ...log.value].slice(0, 40)
}

const unsubBanner = onBannerFetched((payload) => {
  const j = typeof payload.jurisdiction === 'string' ? payload.jurisdiction : payload.jurisdiction.code
  append(`onBannerFetched: ${j} @ ${payload.location.countryCode ?? '?'}/${payload.location.regionCode ?? '?'}`)
})

const unsubSet = onConsentSet((payload) => {
  append(`onConsentSet: ${Object.keys(payload.preferences).filter(k => payload.preferences[k as keyof typeof payload.preferences]).join(', ') || '(none)'}`)
})

const unsubChanged = onConsentChanged((payload) => {
  append(`onConsentChanged: +[${payload.allowedCategories.join(', ') || '–'}] -[${payload.deniedCategories.join(', ') || '–'}]`)
})

const unsubError = onError((payload) => {
  append(`onError: ${payload.error}`)
})

onBeforeUnmount(() => {
  unsubBanner()
  unsubSet()
  unsubChanged()
  unsubError()
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold mb-1">
        Callbacks
      </h2>
      <p class="text-sm text-gray-500 mb-4">
        Subscribe to consent lifecycle events via <code>useC15t()</code>. Each subscriber returns an unsubscribe function.
      </p>
    </div>

    <div class="flex flex-wrap gap-2">
      <UButton
        size="sm"
        @click="setConsent('marketing', true)"
      >
        grant marketing
      </UButton>
      <UButton
        size="sm"
        @click="setConsent('marketing', false)"
      >
        revoke marketing
      </UButton>
      <UButton
        size="sm"
        @click="saveConsents('custom')"
      >
        saveConsents('custom')
      </UButton>
      <UButton
        size="sm"
        @click="saveConsents('all')"
      >
        saveConsents('all')
      </UButton>
      <UButton
        size="sm"
        variant="outline"
        @click="resetConsents"
      >
        reset
      </UButton>
    </div>

    <UCard>
      <h3 class="font-semibold mb-2 text-sm">
        Callback log
      </h3>
      <pre class="text-xs overflow-x-auto">{{ log.join('\n') || '(empty — grant or save consent above)' }}</pre>
    </UCard>

    <UCard>
      <h3 class="font-semibold mb-2 text-sm">
        Code
      </h3>
      <pre class="text-xs overflow-x-auto">const { onBannerFetched, onConsentSet, onConsentChanged, onError } = useC15t()

const stop = onConsentChanged((payload) => {
  console.log('granted:', payload.allowedCategories)
  console.log('denied:', payload.deniedCategories)
})

// Call stop() to unsubscribe.</pre>
    </UCard>
  </div>
</template>
