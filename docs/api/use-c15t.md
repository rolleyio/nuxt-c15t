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

Change the active language for consent UI translations. The `translations` computed re-evaluates automatically.

```ts
setLanguage('de')
```

## Reactive State (additional)

### `translations`

- **Type:** `ComputedRef<ResolvedTranslations>`

Resolved translation strings for the active language. Used by all built-in components (Banner, Dialog) to render localised text. Falls back to English defaults during SSR.

```ts
const { translations } = useC15t()

// Access translated strings
translations.value.cookieBanner.title      // "We value your privacy"
translations.value.common.acceptAll        // "Accept All"
translations.value.consentTypes.marketing  // { title: "Marketing", description: "..." }
```
