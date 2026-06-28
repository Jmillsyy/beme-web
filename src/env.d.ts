/// <reference path="../.astro/types.d.ts" />

// Custom public env vars. Merges with Astro's built-in ImportMetaEnv
// so import.meta.env.PUBLIC_ANALYTICS_DOMAIN is typed in strict mode.
interface ImportMetaEnv {
  /** Set in production to enable Plausible analytics (e.g. bemeapp.app). */
  readonly PUBLIC_ANALYTICS_DOMAIN?: string
}
