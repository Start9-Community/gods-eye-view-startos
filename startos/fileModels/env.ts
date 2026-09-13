import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

/**
 * Upstream reads its configuration from a `.env` at the checkout root
 * (`server/standalone/vite.config.js` calls Vite's `loadEnv` over it).
 *
 * Two of these are NOT runtime values: `build/vite.js` injects
 * GOOGLE_MAPS_API_KEY and CESIUM_ION_TOKEN into the browser bundle via Vite's
 * `define`, so they only take effect on the next `vite build`. The
 * 'build-client' oneshot in main.ts re-runs that build on every start, which is
 * what makes editing them through an action work at all.
 *
 * Everything else here is read server-side by the provider middleware in
 * `server/providers/*` and never reaches the browser.
 *
 * Only the keys this package manages are named. FileHelper preserves keys it
 * does not name, so upstream's advanced tunables (the CCTV_* source-pack
 * options, AISSTREAM_BOUNDING_BOXES, the OPENAI_REALTIME_* model overrides)
 * survive if a user sets them by hand on the volume.
 */
const shape = z.object({
  // --- Map tiles: baked into the browser bundle at build time ---
  GOOGLE_MAPS_API_KEY: z.string().optional().catch(undefined),
  CESIUM_ION_TOKEN: z.string().optional().catch(undefined),

  // --- Server-side only, read per request by the proxy middleware ---
  GOOGLE_MAPS_SERVER_API_KEY: z.string().optional().catch(undefined),
  OPENAI_API_KEY: z.string().optional().catch(undefined),
  FIRMS_MAP_KEY: z.string().optional().catch(undefined),
  AISSTREAM_API_KEY: z.string().optional().catch(undefined),
  TOMTOM_API_KEY: z.string().optional().catch(undefined),
  LL2_API_TOKEN: z.string().optional().catch(undefined),

  // OpenSky works anonymously (verified: /api/opensky returns live states with
  // no credentials). 'oauth' is upstream's default and needs both halves, so
  // the action only sets this when the user supplies a client id and secret.
  OPENSKY_AUTH_MODE: z
    .enum(['oauth', 'basic', 'auto', 'anon'])
    .optional()
    .catch(undefined),
  OPENSKY_CLIENT_ID: z.string().optional().catch(undefined),
  OPENSKY_CLIENT_SECRET: z.string().optional().catch(undefined),

  // --- Spend controls ---
  // Per-IP caps upstream enforces in front of the two metered providers. These
  // are throttles, not billing caps: set quotas at the provider too.
  GEV_RATELIMIT_GOOGLE_PER_MIN: z.string().optional().catch(undefined),
  GEV_RATELIMIT_OPENAI_PER_MIN: z.string().optional().catch(undefined),
  TOMTOM_DAILY_TILE_BUDGET: z.string().optional().catch(undefined),
})

export type EnvType = z.infer<typeof shape>

export const envFile = FileHelper.env(
  {
    base: sdk.volumes.main,
    subpath: '.env',
  },
  shape,
)
