<script setup lang="ts">
const { consents } = useC15t()
</script>

<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-lg font-semibold mb-3">
        Consent State
      </h2>
      <UCard>
        <pre class="text-xs overflow-x-auto">{{ JSON.stringify(consents, null, 2) }}</pre>
      </UCard>
    </div>

    <div>
      <h2 class="text-lg font-semibold mb-3">
        Cookie Policy Table
      </h2>
      <p class="text-sm text-gray-500 mb-4">
        Rendered by <code>&lt;C15tCookiePolicy&gt;</code> using the vendor registry and custom cookies from <code>nuxt.config.ts</code>.
      </p>
      <UCard>
        <C15tCookiePolicy />
      </UCard>
    </div>
  </div>
</template>
