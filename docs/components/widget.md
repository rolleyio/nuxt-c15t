---
title: C15tWidget
description: Inline, always-visible consent controls — embed on a privacy settings page instead of the modal dialog.
---

# C15tWidget

Inline consent manager. Renders the same per-category toggles as `<C15tDialog>` but embedded directly in your page layout — no modal, no trigger. Best for account or privacy settings pages where users expect controls to be always visible.

## Usage

```vue
<template>
  <section>
    <h2>Privacy preferences</h2>
    <C15tWidget />
  </section>
</template>
```

## Default UI

- One checkbox row per configured consent category.
- Three buttons: **Reject All**, **Save Settings**, **Accept All**.
- Translated via the same keys as `<C15tDialog>` (`consentManagerDialog.*`, `common.*`, `consentTypes.*`).

## Custom UI

All state is exposed via the default slot, so you can render any layout:

```vue
<template>
  <C15tWidget v-slot="{ displayedConsents, consents, toggle, saveCustom, acceptAll, rejectAll }">
    <div v-for="ct in displayedConsents" :key="ct.name">
      <input
        type="checkbox"
        :checked="consents[ct.name]"
        :disabled="ct.disabled"
        @change="toggle(ct.name, $event.target.checked)"
      >
      {{ ct.name }}
    </div>
    <button @click="rejectAll">Reject</button>
    <button @click="saveCustom">Save</button>
    <button @click="acceptAll">Accept all</button>
  </C15tWidget>
</template>
```

## Slot props

| Prop | Type | Description |
| --- | --- | --- |
| `displayedConsents` | `ConsentType[]` | Categories to render, with per-item `disabled` flag. |
| `consents` | `Record<string, boolean>` | Current consent state. |
| `translations` | `{ title, description, save, acceptAll, rejectAll }` | Resolved translation strings. |
| `toggle` | `(name, value) => void` | Toggle a category's selected state. |
| `saveCustom` | `() => void` | Persist the user's current selections. |
| `acceptAll` | `() => void` | Grant every category. |
| `rejectAll` | `() => void` | Deny every non-necessary category. |

## Compared to `<C15tDialog>`

- **Dialog** — modal overlay, opened on demand (banner button, `setActiveUI('dialog')`, `<C15tDialogTrigger>`, `<C15tDialogLink>`).
- **Widget** — always rendered inline. No overlay, no teleport, no open/close state.

Use the widget for deliberate settings pages; use the dialog for incidental access.
