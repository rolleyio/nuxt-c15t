<script setup lang="ts">
const { has, setConsent, consents } = useC15t()

const hasMeasurement = has('measurement')
const hasMarketing = has('marketing')
const hasFunctionality = has('functionality')
const hasAnyAnalytics = has({ or: ['measurement', 'marketing'] })
const hasFullTracking = has({ and: ['measurement', 'marketing'] })
const hasAllOptional = has({ and: ['measurement', 'marketing', 'functionality'] })

const conditions = computed(() => [
  { label: 'Measurement', code: 'has(\'measurement\')', result: hasMeasurement.value },
  { label: 'Marketing', code: 'has(\'marketing\')', result: hasMarketing.value },
  { label: 'Functionality', code: 'has(\'functionality\')', result: hasFunctionality.value },
  { label: 'Any analytics (OR)', code: 'has({ or: [\'measurement\', \'marketing\'] })', result: hasAnyAnalytics.value, compound: true },
  { label: 'Full tracking (AND)', code: 'has({ and: [\'measurement\', \'marketing\'] })', result: hasFullTracking.value, compound: true },
  { label: 'All optional (AND)', code: 'has({ and: [\'measurement\', \'marketing\', \'functionality\'] })', result: hasAllOptional.value, compound: true },
])
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold mb-1">
        Compound Conditions
      </h2>
      <p class="text-sm text-gray-500 mb-4">
        <code>has()</code> supports <code>{ or: [...] }</code> and <code>{ and: [...] }</code>
        conditions for checking multiple categories at once.
      </p>
    </div>

    <div class="flex gap-2 flex-wrap">
      <UButton
        v-for="cat in (['measurement', 'marketing', 'functionality'] as const)"
        :key="cat"
        size="xs"
        :color="(consents as Record<string, boolean>)[cat] ? 'success' : 'error'"
        variant="soft"
        @click="setConsent(cat, !(consents as Record<string, boolean>)[cat])"
      >
        {{ cat }}: {{ (consents as Record<string, boolean>)[cat] ? 'on' : 'off' }}
      </UButton>
    </div>

    <UCard>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="text-left py-2 px-3 text-gray-500 font-medium">
              Condition
            </th>
            <th class="text-left py-2 px-3 text-gray-500 font-medium">
              Code
            </th>
            <th class="text-center py-2 px-3 text-gray-500 font-medium">
              Result
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="c in conditions"
            :key="c.label"
            class="border-b border-gray-100"
            :class="{ 'bg-yellow-50': c.compound }"
          >
            <td
              class="py-2 px-3"
              :class="{ 'font-medium': c.compound }"
            >
              {{ c.label }}
            </td>
            <td class="py-2 px-3 font-mono text-xs">
              {{ c.code }}
            </td>
            <td class="py-2 px-3 text-center">
              <UBadge
                :color="c.result ? 'success' : 'error'"
                variant="subtle"
                size="xs"
              >
                {{ c.result }}
              </UBadge>
            </td>
          </tr>
        </tbody>
      </table>
    </UCard>
  </div>
</template>
