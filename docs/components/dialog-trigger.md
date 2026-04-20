---
title: C15tDialogTrigger
description: Floating drag-anywhere button that opens the consent preferences dialog, with per-corner snap and localStorage persistence.
---

# C15tDialogTrigger

A floating button for persistent access to privacy settings. Users can drag it to any corner of the viewport; the position is remembered across sessions via `localStorage`.

## Usage

Mount once, typically in your `app.vue` alongside `<C15tBanner>` and `<C15tDialog>`:

```vue
<template>
  <UApp>
    <NuxtPage />

    <C15tBanner />
    <C15tDialog />
    <C15tDialogTrigger />
  </UApp>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultPosition` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` | Corner to snap to before the user drags it. |
| `persistPosition` | `boolean` | `true` | Save the user's chosen corner to `localStorage` (key `c15t-trigger-corner`). |
| `showWhen` | `'always' \| 'after-consent' \| 'never'` | `'after-consent'` | When the trigger is rendered. `after-consent` hides it until the user has made an initial choice. |
| `ariaLabel` | `string` | `'Open privacy settings'` | Accessible label on the button. |

## Custom content

The default icon is a cookie-ish dotted circle. Override via the default slot:

```vue
<C15tDialogTrigger>
  <Icon name="i-heroicons-cog-6-tooth" />
</C15tDialogTrigger>
```

## Dragging

Pointer events — works with mouse, touch, and pen. Dragging follows the pointer; on release, the button snaps to the nearest corner (divided along the viewport midpoints). A drag never triggers a click, so accidental dialog opens are avoided.
