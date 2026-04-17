<script setup lang="ts">
import { ref } from 'vue'

const { has, setConsent, setNetworkBlocker } = useC15t()
const hasMarketing = has('marketing')
const hasMeasurement = has('measurement')

const log = ref<string[]>([])

function append(line: string) {
  log.value = [`${new Date().toLocaleTimeString()} — ${line}`, ...log.value].slice(0, 20)
}

async function tryGA() {
  try {
    const res = await fetch('https://www.google-analytics.com/collect?v=1&tid=UA-XX&cid=1&t=pageview')
    append(res.status === 451 ? 'GA blocked (451)' : `GA allowed (${res.status})`)
  }
  catch (e) {
    append(`GA threw: ${(e as Error).message}`)
  }
}

async function tryFB() {
  try {
    const res = await fetch('https://www.facebook.com/tr?id=123&ev=PageView')
    append(res.status === 451 ? 'FB pixel blocked (451)' : `FB pixel allowed (${res.status})`)
  }
  catch (e) {
    append(`FB threw: ${(e as Error).message}`)
  }
}

function registerCallback() {
  setNetworkBlocker({
    enabled: true,
    rules: [
      { id: 'ga', domain: 'google-analytics.com', category: 'measurement' },
      { id: 'fb', domain: 'facebook.com', category: 'marketing', pathIncludes: '/tr' },
    ],
    onRequestBlocked: (info) => {
      append(`onRequestBlocked: ${info.method} ${info.url} (rule: ${info.rule?.id})`)
    },
  })
  append('Registered onRequestBlocked callback')
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold mb-1">
        Network Blocker
      </h2>
      <p class="text-sm text-gray-500 mb-4">
        Outgoing <code>fetch</code> and <code>XMLHttpRequest</code> calls to matching domains return <code>451</code> until consent is granted. Catches beacons and pixels from already-loaded code.
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

    <div class="flex gap-2">
      <UButton
        size="sm"
        @click="tryGA"
      >
        Try Google Analytics fetch
      </UButton>
      <UButton
        size="sm"
        @click="tryFB"
      >
        Try Facebook pixel fetch
      </UButton>
      <UButton
        size="sm"
        variant="outline"
        @click="registerCallback"
      >
        Register onRequestBlocked
      </UButton>
    </div>

    <UCard>
      <h3 class="font-semibold mb-2 text-sm">
        Log
      </h3>
      <pre class="text-xs overflow-x-auto">{{ log.join('\n') || '(empty — try the buttons above)' }}</pre>
    </UCard>

    <UCard>
      <h3 class="font-semibold mb-2">
        Config
      </h3>
      <pre class="text-xs overflow-x-auto">c15t: {
  networkBlocker: {
    rules: [
      { id: 'ga', domain: 'google-analytics.com', category: 'measurement' },
      { id: 'fb', domain: 'facebook.com', category: 'marketing', pathIncludes: '/tr' },
    ],
  },
}</pre>
    </UCard>
  </div>
</template>
