---
title: C15tIframe
description: Consent-gated iframe component — renders a customisable placeholder until the required category is granted, then loads the iframe.
---

# C15tIframe

A consent-gated iframe component. Shows a placeholder until the required consent category is granted, then loads the iframe.

## Usage

### Default UI

```vue
<template>
  <C15tIframe
    src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
    category="marketing"
    width="560"
    height="315"
    title="YouTube video"
  />
</template>
```

When `marketing` consent is denied, a placeholder is shown. When granted, the iframe loads automatically.

### Custom Placeholder

```vue
<template>
  <C15tIframe
    src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
    category="marketing"
    v-slot="{ hasConsent, categoryTitle }"
  >
    <iframe v-if="hasConsent" src="https://www.youtube-nocookie.com/embed/VIDEO_ID" />
    <div v-else class="my-placeholder">
      <p>Enable {{ categoryTitle }} cookies to watch this video</p>
    </div>
  </C15tIframe>
</template>
```

## Props

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `src` | `string` | Yes | The iframe URL — only loaded when consent is granted |
| `category` | `AllConsentNames` | Yes | Consent category required (`'marketing'`, `'measurement'`, etc.) |

All other attributes (`width`, `height`, `title`, `style`, etc.) are passed through to the iframe element via `v-bind="$attrs"`.

## Slot Props

| Prop | Type | Description |
| --- | --- | --- |
| `hasConsent` | `ComputedRef<boolean>` | Whether the required consent is currently granted |
| `categoryTitle` | `string` | Translated display name for the consent category |

## Compared to `data-src` iframes

`<C15tIframe>` is the recommended approach. It uses Vue reactivity to conditionally render the iframe, so:

- No need to remember `data-src` vs `src`
- The iframe loads instantly when consent is granted (no page reload)
- The placeholder is a proper Vue slot you can customise
- TypeScript props ensure you pass a valid `category`
