---
title: Network Blocker
description: Block outgoing fetch and XMLHttpRequest calls to tracking endpoints until the matching consent category is granted — catches beacons and pixels from already-loaded code.
---

# Network Blocker

The network blocker intercepts outgoing `fetch` and `XMLHttpRequest` calls and short-circuits them with a `451` response when they target tracking endpoints and the required consent category hasn't been granted.

This complements iframe blocking and the Nuxt Scripts integration: those stop third-party code from *loading*, while the network blocker stops *already-loaded* code from phoning home — analytics beacons, pixel fires, bundled SDKs that ship with your app, etc.

## Setup

Define rules in `nuxt.config.ts`. Each rule matches by domain (subdomains included) and optionally by path and HTTP method. Matching requests are blocked until the rule's `category` is granted.

```ts
export default defineNuxtConfig({
  c15t: {
    networkBlocker: {
      rules: [
        { id: 'ga', domain: 'google-analytics.com', category: 'measurement' },
        { id: 'fb', domain: 'facebook.com', category: 'marketing', pathIncludes: '/tr' },
        { id: 'hj', domain: 'hotjar.com', category: 'measurement', methods: ['POST'] },
      ],
    },
  },
})
```

Blocking becomes active as soon as the page loads. When the user grants the required consent, matching requests pass through; revoke it and they start blocking again.

## Rule fields

| Field | Type | Description |
| --- | --- | --- |
| `domain` | `string` | Hostname to match. Subdomains match too — `google-analytics.com` catches `stats.google-analytics.com`. |
| `category` | `AllConsentNames \| HasCondition` | Consent category that must be granted. Supports `{ and: [...] }` / `{ or: [...] }` composition. |
| `pathIncludes` | `string?` | Require this substring in the URL path. |
| `methods` | `string[]?` | Limit to these HTTP methods. Omit to match any. |
| `id` | `string?` | Debug label — logged on block and passed to `onRequestBlocked`. |

## Runtime API

`useC15t()` exposes `setNetworkBlocker()` for dynamic rules and the `onRequestBlocked` callback, which can't live in `nuxt.config` (must be JSON-serializable):

```vue
<script setup lang="ts">
const { setNetworkBlocker } = useC15t()

setNetworkBlocker({
  enabled: true,
  rules: [
    { id: 'ga', domain: 'google-analytics.com', category: 'measurement' },
  ],
  onRequestBlocked: (info) => {
    console.warn('blocked:', info.method, info.url, 'rule:', info.rule?.id)
  },
})
</script>
```

## Options

| Option | Default | Description |
| --- | --- | --- |
| `enabled` | `true` | Set `false` to keep rules configured but disable blocking. |
| `logBlockedRequests` | `true` | Emit a `console.warn` for each blocked request. |
| `onRequestBlocked` | — | Callback fired on each block (runtime-only — register via `setNetworkBlocker`). |
| `rules` | `[]` | Array of domain rules — see above. |

## How requests are blocked

- `fetch` returns a `Response(null, { status: 451 })`. Inspect `res.status` to detect blocks.
- `XMLHttpRequest` is aborted and fires the `error` event.

If your own code calls a blocked endpoint, handle the `451` status the same way you'd handle any other error.

## Relationship to other blocking features

- **Iframe blocking** stops `<iframe>` elements from loading. See [Iframe Blocking](/guide/iframe-blocking).
- **Nuxt Scripts integration** gates `<script>` loading. See [Nuxt Scripts](/guide/nuxt-scripts).
- **Network blocker** stops outgoing requests from whatever *did* load.

Use all three for defense in depth: block the script tag, block any iframe it renders, and block any tracking request it tries to send.
