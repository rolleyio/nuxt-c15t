import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  c15t: {
    mode: 'offline',
    consentCategories: ['necessary', 'measurement', 'marketing'],
    cookiePolicy: {
      vendors: ['google-analytics'],
      cookies: [
        {
          name: 'session_id',
          vendor: 'This website',
          category: 'necessary',
          purpose: 'Session management',
          duration: 'Session',
          type: 'HTTP',
        },
      ],
    },
  },
})
