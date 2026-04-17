import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'nuxt-c15t',
  description: 'Consent management for Nuxt — reactive composables, headless components, and Nuxt Scripts integration',

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/use-c15t' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Configuration', link: '/guide/configuration' },
          { text: 'Nuxt Scripts', link: '/guide/nuxt-scripts' },
          { text: 'Translations', link: '/guide/translations' },
          { text: 'Iframe Blocking', link: '/guide/iframe-blocking' },
          { text: 'Callbacks', link: '/guide/callbacks' },
        ],
      },
      {
        text: 'API',
        items: [
          { text: 'useC15t', link: '/api/use-c15t' },
          { text: 'useC15tScriptTrigger', link: '/api/use-c15t-script-trigger' },
          { text: 'useC15tConsent (server)', link: '/api/use-c15t-consent-server' },
          { text: 'useCookiePolicy', link: '/api/use-cookie-policy' },
        ],
      },
      {
        text: 'Components',
        items: [
          { text: 'C15tConsentManager', link: '/components/consent-manager' },
          { text: 'C15tBanner', link: '/components/banner' },
          { text: 'C15tDialog', link: '/components/dialog' },
          { text: 'C15tCookiePolicy', link: '/components/cookie-policy' },
          { text: 'C15tIframe', link: '/components/iframe' },
          { text: 'C15tConsentGate', link: '/components/consent-gate' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/rolleyio/nuxt-c15t' },
    ],
  },
})
