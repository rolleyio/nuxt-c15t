<script setup lang="ts">
import { useC15t } from '#imports'

withDefaults(defineProps<{
  /** Render as an anchor instead of a button. Defaults to false. */
  asAnchor?: boolean
}>(), {
  asAnchor: false,
})

const { setActiveUI } = useC15t()

function open(event: Event) {
  event.preventDefault()
  setActiveUI('dialog', { force: true })
}
</script>

<template>
  <a
    v-if="asAnchor"
    href="#"
    class="c15t-dialog-link"
    @click="open"
  >
    <slot>Manage cookie preferences</slot>
  </a>
  <button
    v-else
    type="button"
    class="c15t-dialog-link"
    @click="open"
  >
    <slot>Manage cookie preferences</slot>
  </button>
</template>

<style>
.c15t-dialog-link {
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  font: inherit;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

.c15t-dialog-link:hover {
  opacity: 0.7;
}
</style>
