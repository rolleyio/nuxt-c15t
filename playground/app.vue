<script setup lang="ts">
const { consents, activeUI, setActiveUI } = useC15t()

const pages = [
  { path: '/', label: 'Overview' },
  { path: '/custom-ui', label: 'Custom UI' },
  { path: '/toggles', label: 'Toggles' },
  { path: '/iframe-blocking', label: 'Iframe Blocking' },
  { path: '/nuxt-scripts', label: 'Nuxt Scripts' },
  { path: '/compound-conditions', label: 'Compound Conditions' },
  { path: '/translations', label: 'Translations' },
]
</script>

<template>
  <div style="max-width: 56rem; margin: 0 auto; padding: 0 1rem; font-family: system-ui, -apple-system, sans-serif;">
    <!-- Header -->
    <header style="padding: 1.5rem 0; border-bottom: 1px solid #e5e7eb; margin-bottom: 2rem;">
      <h1 style="font-size: 1.5rem; font-weight: 700; margin: 0 0 1rem;">
        nuxt-c15t Playground
      </h1>
      <nav style="display: flex; gap: 0.25rem; flex-wrap: wrap;">
        <NuxtLink
          v-for="page in pages"
          :key="page.path"
          :to="page.path"
          style="padding: 0.375rem 0.75rem; border-radius: 0.375rem; font-size: 0.8125rem; text-decoration: none; color: #374151; border: 1px solid transparent;"
          active-style="background: #111827; color: #fff;"
        >
          {{ page.label }}
        </NuxtLink>
      </nav>
    </header>

    <!-- Sticky consent state bar -->
    <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.75rem 1rem; margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; font-size: 0.75rem;">
      <span style="font-weight: 600; color: #374151;">State:</span>
      <span
        v-for="(value, key) in consents"
        :key="key"
        style="padding: 0.125rem 0.5rem; border-radius: 9999px;"
        :style="{
          background: value ? '#d1fae5' : '#fee2e2',
          color: value ? '#065f46' : '#991b1b',
        }"
      >
        {{ key }}: {{ value ? 'yes' : 'no' }}
      </span>
      <span style="padding: 0.125rem 0.5rem; border-radius: 9999px; background: #e0e7ff; color: #3730a3;">
        ui: {{ activeUI }}
      </span>
      <button
        style="margin-left: auto; padding: 0.25rem 0.625rem; border: 1px solid #d1d5db; border-radius: 0.25rem; background: #fff; cursor: pointer; font-size: 0.75rem;"
        @click="setActiveUI('banner', { force: true })"
      >
        Re-show banner
      </button>
    </div>

    <!-- Page content -->
    <NuxtPage />

    <!-- Consent UI (shared across all pages) -->
    <C15tBanner />
    <C15tDialog />
  </div>
</template>
