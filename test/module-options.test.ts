import { describe, it, expect } from 'vitest'

/**
 * Tests that validate the module configuration shape.
 * These don't spin up Nuxt — they test the config processing logic
 * that the module.ts setup function performs.
 */
describe('module options: countryOverride', () => {
  // Simulates the logic from plugin.client.ts
  function buildRuntimeOverrides(config: { countryOverride?: string }) {
    return {
      ...(config.countryOverride && { overrides: { country: config.countryOverride } }),
    }
  }

  it('produces no overrides when countryOverride is not set', () => {
    const result = buildRuntimeOverrides({})
    expect(result).toEqual({})
  })

  it('produces no overrides when countryOverride is empty string', () => {
    const result = buildRuntimeOverrides({ countryOverride: '' })
    expect(result).toEqual({})
  })

  it('produces overrides when countryOverride is set', () => {
    const result = buildRuntimeOverrides({ countryOverride: 'DE' })
    expect(result).toEqual({ overrides: { country: 'DE' } })
  })

  it('produces overrides for US country code', () => {
    const result = buildRuntimeOverrides({ countryOverride: 'US' })
    expect(result).toEqual({ overrides: { country: 'US' } })
  })
})

describe('module options: iframeBlocking', () => {
  // Simulates the logic from plugin.client.ts
  function buildIframeBlockerConfig(config: { iframeBlocking: boolean }) {
    return config.iframeBlocking ? {} : { disableAutomaticBlocking: true }
  }

  it('enables iframe blocking by default (empty config)', () => {
    const result = buildIframeBlockerConfig({ iframeBlocking: true })
    expect(result).toEqual({})
  })

  it('disables automatic blocking when iframeBlocking is false', () => {
    const result = buildIframeBlockerConfig({ iframeBlocking: false })
    expect(result).toEqual({ disableAutomaticBlocking: true })
  })
})

describe('module options: mode resolution', () => {
  // Simulates the logic from plugin.client.ts
  function buildModeConfig(config: { mode: 'hosted' | 'offline' | 'self-hosted', backendURL: string }) {
    return config.mode === 'offline'
      ? { mode: 'offline' as const }
      : { mode: 'hosted' as const, backendURL: config.backendURL }
  }

  it('produces offline config with no backendURL', () => {
    const result = buildModeConfig({ mode: 'offline', backendURL: '' })
    expect(result).toEqual({ mode: 'offline' })
    expect(result).not.toHaveProperty('backendURL')
  })

  it('produces hosted config with backendURL for hosted mode', () => {
    const result = buildModeConfig({ mode: 'hosted', backendURL: 'https://my-instance.c15t.dev' })
    expect(result).toEqual({ mode: 'hosted', backendURL: 'https://my-instance.c15t.dev' })
  })

  it('maps self-hosted to hosted mode with backendURL', () => {
    const result = buildModeConfig({ mode: 'self-hosted', backendURL: 'https://consent.example.com' })
    expect(result).toEqual({ mode: 'hosted', backendURL: 'https://consent.example.com' })
  })

  it('offline mode does not include backendURL even if provided', () => {
    const result = buildModeConfig({ mode: 'offline', backendURL: 'https://ignored.example.com' })
    expect(result).toEqual({ mode: 'offline' })
    expect(result).not.toHaveProperty('backendURL')
  })
})

describe('module options: defaults', () => {
  // Simulates the defaults from module.ts
  function resolveConfig(options: {
    mode?: string
    backendURL?: string
    consentCategories?: string[]
    countryOverride?: string
    iframeBlocking?: boolean
  }) {
    let mode = options.mode ?? 'hosted'
    if (mode !== 'offline' && !options.backendURL) {
      mode = 'offline'
    }

    return {
      mode,
      backendURL: options.backendURL ?? '',
      consentCategories: options.consentCategories ?? ['necessary', 'measurement', 'marketing'],
      countryOverride: options.countryOverride ?? '',
      iframeBlocking: options.iframeBlocking ?? true,
    }
  }

  it('falls back to offline mode when no backendURL is provided', () => {
    const config = resolveConfig({ mode: 'hosted' })
    expect(config.mode).toBe('offline')
  })

  it('keeps hosted mode when backendURL is provided', () => {
    const config = resolveConfig({ mode: 'hosted', backendURL: 'https://my-instance.c15t.dev' })
    expect(config.mode).toBe('hosted')
  })

  it('uses default consent categories', () => {
    const config = resolveConfig({})
    expect(config.consentCategories).toEqual(['necessary', 'measurement', 'marketing'])
  })

  it('uses custom consent categories when provided', () => {
    const config = resolveConfig({ consentCategories: ['necessary', 'functionality'] })
    expect(config.consentCategories).toEqual(['necessary', 'functionality'])
  })

  it('defaults iframeBlocking to true', () => {
    const config = resolveConfig({})
    expect(config.iframeBlocking).toBe(true)
  })

  it('defaults countryOverride to empty string', () => {
    const config = resolveConfig({})
    expect(config.countryOverride).toBe('')
  })
})

