---
title: Configuration
description: Every nuxt-c15t option — mode, consent categories, country overrides, iframe blocking, translations, and the cookie policy schema.
---

# Configuration

All options are set under the `c15t` key in `nuxt.config.ts`.

## Full Example

```ts
export default defineNuxtConfig({
  modules: ['nuxt-c15t'],

  c15t: {
    mode: 'offline',
    consentCategories: ['necessary', 'measurement', 'marketing', 'functionality'],
    countryOverride: 'DE', // dev: always show GDPR banner
    iframeBlocking: true,
    cookiePolicy: {
      vendors: ['google-analytics', 'meta-pixel', 'hotjar'],
      cookies: [
        {
          name: 'session_id',
          vendor: 'This website',
          category: 'necessary',
          purpose: 'Maintains your logged-in session.',
          duration: 'Session',
          type: 'HTTP',
        },
      ],
    },
  },
})
```

## Options Reference

### `mode`

- **Type:** `'hosted' | 'offline' | 'self-hosted'`
- **Default:** `'hosted'`

Backend mode. Use `'offline'` for browser-only storage with no backend.

### `backendURL`

- **Type:** `string`
- **Required:** When `mode` is `'hosted'` or `'self-hosted'`

URL of your c15t backend instance.

### `consentCategories`

- **Type:** `Array<'necessary' | 'functionality' | 'measurement' | 'marketing' | 'experience'>`
- **Default:** `['necessary', 'measurement', 'marketing']`

Consent categories to present to the user.

### `countryOverride`

- **Type:** `string`
- **Default:** `undefined`

Override the detected country code, bypassing automatic geo-detection. Useful during development to simulate specific jurisdictions (e.g. `'DE'` for GDPR, `'US'` for no banner).

### `iframeBlocking`

- **Type:** `boolean`
- **Default:** `true`

Enable iframe blocking. Iframes with `data-category="marketing"` etc. will be blocked until the relevant consent is granted.

### `nuxtScripts`

- **Type:** `boolean`
- **Default:** `true` (when `@nuxt/scripts` is installed)

Enable the `useC15tScriptTrigger()` composable for consent-gated script loading.

### `cookiePolicy`

Configuration for the `<C15tCookiePolicy>` component and `useCookiePolicy()` composable.

#### `cookiePolicy.vendors`

- **Type:** `string[]`

Vendor IDs to include in the cookie policy table. Each must match an ID in the built-in vendor registry.

Available vendors: `google-tag-manager`, `google-analytics`, `google-ads`, `meta-pixel`, `posthog`, `linkedin-insight`, `tiktok-pixel`, `microsoft-clarity`, `hotjar`, `intercom`, `hubspot`, `stripe`, `youtube`, `vimeo`, `cloudflare`, `cloudflare-turnstile`, `directus`, `medusa`.

#### `cookiePolicy.cookies`

- **Type:** `CookieEntry[]`

Custom cookies to include alongside vendor cookies. Use for first-party cookies:

```ts
{
  name: 'theme',
  vendor: 'This website',
  category: 'functionality',
  purpose: 'Remembers your preferred colour scheme.',
  duration: '1 year',
  type: 'HTML Local Storage',
}
```

### `translations`

- **Type:** `TranslationConfig`
- **Default:** `{}` (uses c15t's built-in English)

Translation overrides for consent UI text. See [Translations](/guide/translations) for full details.

### `prefetchScript`

- **Type:** `boolean`
- **Default:** `true`

Inject an inline `<script>` into `<head>` that starts the consent API request early, before the main JS bundle loads. Only applies to `hosted` and `self-hosted` modes. Improves time-to-consent-banner by parallelising the API fetch with bundle download.
