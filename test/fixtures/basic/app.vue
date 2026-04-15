<script setup>
const { consents, activeUI } = useC15t()
</script>

<template>
  <div>
    <div id="consent-state">
      {{ JSON.stringify(consents) }}
    </div>
    <div id="active-ui">
      {{ activeUI }}
    </div>
    <C15tBanner />
    <C15tDialog />
    <C15tCookiePolicy />
  </div>
</template>