describe('module options: CSP nonce resolution', () => {
  // Simulates the cspNonce handling in module.ts:
  //   cspNonce === true          → read from runtimeConfig.public.cspNonce at request time
  //   cspNonce === 'abc123'      → use the static value
  //   cspNonce === undefined     → no nonce
  function resolveNonce(input: string | true | undefined) {
    return {
      cspNonce: input === true ? '' : (input ?? ''),
      readCspNonceFromRuntimeConfig: input === true,
    }
  }

  it('no nonce when unset', () => {
    expect(resolveNonce(undefined)).toEqual({ cspNonce: '', readCspNonceFromRuntimeConfig: false })
  })
  it('uses static nonce value', () => {
    expect(resolveNonce('abc123')).toEqual({ cspNonce: 'abc123', readCspNonceFromRuntimeConfig: false })
  })
  it('defers to runtimeConfig when true', () => {
    expect(resolveNonce(true)).toEqual({ cspNonce: '', readCspNonceFromRuntimeConfig: true })
  })
})

describe('module options: scripts integration flag', () => {
  // Simulates: Boolean(options.nuxtScripts && hasNuxtModule('@nuxt/scripts'))
  function resolveScriptsFlag(userFlag: boolean | undefined, hasModule: boolean) {
    return Boolean((userFlag ?? true) && hasModule)
  }

  it('off when @nuxt/scripts not installed, even if user opts in', () => {
    expect(resolveScriptsFlag(true, false)).toBe(false)
  })
  it('off when user opts out, even if @nuxt/scripts is installed', () => {
    expect(resolveScriptsFlag(false, true)).toBe(false)
  })
  it('on when user opts in and @nuxt/scripts is installed', () => {
    expect(resolveScriptsFlag(true, true)).toBe(true)
  })
  it('on by default (undefined) when @nuxt/scripts is installed', () => {
    expect(resolveScriptsFlag(undefined, true)).toBe(true)
  })
})

describe('module options: server proxy defaults', () => {
  function resolveProxyConfig(opts: { serverProxy?: boolean, serverProxyPath?: string }) {
    return {
      serverProxy: Boolean(opts.serverProxy),
      serverProxyPath: opts.serverProxyPath ?? '/api/c15t',
    }
  }

  it('disabled by default', () => {
    expect(resolveProxyConfig({})).toEqual({ serverProxy: false, serverProxyPath: '/api/c15t' })
  })
  it('enables with default path', () => {
    expect(resolveProxyConfig({ serverProxy: true })).toEqual({ serverProxy: true, serverProxyPath: '/api/c15t' })
  })
  it('honours custom path', () => {
    expect(resolveProxyConfig({ serverProxy: true, serverProxyPath: '/consent' }))
      .toEqual({ serverProxy: true, serverProxyPath: '/consent' })
  })
})

describe('module options: virtual translations template contents', () => {
  // Mirrors the getContents() fn used with addTemplate in module.ts
  function render(translations: object | undefined) {
    return `export const translations = ${JSON.stringify(translations ?? {})}\nexport default translations\n`
  }

  it('emits an empty object for undefined translations', () => {
    expect(render(undefined)).toContain('export const translations = {}')
  })

  it('embeds the full translation config verbatim', () => {
    const src = { translations: { de: { common: { acceptAll: 'Alle akzeptieren' } } }, defaultLanguage: 'de' }
    const out = render(src)
    expect(out).toContain('"defaultLanguage":"de"')
    expect(out).toContain('"acceptAll":"Alle akzeptieren"')
    expect(out).toMatch(/export default translations/)
  })
})

