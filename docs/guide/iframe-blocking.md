# Iframe Blocking

`nuxt-c15t` can block third-party iframes (YouTube, social embeds, maps) until the relevant consent category is granted.

## Setup

Iframe blocking is enabled by default. To disable:

```ts
export default defineNuxtConfig({
  c15t: {
    iframeBlocking: false,
  },
})
```

## Usage

Add `data-category` and use `data-src` instead of `src` on iframes that require consent:

```html
<iframe
  data-category="marketing"
  data-src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
  width="560"
  height="315"
  title="YouTube video"
/>
```

When the user grants `marketing` consent, c15t automatically sets `src` from `data-src` and the iframe loads.

## How It Works

1. On page load, c15t scans all `<iframe>` elements with a `data-category` attribute
2. If the required consent hasn't been granted, the iframe's `src` is not set (or removed)
3. A `MutationObserver` watches for dynamically added iframes
4. When consent is granted, `src` is restored from `data-src`

## Important

Always use `data-src` instead of `src` for blocked iframes. If you set `src` directly, the iframe will make a network request before c15t can block it, and the URL won't be preserved for restoration after consent.

## Categories

Use any configured consent category:

```html
<!-- Marketing: ads, social embeds, retargeting -->
<iframe data-category="marketing" data-src="..." />

<!-- Measurement: analytics embeds -->
<iframe data-category="measurement" data-src="..." />

<!-- Functionality: maps, chat widgets -->
<iframe data-category="functionality" data-src="..." />
```
