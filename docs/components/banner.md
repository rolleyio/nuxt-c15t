# C15tBanner

A headless consent banner component. Shows automatically when a user hasn't consented yet. Provides a default unstyled UI or accepts a custom slot for full control.

## Usage

### Default UI

```vue
<template>
  <C15tBanner />
</template>
```

### Custom UI

```vue
<template>
  <C15tBanner v-slot="{ acceptAll, acceptNecessary, openPreferences }">
    <div class="my-banner">
      <p>We use cookies to improve your experience.</p>
      <button @click="acceptNecessary">Reject</button>
      <button @click="openPreferences">Customise</button>
      <button @click="acceptAll">Accept all</button>
    </div>
  </C15tBanner>
</template>
```

## Slot Props

| Prop | Type | Description |
| --- | --- | --- |
| `acceptAll` | `() => void` | Accept all consent categories |
| `acceptNecessary` | `() => void` | Accept only necessary cookies |
| `openPreferences` | `() => void` | Open the preferences dialog |

## Behaviour

- Renders inside a `<Teleport to="body">` for z-index management
- Only visible when `activeUI === 'banner'` and consent info has finished loading
- Has `role="dialog"` and `aria-label="Cookie consent"` for accessibility
