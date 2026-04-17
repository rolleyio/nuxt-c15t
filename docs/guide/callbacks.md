---
title: Callbacks
description: Subscribe to consent lifecycle events — onBannerFetched, onConsentSet, onConsentChanged, onError — through the useC15t composable.
---

# Callbacks

`useC15t()` exposes subscribers for every consent lifecycle event. Each returns an unsubscribe function you should call when the component unmounts.

```vue
<script setup lang="ts">
const { onBannerFetched, onConsentSet, onConsentChanged, onError } = useC15t()

const stopBanner = onBannerFetched((payload) => {
  console.log('jurisdiction', payload.jurisdiction)
  console.log('location', payload.location)
})

const stopChanged = onConsentChanged((payload) => {
  console.log('granted:', payload.allowedCategories)
  console.log('denied:', payload.deniedCategories)
})

onBeforeUnmount(() => {
  stopBanner()
  stopChanged()
})
</script>
```

## Available callbacks

| Method | Fires when | Payload |
| --- | --- | --- |
| `onBannerFetched` | The consent banner has resolved its jurisdiction and translations. | `{ jurisdiction, location, translations }` |
| `onConsentSet` | Consent is assigned (including automatic grants for no-jurisdiction visitors). Replays the current state on registration. | `{ preferences }` |
| `onConsentChanged` | An explicit save changed the previously saved state. Does **not** replay on registration. | `{ preferences, previousPreferences, allowedCategories, deniedCategories, previousAllowedCategories, previousDeniedCategories }` |
| `onError` | Any internal error — backend fetch, storage, translations. | `{ error }` |
| `onBeforeConsentRevocationReload` | Just before a page reload triggered by consent revocation (when `reloadOnConsentRevoked` is enabled). Runs synchronously. | `{ preferences }` |

## Generic `on()`

For ad-hoc subscriptions or dynamic event names, use the generic form:

```ts
const { on } = useC15t()

const stop = on('onConsentSet', (payload) => {
  console.log(payload.preferences)
})
```

Same return value — an unsubscribe function.

## Single-handler rule

Each event has one slot. Registering a second handler for the same event replaces the first. If you need multiple listeners for one event, fan out inside your handler:

```ts
const listeners: Array<(p: OnConsentSetPayload) => void> = []

onConsentSet((payload) => {
  for (const fn of listeners) fn(payload)
})
```

## When to use what

- **`onConsentChanged`** — analytics / side-effects that should only fire on a *real* user action. Skips hydration, auto-grants, and re-renders.
- **`onConsentSet`** — anything that needs the current consent state as soon as you subscribe, including during initialisation.
- **`onBannerFetched`** — to branch on detected jurisdiction or translate additional UI.
- **`onError`** — centralised error reporting (Sentry, internal logs).
- **`onBeforeConsentRevocationReload`** — show a loader before the reload. Keep it synchronous.
