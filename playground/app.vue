<script setup lang="ts">
const { consents, activeUI, setActiveUI } = useC15t()

const pages = [
  { path: '/', label: 'Overview' },
  { path: '/custom-ui', label: 'Custom UI' },
  { path: '/toggles', label: 'Toggles' },
  { path: '/iframe-blocking', label: 'Iframe Blocking' },
  { path: '/network-blocker', label: 'Network Blocker' },
  { path: '/policy-packs', label: 'Policy Packs' },
  { path: '/nuxt-scripts', label: 'Nuxt Scripts' },
  { path: '/compound-conditions', label: 'Compound Conditions' },
  { path: '/consent-gate', label: 'Consent Gate' },
  { path: '/translations', label: 'Translations' },
  { path: '/callbacks', label: 'Callbacks' },
  { path: '/widgets', label: 'Widgets' },
  { path: '/advanced', label: 'Advanced' },
]
</script>

<template>
  <UApp>
    <UContainer class="py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-xl font-bold">
          nuxt-c15t Playground
        </h1>
      </div>

      <UCard class="mb-6">
        <div class="flex items-center gap-3 flex-wrap text-xs">
          <span class="font-semibold text-gray-500">State:</span>
          <UBadge
            v-for="(value, key) in consents"
            :key="key"
            :color="value ? 'success' : 'error'"
            variant="subtle"
          >
            {{ key }}: {{ value ? 'yes' : 'no' }}
          </UBadge>
          <UBadge
            color="info"
            variant="subtle"
          >
            ui: {{ activeUI }}
          </UBadge>
          <UButton
            size="xs"
            variant="outline"
            class="ml-auto"
            @click="setActiveUI('banner', { force: true })"
          >
            Re-show banner
          </UButton>
        </div>
      </UCard>

      <div class="grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-6">
        <aside>
          <UNavigationMenu
            :items="pages.map(p => ({ label: p.label, to: p.path }))"
            orientation="vertical"
          />
        </aside>
        <main class="min-w-0">
          <NuxtPage />
        </main>
      </div>

      <C15tBanner />
      <C15tDialog />
      <C15tDialogTrigger show-when="after-consent" />
    </UContainer>
  </UApp>
</template>
