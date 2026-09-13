import { sdk } from '../sdk'
import { envFile } from '../fileModels/env'

const { InputSpec, Value } = sdk

/**
 * Upstream stores a missing key as an empty value, not an absent one — the
 * providers guard with `Boolean(process.env.X)` / `String(X || '').trim()`, and
 * upstream's own keyless test sets GOOGLE_MAPS_API_KEY to ''. Writing '' is
 * therefore how a field gets cleared; `merge` would treat undefined as
 * "leave alone", making a cleared field impossible to save.
 */
const clear = (v: string | null | undefined) => (v ?? '').trim()

export const mapKeys = sdk.Action.withInput(
  'map-keys',

  async ({ effects }) => ({
    name: 'Map Tile Keys',
    description:
      'Optional keys for the globe imagery. Without them the globe still renders satellite imagery through CesiumJS’s bundled default token — which is shared and rate-limited, so a key of your own is more reliable.',
    warning:
      'Saving restarts the service: these two keys are compiled into the browser bundle, so the client is rebuilt before the globe comes back (a few seconds).',
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  InputSpec.of({
    CESIUM_ION_TOKEN: Value.text({
      name: 'Cesium ion Token',
      description:
        'Free from cesium.com — provides world terrain and imagery. Recommended: it replaces the shared default token.',
      required: false,
      masked: true,
      default: null,
      placeholder: 'eyJhbGciOi...',
    }),
    GOOGLE_MAPS_API_KEY: Value.text({
      name: 'Google Maps API Key (browser)',
      description:
        'Enables Google Photorealistic 3D Tiles and place search. Metered — set a billing cap at Google. This key is compiled into the page and is readable by anyone who can open the UI, so restrict it by HTTP referrer at Google.',
      required: false,
      masked: true,
      default: null,
      placeholder: 'AIza...',
    }),
    GOOGLE_MAPS_SERVER_API_KEY: Value.text({
      name: 'Google Maps API Key (server)',
      description:
        'Used only by the server for Places and Street View lookups. Never sent to the browser, so this one can stay unrestricted by referrer.',
      required: false,
      masked: true,
      default: null,
      placeholder: 'AIza...',
    }),
  }),

  async ({ effects }) => {
    const env = await envFile.read().once()
    return {
      CESIUM_ION_TOKEN: env?.CESIUM_ION_TOKEN,
      GOOGLE_MAPS_API_KEY: env?.GOOGLE_MAPS_API_KEY,
      GOOGLE_MAPS_SERVER_API_KEY: env?.GOOGLE_MAPS_SERVER_API_KEY,
    }
  },

  async ({ effects, input }) => {
    await envFile.merge(effects, {
      CESIUM_ION_TOKEN: clear(input.CESIUM_ION_TOKEN),
      GOOGLE_MAPS_API_KEY: clear(input.GOOGLE_MAPS_API_KEY),
      GOOGLE_MAPS_SERVER_API_KEY: clear(input.GOOGLE_MAPS_SERVER_API_KEY),
    })
  },
)