describe('module options: networkBlocker', () => {
  interface RuntimeInput {
    networkBlocker: {
      enabled?: boolean
      logBlockedRequests?: boolean
      rules: Array<{ domain: string, category: string }>
    } | null
  }

  // Simulates the conditional spread from plugin.client.ts
  function buildNetworkBlocker(config: RuntimeInput) {
    const hasNetworkRules = !!config.networkBlocker?.rules?.length
    return hasNetworkRules
      ? {
          networkBlocker: {
            enabled: config.networkBlocker!.enabled !== false,
            logBlockedRequests: config.networkBlocker!.logBlockedRequests !== false,
            rules: config.networkBlocker!.rules,
          },
        }
      : {}
  }

  it('produces no networkBlocker key when config is null', () => {
    const result = buildNetworkBlocker({ networkBlocker: null })
    expect(result).toEqual({})
  })

  it('produces no networkBlocker key when rules array is empty', () => {
    const result = buildNetworkBlocker({ networkBlocker: { rules: [] } })
    expect(result).toEqual({})
  })

  it('passes through rules when provided', () => {
    const rules = [{ domain: 'google-analytics.com', category: 'measurement' }]
    const result = buildNetworkBlocker({ networkBlocker: { rules } })
    expect(result).toEqual({
      networkBlocker: {
        enabled: true,
        logBlockedRequests: true,
        rules,
      },
    })
  })

  it('defaults enabled to true when omitted', () => {
    const result = buildNetworkBlocker({
      networkBlocker: { rules: [{ domain: 'example.com', category: 'marketing' }] },
    })
    expect(result).toHaveProperty('networkBlocker.enabled', true)
  })

  it('respects enabled: false', () => {
    const result = buildNetworkBlocker({
      networkBlocker: { enabled: false, rules: [{ domain: 'example.com', category: 'marketing' }] },
    })
    expect(result).toHaveProperty('networkBlocker.enabled', false)
  })

  it('respects logBlockedRequests: false', () => {
    const result = buildNetworkBlocker({
      networkBlocker: { logBlockedRequests: false, rules: [{ domain: 'example.com', category: 'marketing' }] },
    })
    expect(result).toHaveProperty('networkBlocker.logBlockedRequests', false)
  })
})

describe('module options: policyPacks', () => {
  interface RuntimeInput {
    mode: 'hosted' | 'offline' | 'self-hosted'
    policyPacks: Array<{ id: string }> | null
  }

  // Simulates the conditional offlinePolicy spread from plugin.client.ts
  function buildOfflinePolicy(config: RuntimeInput) {
    const hasOfflinePolicyPacks = config.mode === 'offline' && !!config.policyPacks?.length
    return hasOfflinePolicyPacks
      ? { offlinePolicy: { policyPacks: config.policyPacks! } }
      : {}
  }

  it('produces no offlinePolicy when mode is hosted even with packs', () => {
    const result = buildOfflinePolicy({ mode: 'hosted', policyPacks: [{ id: 'europe_opt_in' }] })
    expect(result).toEqual({})
  })

  it('produces no offlinePolicy when policyPacks is null', () => {
    const result = buildOfflinePolicy({ mode: 'offline', policyPacks: null })
    expect(result).toEqual({})
  })

  it('produces no offlinePolicy when policyPacks is empty', () => {
    const result = buildOfflinePolicy({ mode: 'offline', policyPacks: [] })
    expect(result).toEqual({})
  })

  it('passes policyPacks through in offline mode', () => {
    const packs = [{ id: 'europe_opt_in' }, { id: 'world_no_banner' }]
    const result = buildOfflinePolicy({ mode: 'offline', policyPacks: packs })
    expect(result).toEqual({ offlinePolicy: { policyPacks: packs } })
  })

  // Simulates the module.ts normalization
  function normalize(options: { policyPacks?: Array<{ id: string }> }) {
    return options.policyPacks && options.policyPacks.length > 0 ? options.policyPacks : null
  }

  it('normalizes empty array to null', () => {
    expect(normalize({ policyPacks: [] })).toBeNull()
  })

  it('normalizes missing field to null', () => {
    expect(normalize({})).toBeNull()
  })

  it('preserves non-empty packs array', () => {
    const packs = [{ id: 'europe_opt_in' }]
    expect(normalize({ policyPacks: packs })).toBe(packs)
  })
})
