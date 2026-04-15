<script setup lang="ts">
import { useCookiePolicy, useC15t, computed } from '#imports'

const {
  /** Column header for cookie name */
  labelName,
  /** Column header for cookie provider/vendor */
  labelProvider,
  /** Column header for cookie purpose */
  labelPurpose,
  /** Column header for cookie expiry/duration */
  labelExpiry,
  /** Column header for cookie type */
  labelType,
} = defineProps<{
  labelName?: string
  labelProvider?: string
  labelPurpose?: string
  labelExpiry?: string
  labelType?: string
}>()

const { groups } = useCookiePolicy()
const { translations } = useC15t()

// Use props if provided, otherwise fall back to translations, then English defaults
const headers = computed(() => {
  const raw = translations.value as Record<string, Record<string, string>> | null
  const t = raw?.cookiePolicy
  return {
    name: labelName ?? t?.name ?? 'Name',
    provider: labelProvider ?? t?.provider ?? 'Provider',
    purpose: labelPurpose ?? t?.purpose ?? 'Purpose',
    expiry: labelExpiry ?? t?.expiry ?? 'Expiry',
    type: labelType ?? t?.type ?? 'Type',
  }
})
</script>

<template>
  <div>
    <slot :groups="groups">
      <div
        v-for="group in groups"
        :key="group.category"
        class="c15t-policy-group"
      >
        <h3 class="c15t-policy-group__title">
          {{ group.label }} ({{ group.cookies.length }})
        </h3>
        <div class="c15t-policy-table-wrap">
          <table class="c15t-policy-table">
            <thead>
              <tr class="c15t-policy-table__header-row">
                <th class="c15t-policy-table__th">{{ headers.name }}</th>
                <th class="c15t-policy-table__th">{{ headers.provider }}</th>
                <th class="c15t-policy-table__th">{{ headers.purpose }}</th>
                <th class="c15t-policy-table__th">{{ headers.expiry }}</th>
                <th class="c15t-policy-table__th">{{ headers.type }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="cookie in group.cookies"
                :key="cookie.name"
                class="c15t-policy-table__row"
              >
                <td class="c15t-policy-table__td c15t-policy-table__td--name">{{ cookie.name }}</td>
                <td class="c15t-policy-table__td">{{ cookie.vendor }}</td>
                <td class="c15t-policy-table__td c15t-policy-table__td--purpose">{{ cookie.purpose }}</td>
                <td class="c15t-policy-table__td c15t-policy-table__td--nowrap">{{ cookie.duration }}</td>
                <td class="c15t-policy-table__td">{{ cookie.type }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </slot>
  </div>
</template>

<style>
.c15t-policy-group {
  margin-bottom: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
}

.c15t-policy-group__title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.75rem;
}

.c15t-policy-table-wrap {
  overflow-x: auto;
}

.c15t-policy-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
  text-align: left;
}

.c15t-policy-table__header-row {
  border-bottom: 2px solid #e5e7eb;
}

.c15t-policy-table__th {
  padding: 0.5rem 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.c15t-policy-table__row {
  border-bottom: 1px solid #f3f4f6;
}

.c15t-policy-table__td {
  padding: 0.5rem 0.75rem;
  color: #374151;
}

.c15t-policy-table__td--name {
  color: #111827;
  font-family: monospace;
  font-size: 0.75rem;
}

.c15t-policy-table__td--purpose {
  color: #6b7280;
  max-width: 20rem;
}

.c15t-policy-table__td--nowrap {
  white-space: nowrap;
}
</style>
