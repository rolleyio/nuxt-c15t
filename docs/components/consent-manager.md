---
title: C15tConsentManager
description: The recommended one-line drop-in that renders both the consent banner and preferences dialog.
---

# C15tConsentManager

A convenience component that renders both the consent banner and preferences dialog. This is the recommended way to add consent UI to your app.

## Usage

### Default UI

```vue
<template>
  <div>
    <NuxtPage />
    <C15tConsentManager />
  </div>
</template>
```

This is equivalent to:

```vue
<template>
  <C15tBanner />
  <C15tDialog />
</template>
```

### Custom UI via Named Slots

Customise the banner, dialog, or both using named slots. Each slot receives the same props as the individual component's default slot.

```vue
<template>
  <C15tConsentManager>
    <template #banner="{ acceptAll, acceptNecessary, openPreferences, translations }">
      <div class="my-banner">
        <p>{{ translations.title }}</p>
        <button @click="acceptAll">OK</button>
        <button @click="openPreferences">Settings</button>
      </div>
    </template>

    <template #dialog="{ displayedConsents, consents, toggle, saveCustom, acceptAll, close }">
      <div class="my-dialog">
        <label v-for="ct in displayedConsents" :key="ct.name">
          <input type="checkbox" :checked="consents[ct.name]" @change="toggle(ct.name, $event.target.checked)" />
          {{ ct.description }}
        </label>
        <button @click="saveCustom">Save</button>
      </div>
    </template>
  </C15tConsentManager>
</template>
```

## Slots

### `banner`

Optional. Receives the same slot props as [`<C15tBanner>`](/components/banner):

| Prop | Type | Description |
| --- | --- | --- |
| `acceptAll` | `() => void` | Accept all consent categories |
| `acceptNecessary` | `() => void` | Accept only necessary cookies |
| `openPreferences` | `() => void` | Open the preferences dialog |
| `translations` | `object` | Translated banner text |

### `dialog`

Optional. Receives the same slot props as [`<C15tDialog>`](/components/dialog):

| Prop | Type | Description |
| --- | --- | --- |
| `displayedConsents` | `ConsentType[]` | Consent types to display |
| `consents` | `object` | Current consent state |
| `toggle` | `(name, value) => void` | Toggle a consent checkbox |
| `saveCustom` | `() => void` | Save current selections |
| `acceptAll` | `() => void` | Accept all categories |
| `close` | `() => void` | Close the dialog |
| `translations` | `object` | Translated dialog text |

If a slot is not provided, the component falls back to the default UI from the corresponding component.
