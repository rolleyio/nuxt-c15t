---
title: useCookiePolicy
description: Resolve merged cookie policy data — combines declared vendor cookies with custom entries, grouped by consent category.
---

# useCookiePolicy

Returns resolved cookie policy data for rendering a cookie policy table. Merges cookies from declared vendors with custom cookies, grouped by consent category.

## Usage

```vue
<script setup>
const { groups, allCookies } = useCookiePolicy()
</script>

<template>
  <div v-for="group in groups" :key="group.category">
    <h3>{{ group.label }} ({{ group.cookies.length }})</h3>
    <table>
      <tr v-for="cookie in group.cookies" :key="cookie.name">
        <td>{{ cookie.name }}</td>
        <td>{{ cookie.vendor }}</td>
        <td>{{ cookie.purpose }}</td>
        <td>{{ cookie.duration }}</td>
      </tr>
    </table>
  </div>
</template>
```

## Return Values

### `allCookies`

- **Type:** `ComputedRef<CookieEntry[]>`

All resolved cookies (vendors + custom), as a flat array.

### `groups`

- **Type:** `ComputedRef<CookiePolicyGroup[]>`

Cookies grouped by consent category, with display labels. Only categories that have cookies are included.

```ts
interface CookiePolicyGroup {
  category: AllConsentNames
  label: string       // e.g. 'Measurement & Analytics'
  cookies: CookieEntry[]
}
```

## Types

### `CookieEntry`

```ts
interface CookieEntry {
  name: string
  vendor: string
  category: AllConsentNames
  purpose: string
  duration: string
  type: 'HTTP' | 'HTML Local Storage' | 'Pixel' | 'IndexedDB'
}
```
