import { envFile } from '../fileModels/env'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { envValue } from '../utils'

const { InputSpec, Value } = sdk

export const mapKeys = sdk.Action.withInput(
  'map-keys',

  async () => ({
    name: i18n('Map Tile Keys'),
    description: i18n(
      'Optional keys for the globe imagery. Without them the globe renders Esri satellite imagery; a Cesium ion token adds photorealistic 3D and world terrain, and a Google Maps key adds direct Google 3D tiles and place search.',
    ),
    warning: i18n(
      'Saving restarts the service: these keys are compiled into the browser bundle, so the client is rebuilt before the globe comes back.',
    ),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  InputSpec.of({
    CESIUM_ION_TOKEN: Value.text({
      name: i18n('Cesium ion Token'),
      description: i18n(
        'Free for personal, non-commercial use from cesium.com. Unlocks Google Photorealistic 3D Tiles through ion, world terrain and Bing aerial imagery.',
      ),
      required: false,
      masked: true,
      default: null,
      placeholder: 'eyJhbGciOi...',
    }),
    GOOGLE_MAPS_API_KEY: Value.text({
      name: i18n('Google Maps API Key (browser)'),
      description: i18n(
        'Enables direct Google Photorealistic 3D Tiles and place search. Metered — set a billing cap at Google. This key is compiled into the page and readable by anyone who can sign in, so restrict it by HTTP referrer at Google.',
      ),
      required: false,
      masked: true,
      default: null,
      placeholder: 'AIza...',
    }),
    GOOGLE_MAPS_SERVER_API_KEY: Value.text({
      name: i18n('Google Maps API Key (server)'),
      description: i18n(
        'Used only by the server for Places and Street View lookups and never sent to the browser. Leave empty to use the browser key for those too.',
      ),
      required: false,
      masked: true,
      default: null,
      placeholder: 'AIza...',
    }),
  }),

  async () => {
    const env = await envFile.read().once()
    return {
      CESIUM_ION_TOKEN: env?.CESIUM_ION_TOKEN,
      GOOGLE_MAPS_API_KEY: env?.GOOGLE_MAPS_API_KEY,
      GOOGLE_MAPS_SERVER_API_KEY: env?.GOOGLE_MAPS_SERVER_API_KEY,
    }
  },

  async ({ effects, input }) =>
    envFile.merge(effects, {
      CESIUM_ION_TOKEN: envValue(input.CESIUM_ION_TOKEN),
      GOOGLE_MAPS_API_KEY: envValue(input.GOOGLE_MAPS_API_KEY),
      GOOGLE_MAPS_SERVER_API_KEY: envValue(input.GOOGLE_MAPS_SERVER_API_KEY),
    }),
)
