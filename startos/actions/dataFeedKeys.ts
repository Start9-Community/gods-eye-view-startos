import { sdk } from '../sdk'
import { envFile } from '../fileModels/env'

const { InputSpec, Value } = sdk

const clear = (v: string | null | undefined) => (v ?? '').trim()

export const dataFeedKeys = sdk.Action.withInput(
  'data-feed-keys',

  async ({ effects }) => ({
    name: 'Data Feed Keys',
    description:
      'Optional keys that unlock extra data layers. All free to obtain. Layers without a key are simply absent — flights, satellites, earthquakes, radio, bikeshare, CCTV and launches need no key at all.',
    warning: 'Saving restarts the service.',
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  InputSpec.of({
    FIRMS_MAP_KEY: Value.text({
      name: 'NASA FIRMS Map Key',
      description: 'Free from NASA EOSDIS. Enables the active wildfires layer.',
      required: false,
      masked: true,
      default: null,
      placeholder: null,
    }),
    AISSTREAM_API_KEY: Value.text({
      name: 'AISStream API Key',
      description: 'Free from aisstream.io. Enables live vessel tracking.',
      required: false,
      masked: true,
      default: null,
      placeholder: null,
    }),
    TOMTOM_API_KEY: Value.text({
      name: 'TomTom API Key',
      description:
        'Freemium. Enables the live traffic-flow layer. See Spend Controls for the daily tile budget.',
      required: false,
      masked: true,
      default: null,
      placeholder: null,
    }),
    LL2_API_TOKEN: Value.text({
      name: 'Launch Library 2 Token',
      description:
        'Optional. Raises the request allowance for the space-launch layer, which otherwise works anonymously.',
      required: false,
      masked: true,
      default: null,
      placeholder: null,
    }),
    OPENSKY_CLIENT_ID: Value.text({
      name: 'OpenSky Client ID',
      description:
        'Optional. Flight tracking works anonymously; OpenSky credentials raise your rate limit. Both this and the secret must be set to take effect.',
      required: false,
      masked: false,
      default: null,
      placeholder: null,
    }),
    OPENSKY_CLIENT_SECRET: Value.text({
      name: 'OpenSky Client Secret',
      description: 'The secret paired with the OpenSky client ID above.',
      required: false,
      masked: true,
      default: null,
      placeholder: null,
    }),
  }),

  async ({ effects }) => {
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
    const openskyId = clear(input.OPENSKY_CLIENT_ID)
    const openskySecret = clear(input.OPENSKY_CLIENT_SECRET)

    await envFile.merge(effects, {
      FIRMS_MAP_KEY: clear(input.FIRMS_MAP_KEY),
      AISSTREAM_API_KEY: clear(input.AISSTREAM_API_KEY),
      TOMTOM_API_KEY: clear(input.TOMTOM_API_KEY),
      LL2_API_TOKEN: clear(input.LL2_API_TOKEN),
      OPENSKY_CLIENT_ID: openskyId,
      OPENSKY_CLIENT_SECRET: openskySecret,
      /**
       * Upstream defaults OPENSKY_AUTH_MODE to 'oauth', which needs both
       * halves of the credential. Verified that the anonymous path works
       * (/api/opensky returned live states with no .env at all), so only ask
       * for OAuth once the user has actually supplied a full credential.
       */
      OPENSKY_AUTH_MODE: openskyId && openskySecret ? 'oauth' : 'anon',
    })
  },
)
