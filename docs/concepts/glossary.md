---
title: Glossary
description: Consent-management terms used throughout nuxt-c15t — CMP, DSAR, IAB TCF, GPC, jurisdiction, policy pack.
---

# Glossary

Terms that appear across the docs, in alphabetical order.

**CMP** — Consent Management Platform. The whole surface that shows banners, stores decisions, and gates tracking. nuxt-c15t is one.

**CCPA / CPRA** — California Consumer Privacy Act and its 2020 amendment. Opt-out model with a "Do Not Sell or Share" requirement. Covered by `policyPackPresets.californiaOptOut()`.

**Consent category** — one of `necessary`, `functionality`, `experience`, `measurement`, `marketing`. The unit of consent across c15t. See [Consent Categories](/concepts/consent-categories).

**Consent model** — the rule a jurisdiction enforces: `opt-in`, `opt-out`, `iab`, or `none`. See [Consent Models](/concepts/consent-models).

**DSAR** — Data Subject Access Request. A GDPR Article 15 right ("give me my data / delete my data"). c15t stores consent records but does not itself implement DSAR intake — wire those through your own backend.

**Fingerprint** — a hash of the resolved policy. When the fingerprint changes (you edited your pack, the regulation changed), c15t re-prompts users who consented under the old version.

**GDPR** — General Data Protection Regulation. EU + EEA. Strict opt-in. Covered by `policyPackPresets.europeOptIn()`.

**GPC** — [Global Privacy Control](https://globalprivacycontrol.org). A browser signal that opts the user out of sale/sharing. c15t respects it in opt-out jurisdictions — `measurement` and `marketing` are auto-denied when present.

**IAB TCF 2.3** — the ad industry's programmatic-ads consent framework. Produces a TC String readable by ad-tech vendors. c15t ships this as a separate concern; only needed if you run programmatic ads.

**Jurisdiction** — the code c15t resolves from the visitor's IP — `gdpr`, `ccpa`, `quebec`, etc. Drives which [policy pack](/guide/policy-packs) matches.

**LGPD** — Brazil's *Lei Geral de Proteção de Dados*. Opt-in model, close to GDPR in practice.

**Necessary cookie** — a cookie the site can't function without. The `c15t` cookie itself is a necessary cookie because it remembers the user's decision.

**Offline mode** — c15t without a backend. Everything lives in `localStorage` and the `c15t` cookie. See [Client Modes](/concepts/client-modes).

**Policy pack** — a config object with `match`, `consent`, `ui`, and `proof` fields that tells c15t how to behave for a jurisdiction. See [Policy Packs](/guide/policy-packs).

**Subject** — the user, in c15t's data model. `consentInfo.subjectId` is their opaque ID, stored in the `c15t` cookie.

**TC String** — the IAB TCF 2.3 consent payload, a Base64-encoded blob vendor scripts read via `__tcfapi()`.
