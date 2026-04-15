<script setup lang="ts">
import { useCookiePolicy } from '#imports'

const { groups } = useCookiePolicy()
</script>

<template>
  <div>
    <slot :groups="groups">
      <!-- Fallback: minimal unstyled cookie policy table -->
      <div
        v-for="group in groups"
        :key="group.category"
        style="margin-bottom: 2rem; font-family: system-ui, -apple-system, sans-serif;"
      >
        <h3 style="font-size: 1rem; font-weight: 600; color: #111827; margin: 0 0 0.75rem;">
          {{ group.label }} ({{ group.cookies.length }})
        </h3>
        <div style="overflow-x: auto;">
          <table
            style="
              width: 100%;
              border-collapse: collapse;
              font-size: 0.8125rem;
              text-align: left;
            "
          >
            <thead>
              <tr style="border-bottom: 2px solid #e5e7eb;">
                <th style="padding: 0.5rem 0.75rem; color: #6b7280; font-weight: 500;">
                  Name
                </th>
                <th style="padding: 0.5rem 0.75rem; color: #6b7280; font-weight: 500;">
                  Provider
                </th>
                <th style="padding: 0.5rem 0.75rem; color: #6b7280; font-weight: 500;">
                  Purpose
                </th>
                <th style="padding: 0.5rem 0.75rem; color: #6b7280; font-weight: 500;">
                  Expiry
                </th>
                <th style="padding: 0.5rem 0.75rem; color: #6b7280; font-weight: 500;">
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="cookie in group.cookies"
                :key="cookie.name"
                style="border-bottom: 1px solid #f3f4f6;"
              >
                <td style="padding: 0.5rem 0.75rem; color: #111827; font-family: monospace; font-size: 0.75rem;">
                  {{ cookie.name }}
                </td>
                <td style="padding: 0.5rem 0.75rem; color: #374151;">
                  {{ cookie.vendor }}
                </td>
                <td style="padding: 0.5rem 0.75rem; color: #6b7280; max-width: 20rem;">
                  {{ cookie.purpose }}
                </td>
                <td style="padding: 0.5rem 0.75rem; color: #374151; white-space: nowrap;">
                  {{ cookie.duration }}
                </td>
                <td style="padding: 0.5rem 0.75rem; color: #374151;">
                  {{ cookie.type }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </slot>
  </div>
</template>
