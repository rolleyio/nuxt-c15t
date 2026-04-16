export default defineNuxtConfig({
  modules: ['../src/module', '@nuxt/scripts', '@nuxt/ui'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  compatibilityDate: 'latest',

  c15t: {
    mode: 'offline',
    consentCategories: ['necessary', 'measurement', 'marketing', 'functionality', 'experience'],
    iframeBlocking: true,
    translations: {
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
            description: 'Diese Website verwendet Cookies, um Ihr Surferlebnis zu verbessern.',
          },
          consentManagerDialog: {
            title: 'Datenschutzeinstellungen',
            description: 'Passen Sie hier Ihre Datenschutzeinstellungen an.',
          },
          consentTypes: {
            necessary: { title: 'Unbedingt erforderlich', description: 'Diese Cookies sind für die Funktion der Website unerlässlich.' },
            functionality: { title: 'Funktionalität', description: 'Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung.' },
            marketing: { title: 'Marketing', description: 'Diese Cookies werden für Werbung und Retargeting verwendet.' },
            measurement: { title: 'Analyse', description: 'Diese Cookies helfen uns zu verstehen, wie Besucher die Website nutzen.' },
            experience: { title: 'Erfahrung', description: 'Diese Cookies helfen uns, ein besseres Nutzererlebnis zu bieten.' },
          },
        },
      },
    },
    cookiePolicy: {
      vendors: ['google-analytics', 'meta-pixel', 'hotjar', 'intercom'],
      cookies: [
        {
          name: 'session_id',
          vendor: 'This website',
          category: 'necessary',
          purpose: 'Maintains your logged-in session.',
          duration: 'Session',
          type: 'HTTP',
        },
        {
          name: 'theme',
          vendor: 'This website',
          category: 'functionality',
          purpose: 'Remembers your preferred colour scheme.',
          duration: '1 year',
          type: 'HTML Local Storage',
        },
      ],
    },
  },
})
