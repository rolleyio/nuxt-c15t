<script setup lang="ts">
const { translations, setLanguage, setActiveUI } = useC15t()

const languages = ['en', 'de']

const t = computed(() => {
  const raw = translations.value as Record<string, Record<string, string>> | null
  return {
    bannerTitle: raw?.cookieBanner?.title ?? '-',
    bannerDescription: raw?.cookieBanner?.description ?? '-',
    acceptAll: raw?.common?.acceptAll ?? '-',
    rejectAll: raw?.common?.rejectAll ?? '-',
    customize: raw?.common?.customize ?? '-',
    save: raw?.common?.save ?? '-',
  }
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold mb-1">
        Translations / i18n
      </h2>
      <p class="text-sm text-gray-500 mb-4">
        Switch language and re-show the banner to see translated text.
      </p>
    </div>

    <div class="flex gap-2">
      <UButton
        v-for="lang in languages"
        :key="lang"
        size="xs"
        variant="outline"
        @click="setLanguage(lang)"
      >
        {{ lang.toUpperCase() }}
      </UButton>
      <UButton
        size="xs"
        @click="setActiveUI('banner', { force: true })"
      >
        Re-show banner
      </UButton>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <UCard>
        <h3 class="text-sm font-semibold mb-2">
          Banner
        </h3>
        <div class="text-sm space-y-1">
          <div><span class="text-gray-500">Title:</span> {{ t.bannerTitle }}</div>
          <div><span class="text-gray-500">Description:</span> {{ t.bannerDescription }}</div>
        </div>
      </UCard>
      <UCard>
        <h3 class="text-sm font-semibold mb-2">
          Buttons
        </h3>
        <div class="text-sm space-y-1">
          <div><span class="text-gray-500">Accept All:</span> {{ t.acceptAll }}</div>
          <div><span class="text-gray-500">Reject All:</span> {{ t.rejectAll }}</div>
          <div><span class="text-gray-500">Customize:</span> {{ t.customize }}</div>
          <div><span class="text-gray-500">Save:</span> {{ t.save }}</div>
        </div>
      </UCard>
    </div>
  </div>
</template>
