<script setup lang="ts">
const { has, setConsent, consents } = useC15t()

// Simple conditions
const hasMeasurement = has('measurement')
const hasMarketing = has('marketing')
const hasFunctionality = has('functionality')

// Compound conditions
const hasAnyAnalytics = has({ or: ['measurement', 'marketing'] })
const hasFullTracking = has({ and: ['measurement', 'marketing'] })
const hasAllOptional = has({ and: ['measurement', 'marketing', 'functionality'] })
</script>

<template>
  <div>
    <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.75rem;">
      Compound Conditions
    </h2>
    <p style="color: #6b7280; font-size: 0.875rem; margin: 0 0 1.5rem;">
      The <code>has()</code> function supports <code>{ or: [...] }</code> and <code>{ and: [...] }</code>
      conditions for checking multiple categories at once.
    </p>

    <!-- Toggle buttons -->
    <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
      <button
        v-for="cat in (['measurement', 'marketing', 'functionality'] as const)"
        :key="cat"
        style="padding: 0.375rem 0.75rem; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 0.8125rem;"
        :style="{ background: consents[cat] ? '#d1fae5' : '#fee2e2', color: consents[cat] ? '#065f46' : '#991b1b' }"
        @click="setConsent(cat, !consents[cat])"
      >
        {{ cat }}: {{ consents[cat] ? 'on' : 'off' }}
      </button>
    </div>

    <!-- Results table -->
    <div style="border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden;">
      <table style="width: 100%; border-collapse: collapse; font-size: 0.8125rem;">
        <thead>
          <tr style="background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
            <th style="padding: 0.625rem 1rem; text-align: left; font-weight: 500; color: #6b7280;">Condition</th>
            <th style="padding: 0.625rem 1rem; text-align: left; font-weight: 500; color: #6b7280;">Code</th>
            <th style="padding: 0.625rem 1rem; text-align: center; font-weight: 500; color: #6b7280;">Result</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 0.625rem 1rem;">Measurement</td>
            <td style="padding: 0.625rem 1rem; font-family: monospace; font-size: 0.75rem;">has('measurement')</td>
            <td style="padding: 0.625rem 1rem; text-align: center;">
              <span style="padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem;" :style="{ background: hasMeasurement ? '#d1fae5' : '#fee2e2', color: hasMeasurement ? '#065f46' : '#991b1b' }">
                {{ hasMeasurement }}
              </span>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 0.625rem 1rem;">Marketing</td>
            <td style="padding: 0.625rem 1rem; font-family: monospace; font-size: 0.75rem;">has('marketing')</td>
            <td style="padding: 0.625rem 1rem; text-align: center;">
              <span style="padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem;" :style="{ background: hasMarketing ? '#d1fae5' : '#fee2e2', color: hasMarketing ? '#065f46' : '#991b1b' }">
                {{ hasMarketing }}
              </span>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 0.625rem 1rem;">Functionality</td>
            <td style="padding: 0.625rem 1rem; font-family: monospace; font-size: 0.75rem;">has('functionality')</td>
            <td style="padding: 0.625rem 1rem; text-align: center;">
              <span style="padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem;" :style="{ background: hasFunctionality ? '#d1fae5' : '#fee2e2', color: hasFunctionality ? '#065f46' : '#991b1b' }">
                {{ hasFunctionality }}
              </span>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6; background: #fefce8;">
            <td style="padding: 0.625rem 1rem; font-weight: 500;">Any analytics (OR)</td>
            <td style="padding: 0.625rem 1rem; font-family: monospace; font-size: 0.75rem;">has({ or: ['measurement', 'marketing'] })</td>
            <td style="padding: 0.625rem 1rem; text-align: center;">
              <span style="padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem;" :style="{ background: hasAnyAnalytics ? '#d1fae5' : '#fee2e2', color: hasAnyAnalytics ? '#065f46' : '#991b1b' }">
                {{ hasAnyAnalytics }}
              </span>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6; background: #fefce8;">
            <td style="padding: 0.625rem 1rem; font-weight: 500;">Full tracking (AND)</td>
            <td style="padding: 0.625rem 1rem; font-family: monospace; font-size: 0.75rem;">has({ and: ['measurement', 'marketing'] })</td>
            <td style="padding: 0.625rem 1rem; text-align: center;">
              <span style="padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem;" :style="{ background: hasFullTracking ? '#d1fae5' : '#fee2e2', color: hasFullTracking ? '#065f46' : '#991b1b' }">
                {{ hasFullTracking }}
              </span>
            </td>
          </tr>
          <tr style="background: #fefce8;">
            <td style="padding: 0.625rem 1rem; font-weight: 500;">All optional (AND)</td>
            <td style="padding: 0.625rem 1rem; font-family: monospace; font-size: 0.75rem;">has({ and: ['measurement', 'marketing', 'functionality'] })</td>
            <td style="padding: 0.625rem 1rem; text-align: center;">
              <span style="padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.75rem;" :style="{ background: hasAllOptional ? '#d1fae5' : '#fee2e2', color: hasAllOptional ? '#065f46' : '#991b1b' }">
                {{ hasAllOptional }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
