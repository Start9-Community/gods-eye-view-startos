import { envFile } from '../fileModels/env'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { envValue } from '../utils'

const { InputSpec, Value } = sdk

export const dataFeedKeys = sdk.Action.withInput(
  'data-feed-keys',

  async () => ({
    name: i18n('Data Feed Keys'),
    description: i18n(
      'Optional keys that unlock extra data layers, all free to obtain. Flights, satellites, earthquakes, radio, bikeshare, public cameras and launches need no key at all.',
    ),
    warning: i18n('Saving restarts the service.'),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  InputSpec.of({
    FIRMS_MAP_KEY: Value.text({
      name: i18n('NASA FIRMS Map Key'),
      description: i18n(
        'Free from NASA EOSDIS. Enables the active wildfires layer.',
      ),
      required: false,
      masked: true,
      default: null,
      placeholder: null,
    }),
    AISSTREAM_API_KEY: Value.text({
      name: i18n('AISStream API Key'),
      description: i18n(
        'Free from aisstream.io. Enables live vessel tracking.',
      ),
      required: false,
      masked: true,
      default: null,
      placeholder: null,
    }),
    TOMTOM_API_KEY: Value.text({
      name: i18n('TomTom API Key'),
      description: i18n(
        'Free tier available. Enables the live traffic-flow layer; see Voice & Spend Controls for the daily tile budget.',
      ),
      required: false,
      masked: true,
      default: null,
      placeholder: null,
    }),
    LL2_API_TOKEN: Value.text({
      name: i18n('Launch Library 2 Token'),
      description: i18n(
        'Raises the request allowance for the space-launch layer, which otherwise works anonymously.',
      ),
      required: false,
      masked: true,
      default: null,
      placeholder: null,
    }),
    OPENSKY_CLIENT_ID: Value.text({
      name: i18n('OpenSky Client ID'),
      description: i18n(
        'Flight tracking works anonymously; OpenSky credentials raise the rate limit. Both this and the secret must be set to take effect.',
      ),
      required: false,
      masked: false,
      default: null,
      placeholder: null,
    }),
    OPENSKY_CLIENT_SECRET: Value.text({
      name: i18n('OpenSky Client Secret'),
      description: i18n('The secret paired with the OpenSky client ID above.'),
      required: false,
      masked: true,
      default: null,
      placeholder: null,
    }),
  }),

  async () => {
    const env = await envFile.read().once()
    return {
      FIRMS_MAP_KEY: env?.FIRMS_MAP_KEY,
      AISSTREAM_API_KEY: env?.AISSTREAM_API_KEY,
      TOMTOM_API_KEY: env?.TOMTOM_API_KEY,
      LL2_API_TOKEN: env?.LL2_API_TOKEN,
      OPENSKY_CLIENT_ID: env?.OPENSKY_CLIENT_ID,
      OPENSKY_CLIENT_SECRET: env?.OPENSKY_CLIENT_SECRET,
    }
  },

  async ({ effects, input }) => {
    const openskyId = envValue(input.OPENSKY_CLIENT_ID)
    const openskySecret = envValue(input.OPENSKY_CLIENT_SECRET)
    await envFile.merge(effects, {
      FIRMS_MAP_KEY: envValue(input.FIRMS_MAP_KEY),
      AISSTREAM_API_KEY: envValue(input.AISSTREAM_API_KEY),
      TOMTOM_API_KEY: envValue(input.TOMTOM_API_KEY),
      LL2_API_TOKEN: envValue(input.LL2_API_TOKEN),
      OPENSKY_CLIENT_ID: openskyId,
      OPENSKY_CLIENT_SECRET: openskySecret,
      OPENSKY_AUTH_MODE: openskyId && openskySecret ? 'oauth' : 'anon',
    })
  },
)
