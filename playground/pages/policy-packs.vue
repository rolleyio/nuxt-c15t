<script setup lang="ts">
import { computed } from 'vue'

const { locationInfo, consents } = useC15t()

type MaybeRecord = Record<string, unknown> | null | undefined

function readString(source: MaybeRecord, key: string): string | null {
  if (!source) return null
  const value = source[key]
  return typeof value === 'string' ? value : null
}

const country = computed(() => readString(locationInfo.value as MaybeRecord, 'countryCode') ?? '(unknown)')
const region = computed(() => readString(locationInfo.value as MaybeRecord, 'regionCode') ?? '(none)')
const jurisdiction = computed(() => {
  const j = (locationInfo.value as MaybeRecord)?.jurisdiction as MaybeRecord
  return readString(j, 'code') ?? '(unresolved)'
})

const packs = [
  { id: 'europeOptIn', country: 'DE', label: 'Germany (europeOptIn)' },
  { id: 'californiaOptOut', country: 'US', label: 'California (californiaOptOut)', hint: 'Set countryOverride to US to simulate' },
  { id: 'quebecOptIn', country: 'CA', label: 'Quebec (quebecOptIn)', hint: 'countryOverride only sets country — region resolution needs backend' },
  { id: 'worldNoBanner', country: 'AU', label: 'Australia → worldNoBanner fallback' },
]
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold mb-1">
        Policy Packs
      </h2>
      <p class="text-sm text-gray-500 mb-4">
        Offline-mode presets evaluated by c15t in <code>region &gt; country &gt; default</code> order. Change <code>countryOverride</code> in <code>nuxt.config.ts</code> to see a different pack match.
      </p>
    </div>

    <UCard>
      <h3 class="text-sm font-semibold mb-2">
        Resolved location
      </h3>
      <dl class="grid grid-cols-3 gap-2 text-xs">
        <dt class="font-medium text-gray-500">
          country
        </dt>
        <dd class="col-span-2">
          {{ country }}
        </dd>
        <dt class="font-medium text-gray-500">
          region
        </dt>
        <dd class="col-span-2">
          {{ region }}
        </dd>
        <dt class="font-medium text-gray-500">
          jurisdiction
        </dt>
        <dd class="col-span-2">
          {{ jurisdiction }}
        </dd>
      </dl>
    </UCard>

    <UCard>
      <h3 class="text-sm font-semibold mb-2">
        Configured packs
      </h3>
      <ul class="text-xs space-y-2">
        <li
          v-for="pack in packs"
          :key="pack.id"
        >
          <code>{{ pack.id }}</code> — {{ pack.label }}
          <span
            v-if="pack.hint"
            class="text-gray-500"
          >&nbsp;({{ pack.hint }})</span>
        </li>
      </ul>
    </UCard>

    <UCard>
      <h3 class="text-sm font-semibold mb-2">
        Current consent state
      </h3>
      <pre class="text-xs overflow-x-auto">{{ JSON.stringify(consents, null, 2) }}</pre>
    </UCard>

    <UCard>
      <h3 class="font-semibold mb-2">
        Config
      </h3>
      <pre class="text-xs overflow-x-auto">import { policyPackPresets } from 'c15t'

c15t: {
  mode: 'offline',
  policyPacks: [
    policyPackPresets.europeOptIn(),
    policyPackPresets.californiaOptOut(),
    policyPackPresets.quebecOptIn(),
    policyPackPresets.worldNoBanner(),
  ],
}</pre>
    </UCard>
  </div>
</template>
