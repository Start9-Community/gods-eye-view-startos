import { sdk } from '../sdk'
import { store } from '../fileModels/store.json'

export const showUiPassword = sdk.Action.withoutInput(
  'show-ui-password',

  async ({ effects }) => ({
    name: 'Show UI Password',
    description:
      'The password for the web interface. God’s Eye View has no login of its own, so StartOS challenges for this at the reverse proxy before any request reaches the service.',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const password = await store.read((s) => s.uiPassword).once()

    return {
      version: '1',
      title: 'Web UI Password',
      message:
        'Enter these when your browser asks. This gate also protects the service’s API endpoints, which spend your own API credit — so treat it as a real credential.',
      result: {
        type: 'single',
        copyable: true,
        masked: true,
        qr: false,
        value: `admin / ${password || ''}`,
      },
    } as const
  },
)
