---
title: useC15t
description: Primary composable for consent management — reactive consent state plus methods to check, grant, and revoke consent.
---

# useC15t

The primary composable for consent management. Returns reactive consent state and methods for checking, granting, and revoking consent.

## Usage

```vue
<script setup>
const {
  consents,
  activeUI,
  isLoading,
  hasConsented,
  has,
  saveConsents,
  setConsent,
  setSelectedConsent,
  setActiveUI,
  resetConsents,
  getDisplayedConsents,
} = useC15t()
</script>
```

## Return Values

### `consents`

- **Type:** `Ref<Partial<ConsentState>>`

Reactive object containing the current consent state, filtered to only the categories configured in `consentCategories`.

```ts
// { necessary: true, measurement: false, marketing: false }
console.log(consents.value)
```

### `activeUI`

- **Type:** `Ref<'none' | 'banner' | 'dialog'>`

Which consent UI is currently showing.

### `isLoading`

- **Type:** `Ref<boolean>`

Whether consent information is still loading (e.g. from backend or local storage).

### `hasConsented`

- **Type:** `Ref<boolean>`

Whether the user has given any form of consent in this session.

## Methods

### `has(condition)`

Returns a reactive `ComputedRef<boolean>` that re-evaluates when consent state changes.

```ts
const hasMeasurement = has('measurement')
const hasAnalytics = has({ or: ['measurement', 'marketing'] })
const hasAll = has({ and: ['measurement', 'marketing'] })
```

### `saveConsents(type)`

Save consent preferences.

| `type` | Behaviour |
| --- | --- |
| `'all'` | Accept all categories |
| `'necessary'` | Accept only required categories |
| `'custom'` | Save the current selection (from dialog checkboxes) |

```ts
await saveConsents('all')
```

### `setConsent(name, value)`

Set consent for a specific category and immediately persist.

```ts
setConsent('measurement', true)
```

### `setSelectedConsent(name, value)`

Update a consent checkbox without saving. Used by the dialog to track in-progress selections before the user clicks "Save".

```ts
setSelectedConsent('marketing', true)
```

### `setActiveUI(ui, options?)`

Control which consent UI is shown.

```ts
// Show the banner
setActiveUI('banner')

// Force show (even if user already consented)
setActiveUI('banner', { force: true })

// Show preferences dialog
setActiveUI('dialog')

// Hide all consent UI
setActiveUI('none')
```

### `resetConsents()`

Reset all consents to their default (unconsented) state.

### `getDisplayedConsents()`

Returns the consent types that should be displayed to the user based on their jurisdiction.

### `setLanguage(language)`

Change the active language for consent UI translations.

```ts
setLanguage('de')
```

### `identifyUser(user)`

Associate consent with a logged-in user. Used in hosted/self-hosted mode to link consent records to user accounts.

```ts
identifyUser({ id: 'user-123', identityProvider: 'better-auth' })
```

### `onConsentChanged(listener)`

Subscribe to consent changes. Returns an unsubscribe function.

```ts
const unsubscribe = onConsentChanged((payload) => {
  console.log('Consent changed:', payload)
  // Send to analytics, update UI, etc.
})

// Later: unsubscribe()
```

## Reactive State (additional)

### `translations`

- **Type:** `ComputedRef<Record<string, unknown> | null>`

Resolved translations for the active language, directly from c15t's store. Used by all built-in components. Returns `null` during SSR.

### `consentTypes`

- **Type:** `ComputedRef<ConsentType[]>`

Array of consent type objects with `name`, `description`, `disabled`, etc. Useful for building custom consent UIs.

### `legalLinks`

- **Type:** `ComputedRef<LegalLinks | null>`

Privacy policy, cookie policy, and terms of service URLs if configured.

### `locationInfo`

- **Type:** `ComputedRef<LocationInfo | null>`

Detected country, region, and jurisdiction from geo-detection.

### `consentInfo`

- **Type:** `ComputedRef<ConsentInfo | null>`

Consent record metadata (subject ID, timestamp) for compliance auditing.

### `allConsentNames`

- **Type:** `AllConsentNames[]`

Static array of all consent category names: `['necessary', 'functionality', 'measurement', 'experience', 'marketing']`. Useful for iterating over categories.
