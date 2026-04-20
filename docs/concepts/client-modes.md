---
title: Client Modes
description: hosted vs offline vs self-hosted — what each mode actually does and when to pick which.
---

# Client Modes

`mode` in your `c15t` config picks how consent state is resolved and persisted.

## Hosted mode (`mode: 'hosted'`)

Default. On page load the client calls `GET /init` against the c15t-managed backend at `backendURL`. The backend resolves jurisdiction from the visitor's IP, picks the right policy pack, and returns the matched model, UI mode, translations, and categories. Consent changes are synced back to the backend.

```ts
c15t: {
  mode: 'hosted',
  backendURL: 'https://your-instance.c15t.dev',
}
```

**Good fit for:** production apps that need geo-aware UI, audit trails, and cross-device consent records. The backend is the source of truth.

**Trade-offs:** requires a backend. Consent sync fails are logged but not retried in the browser — the hosted infrastructure handles retry.

## Offline mode (`mode: 'offline'`)

No network calls. Consent lives entirely in `localStorage` and the `c15t` cookie. Use [policy packs](/guide/policy-packs) to preview regional behavior locally.

```ts
import { policyPackPresets } from 'c15t'

c15t: {
  mode: 'offline',
  policyPacks: [policyPackPresets.europeOptIn(), policyPackPresets.worldNoBanner()],
}
```

**Good fit for:** local development, static demos, CI snapshot tests, or very simple sites that don't need audit records.

**Trade-offs:** no geolocation (use `countryOverride` to simulate), no server-side visibility of consent, storage can be cleared by users or browsers. Strictly client-side.

## Self-hosted mode (`mode: 'self-hosted'`)

Same as hosted, but `backendURL` points at your own c15t deployment. nuxt-c15t treats this as hosted mode under the hood.

```ts
c15t: {
  mode: 'self-hosted',
  backendURL: 'https://consent.example.com',
}
```

**Good fit for:** regulated environments where consent records must live on your infrastructure.

## How to choose

| Requirement | Mode |
| --- | --- |
| Geo-aware banner, audit trail | `hosted` |
| No backend, local only | `offline` |
| Self-run backend | `self-hosted` |
| CI/tests, demos | `offline` + `countryOverride` |

If `mode !== 'offline'` and `backendURL` is missing, nuxt-c15t falls back to offline with a console warning — so a fresh install can't hang waiting for a never-configured backend.
