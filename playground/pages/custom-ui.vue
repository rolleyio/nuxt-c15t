<script setup lang="ts">
const { setActiveUI } = useC15t()
</script>

<template>
  <div>
    <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.75rem;">
      Custom UI via Headless Slots
    </h2>
    <p style="color: #6b7280; font-size: 0.875rem; margin: 0 0 1rem;">
      All components expose a default slot with actions/state, so you can replace the entire UI.
      Click the buttons below to see the custom-styled versions.
    </p>

    <div style="display: flex; gap: 0.5rem; margin-bottom: 2rem;">
      <button
        style="padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: #fff; cursor: pointer; font-size: 0.875rem;"
        @click="setActiveUI('banner', { force: true })"
      >
        Show custom banner
      </button>
      <button
        style="padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: #fff; cursor: pointer; font-size: 0.875rem;"
        @click="setActiveUI('dialog')"
      >
        Show custom dialog
      </button>
    </div>

    <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem;">Custom Banner</h3>
    <p style="color: #6b7280; font-size: 0.8125rem; margin: 0 0 1rem;">
      Uses the default slot to provide a dark-themed banner.
    </p>

    <C15tBanner v-slot="{ acceptAll, acceptNecessary, openPreferences }">
      <div
        style="
          position: fixed; bottom: 1rem; left: 1rem; right: 1rem;
          padding: 1.25rem 1.5rem;
          background: #1e293b; color: #f1f5f9;
          border-radius: 0.75rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          z-index: 9999;
          display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;
          font-size: 0.875rem;
        "
      >
        <div>
          <p style="margin: 0 0 0.25rem; font-weight: 600;">We value your privacy</p>
          <p style="margin: 0; color: #94a3b8; font-size: 0.8125rem;">
            We use cookies to enhance your experience. Choose your preferences below.
          </p>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-shrink: 0;">
          <button
            style="padding: 0.5rem 1rem; border: 1px solid #475569; border-radius: 0.5rem; background: transparent; color: #cbd5e1; cursor: pointer; font-size: 0.8125rem;"
            @click="acceptNecessary"
          >
            Decline
          </button>
          <button
            style="padding: 0.5rem 1rem; border: 1px solid #475569; border-radius: 0.5rem; background: transparent; color: #cbd5e1; cursor: pointer; font-size: 0.8125rem;"
            @click="openPreferences"
          >
            Customise
          </button>
          <button
            style="padding: 0.5rem 1rem; border: none; border-radius: 0.5rem; background: #3b82f6; color: #fff; cursor: pointer; font-size: 0.8125rem; font-weight: 500;"
            @click="acceptAll"
          >
            Accept all
          </button>
        </div>
      </div>
    </C15tBanner>

    <h3 style="font-size: 1rem; font-weight: 600; margin: 2rem 0 0.5rem;">Custom Dialog</h3>
    <p style="color: #6b7280; font-size: 0.8125rem; margin: 0 0 1rem;">
      Uses the default slot to provide a styled preferences panel.
    </p>

    <C15tDialog v-slot="{ displayedConsents, consents, toggle, saveCustom, acceptAll, close }">
      <div
        style="
          position: fixed; inset: 0; z-index: 10000;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
        "
        @click.self="close"
      >
        <div
          style="
            background: #fff; border-radius: 1rem; padding: 2rem;
            max-width: 28rem; width: 100%;
            box-shadow: 0 25px 50px rgba(0,0,0,0.2);
          "
        >
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h2 style="margin: 0; font-size: 1.25rem; font-weight: 700;">Privacy settings</h2>
            <button
              style="background: none; border: none; cursor: pointer; font-size: 1.5rem; color: #9ca3af; line-height: 1;"
              @click="close"
            >
              &times;
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem;">
            <label
              v-for="ct in displayedConsents"
              :key="ct.name"
              style="
                display: flex; align-items: center; gap: 0.75rem;
                padding: 0.875rem 1rem;
                border: 1px solid #e5e7eb; border-radius: 0.75rem;
                cursor: pointer; transition: border-color 0.15s;
              "
              :style="{ borderColor: consents[ct.name] ? '#3b82f6' : '#e5e7eb', background: consents[ct.name] ? '#eff6ff' : '#fff' }"
            >
              <input
                type="checkbox"
                :checked="consents[ct.name]"
                :disabled="ct.disabled"
                style="width: 1rem; height: 1rem; accent-color: #3b82f6;"
                @change="toggle(ct.name, ($event.target as HTMLInputElement).checked)"
              >
              <div>
                <div style="font-weight: 500; font-size: 0.875rem;">{{ ct.description }}</div>
                <div v-if="ct.disabled" style="font-size: 0.75rem; color: #9ca3af;">Always required</div>
              </div>
            </label>
          </div>

          <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button
              style="padding: 0.625rem 1.25rem; border: 1px solid #d1d5db; border-radius: 0.5rem; background: #fff; cursor: pointer; font-size: 0.875rem;"
              @click="saveCustom"
            >
              Save choices
            </button>
            <button
              style="padding: 0.625rem 1.25rem; border: none; border-radius: 0.5rem; background: #3b82f6; color: #fff; cursor: pointer; font-size: 0.875rem; font-weight: 500;"
              @click="acceptAll"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </C15tDialog>

    <h3 style="font-size: 1rem; font-weight: 600; margin: 2rem 0 0.5rem;">Custom Cookie Policy</h3>
    <p style="color: #6b7280; font-size: 0.8125rem; margin: 0 0 1rem;">
      Uses the default slot to render cookie data as cards instead of tables.
    </p>

    <C15tCookiePolicy v-slot="{ groups }">
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        <div v-for="group in groups" :key="group.category">
          <h4 style="font-size: 0.875rem; font-weight: 600; margin: 0 0 0.5rem; color: #374151;">
            {{ group.label }}
          </h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr)); gap: 0.5rem;">
            <div
              v-for="cookie in group.cookies"
              :key="cookie.name"
              style="padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; font-size: 0.75rem;"
            >
              <div style="font-weight: 600; font-family: monospace; margin-bottom: 0.25rem;">{{ cookie.name }}</div>
              <div style="color: #6b7280;">{{ cookie.vendor }} &middot; {{ cookie.duration }}</div>
              <div style="color: #9ca3af; margin-top: 0.25rem;">{{ cookie.purpose }}</div>
            </div>
          </div>
        </div>
      </div>
    </C15tCookiePolicy>
  </div>
</template>
