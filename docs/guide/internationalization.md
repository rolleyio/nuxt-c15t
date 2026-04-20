---
title: Internationalization
description: Translate the consent UI, switch languages at runtime, and integrate with @nuxtjs/i18n.
---

# Internationalization

nuxt-c15t ships with English built-in. Override it with your own translations and switch languages at runtime — optionally driven by [`@nuxtjs/i18n`](https://i18n.nuxtjs.org/).

## Providing translations

Set `translations` in `nuxt.config.ts`. Your strings are **merged** into the built-in set — you only need to override the keys you want to change.

```ts
c15t: {
  translations: {
    defaultLanguage: 'de',
    translations: {
      de: {
        common: {
          acceptAll: 'Alle akzeptieren',
          rejectAll: 'Alle ablehnen',
          save: 'Einstellungen speichern',
        },
        cookieBanner: {
          title: 'Wir schätzen Ihre Privatsphäre',
        },
        consentTypes: {
          marketing: {
            title: 'Marketing',
            description: 'Diese Cookies werden für Werbung und Retargeting verwendet.',
          },
        },
      },
    },
  },
}
```

Unprovided keys fall back to English.

## Switching language at runtime

```ts
const { setLanguage } = useC15t()

setLanguage('de')
```

That writes to the store's override and re-applies the resolved language to every consent-UI component. Custom translations passed via `translations` are re-applied automatically — internally the plugin re-merges them whenever c15t resets the translation config (it does this during `setLanguage`).

## Integrating with `@nuxtjs/i18n`

nuxt-c15t and `@nuxtjs/i18n` don't collide — they manage different surfaces. To keep the two in lockstep, react to locale changes and forward them:

```vue
<script setup lang="ts">
const { setLanguage } = useC15t()
const { locale } = useI18n()

watch(locale, (next) => {
  setLanguage(next)
}, { immediate: true })
</script>
```

Put this watcher in a component that mounts once (your layout or `app.vue`) so the forwarding runs for the whole app.

## Auto-detect from the browser

By default c15t reads `navigator.language` and picks a matching entry from `translations.translations`. Disable this if you want to control language exclusively from code:

```ts
c15t: {
  translations: {
    translations: { /* ... */ },
    defaultLanguage: 'en',
    disableAutoLanguageSwitch: true,
  },
}
```

## Translation keys

The full key list lives in [`c15t`'s translation schema](https://github.com/c15t/c15t/blob/main/packages/translations/src/types.ts). Notable top-level sections:

| Section | What it drives |
| --- | --- |
| `common.*` | Button labels — `acceptAll`, `rejectAll`, `save`, `close`, `customize`. |
| `cookieBanner.*` | Banner heading and description. |
| `consentManagerDialog.*` | Preferences dialog heading and description. |
| `consentTypes.<category>.*` | Per-category `title` and `description`. |
| `frame.*` | Placeholder text for [`<C15tIframe>`](/components/iframe) when consent is denied. |

## Where translations don't reach

- **Your own components** — anything you render outside the built-in components uses your normal i18n setup, not c15t's.
- **Server-rendered text** — the c15t runtime is client-only. If you SSR consent-aware content, translate it through `@nuxtjs/i18n` as normal.
- **Vendor cookie policy entries** — the [`<C15tCookiePolicy>`](/components/cookie-policy) table renders strings from your config verbatim. Localize those at the config level if you build the registry dynamically.
