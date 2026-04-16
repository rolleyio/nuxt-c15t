# nuxt-c15t

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

> Consent management for Nuxt — reactive composables, headless components, Nuxt Scripts integration, and vendor-aware cookie policy tables

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
- [📚 &nbsp;Documentation](https://nuxt-c15t.rolley.io)

## Features

- 🔒 &nbsp;**Reactive composables** — `useC15t()` provides fully reactive consent state with Vue 3 Composition API
- 🎨 &nbsp;**Headless components** — Banner, Dialog, CookiePolicy, Iframe, and ConsentGate with customisable slots
- 📜 &nbsp;**Nuxt Scripts integration** — gate third-party scripts behind consent with `useC15tScriptTrigger()`
- 🍪 &nbsp;**Vendor cookie registry** — pre-built definitions for 16+ vendors (GA, Meta, Hotjar, YouTube, etc.)
- 🌍 &nbsp;**i18n support** — translations via c15t's built-in system with runtime language switching
- 🖥️ &nbsp;**SSR-safe** — server-side consent reading via `useC15tConsent()`
- 🔌 &nbsp;**Offline & hosted modes** — browser-only storage or sync with a c15t backend

## Quick Setup

1. Add `nuxt-c15t` dependency to your project

```bash
pnpm add nuxt-c15t
```

2. Add `nuxt-c15t` to the `modules` section of `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  modules: ['nuxt-c15t'],

  c15t: {
    mode: 'offline',
    consentCategories: ['necessary', 'measurement', 'marketing'],
  },
})
```

3. Add the consent banner to your `app.vue`

```vue
<template>
  <div>
    <NuxtPage />
    <C15tConsentManager />
  </div>
</template>
```

This renders both the banner and preferences dialog. You can also use `<C15tBanner>` and `<C15tDialog>` separately, or customise them via named slots:

```vue
<C15tConsentManager>
  <template #banner="{ acceptAll, acceptNecessary, openPreferences }">
    <!-- your custom banner -->
  </template>
  <template #dialog="{ displayedConsents, toggle, saveCustom, acceptAll, close }">
    <!-- your custom dialog -->
  </template>
</C15tConsentManager>
```

4. Check consent anywhere

```vue
<script setup>
const { has } = useC15t()
const hasMeasurement = has('measurement')
</script>
```

That's it! You can now manage consent in your Nuxt app ✨

## Gate Scripts Behind Consent

Use with `@nuxt/scripts` to load third-party scripts only after consent:

```ts
useScript('https://www.googletagmanager.com/gtag/js?id=G-XXXXX', {
  trigger: useC15tScriptTrigger('measurement'),
})
```

## Development

```bash
# Install dependencies
pnpm install

# Generate type stubs
pnpm run dev:prepare

# Develop with the playground
pnpm run dev

# Run ESLint
pnpm run lint

# Run Vitest
pnpm run test

# Build docs
pnpm run docs:dev

# Release new version
pnpm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-c15t/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-c15t

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-c15t.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-c15t

[license-src]: https://img.shields.io/npm/l/nuxt-c15t.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-c15t

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
