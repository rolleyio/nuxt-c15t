import { describe, it, expect } from 'vitest'
import { detectBrowserLanguage } from 'c15t'

/**
 * Tests the exact translation resolution logic from useC15t's computed,
 * without Vue reactivity — just the pure function.
 */

const defaultTranslations = {
  common: { acceptAll: 'Accept All', rejectAll: 'Reject All' },
  cookieBanner: { title: 'We value your privacy' },
}

function resolveTranslations(
  tc: { translations?: Record<string, Record<string, unknown>>, defaultLanguage?: string, disableAutoLanguageSwitch?: boolean } | null,
  activeLanguage: string | undefined,
) {
  if (!tc?.translations) return defaultTranslations

  const lang = activeLanguage ?? detectBrowserLanguage(
    tc.translations,
    tc.defaultLanguage,
    tc.disableAutoLanguageSwitch,
  )
  const t = tc.translations[lang]
  if (!t) return defaultTranslations

  return {
    common: { ...defaultTranslations.common, ...t.common },
    cookieBanner: { ...defaultTranslations.cookieBanner, ...t.cookieBanner },
  }
}

const bothLanguages = {
  translations: {
    en: { common: { acceptAll: 'Accept All' }, cookieBanner: { title: 'Privacy' } },
    de: { common: { acceptAll: 'Alle akzeptieren' }, cookieBanner: { title: 'Datenschutz' } },
  },
  defaultLanguage: 'en',
}

describe('translation resolution', () => {
  it('returns defaults when translationConfig is null', () => {
    expect(resolveTranslations(null, undefined).common.acceptAll).toBe('Accept All')
  })

  it('returns English when no activeLanguage and defaultLanguage is en', () => {
    // detectBrowserLanguage without window returns defaultLanguage
    expect(resolveTranslations(bothLanguages, undefined).common.acceptAll).toBe('Accept All')
  })

  it('returns German when activeLanguage is de', () => {
    expect(resolveTranslations(bothLanguages, 'de').common.acceptAll).toBe('Alle akzeptieren')
  })

  it('returns English when activeLanguage is en', () => {
    expect(resolveTranslations(bothLanguages, 'en').common.acceptAll).toBe('Accept All')
  })

  it('returns defaults when activeLanguage is unknown', () => {
    expect(resolveTranslations(bothLanguages, 'fr').common.acceptAll).toBe('Accept All')
  })

  it('merges partial translations with defaults', () => {
    const partial = {
      translations: {
        de: { common: { acceptAll: 'Alle akzeptieren' } },
      },
      defaultLanguage: 'en',
    }
    const result = resolveTranslations(partial, 'de')
    expect(result.common.acceptAll).toBe('Alle akzeptieren')
    // rejectAll not provided in de, should keep default
    expect(result.common.rejectAll).toBe('Reject All')
  })

  it('returns defaults when translations object is empty', () => {
    expect(resolveTranslations({ translations: {} }, undefined).common.acceptAll).toBe('Accept All')
  })

  it('detectBrowserLanguage returns defaultLanguage when no window', () => {
    // In Node (no window), detectBrowserLanguage should return defaultLanguage
    const lang = detectBrowserLanguage(bothLanguages.translations, 'en', false)
    expect(lang).toBe('en')
  })

  it('detectBrowserLanguage returns en when disableAutoSwitch and no defaultLanguage', () => {
    const lang = detectBrowserLanguage(bothLanguages.translations, undefined, true)
    expect(lang).toBe('en')
  })
})
