---
title: C15tDialog
description: Headless consent preferences dialog with per-category checkboxes — opened from the banner or setActiveUI('dialog').
---

# C15tDialog

A headless consent preferences dialog. Shows when the user clicks "Preferences" in the banner or when `setActiveUI('dialog')` is called. Displays checkboxes for each consent category.

## Usage

### Default UI

```vue
<template>
  <C15tDialog />
</template>
```

### Custom UI

```vue
<template>
  <C15tDialog v-slot="{ displayedConsents, consents, toggle, saveCustom, acceptAll, close }">
    <div class="my-dialog-overlay" @click.self="close">
      <div class="my-dialog">
        <h2>Cookie Preferences</h2>
        <label v-for="ct in displayedConsents" :key="ct.name">
          <input
            type="checkbox"
            :checked="consents[ct.name]"
            :disabled="ct.disabled"
            @change="toggle(ct.name, $event.target.checked)"
          />
          {{ ct.description }}
        </label>
        <button @click="saveCustom">Save</button>
        <button @click="acceptAll">Accept all</button>
      </div>
    </div>
  </C15tDialog>
</template>
```

## Slot Props

| Prop | Type | Description |
| --- | --- | --- |
| `displayedConsents` | `ConsentType[]` | Consent types to display, based on user's jurisdiction |
| `consents` | `Partial<ConsentState>` | Current consent state object |
| `toggle` | `(name, value) => void` | Toggle a consent checkbox (doesn't save) |
| `saveCustom` | `() => void` | Save the current checkbox selections |
| `acceptAll` | `() => void` | Accept all categories |
| `close` | `() => void` | Close the dialog, return to banner |

## Behaviour

- Renders inside a `<Teleport to="body">`
- Only visible when `activeUI === 'dialog'`
- Necessary cookies are shown as always-active (disabled checkbox)
- Clicking the backdrop calls `close()`
