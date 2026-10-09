import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// Only the keys the actions manage are named; upstream's other tunables
// (CCTV_*, OVERPASS_UPSTREAMS, OPENAI_REALTIME_*, GEV_ALLOWED_HOSTS, …)
// survive a write. GEV_ALLOWED_HOSTS and GEV_TRUSTED_PROXY set in the
// daemon's env cannot be overridden from here: server/standalone/
// vite.config.js only fills process.env keys that are still unset.
const shape = z
  .object({
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
  .catchall(z.string())

export const envFile = FileHelper.env(
  { base: sdk.volumes.main, subpath: '.env' },
  shape,
)
