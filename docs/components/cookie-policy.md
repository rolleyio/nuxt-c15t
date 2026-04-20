---
title: C15tCookiePolicy
description: Render a cookie policy table grouped by consent category, driven by the cookiePolicy config in nuxt.config.ts.
---

# C15tCookiePolicy

Renders a cookie policy table grouped by consent category. Driven by the `cookiePolicy` config in `nuxt.config.ts`.

## Usage

### Default UI

```vue
<template>
  <C15tCookiePolicy />
</template>
```

### Custom UI

```vue
<template>
  <C15tCookiePolicy v-slot="{ groups }">
    <div v-for="group in groups" :key="group.category">
      <h3>{{ group.label }}</h3>
      <ul>
        <li v-for="cookie in group.cookies" :key="cookie.name">
          <strong>{{ cookie.name }}</strong> ({{ cookie.vendor }}) — {{ cookie.purpose }}
        </li>
      </ul>
    </div>
  </C15tCookiePolicy>
</template>
```

## Slot Props

| Prop | Type | Description |
| --- | --- | --- |
| `groups` | `CookiePolicyGroup[]` | Cookies grouped by category with labels |

Each group contains:

```ts
interface CookiePolicyGroup {
  category: AllConsentNames
  label: string          // e.g. 'Marketing & Advertising'
  cookies: CookieEntry[] // name, vendor, purpose, duration, type
}
```

## Configuration

Configure which cookies appear via `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  c15t: {
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

## Available Vendors

| ID | Name |
| --- | --- |
| `google-tag-manager` | Google Tag Manager |
| `google-analytics` | Google Analytics 4 |
| `google-ads` | Google Ads |
| `meta-pixel` | Meta Pixel (Facebook) |
| `posthog` | PostHog |
| `linkedin-insight` | LinkedIn Insight Tag |
| `tiktok-pixel` | TikTok Pixel |
| `microsoft-clarity` | Microsoft Clarity |
| `hotjar` | Hotjar |
| `intercom` | Intercom |
| `hubspot` | HubSpot |
| `stripe` | Stripe |
