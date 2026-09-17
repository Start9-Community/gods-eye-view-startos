import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// Only the keys the actions manage are named; upstream's other tunables
// (CCTV_*, AISSTREAM_BOUNDING_BOXES, OPENAI_REALTIME_*) survive a write.
const shape = z.object({
  // Compiled into the browser bundle by `build/vite.js`, so a change only
  // lands on the next `vite build`.
  GOOGLE_MAPS_API_KEY: z.string().optional().catch(undefined),
  CESIUM_ION_TOKEN: z.string().optional().catch(undefined),

  GOOGLE_MAPS_SERVER_API_KEY: z.string().optional().catch(undefined),
  OPENAI_API_KEY: z.string().optional().catch(undefined),
  FIRMS_MAP_KEY: z.string().optional().catch(undefined),
  AISSTREAM_API_KEY: z.string().optional().catch(undefined),
  TOMTOM_API_KEY: z.string().optional().catch(undefined),
  LL2_API_TOKEN: z.string().optional().catch(undefined),

  // Upstream defaults to 'oauth', which needs both halves of the credential.
  OPENSKY_AUTH_MODE: z
    .enum(['oauth', 'basic', 'auto', 'anon'])
    .optional()
    .catch(undefined),
  OPENSKY_CLIENT_ID: z.string().optional().catch(undefined),
  OPENSKY_CLIENT_SECRET: z.string().optional().catch(undefined),

  GEV_RATELIMIT_GOOGLE_PER_MIN: z.string().optional().catch(undefined),
  GEV_RATELIMIT_OPENAI_PER_MIN: z.string().optional().catch(undefined),
  TOMTOM_DAILY_TILE_BUDGET: z.string().optional().catch(undefined),
})

export const envFile = FileHelper.env(
  { base: sdk.volumes.main, subpath: '.env' },
  shape,
)
