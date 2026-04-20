---
title: Troubleshooting
description: Common failure modes in nuxt-c15t — banner not showing, hydration mismatch, scripts blocked after consent, offline-mode fallback.
---

# Troubleshooting

Failure modes that trip people up, and how to debug them.

## `useC15t()` returns empty state on SSR

**Symptom:** `consents.value` is `{}`, `activeUI.value` is `'none'`, `isLoading.value` is `true` during SSR.

**Why:** The c15t runtime is client-only. The store doesn't exist until the client plugin boots, so any server-rendered branch that reads `useC15t()` gets defaults.

**Fix:** Don't branch on consent during SSR. If you need server-side consent awareness (to skip the `<script>` tag entirely, for example), read the cookie directly with the [`useC15tConsent` server composable](/api/use-c15t-consent-server).

## Banner never appears

Check in order:

1. **Opt-out jurisdiction** — `policyPackPresets.californiaOptOut()` and friends resolve to `ui.mode: 'none'`. No banner is expected. Check `consentInfo.value?.type`.
2. **Consent already recorded** — c15t respects stored decisions. Call `resetConsents()` to retest.
3. **`setActiveUI('none')` somewhere** — something explicitly hid the UI. Inspect the [DevTools panel](https://devtools.nuxt.com) to see current `activeUI`.
4. **Hosted-mode `/init` failure** — open the Network tab. If `GET /init` on your `backendURL` is failing, the banner waits forever.
5. **No `backendURL`** — in hosted / self-hosted mode without a URL, nuxt-c15t warns and falls back to offline. Check the terminal.

```ts
const { activeUI, isLoading, consentInfo } = useC15t()

watchEffect(() => {
  console.log({ activeUI: activeUI.value, isLoading: isLoading.value, model: consentInfo.value?.type })
})
```

## "Falling back to offline mode" warning on boot

**Symptom:** Terminal prints `[nuxt-c15t] No backendURL provided. Falling back to offline mode.` on every build.

**Why:** `mode` is `hosted` or `self-hosted` but `backendURL` is empty or missing.

**Fix:** Either set `backendURL` or change `mode` to `'offline'` explicitly. Offline-mode fallback is deliberate behavior for bootstrapped projects — it prevents a broken install from hanging waiting for a backend that was never configured.

## Scripts don't load after granting consent

Check the category name matches exactly. c15t ships `necessary`, `functionality`, `experience`, `measurement`, `marketing` — using `analytics` or `advertising` will silently never match.

```ts
// WRONG
useC15tScriptTrigger('analytics')

// RIGHT
useC15tScriptTrigger('measurement')
```

Then verify the consent actually landed:

```ts
const { has } = useC15t()
console.log(has('measurement').value) // expect true after grant
```

If it's true but the script still hasn't fired, check ad-blocker and DNS-level filters — they block independently of consent state.

## Iframes stay placeholder after consent

Two cases:

- **Using `<C15tIframe>`** — it's reactive. If the iframe doesn't swap in, check that `category` matches one of your `consentCategories` and that `useC15t().has(category).value` flips to `true`.
- **Using raw `<iframe data-category>`** — c15t scans the DOM on mount and via `MutationObserver`. If you added the iframe inside a Teleport, portal, or any detached node, the observer might not see it. Move it into the main tree or swap to `<C15tIframe>`.

Make sure you're using `data-src`, not `src` — setting `src` directly triggers the network request before c15t gets a chance to block it. See [Iframe Blocking](/guide/iframe-blocking).

## Consent doesn't persist across pages

Most often a storage problem:

- **Private browsing** restricts cookie and `localStorage` writes.
- **Cross-subdomain usage** needs backend cookie config — the `c15t` cookie is path-scoped by default. Hosted mode exposes this; offline mode doesn't.
- **Tracking-protection extensions** (uBlock, Ghostery) can delete the `c15t` cookie alongside tracking cookies.

To check which is the failing side:

```ts
console.log(document.cookie.includes('c15t='))
console.log(localStorage.getItem('c15t-state'))
```

If both are empty right after a save, the browser rejected the write — users in private mode will see this.

## Devtools panel is empty

The [DevTools panel](https://devtools.nuxt.com) depends on the client plugin having run. If you're inspecting the panel during SSR (before hydration), or in production without devtools enabled, it won't populate. Reload once the app is hydrated.

## Translations show English even though I set `defaultLanguage`

`c15t`'s store resets `translationConfig` during `initConsentManager`. nuxt-c15t re-applies your custom translations each time the store settles, but if you're setting them *after* the plugin runs (from a layout or page), you'll briefly see the built-in strings.

Put overrides in `nuxt.config.ts` rather than at runtime unless you genuinely need per-user strings.

## TypeScript errors about `runtimeConfig.public.c15t`

The generated `.nuxt/types/runtime-config.d.ts` lags behind changes to the module. Run `pnpm dev:prepare` (or your package manager's equivalent) to regenerate it. If you're typechecking in CI, add that step before `vue-tsc`.

## Still stuck?

Open an issue at [rolleyio/nuxt-c15t](https://github.com/rolleyio/nuxt-c15t/issues) with:

- Your `c15t` config block from `nuxt.config.ts`
- The `mode` and `backendURL` (redact if private)
- Browser console output after reproducing
- What `consentInfo.value?.type` and `activeUI.value` report
