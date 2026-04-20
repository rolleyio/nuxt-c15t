---
title: Nuxt Scripts Integration
description: Gate @nuxt/scripts loading behind consent categories — analytics, ads, and embeds only fire once the user opts in.
---

# Nuxt Scripts Integration

`nuxt-c15t` integrates with [`@nuxt/scripts`](https://scripts.nuxt.com/) to gate third-party script loading behind user consent. Scripts remain unloaded until the relevant consent category is granted.

## Setup

Install `@nuxt/scripts` alongside `nuxt-c15t`:

```bash
npx nuxt module add @nuxt/scripts
```

```ts
export default defineNuxtConfig({
  modules: ['nuxt-c15t', '@nuxt/scripts'],

  c15t: {
    mode: 'offline',
    consentCategories: ['necessary', 'measurement', 'marketing'],
  },
})
```

## Usage

Use `useC15tScriptTrigger()` as the `trigger` option for `useScript()`:

```vue
<script setup>
// Google Analytics — loads only after measurement consent
const ga = useScript('https://www.googletagmanager.com/gtag/js?id=G-XXXXXX', {
  trigger: useC15tScriptTrigger('measurement'),
})

// Meta Pixel — loads only after marketing consent
useScript('https://connect.facebook.net/en_US/fbevents.js', {
  trigger: useC15tScriptTrigger('marketing'),
})
</script>

<template>
  <div>
    <p>GA status: {{ ga.status }}</p>
  </div>
</template>
```

## How It Works

`useC15tScriptTrigger(condition)` returns a `Promise<void>` that resolves when the specified consent condition is satisfied. This is compatible with `@nuxt/scripts`'s `trigger` option, which accepts a promise that controls when the script is injected into the page.

The trigger:

1. Waits for the c15t consent store to initialise
2. Checks if the condition is already satisfied (e.g. from a prior session)
3. If not, subscribes to store changes and resolves when consent is granted
4. Automatically cleans up the subscription when the component scope is disposed

## Compound Conditions

You can pass complex conditions using `{ or: [...] }` or `{ and: [...] }` syntax:

```ts
// Load if EITHER measurement or marketing consent is granted
useScript('/analytics.js', {
  trigger: useC15tScriptTrigger({ or: ['measurement', 'marketing'] }),
})

// Load only if BOTH are granted
useScript('/full-tracking.js', {
  trigger: useC15tScriptTrigger({ and: ['measurement', 'marketing'] }),
})
```
