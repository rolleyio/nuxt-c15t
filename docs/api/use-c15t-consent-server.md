---
title: useC15tConsent (server)
description: Read consent state from the request cookie in server routes, middleware, and during SSR — no client runtime required.
---

# useC15tConsent (server)

Server-side composable to read consent state from the request cookie. Use this in server routes, middleware, or during SSR to check consent without the full c15t client runtime.

## Usage

### Server Middleware

```ts
// server/middleware/analytics.ts
export default defineEventHandler((event) => {
  const consent = useC15tConsent()

  if (consent.has('measurement')) {
    // User has granted measurement consent
    // Inject server-side analytics, set headers, etc.
  }
})
```

### SSR Rendering

```vue
<script setup>
// Works during SSR — reads from the request cookie
const consent = useC15tConsent()
const showAnalytics = consent.has('measurement')
</script>
```

## Return Values

### `consents`

- **Type:** `Record<string, boolean>`

The raw consent state parsed from the `c15t` cookie.

### `has(condition)`

Check a consent condition. Supports the same condition syntax as the client-side `has()`.

```ts
consent.has('measurement')                          // single category
consent.has({ or: ['measurement', 'marketing'] })   // any of these
consent.has({ and: ['measurement', 'marketing'] })   // all of these
```

## How It Works

1. Reads the `c15t` cookie from the request `Cookie` header
2. Decodes c15t's compact cookie format (key shorthand + flattened encoding)
3. Returns the consent state as a plain object

## Limitations

- Read-only — cannot modify consent on the server
- Only reads the cookie — if consent was just granted on the client but the page hasn't reloaded, the server won't see it yet
- The cookie format is an implementation detail of c15t and may change between major versions
