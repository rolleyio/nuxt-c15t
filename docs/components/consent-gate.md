# C15tConsentGate

Conditionally renders content based on consent. Shows a placeholder until the required consent is granted.

Unlike `<C15tIframe>` which is specific to iframes, `<C15tConsentGate>` works with any content.

## Usage

### Default Placeholder

```vue
<template>
  <C15tConsentGate condition="marketing">
    <ThirdPartyWidget />
  </C15tConsentGate>
</template>
```

### Custom Fallback

```vue
<template>
  <C15tConsentGate condition="marketing">
    <ThirdPartyWidget />

    <template #fallback="{ conditionLabel }">
      <div class="my-placeholder">
        <p>Enable {{ conditionLabel }} cookies to see this content</p>
      </div>
    </template>
  </C15tConsentGate>
</template>
```

### Compound Conditions

```vue
<template>
  <!-- Show only if BOTH measurement and marketing are granted -->
  <C15tConsentGate :condition="{ and: ['measurement', 'marketing'] }">
    <FullTrackingDashboard />
  </C15tConsentGate>

  <!-- Show if EITHER is granted -->
  <C15tConsentGate :condition="{ or: ['measurement', 'marketing'] }">
    <BasicAnalytics />
  </C15tConsentGate>
</template>
```

## Props

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `condition` | `HasCondition<AllConsentNames>` | Yes | Consent condition — a single category name, `{ or: [...] }`, or `{ and: [...] }` |

## Slots

### Default

Rendered when the consent condition is met.

### `fallback`

Rendered when consent is not granted. Receives:

| Prop | Type | Description |
| --- | --- | --- |
| `conditionLabel` | `string` | Translated display name of the consent category |
| `hasConsent` | `ComputedRef<boolean>` | Whether consent is granted |
