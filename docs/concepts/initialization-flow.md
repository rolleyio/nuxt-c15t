---
title: Initialization Flow
description: Exactly what happens when nuxt-c15t boots — plugin mount, store creation, /init, policy resolution, banner decision, gating.
---

# Initialization Flow

What happens, in order, when a page loads.

## 1. Plugin mount (client only)

`nuxt-c15t` registers [plugin.client.ts](https://github.com/rolleyio/nuxt-c15t/blob/main/src/runtime/plugin.client.ts), which runs once per client navigation lifecycle. It calls `getOrCreateConsentRuntime()` from `c15t`, which creates the store the first time and returns the cached instance on subsequent invocations.

Server renders never create a store — all c15t state is client-only. The `useC15tConsent.server` composable reads the consent cookie directly instead.

## 2. Runtime + store creation

`getOrCreateConsentRuntime()`:

- Builds the Zustand vanilla store with its initial state.
- Reads any existing consent from `localStorage` / the `c15t` cookie.
- Registers the iframe blocker and network blocker (if configured) so they're active before the first paint.
- Applies `consentCategories`, `overrides` (including `countryOverride`), and any `offlinePolicy.policyPacks`.

The store is provided to the Nuxt app as `$c15tStore` and surfaced through `useC15t()`.

## 3. Policy resolution

In **hosted / self-hosted** mode, `c15t` fires `GET /init` against the configured `backendURL`. The prefetch script injected into `<head>` (enabled by default via [the `prefetchScript` option](/guide/configuration)) can start this request before the Nuxt bundle hydrates, eliminating waterfalls.

In **offline** mode, c15t evaluates `offlinePolicy.policyPacks` locally using `region > country > default` precedence. See [Policy Packs](/guide/policy-packs).

The resolved response includes:

- `model` — `opt-in`, `opt-out`, `iab`, or `none`
- `ui` — `banner`, `dialog`, or `none`
- `categories` — allowed / default categories for the matched jurisdiction
- A policy fingerprint — if it changes, consent re-prompts

## 4. Banner decision

The banner renders only when all of these are true:

- The resolved `ui.mode` is `banner` or `dialog`.
- No prior consent exists, **or** the stored fingerprint no longer matches the resolved fingerprint.
- `activeUI` hasn't been forced to `'none'`.

For opt-out jurisdictions the default UI is `none` — tracking is legal without a blocking banner, so nothing renders unless you explicitly ask for it.

## 5. Gating takes effect

Once the store settles, gated integrations activate:

- [`<C15tIframe>`](/components/iframe) mounts the iframe when its category is granted.
- Raw `<iframe data-category>` elements get their `src` restored when consent lands.
- The [network blocker](/guide/network-blocker) short-circuits matching `fetch`/`XHR` calls until categories are granted.
- `<NuxtScript>` consumers using [`useC15tScriptTrigger`](/api/use-c15t-script-trigger) wait for their consent promise to resolve.

## SSR and hydration

Nothing hydrates from the server because the plugin is `.client`. The upside: no SSR mismatch on consent state — it simply doesn't exist during render. The downside: if you need server-rendered content to branch on consent, use the [`useC15tConsent` server composable](/api/use-c15t-consent-server) which reads the cookie directly.

The prefetch script (`head` position, hosted modes only) is the escape hatch for "I want `/init` to be in flight before my JS runs." It's safe to keep enabled.
