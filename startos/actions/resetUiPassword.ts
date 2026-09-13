import { utils } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { store } from '../fileModels/store.json'

export const resetUiPassword = sdk.Action.withoutInput(
  'reset-ui-password',

  async ({ effects }) => ({
    name: 'Reset UI Password',
    description:
      'Generate a new password for the web interface and show it once.',
    warning:
      'The old password stops working immediately. Browsers cache HTTP Basic credentials, so close and reopen the browser (or use a private window) if it keeps signing you in with the old one.',
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const uiPassword = utils.getDefaultString({
      charset: 'a-z,A-Z,0-9',
      len: 22,
    })

    /**
     * setInterfaces reads uiPassword with .const(), so this write re-runs it
     * and the OS proxy picks up the new credential — no restart needed.
     */
    await store.merge(effects, { uiPassword })

    return {
      version: '1',
      title: 'New Web UI Password',
      message:
        'Save this now — it is shown here but not stored in cleartext anywhere you can read it back except this action.',
      result: {
        type: 'single',
        copyable: true,
        masked: true,
        qr: false,
        value: `admin / ${uiPassword}`,
      },
    } as const
  },
)
