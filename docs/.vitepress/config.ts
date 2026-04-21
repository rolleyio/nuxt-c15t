import { defineConfig } from 'vitepress'

const SITE_URL = 'https://nuxt-c15t.rolley.io'
const OG_IMAGE = `${SITE_URL}/og.png`

export default defineConfig({
  title: 'nuxt-c15t',
  description: 'Consent management for Nuxt — reactive composables, headless components, and Nuxt Scripts integration',

  lastUpdated: true,

  sitemap: {
    hostname: SITE_URL,
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],

    // Canonical URL handled per-page via transformHead below

    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'nuxt-c15t' }],
    ['meta', { property: 'og:image', content: OG_IMAGE }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],

    // Twitter card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: OG_IMAGE }],
  ],

  transformHead: ({ pageData }) => {
    const head: Array<[string, Record<string, string>]> = []
    const path = pageData.relativePath.replace(/\.md$/, '').replace(/index$/, '')
    const url = `${SITE_URL}/${path}`.replace(/\/$/, '') || SITE_URL
    const title = pageData.frontmatter.title
      ? `${pageData.frontmatter.title} | nuxt-c15t`
      : 'nuxt-c15t — Consent management for Nuxt'
    const description = pageData.frontmatter.description ?? 'Consent management for Nuxt — reactive composables, headless components, and Nuxt Scripts integration'

    head.push(['link', { rel: 'canonical', href: url }])
    head.push(['meta', { property: 'og:url', content: url }])
    head.push(['meta', { property: 'og:title', content: title }])
    head.push(['meta', { property: 'og:description', content: description }])
    head.push(['meta', { name: 'twitter:title', content: title }])
    head.push(['meta', { name: 'twitter:description', content: description }])
    return head
  },

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/use-c15t' },
      { text: 'Playground', link: 'https://playground.nuxt-c15t.rolley.io/', target: '_blank' },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Configuration', link: '/guide/configuration' },
          { text: 'Nuxt Scripts', link: '/guide/nuxt-scripts' },
          { text: 'Translations', link: '/guide/translations' },
          { text: 'Internationalization', link: '/guide/internationalization' },
          { text: 'Iframe Blocking', link: '/guide/iframe-blocking' },
          { text: 'Network Blocker', link: '/guide/network-blocker' },
          { text: 'Policy Packs', link: '/guide/policy-packs' },
          { text: 'Callbacks', link: '/guide/callbacks' },
          { text: 'Troubleshooting', link: '/guide/troubleshooting' },
        ],
      },
      {
        text: 'Concepts',
        items: [
          { text: 'Initialization Flow', link: '/concepts/initialization-flow' },
          { text: 'Client Modes', link: '/concepts/client-modes' },
          { text: 'Consent Models', link: '/concepts/consent-models' },
          { text: 'Consent Categories', link: '/concepts/consent-categories' },
          { text: 'Cookie Management', link: '/concepts/cookie-management' },
          { text: 'Glossary', link: '/concepts/glossary' },
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
          { text: 'C15tDialogLink', link: '/components/dialog-link' },
          { text: 'C15tDialogTrigger', link: '/components/dialog-trigger' },
          { text: 'C15tWidget', link: '/components/widget' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/rolleyio/nuxt-c15t' },
    ],
  },
})
