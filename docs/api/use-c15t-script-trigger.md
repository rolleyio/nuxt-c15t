# useC15tScriptTrigger

Returns a `Promise<void>` compatible with `@nuxt/scripts`'s `trigger` option. The promise resolves when the specified consent condition is granted.

## Usage

```ts
import { useScript } from '#imports'

useScript('https://www.googletagmanager.com/gtag/js?id=G-XXXXXX', {
  trigger: useC15tScriptTrigger('measurement'),
})
```

## Parameters

### `condition`

- **Type:** `HasCondition<AllConsentNames>`

A consent condition to satisfy. Can be:

- A single category name: `'measurement'`
- An OR condition: `{ or: ['measurement', 'marketing'] }`
- An AND condition: `{ and: ['measurement', 'marketing'] }`

## Returns

- **Type:** `Promise<void>`

A promise that resolves when the consent condition is met. If consent is already granted when called, the promise resolves immediately.

## Lifecycle

The trigger automatically cleans up its store subscription when the component scope is disposed via `onScopeDispose`.
