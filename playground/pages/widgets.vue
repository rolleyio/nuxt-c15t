<script setup lang="ts">
const { resetConsents } = useC15t()
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-lg font-semibold mb-1">
        Dialog Trigger, Link &amp; Widget
      </h2>
      <p class="text-sm text-gray-500 mb-4">
        Three ways to let users manage consent outside of the initial banner.
      </p>
    </div>

    <UCard>
      <h3 class="text-sm font-semibold mb-2">
        C15tDialogLink
      </h3>
      <p class="text-xs text-gray-500 mb-3">
        Inline trigger for the preferences dialog. Use it in footers and legal pages.
      </p>
      <p class="text-sm">
        Read our cookie policy and <C15tDialogLink>update your preferences</C15tDialogLink> at any time.
      </p>
    </UCard>

    <UCard>
      <h3 class="text-sm font-semibold mb-2">
        C15tDialogTrigger
      </h3>
      <p class="text-xs text-gray-500 mb-3">
        Floating drag-to-any-corner button. Already rendered in this app root (see the floating icon). Position is persisted to localStorage.
      </p>
      <UButton
        size="xs"
        variant="outline"
        @click="resetConsents"
      >
        reset consents to hide trigger (showWhen="after-consent")
      </UButton>
    </UCard>

    <UCard>
      <h3 class="text-sm font-semibold mb-2">
        C15tWidget
      </h3>
      <p class="text-xs text-gray-500 mb-3">
        Inline, always-visible consent controls. Drop on an account or privacy settings page.
      </p>
      <C15tWidget />
    </UCard>

    <UCard>
      <h3 class="font-semibold mb-2">
        Code
      </h3>
      <pre class="text-xs overflow-x-auto">&lt;!-- Inline link in body copy --&gt;
Read our policy and &lt;C15tDialogLink&gt;update your preferences&lt;/C15tDialogLink&gt;.

&lt;!-- Floating corner trigger, mounted once in app.vue --&gt;
&lt;C15tDialogTrigger show-when="after-consent" default-position="bottom-right" /&gt;

&lt;!-- Inline widget on a settings page --&gt;
&lt;C15tWidget /&gt;</pre>
    </UCard>
  </div>
</template>
