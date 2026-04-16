# Iframe Blocking

Use the [`<C15tIframe>`](/components/iframe) component to gate third-party iframes (YouTube, social embeds, maps) behind a consent category. The iframe only loads once the required consent is granted.

## Usage

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

When `marketing` consent is denied, a placeholder is rendered. When granted, the iframe mounts and loads automatically.

See the [`<C15tIframe>` component reference](/components/iframe) for custom placeholders via slot props and the full prop list.

## Categories

Use any configured consent category:

```vue
<!-- Marketing: ads, social embeds, retargeting -->
<C15tIframe category="marketing" src="..." />

<!-- Measurement: analytics embeds -->
<C15tIframe category="measurement" src="..." />

<!-- Functionality: maps, chat widgets -->
<C15tIframe category="functionality" src="..." />
```

## Automatic blocking of raw `<iframe>` elements

For content you don't control (CMS output, third-party embeds), `nuxt-c15t` also blocks raw `<iframe>` elements that opt in via `data-category` and `data-src`:

```html
<iframe
  data-category="marketing"
  data-src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
  width="560"
  height="315"
  title="YouTube video"
/>
```

On page load, c15t scans iframes with `data-category`, leaves `src` unset until the category is granted, then restores it from `data-src`. A `MutationObserver` handles dynamically added iframes. Always use `data-src` instead of `src` — setting `src` directly triggers a network request before c15t can block it.

## Disable raw `<iframe>` blocking

Raw-iframe blocking is enabled by default. To turn it off:

```ts
export default defineNuxtConfig({
  c15t: {
    iframeBlocking: false,
  },
})
```
