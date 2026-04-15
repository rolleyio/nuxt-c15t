import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('nuxt-c15t SSR', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders the page without SSR errors', async () => {
    const html = await $fetch('/')
    expect(html).toContain('id="consent-state"')
    expect(html).toContain('id="active-ui"')
  })

  it('injects c15t runtime config', async () => {
    const html = await $fetch('/')
    // Runtime config is serialised into the SSR payload
    expect(html).toContain('c15t')
  })

  it('renders consent state as empty object during SSR (client-only store)', async () => {
    const html = await $fetch('/')
    // On the server the store is null, so consents is {}
    expect(html).toContain('{}</div>')
  })

  it('renders activeUI as none during SSR', async () => {
    const html = await $fetch('/')
    expect(html).toContain('>none</div>')
  })
})
