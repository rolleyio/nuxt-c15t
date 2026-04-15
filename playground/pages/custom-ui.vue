<script setup lang="ts">
const { setActiveUI } = useC15t()
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold mb-1">
        Custom UI via Headless Slots
      </h2>
      <p class="text-sm text-gray-500 mb-4">
        All components expose a default slot with actions/state, so you can replace the entire UI.
      </p>
    </div>

    <div class="flex gap-2">
      <UButton variant="outline" size="sm" @click="setActiveUI('banner', { force: true })">
        Show custom banner
      </UButton>
      <UButton variant="outline" size="sm" @click="setActiveUI('dialog')">
        Show custom dialog
      </UButton>
    </div>

    <UCard>
      <h3 class="font-semibold mb-2">Custom Banner</h3>
      <p class="text-xs text-gray-500 mb-3">
        Uses the default slot to provide a dark-themed banner.
      </p>

      <C15tBanner v-slot="{ acceptAll, acceptNecessary, openPreferences }">
        <div class="fixed bottom-4 left-4 right-4 p-5 bg-gray-900 text-gray-100 rounded-xl shadow-2xl z-[9999] flex items-center justify-between gap-6 text-sm">
          <div>
            <p class="font-semibold mb-1">We value your privacy</p>
            <p class="text-gray-400 text-xs">Choose your cookie preferences below.</p>
          </div>
          <div class="flex gap-2 shrink-0">
            <UButton variant="outline" color="neutral" size="xs" @click="acceptNecessary">Decline</UButton>
            <UButton variant="outline" color="neutral" size="xs" @click="openPreferences">Customise</UButton>
            <UButton size="xs" @click="acceptAll">Accept all</UButton>
          </div>
        </div>
      </C15tBanner>
    </UCard>

    <UCard>
      <h3 class="font-semibold mb-2">Custom Cookie Policy</h3>
      <p class="text-xs text-gray-500 mb-3">
        Uses the default slot to render cookie data as cards instead of tables.
      </p>

      <C15tCookiePolicy v-slot="{ groups }">
        <div class="space-y-4">
          <div v-for="group in groups" :key="group.category">
            <h4 class="text-sm font-semibold mb-2">{{ group.label }}</h4>
            <div class="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-2">
              <UCard v-for="cookie in group.cookies" :key="cookie.name" class="text-xs">
                <div class="font-semibold font-mono mb-1">{{ cookie.name }}</div>
                <div class="text-gray-500">{{ cookie.vendor }} &middot; {{ cookie.duration }}</div>
                <div class="text-gray-400 mt-1">{{ cookie.purpose }}</div>
              </UCard>
            </div>
          </div>
        </div>
      </C15tCookiePolicy>
    </UCard>
  </div>
</template>
