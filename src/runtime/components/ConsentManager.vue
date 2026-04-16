<script setup lang="ts">
</script>

<template>
  <C15tBanner>
    <template v-if="$slots.banner" #default="bannerProps">
      <slot name="banner" v-bind="bannerProps" />
    </template>
  </C15tBanner>
  <C15tDialog>
    <template v-if="$slots.dialog" #default="dialogProps">
      <slot name="dialog" v-bind="dialogProps" />
    </template>
  </C15tDialog>
</template>
