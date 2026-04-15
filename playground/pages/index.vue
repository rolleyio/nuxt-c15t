<script setup lang="ts">
const { consents } = useC15t()
const { groups } = useCookiePolicy()
</script>

<template>
  <div>
    <section style="margin-bottom: 2rem;">
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.75rem;">
        Consent State
      </h2>
      <pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; font-size: 0.8125rem; overflow-x: auto;">{{ JSON.stringify(consents, null, 2) }}</pre>
    </section>

    <section>
      <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.75rem;">
        Cookie Policy Table
      </h2>
      <p style="color: #6b7280; font-size: 0.875rem; margin: 0 0 1rem;">
        Rendered by <code>&lt;C15tCookiePolicy&gt;</code> using the vendor registry and custom cookies from <code>nuxt.config.ts</code>.
      </p>
      <C15tCookiePolicy />
    </section>
  </div>
</template>
