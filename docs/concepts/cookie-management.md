---
title: Cookie Management
description: What nuxt-c15t does — and doesn't — do with cookies, and how consent state itself is stored.
---

# Cookie Management

Scope check first, because the name is misleading.

> **c15t doesn't manage every cookie on your site.**
>
> It gates what *loads* — scripts, iframes, network requests. Cookies those assets would have set never exist, because the asset never ran.

For first-party cookies your own server sets, that's still on you.

## How consent state is stored

c15t persists its own decision in two places:

- **The `c15t` cookie** — consent categories, timestamp, subject ID. Flagged necessary because the site can't remember the user's choice without it.
- **`localStorage`** — mirror for resilience. If one is missing, the other is the source of truth.

Both write on every `saveConsents()` call. No sync delay.

## What c15t blocks, and how

| Surface | Mechanism | Docs |
| --- | --- | --- |
| `<script>` tags | Gated via `@nuxt/scripts` integration — trigger Promise resolves on consent. | [Nuxt Scripts](/guide/nuxt-scripts) |
| `<iframe>` elements | `<C15tIframe>` renders conditionally, or raw `<iframe data-src>` gets `src` restored. | [Iframe Blocking](/guide/iframe-blocking) |
| `fetch` / `XMLHttpRequest` | Network blocker short-circuits matching requests with a 451. | [Network Blocker](/guide/network-blocker) |
| Your own code | `useC15t().has(...)` / `<C15tConsentGate>`. | [useC15t](/api/use-c15t) |

## Why revoking consent triggers a reload (when enabled)

Many tracking cookies are `HttpOnly` — JavaScript can't read or delete them. Others live on third-party domains c15t can't touch. A reload isn't elegant but it's the only reliable way to re-render the page without the now-revoked scripts in play. Opt out with `reloadOnConsentRevoked: false` if you manage cleanup yourself.

Hook [`onBeforeConsentRevocationReload`](/guide/callbacks) to show a loader before the reload fires.

## Consent on the server

For SSR branching (e.g. don't render the analytics `<script>` server-side unless consent is granted), use [`useC15tConsent` server composable](/api/use-c15t-consent-server). It parses the `c15t` cookie in-request without pulling in the client runtime.

## What c15t does not do

- It doesn't delete cookies after revocation — browsers own the lifetime of third-party cookies.
- It doesn't scan your site for undeclared cookies — that's a compliance-audit tool, not a CMP.
- It doesn't configure `SameSite` / `Secure` / cross-subdomain for your own cookies — those are nitro / nginx / your framework's concern.

If you need a discoverable list of cookies for visitors, see [`<C15tCookiePolicy>`](/components/cookie-policy) — a table you populate from config.
