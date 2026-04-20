import { defineEventHandler, setHeader } from 'h3'
import { useRuntimeConfig } from '#imports'

/**
 * Tiny devtools panel for nuxt-c15t. Rendered as HTML inside the Nuxt Devtools
 * iframe tab. Shows the resolved runtime config so users can verify what the
 * module has given c15t at a glance.
 *
 * Only registered in dev (see module.ts).
 */
export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/html; charset=utf-8')
  const config = useRuntimeConfig().public.c15t ?? {}
  const body = JSON.stringify(config, null, 2)
  return `<!doctype html>
<html><head><title>nuxt-c15t devtools</title>
<style>
  body { font-family: system-ui, sans-serif; padding: 16px; background: #fafafa; color: #111; }
  pre { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; overflow: auto; }
  h1 { font-size: 15px; margin: 0 0 12px; }
  .hint { font-size: 12px; color: #666; margin-bottom: 8px; }
</style></head>
<body>
  <h1>nuxt-c15t — resolved runtime config</h1>
  <div class="hint">These values come from <code>runtimeConfig.public.c15t</code>. Translations live in a virtual build template and are not shown here.</div>
  <pre>${escapeHtml(body)}</pre>
</body></html>`
})

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
