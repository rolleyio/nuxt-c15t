<script setup lang="ts">
const { consents, setConsent, resetConsents, getDisplayedConsents, allConsentNames } = useC15t()
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold mb-1">
        Individual Consent Toggles
      </h2>
      <p class="text-sm text-gray-500 mb-4">
        Use <code>setConsent(name, value)</code> to grant or revoke individual categories.
      </p>
    </div>

    <div class="space-y-3">
      <UCard
        v-for="cat in allConsentNames"
        :key="cat"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="font-medium capitalize">
              {{ cat }}
            </div>
            <div class="text-xs text-gray-500">
              consents.{{ cat }} = {{ (consents as Record<string, boolean>)[cat] ?? 'undefined' }}
            </div>
          </div>
          <div class="flex gap-2">
            <UButton
              size="xs"
              color="success"
              variant="soft"
              @click="setConsent(cat, true)"
            >
              Grant
            </UButton>
            <UButton
              size="xs"
              color="error"
              variant="soft"
              @click="setConsent(cat, false)"
            >
              Revoke
            </UButton>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <div class="font-medium">
              necessary
            </div>
            <div class="text-xs text-gray-500">
              Always true — cannot be revoked
            </div>
          </div>
          <UBadge
            color="success"
            variant="subtle"
          >
            active
          </UBadge>
        </div>
      </UCard>
    </div>

    <UButton
      color="error"
      variant="outline"
      @click="resetConsents()"
    >
      Reset all consents
    </UButton>

    <div>
      <h3 class="font-semibold mb-2">
        getDisplayedConsents()
      </h3>
      <UCard>
        <pre class="text-xs overflow-x-auto">{{ JSON.stringify(getDisplayedConsents(), null, 2) }}</pre>
      </UCard>
    </div>
  </div>
</template>
