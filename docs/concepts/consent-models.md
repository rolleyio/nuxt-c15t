---
title: Consent Models
description: opt-in, opt-out, iab, and none — what each model does to the default state and the UI that renders.
---

# Consent Models

The **model** is the consent rule for a given jurisdiction. It's set per policy pack and drives the banner, defaults, and what "no decision yet" means. Resolved by the backend (hosted mode) or by the matched [policy pack](/guide/policy-packs) (offline mode).

## `opt-in`

Nothing tracks until the user explicitly grants it. All non-`necessary` categories default to `false`. A blocking banner or dialog renders on first visit.

**Applies to** EEA + UK (GDPR), Quebec (Law 25), Brazil (LGPD), and other strict-consent regimes.

## `opt-out`

Tracking is on by default — users must revoke it. All categories default to `true`. Typically renders a non-blocking notice with a "do not sell" link, not a modal.

**Applies to** California (CCPA / CPRA) and most of the US, Australia, Canada (outside Quebec).

When the backend detects the browser's **Global Privacy Control** signal, `measurement` and `marketing` are auto-denied regardless of the model default.

## `iab`

IAB TCF 2.3 — the programmatic-ads consent standard. Only active when the jurisdiction is GDPR / UK-GDPR AND `iab.enabled` is true in the policy. Emits the standard TC String and wires up the `__tcfapi` stub for vendor scripts.

**Applies to** sites running programmatic ads in the EEA + UK.

## `none`

No banner, all categories auto-grant on first visit. Used as the catch-all for jurisdictions without a consent requirement.

**Applies to** visitors outside any configured pack, or when you want a no-prompt experience (`policyPackPresets.worldNoBanner()`).

## How the model changes behavior

| Behavior | `opt-in` | `opt-out` | `iab` | `none` |
| --- | --- | --- | --- | --- |
| Default for non-necessary categories | `false` | `true` | per TCF rules | `true` |
| Banner on first visit | Yes | Sometimes (opt-out notice) | Yes (TCF banner) | No |
| Scripts / iframes blocked by default | Yes | No | Per purpose | No |
| GPC respected | No (already opt-in) | Yes | Yes | N/A |

In `useC15t()`, read the resolved model from `consentInfo.value?.type` after the store hydrates.
