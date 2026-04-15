import type { VendorDefinition } from './types'

/**
 * Known vendor cookie definitions.
 *
 * Each vendor entry documents the cookies set by a common third-party
 * script, sourced from vendor documentation and empirical observation.
 *
 * To add a new vendor, append a VendorDefinition to this array.
 * PRs welcome — this is designed as a community contribution surface.
 */
export const vendorRegistry: VendorDefinition[] = [
  {
    id: 'google-tag-manager',
    name: 'Google Tag Manager',
    privacyPolicyUrl: 'https://policies.google.com/privacy',
    cookies: [
      { name: '_gcl_au', vendor: 'Google', category: 'marketing', purpose: 'Used by Google AdSense to store and track conversions.', duration: '3 months', type: 'HTTP' },
      { name: '_gcl_aw', vendor: 'Google', category: 'marketing', purpose: 'Stores ad click information from Google Ads campaigns.', duration: '3 months', type: 'HTTP' },
    ],
  },
  {
    id: 'google-analytics',
    name: 'Google Analytics 4',
    privacyPolicyUrl: 'https://policies.google.com/privacy',
    cookies: [
      { name: '_ga', vendor: 'Google Analytics', category: 'measurement', purpose: 'Distinguishes unique users by assigning a randomly generated number as a client identifier.', duration: '2 years', type: 'HTTP' },
      { name: '_ga_*', vendor: 'Google Analytics', category: 'measurement', purpose: 'Maintains session state across page requests.', duration: '2 years', type: 'HTTP' },
      { name: '_gid', vendor: 'Google Analytics', category: 'measurement', purpose: 'Distinguishes unique users. Set on every page that includes the GA tracking script.', duration: '24 hours', type: 'HTTP' },
      { name: '_gat', vendor: 'Google Analytics', category: 'measurement', purpose: 'Throttles the request rate to Google Analytics.', duration: '1 minute', type: 'HTTP' },
    ],
  },
  {
    id: 'meta-pixel',
    name: 'Meta Pixel (Facebook)',
    privacyPolicyUrl: 'https://www.facebook.com/privacy/policy/',
    cookies: [
      { name: '_fbp', vendor: 'Meta', category: 'marketing', purpose: 'Identifies browsers for ad delivery and measurement.', duration: '3 months', type: 'HTTP' },
      { name: '_fbc', vendor: 'Meta', category: 'marketing', purpose: 'Stores last ad click information from Facebook campaigns.', duration: '2 years', type: 'HTTP' },
      { name: 'fr', vendor: 'Meta', category: 'marketing', purpose: 'Used for ad delivery, retargeting, and measurement.', duration: '3 months', type: 'HTTP' },
    ],
  },
  {
    id: 'posthog',
    name: 'PostHog',
    privacyPolicyUrl: 'https://posthog.com/privacy',
    cookies: [
      { name: 'ph_*_posthog', vendor: 'PostHog', category: 'measurement', purpose: 'Stores a unique identifier for the user to enable session replay and analytics.', duration: '1 year', type: 'HTTP' },
    ],
  },
  {
    id: 'linkedin-insight',
    name: 'LinkedIn Insight Tag',
    privacyPolicyUrl: 'https://www.linkedin.com/legal/privacy-policy',
    cookies: [
      { name: 'li_sugr', vendor: 'LinkedIn', category: 'marketing', purpose: 'Collects data on user behaviour and interaction for LinkedIn ad targeting.', duration: '3 months', type: 'HTTP' },
      { name: 'bcookie', vendor: 'LinkedIn', category: 'marketing', purpose: 'Browser identifier cookie for LinkedIn analytics.', duration: '1 year', type: 'HTTP' },
      { name: 'UserMatchHistory', vendor: 'LinkedIn', category: 'marketing', purpose: 'Tracks users across websites for LinkedIn ad targeting.', duration: '30 days', type: 'HTTP' },
      { name: 'AnalyticsSyncHistory', vendor: 'LinkedIn', category: 'marketing', purpose: 'Stores information about the time a sync took place with the lms_analytics cookie.', duration: '30 days', type: 'HTTP' },
    ],
  },
  {
    id: 'tiktok-pixel',
    name: 'TikTok Pixel',
    privacyPolicyUrl: 'https://www.tiktok.com/legal/page/us/privacy-policy',
    cookies: [
      { name: '_ttp', vendor: 'TikTok', category: 'marketing', purpose: 'Tracks visitors across websites to measure ad performance.', duration: '13 months', type: 'HTTP' },
      { name: 'tt_appId', vendor: 'TikTok', category: 'marketing', purpose: 'Stores TikTok application ID for analytics.', duration: 'Session', type: 'HTTP' },
    ],
  },
  {
    id: 'microsoft-clarity',
    name: 'Microsoft Clarity',
    privacyPolicyUrl: 'https://privacy.microsoft.com/en-us/privacystatement',
    cookies: [
      { name: '_clck', vendor: 'Microsoft Clarity', category: 'measurement', purpose: 'Persists the Clarity user ID and preferences.', duration: '1 year', type: 'HTTP' },
      { name: '_clsk', vendor: 'Microsoft Clarity', category: 'measurement', purpose: 'Connects multiple page views by a user into a single session recording.', duration: '1 day', type: 'HTTP' },
      { name: 'CLID', vendor: 'Microsoft Clarity', category: 'measurement', purpose: 'Identifies the first-time Clarity saw this user on any site.', duration: '1 year', type: 'HTTP' },
    ],
  },
  {
    id: 'hotjar',
    name: 'Hotjar',
    privacyPolicyUrl: 'https://www.hotjar.com/legal/policies/privacy/',
    cookies: [
      { name: '_hjSessionUser_*', vendor: 'Hotjar', category: 'measurement', purpose: 'Set when a user first lands on a page. Persists the Hotjar User ID unique to that site.', duration: '1 year', type: 'HTTP' },
      { name: '_hjSession_*', vendor: 'Hotjar', category: 'measurement', purpose: 'Holds current session data. Ensures subsequent requests are attributed to the same session.', duration: '30 minutes', type: 'HTTP' },
      { name: '_hjIncludedInSessionSample_*', vendor: 'Hotjar', category: 'measurement', purpose: 'Determines if a user is included in the data sampling for session recordings.', duration: '30 minutes', type: 'HTTP' },
    ],
  },
  {
    id: 'intercom',
    name: 'Intercom',
    privacyPolicyUrl: 'https://www.intercom.com/legal/privacy',
    cookies: [
      { name: 'intercom-id-*', vendor: 'Intercom', category: 'functionality', purpose: 'Anonymous visitor identifier for the Intercom messenger.', duration: '9 months', type: 'HTTP' },
      { name: 'intercom-session-*', vendor: 'Intercom', category: 'functionality', purpose: 'Identifier for each unique browser session. Resets on logout.', duration: '1 week', type: 'HTTP' },
      { name: 'intercom-device-id-*', vendor: 'Intercom', category: 'functionality', purpose: 'Device identifier for Intercom messenger.', duration: '9 months', type: 'HTTP' },
    ],
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    privacyPolicyUrl: 'https://legal.hubspot.com/privacy-policy',
    cookies: [
      { name: '__hssc', vendor: 'HubSpot', category: 'measurement', purpose: 'Keeps track of sessions. Determines if HubSpot should increment the session number and timestamps.', duration: '30 minutes', type: 'HTTP' },
      { name: '__hssrc', vendor: 'HubSpot', category: 'measurement', purpose: 'Whenever HubSpot changes the session cookie, this cookie is set to determine if the visitor has restarted their browser.', duration: 'Session', type: 'HTTP' },
      { name: '__hstc', vendor: 'HubSpot', category: 'measurement', purpose: 'Tracks visitors. Contains domain, utk, initial timestamp, last timestamp, current timestamp, and session number.', duration: '6 months', type: 'HTTP' },
      { name: 'hubspotutk', vendor: 'HubSpot', category: 'measurement', purpose: 'Keeps track of a visitor identity. Passed to HubSpot on form submission and used for de-duplication.', duration: '6 months', type: 'HTTP' },
    ],
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    privacyPolicyUrl: 'https://policies.google.com/privacy',
    cookies: [
      { name: '_gcl_au', vendor: 'Google', category: 'marketing', purpose: 'Used by Google AdSense to store and track conversions.', duration: '3 months', type: 'HTTP' },
      { name: '_gcl_aw', vendor: 'Google', category: 'marketing', purpose: 'Stores ad click information from Google Ads campaigns.', duration: '3 months', type: 'HTTP' },
      { name: '_gcl_dc', vendor: 'Google', category: 'marketing', purpose: 'Used by DoubleClick (Google Ads) to register and report user actions after viewing or clicking an ad.', duration: '3 months', type: 'HTTP' },
    ],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    privacyPolicyUrl: 'https://stripe.com/privacy',
    cookies: [
      { name: '__stripe_mid', vendor: 'Stripe', category: 'necessary', purpose: 'Fraud prevention and detection.', duration: '1 year', type: 'HTTP' },
      { name: '__stripe_sid', vendor: 'Stripe', category: 'necessary', purpose: 'Fraud prevention and detection for the current browsing session.', duration: 'Session', type: 'HTTP' },
    ],
  },
]
