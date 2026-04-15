# Translations

`nuxt-c15t` supports multi-language consent UI via the `translations` config option. Custom translations are merged with c15t's built-in English strings.

## Configuration

```ts
export default defineNuxtConfig({
  c15t: {
    translations: {
      defaultLanguage: 'de',
      translations: {
        de: {
          common: {
            acceptAll: 'Alle akzeptieren',
            rejectAll: 'Alle ablehnen',
            customize: 'Anpassen',
            save: 'Einstellungen speichern',
            close: 'Schließen',
          },
          cookieBanner: {
            title: 'Wir schätzen Ihre Privatsphäre',
            description: 'Diese Website verwendet Cookies.',
          },
        },
      },
    },
  },
})
```

## Runtime Language Switching

Use `setLanguage()` to change the active language at runtime:

```vue
<script setup>
const { setLanguage, translationConfig } = useC15t()

// Switch to German
setLanguage('de')
</script>
```

## Translation Keys

### `common`

| Key | Default (English) |
| --- | --- |
| `acceptAll` | Accept All |
| `rejectAll` | Reject All |
| `customize` | Customize |
| `save` | Save Settings |
| `close` | Close |

### `cookieBanner`

| Key | Default (English) |
| --- | --- |
| `title` | We value your privacy |
| `description` | This site uses cookies to improve your browsing experience, analyze site traffic, and show personalized content. |

### `consentManagerDialog`

Keys for the preferences dialog. See the `translationConfig` reactive value for the full structure.

## Auto-detection

By default, c15t detects the browser language and selects the best matching translation. Disable this with:

```ts
translations: {
  disableAutoLanguageSwitch: true,
  defaultLanguage: 'en',
}
```
