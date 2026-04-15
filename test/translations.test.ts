import { describe, it, expect } from 'vitest'

/**
 * Tests for the translation resolution logic extracted from useC15t.
 */

interface ResolvedTranslations {
  common: Record<string, string>
  cookieBanner: Record<string, string>
  consentManagerDialog: Record<string, string>
  consentTypes: Record<string, { title: string; description: string }>
}

const defaultTranslations: ResolvedTranslations = {
  common: {
    acceptAll: 'Accept All',
    rejectAll: 'Reject All',
    customize: 'Customize',
    save: 'Save Settings',
    close: 'Close',
  },
  cookieBanner: {
    title: 'We value your privacy',
    description: 'This site uses cookies to improve your browsing experience, analyze site traffic, and show personalized content.',
  },
  consentManagerDialog: {
    title: 'Privacy Settings',
    description: 'Customize your privacy settings here. You can choose which types of cookies and tracking technologies you allow.',
  },
  consentTypes: {
    necessary: { title: 'Strictly Necessary', description: 'These cookies are essential for the website to function properly and cannot be disabled.' },
    functionality: { title: 'Functionality', description: 'These cookies enable enhanced functionality and personalization of the website.' },
    marketing: { title: 'Marketing', description: 'These cookies are used to deliver relevant advertisements and track their effectiveness.' },
    measurement: { title: 'Analytics', description: 'These cookies help us understand how visitors interact with the website and improve its performance.' },
    experience: { title: 'Experience', description: 'These cookies help us provide a better user experience and test new features.' },
  },
}

// Simulates the translation resolution logic from useC15t
function resolveTranslations(
  translationConfig: { translations?: Record<string, any>; defaultLanguage?: string } | null,
  detectedLanguage?: string,
): ResolvedTranslations {
  if (!translationConfig?.translations) return defaultTranslations

  const lang = detectedLanguage ?? translationConfig.defaultLanguage ?? 'en'
  const t = translationConfig.translations[lang]
  if (!t) return defaultTranslations

  return {
    common: { ...defaultTranslations.common, ...t.common },
    cookieBanner: { ...defaultTranslations.cookieBanner, ...t.cookieBanner },
    consentManagerDialog: { ...defaultTranslations.consentManagerDialog, ...t.consentManagerDialog },
    consentTypes: { ...defaultTranslations.consentTypes, ...t.consentTypes },
  }
}

describe('translation resolution', () => {
  it('returns English defaults when no config is provided', () => {
    const result = resolveTranslations(null)
    expect(result.common.acceptAll).toBe('Accept All')
    expect(result.cookieBanner.title).toBe('We value your privacy')
  })

  it('returns English defaults when config has empty translations', () => {
    const result = resolveTranslations({ translations: {} })
    expect(result.common.acceptAll).toBe('Accept All')
  })

  it('resolves German translations when available', () => {
    const config = {
      translations: {
        de: {
          common: { acceptAll: 'Alle akzeptieren', rejectAll: 'Alle ablehnen' },
          cookieBanner: { title: 'Datenschutz' },
        },
      },
      defaultLanguage: 'de',
    }
    const result = resolveTranslations(config)
    expect(result.common.acceptAll).toBe('Alle akzeptieren')
    expect(result.common.rejectAll).toBe('Alle ablehnen')
    expect(result.cookieBanner.title).toBe('Datenschutz')
  })

  it('falls back to English for missing keys in custom language', () => {
    const config = {
      translations: {
        de: {
          common: { acceptAll: 'Alle akzeptieren' },
        },
      },
      defaultLanguage: 'de',
    }
    const result = resolveTranslations(config)
    expect(result.common.acceptAll).toBe('Alle akzeptieren')
    // Keys not provided in German fall back to English
    expect(result.common.customize).toBe('Customize')
    expect(result.common.save).toBe('Save Settings')
    expect(result.cookieBanner.title).toBe('We value your privacy')
  })

  it('uses detected language over default language', () => {
    const config = {
      translations: {
        en: { common: { acceptAll: 'Accept All' } },
        de: { common: { acceptAll: 'Alle akzeptieren' } },
      },
      defaultLanguage: 'en',
    }
    const result = resolveTranslations(config, 'de')
    expect(result.common.acceptAll).toBe('Alle akzeptieren')
  })

  it('falls back to defaults when detected language is not available', () => {
    const config = {
      translations: {
        en: { common: { acceptAll: 'Accept All' } },
      },
      defaultLanguage: 'en',
    }
    const result = resolveTranslations(config, 'fr')
    expect(result.common.acceptAll).toBe('Accept All')
  })

  it('merges custom consent type translations', () => {
    const config = {
      translations: {
        de: {
          consentTypes: {
            marketing: { title: 'Werbung', description: 'Werbecookies' },
          },
        },
      },
      defaultLanguage: 'de',
    }
    const result = resolveTranslations(config)
    expect(result.consentTypes.marketing.title).toBe('Werbung')
    // Other consent types keep English defaults
    expect(result.consentTypes.necessary.title).toBe('Strictly Necessary')
  })

  it('preserves all default consent types when custom only adds some', () => {
    const config = {
      translations: {
        en: {
          consentTypes: {
            marketing: { title: 'Ads & Marketing', description: 'Custom description' },
          },
        },
      },
    }
    const result = resolveTranslations(config, 'en')
    expect(result.consentTypes.marketing.title).toBe('Ads & Marketing')
    expect(result.consentTypes.necessary.title).toBe('Strictly Necessary')
    expect(result.consentTypes.measurement.title).toBe('Analytics')
  })
})

describe('module options: translations', () => {
  function resolveConfig(options: { translations?: object }) {
    return {
      translations: options.translations ?? {},
    }
  }

  it('defaults translations to empty object', () => {
    const config = resolveConfig({})
    expect(config.translations).toEqual({})
  })

  it('passes translations config through', () => {
    const translations = {
      translations: { de: { common: { acceptAll: 'Alle akzeptieren' } } },
      defaultLanguage: 'de',
    }
    const config = resolveConfig({ translations })
    expect(config.translations).toEqual(translations)
  })
})
