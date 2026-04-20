---
title: Consent Categories
description: The five consent categories nuxt-c15t ships — necessary, functionality, experience, measurement, marketing — and what each means.
---

# Consent Categories

c15t groups tracking into five categories, aligned with GDPR / ePrivacy guidance. Users toggle categories, not individual cookies — listing every `_ga` / `_fbp` name is noise that doesn't help users decide.

| Category | Always enabled | Typical purpose |
| --- | --- | --- |
| `necessary` | Yes — cannot be disabled | Session, CSRF, cart, auth — things the site literally can't function without. |
| `functionality` | No | Preferences, remembered settings, language, theme. |
| `experience` | No | Quality-of-life improvements — soft analytics, feature flags tied to consent. |
| `measurement` | No | Analytics and telemetry — GA4, Mixpanel, PostHog. |
| `marketing` | No | Ads, retargeting, social embeds. |

`necessary` is enforced internally. Toggling it off from the UI is not possible — c15t treats it as permanently granted.

## Choosing which to show

List the categories you actually use:

```ts
c15t: {
  consentCategories: ['necessary', 'measurement', 'marketing'],
}
```

Unlisted categories don't appear in the banner or dialog but still exist in the consent state (default `false`). You can check them in code regardless:

```ts
const { has } = useC15t()
const hasExperience = has('experience') // always false if not listed and not granted
```

## Mapping categories to real cookies

`consentCategories` controls the UI toggles. The [cookie policy table](/components/cookie-policy) lists individual cookies and maps them back to categories — users see a summary grouped by category, with the underlying vendor cookies visible if they want the detail.

```ts
c15t: {
  consentCategories: ['necessary', 'measurement', 'marketing'],
  cookiePolicy: {
    vendors: ['google-analytics', 'meta-pixel'],
    cookies: [
      { name: 'session_id', vendor: 'This website', category: 'necessary', /* ... */ },
    ],
  },
}
```

## How categories flow through your code

- **Category check** — [`useC15t().has('measurement')`](/api/use-c15t) returns a reactive boolean.
- **Compound check** — pass `{ and: ['measurement', 'marketing'] }` or `{ or: [...] }` for multi-category conditions.
- **Script gate** — [`useC15tScriptTrigger`](/api/use-c15t-script-trigger) returns a Promise for `@nuxt/scripts`.
- **Iframe gate** — `<C15tIframe category="marketing">` or raw `<iframe data-category="marketing" data-src="...">`.
- **Network gate** — [network blocker rules](/guide/network-blocker) with `{ category: 'measurement' }`.
- **Arbitrary gate** — `<C15tConsentGate category="experience">` for any slot content.

The whole module treats category as the unit of consent — adding a new one is a single string in `consentCategories`.
