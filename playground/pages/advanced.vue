<script setup lang="ts">
const {
  consentTypes,
  legalLinks,
  locationInfo,
  consentInfo,
  identifyUser,
  onConsentChanged,
} = useC15t()

const changeLog = ref<string[]>([])

onMounted(() => {
  const unsubscribe = onConsentChanged((payload) => {
    changeLog.value.push(`${new Date().toLocaleTimeString()}: ${JSON.stringify(payload)}`)
  })

  onUnmounted(() => unsubscribe())
})

function handleIdentify() {
  identifyUser({ id: 'user-123', identityProvider: 'demo' })
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold mb-1">
        Advanced Features
      </h2>
      <p class="text-sm text-gray-500 mb-4">
        Additional reactive state and methods from c15t's store.
      </p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <UCard>
        <h3 class="text-sm font-semibold mb-2">consentTypes</h3>
        <p class="text-xs text-gray-500 mb-2">Consent categories with metadata from c15t.</p>
        <div class="space-y-1">
          <div
            v-for="ct in consentTypes"
            :key="ct.name"
            class="text-xs p-2 bg-gray-50 rounded"
          >
            <span class="font-medium">{{ ct.name }}</span>
            <span v-if="ct.disabled" class="text-gray-400 ml-1">(always active)</span>
            <div class="text-gray-500 truncate">{{ ct.description }}</div>
          </div>
        </div>
      </UCard>

      <UCard>
        <h3 class="text-sm font-semibold mb-2">locationInfo</h3>
        <p class="text-xs text-gray-500 mb-2">Detected jurisdiction from geo-IP.</p>
        <pre class="text-xs overflow-x-auto">{{ JSON.stringify(locationInfo, null, 2) }}</pre>
      </UCard>

      <UCard>
        <h3 class="text-sm font-semibold mb-2">legalLinks</h3>
        <p class="text-xs text-gray-500 mb-2">Privacy/cookie policy URLs if configured.</p>
        <pre class="text-xs overflow-x-auto">{{ JSON.stringify(legalLinks, null, 2) }}</pre>
      </UCard>

      <UCard>
        <h3 class="text-sm font-semibold mb-2">consentInfo</h3>
        <p class="text-xs text-gray-500 mb-2">Consent record metadata for compliance.</p>
        <pre class="text-xs overflow-x-auto">{{ JSON.stringify(consentInfo, null, 2) }}</pre>
      </UCard>
    </div>

    <UCard>
      <h3 class="text-sm font-semibold mb-2">identifyUser</h3>
      <p class="text-xs text-gray-500 mb-2">
        Links consent to a logged-in user account (hosted/self-hosted mode).
      </p>
      <UButton size="xs" variant="outline" @click="handleIdentify">
        identifyUser({ id: 'user-123', identityProvider: 'demo' })
      </UButton>
    </UCard>

    <UCard>
      <h3 class="text-sm font-semibold mb-2">onConsentChanged</h3>
      <p class="text-xs text-gray-500 mb-2">
        Subscribe to consent changes. Toggle consents on the Toggles page to see events here.
      </p>
      <div v-if="changeLog.length" class="space-y-1">
        <div v-for="(entry, i) in changeLog" :key="i" class="text-xs font-mono p-1 bg-gray-50 rounded">
          {{ entry }}
        </div>
      </div>
      <div v-else class="text-xs text-gray-400">
        No changes yet — toggle a consent category to see events.
      </div>
    </UCard>
  </div>
</template>
