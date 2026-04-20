---
title: Policy Packs
description: Configure regional consent rules — opt-in, opt-out, or no-banner — using built-in presets (GDPR, CCPA, Quebec) or custom policy packs.
---

# Policy Packs

Policy packs tell c15t *how* to handle consent for different jurisdictions — which model (opt-in / opt-out / none), which categories, what UI to render. The appropriate pack is selected per visitor based on country and region, using `region > country > default` precedence.

In **hosted / self-hosted** mode the backend resolves packs automatically — you don't need to configure anything.

In **offline** mode you pass the packs yourself via the `policyPacks` option. Use this for local previews, tests, and no-backend deployments.

## Using built-in presets

`c15t` ships factory functions for the common regulations:

```ts
import { policyPackPresets } from 'c15t'

export default defineNuxtConfig({
  c15t: {
    mode: 'offline',
    policyPacks: [
      policyPackPresets.europeOptIn(),       // EEA + UK — GDPR opt-in
      policyPackPresets.europeIab(),         // EEA + UK — IAB TCF 2.3
      policyPackPresets.californiaOptIn(),   // US-CA — opt-in model
      policyPackPresets.californiaOptOut(),  // US-CA — CCPA opt-out
      policyPackPresets.quebecOptIn(),       // CA-QC — Law 25
      policyPackPresets.worldNoBanner(),     // fallback for everywhere else
    ],
  },
})
```

c15t evaluates packs in order and picks the first match. A `worldNoBanner` entry at the end gives a safe default for visitors outside any regulated region.

## How matching works

Each pack has a `match` field that defines where it applies:

- **Regions** — `{ country: 'US', region: 'CA' }` matches California only.
- **Countries** — a list of country codes.
- **Built-ins** — `EU_COUNTRY_CODES`, `EEA_COUNTRY_CODES`, `UK_COUNTRY_CODES`, or `policyMatchers.iab()` (EEA + UK combined).
- **Fallback / default** — catch-alls evaluated last.

`policyPackPresets.europeOptIn()` expands to IAB + fallback, so it covers every EEA + UK country. Region-scoped packs like Quebec or California require backend-driven region resolution — `countryOverride` in `nuxt.config` only sets the country.

## Custom packs

The presets return plain `PolicyConfig` objects — you can hand-roll one if you need a model c15t doesn't ship:

```ts
import type { PolicyConfig } from 'nuxt-c15t'

const japanPack: PolicyConfig = {
  id: 'japan_opt_out',
  match: { countries: ['JP'] },
  consent: { model: 'opt-out', expiryDays: 365 },
  ui: { mode: 'banner' },
  proof: { storeIp: true, storeUserAgent: true, storeLanguage: true },
}

c15t: {
  mode: 'offline',
  policyPacks: [japanPack, policyPackPresets.worldNoBanner()],
}
```

## When packs are ignored

- In `hosted` / `self-hosted` modes, `policyPacks` is ignored — the backend owns policy resolution.
- If no pack matches the visitor's location, c15t falls back to the rest of your module config (`consentCategories`, etc.).

## Testing a specific jurisdiction

Use `countryOverride` to simulate a visitor from elsewhere:

```ts
c15t: {
  mode: 'offline',
  countryOverride: 'DE', // always render as a German visitor
  policyPacks: [policyPackPresets.europeOptIn(), policyPackPresets.worldNoBanner()],
}
```

Pair with the playground's `/policy-packs` page to see which pack c15t selects.

## Relationship to `consentCategories`

Both options coexist:

- **`consentCategories`** — a flat list of categories always shown, regardless of jurisdiction.
- **`policyPacks`** — region-aware rule set where each pack declares its own model and UI.

If both are set in offline mode, the matched pack's rules take over for matched visitors; `consentCategories` provides the fallback for unmatched locations. For apps that only operate in one jurisdiction, `consentCategories` is simpler.
