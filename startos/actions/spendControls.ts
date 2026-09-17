import { envFile } from '../fileModels/env'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { envValue } from '../utils'

const { InputSpec, Value } = sdk

const wholeNumber = [
  { regex: '^[0-9]*$', description: i18n('Must be a whole number') },
]

export const spendControls = sdk.Action.withInput(
  'spend-controls',

  async () => ({
    name: i18n('Voice & Spend Controls'),
    description: i18n(
      'The OpenAI key for voice control, and the per-visitor throttles the app applies in front of the metered providers.',
    ),
    warning: i18n(
      'Saving restarts the service. These throttles are not billing caps: anyone who can sign in can drive spend through these endpoints, so also set quotas and billing alerts with the providers themselves.',
    ),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  InputSpec.of({
    OPENAI_API_KEY: Value.text({
      name: i18n('OpenAI API Key'),
      description: i18n(
        'Enables voice control through the OpenAI Realtime API. Metered — a few cents per minute of conversation. Audio from the browser is sent to OpenAI.',
      ),
      required: false,
      masked: true,
      default: null,
      placeholder: 'sk-...',
    }),
    GEV_RATELIMIT_OPENAI_PER_MIN: Value.text({
      name: i18n('OpenAI Requests per Minute (per IP)'),
      description: i18n("Leave empty for upstream's default (unlimited)."),
      required: false,
      masked: false,
      default: null,
      placeholder: '10',
      patterns: wholeNumber,
    }),
    GEV_RATELIMIT_GOOGLE_PER_MIN: Value.text({
      name: i18n('Google Places Requests per Minute (per IP)'),
      description: i18n("Leave empty for upstream's default (unlimited)."),
      required: false,
      masked: false,
      default: null,
      placeholder: '30',
      patterns: wholeNumber,
    }),
    TOMTOM_DAILY_TILE_BUDGET: Value.text({
      name: i18n('TomTom Daily Tile Budget'),
      description: i18n(
        "Soft cap on traffic-tile requests per day. Leave empty for upstream's default of 40000.",
      ),
      required: false,
      masked: false,
      default: null,
      placeholder: '40000',
      patterns: wholeNumber,
    }),
  }),

  async () => {
    const env = await envFile.read().once()
    return {
      OPENAI_API_KEY: env?.OPENAI_API_KEY,
      GEV_RATELIMIT_OPENAI_PER_MIN: env?.GEV_RATELIMIT_OPENAI_PER_MIN,
      GEV_RATELIMIT_GOOGLE_PER_MIN: env?.GEV_RATELIMIT_GOOGLE_PER_MIN,
      TOMTOM_DAILY_TILE_BUDGET: env?.TOMTOM_DAILY_TILE_BUDGET,
    }
  },

  async ({ effects, input }) =>
    envFile.merge(effects, {
      OPENAI_API_KEY: envValue(input.OPENAI_API_KEY),
      GEV_RATELIMIT_OPENAI_PER_MIN: envValue(
        input.GEV_RATELIMIT_OPENAI_PER_MIN,
      ),
      GEV_RATELIMIT_GOOGLE_PER_MIN: envValue(
        input.GEV_RATELIMIT_GOOGLE_PER_MIN,
      ),
      TOMTOM_DAILY_TILE_BUDGET: envValue(input.TOMTOM_DAILY_TILE_BUDGET),
    }),
)
