---
title: C15tDialogLink
description: Inline trigger for the consent preferences dialog — drop it into footers, legal pages, or account settings.
---

# C15tDialogLink

Inline trigger that opens the consent preferences dialog. Use it in body copy, footers, or wherever a "manage cookies" link belongs.

## Usage

```vue
<template>
  <p>
    Read our <NuxtLink to="/privacy">privacy policy</NuxtLink>
    or <C15tDialogLink>update your preferences</C15tDialogLink>.
  </p>
</template>
```

Renders a `<button>` by default. Use `as-anchor` to render an `<a>` instead:

```vue
<template>
  <C15tDialogLink as-anchor>Cookie settings</C15tDialogLink>
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `asAnchor` | `boolean` | `false` | Render as an `<a>` element instead of `<button>`. |

The default slot content is `"Manage cookie preferences"` — override it with whatever phrasing fits your UI.

## Styling

Minimal CSS: `underline`, inherits font and color. Override via the `.c15t-dialog-link` class or a scoped class of your own.
