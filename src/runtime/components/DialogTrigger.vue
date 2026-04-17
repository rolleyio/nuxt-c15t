<script setup lang="ts">
import { useC15t, computed, ref, onBeforeUnmount, watch } from '#imports'

type Corner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

const props = withDefaults(defineProps<{
  /** Which corner to snap to initially. @default 'bottom-right' */
  defaultPosition?: Corner
  /** Persist the user's dragged position to localStorage. @default true */
  persistPosition?: boolean
  /** When to render the trigger. @default 'after-consent' */
  showWhen?: 'always' | 'after-consent' | 'never'
  /** Accessible label. @default 'Open privacy settings' */
  ariaLabel?: string
}>(), {
  defaultPosition: 'bottom-right',
  persistPosition: true,
  showWhen: 'after-consent',
  ariaLabel: 'Open privacy settings',
})

const { setActiveUI, hasConsented } = useC15t()

const STORAGE_KEY = 'c15t-trigger-corner'

function readStoredCorner(): Corner | null {
  if (typeof window === 'undefined' || !props.persistPosition) return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === 'top-left' || raw === 'top-right' || raw === 'bottom-left' || raw === 'bottom-right') {
      return raw
    }
  }
  catch {
    // storage unavailable (private mode, disabled cookies) — fall back to default
  }
  return null
}

const corner = ref<Corner>(readStoredCorner() ?? props.defaultPosition)
const dragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const dragPos = ref<{ x: number, y: number } | null>(null)
const btnRef = ref<HTMLButtonElement | null>(null)

function persist(next: Corner) {
  if (!props.persistPosition || typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, next)
  }
  catch {
    // storage unavailable — position still works for this session, just not persisted
  }
}

function pickCorner(x: number, y: number): Corner {
  const w = window.innerWidth
  const h = window.innerHeight
  const isRight = x > w / 2
  const isBottom = y > h / 2
  return `${isBottom ? 'bottom' : 'top'}-${isRight ? 'right' : 'left'}` as Corner
}

function onPointerDown(event: PointerEvent) {
  const btn = btnRef.value
  if (!btn) return
  const rect = btn.getBoundingClientRect()
  dragOffset.value = { x: event.clientX - rect.left, y: event.clientY - rect.top }
  dragPos.value = { x: rect.left, y: rect.top }
  dragging.value = true
  btn.setPointerCapture(event.pointerId)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp, { once: true })
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value) return
  dragPos.value = {
    x: event.clientX - dragOffset.value.x,
    y: event.clientY - dragOffset.value.y,
  }
}

function onPointerUp(event: PointerEvent) {
  dragging.value = false
  window.removeEventListener('pointermove', onPointerMove)
  if (dragPos.value) {
    const next = pickCorner(dragPos.value.x + dragOffset.value.x, dragPos.value.y + dragOffset.value.y)
    corner.value = next
    persist(next)
  }
  dragPos.value = null
  // Swallow the click that would fire if we actually dragged
  const btn = btnRef.value
  if (btn && event.pointerId !== undefined && btn.hasPointerCapture(event.pointerId)) {
    btn.releasePointerCapture(event.pointerId)
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
})

// If the user changes defaultPosition and no stored value exists, follow it.
watch(() => props.defaultPosition, (next) => {
  if (!readStoredCorner()) corner.value = next
})

function openDialog() {
  if (dragPos.value) return // was dragged, ignore the synthetic click
  setActiveUI('dialog', { force: true })
}

const visible = computed(() => {
  if (props.showWhen === 'never') return false
  if (props.showWhen === 'always') return true
  return hasConsented.value
})

const positionStyle = computed(() => {
  if (dragPos.value) {
    return {
      left: `${dragPos.value.x}px`,
      top: `${dragPos.value.y}px`,
      right: 'auto',
      bottom: 'auto',
    }
  }
  const [v, h] = corner.value.split('-') as ['top' | 'bottom', 'left' | 'right']
  return {
    [v]: '1rem',
    [h]: '1rem',
  }
})
</script>

<template>
  <Teleport to="body">
    <button
      v-if="visible"
      ref="btnRef"
      type="button"
      class="c15t-trigger"
      :class="{ 'c15t-trigger--dragging': dragging }"
      :style="positionStyle"
      :aria-label="ariaLabel"
      @pointerdown="onPointerDown"
      @click="openDialog"
    >
      <slot>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
          />
          <circle
            cx="12"
            cy="8"
            r="1.5"
            fill="currentColor"
          />
          <circle
            cx="8"
            cy="14"
            r="1.5"
            fill="currentColor"
          />
          <circle
            cx="16"
            cy="15"
            r="1.5"
            fill="currentColor"
          />
        </svg>
      </slot>
    </button>
  </Teleport>
</template>

<style>
.c15t-trigger {
  position: fixed;
  z-index: 9999;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 9999px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #fff;
  color: #111827;
  cursor: grab;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  touch-action: none;
  user-select: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.c15t-trigger:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.c15t-trigger--dragging {
  cursor: grabbing;
  transition: none;
}
</style>
