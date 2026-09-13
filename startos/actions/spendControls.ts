import { sdk } from '../sdk'
import { envFile } from '../fileModels/env'

const { InputSpec, Value } = sdk

const clear = (v: string | null | undefined) => (v ?? '').trim()

export const spendControls = sdk.Action.withInput(
  'spend-controls',

  async ({ effects }) => ({
    name: 'Voice & Spend Controls',
    description:
      'The OpenAI key for voice control, and the throttles upstream applies in front of the metered providers.',
    warning:
      'These are app-level throttles, not billing caps. Anyone who can reach the UI can drive spend through these endpoints, so also set quotas and billing alerts with the providers themselves.',
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  InputSpec.of({
    OPENAI_API_KEY: Value.text({
      name: 'OpenAI API Key',
      description:
        'Enables voice control through the OpenAI Realtime API. Metered — roughly $0.05/min of conversation by upstream’s estimate. Audio from the browser is sent to OpenAI.',
      required: false,
      masked: true,
      default: null,
      placeholder: 'sk-...',
    }),
    GEV_RATELIMIT_OPENAI_PER_MIN: Value.text({
      name: 'OpenAI Requests per Minute (per IP)',
      description: 'Leave empty for upstream’s default (unlimited).',
      required: false,
      masked: false,
      default: null,
      placeholder: '10',
      patterns: [{ regex: '^[0-9]*$', description: 'Must be a whole number' }],
    }),
    GEV_RATELIMIT_GOOGLE_PER_MIN: Value.text({
      name: 'Google Places Requests per Minute (per IP)',
      description: 'Leave empty for upstream’s default (unlimited).',
      required: false,
      masked: false,
      default: null,
      placeholder: '30',
      patterns: [{ regex: '^[0-9]*$', description: 'Must be a whole number' }],
    }),
    TOMTOM_DAILY_TILE_BUDGET: Value.text({
      name: 'TomTom Daily Tile Budget',
      description:
        'Soft cap on upstream traffic-tile requests per day. Upstream’s default is 40000.',
      required: false,
      masked: false,
      default: null,
      placeholder: '40000',
      patterns: [{ regex: '^[0-9]*$', description: 'Must be a whole number' }],
    }),
  }),

  async ({ effects }) => {
    const env = await envFile.read().once()
    return {
      OPENAI_API_KEY: env?.OPENAI_API_KEY,
      GEV_RATELIMIT_OPENAI_PER_MIN: env?.GEV_RATELIMIT_OPENAI_PER_MIN,
      GEV_RATELIMIT_GOOGLE_PER_MIN: env?.GEV_RATELIMIT_GOOGLE_PER_MIN,
      TOMTOM_DAILY_TILE_BUDGET: env?.TOMTOM_DAILY_TILE_BUDGET,
    }
  },

  async ({ effects, input }) => {
    await envFile.merge(effects, {
      OPENAI_API_KEY: clear(input.OPENAI_API_KEY),
      GEV_RATELIMIT_OPENAI_PER_MIN: clear(input.GEV_RATELIMIT_OPENAI_PER_MIN),
      GEV_RATELIMIT_GOOGLE_PER_MIN: clear(input.GEV_RATELIMIT_GOOGLE_PER_MIN),
      TOMTOM_DAILY_TILE_BUDGET: clear(input.TOMTOM_DAILY_TILE_BUDGET),
    })
  },
)
