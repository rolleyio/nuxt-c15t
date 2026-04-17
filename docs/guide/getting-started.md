---
title: Getting Started
description: Install nuxt-c15t, configure consent categories, and wire up the banner and dialog in a few lines of nuxt.config.ts.
---

# Getting Started

## Installation

```bash
npx nuxt module add nuxt-c15t
```

## Basic Configuration

Add `nuxt-c15t` to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['nuxt-c15t'],

  c15t: {
    mode: 'offline',
    consentCategories: ['necessary', 'measurement', 'marketing'],
  },
})
```

### Modes

| Mode | Description |
| --- | --- |
| `offline` | Browser-local storage only, no backend needed |
| `hosted` | Use consent.io managed backend (recommended for production) |
| `self-hosted` | Your own c15t backend instance |

## Add the Banner

Drop the consent banner and preferences dialog into your `app.vue` or layout:

```vue
<template>
  <div>
    <NuxtPage />
    <C15tConsentManager />
  </div>
</template>
```

The banner appears automatically when a user hasn't consented yet. Clicking "Preferences" opens the dialog.

## Check Consent

Use the `useC15t()` composable to reactively check consent state:

```vue
<script setup>
const { has, consents } = useC15t()

const hasMeasurement = has('measurement')
</script>

<template>
  <div v-if="hasMeasurement">
    Analytics are enabled
  </div>
</template>
```

## Next Steps

- [Configuration](/guide/configuration) — all module options
- [Nuxt Scripts integration](/guide/nuxt-scripts) — gate third-party scripts behind consent
- [API reference](/api/use-c15t) — full composable documentation
