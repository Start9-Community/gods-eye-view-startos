import { utils } from '@start9labs/start-sdk'
import { store } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { uiUsername } from '../utils'

export const setPassword = sdk.Action.withoutInput(
  'set-password',

  async ({ effects }) => {
    const alreadySet = !!(await store.read((s) => s.uiPassword).const(effects))
    return {
      name: alreadySet
        ? i18n('Reset Web UI Password')
        : i18n('Set Web UI Password'),
      description: i18n(
        'Generate the password your browser asks for when you open God\'s Eye View. The username is always "admin". Running this again replaces the existing password.',
      ),
      warning: alreadySet
        ? i18n(
            'The current password stops working as soon as this runs. Browsers cache these logins, so open a private window if the old one still seems to work.',
          )
        : null,
      allowedStatuses: 'any',
      group: null,
      visibility: 'enabled',
    }
  },

  async ({ effects }) => {
    const password = utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 32 })
    await store.merge(effects, { uiPassword: password })

    return {
      version: '1',
      title: i18n('Web UI Password Set'),
      message: i18n(
        'Your browser asks for these the next time you open the Web UI. Save the password now — it is not shown again. It also protects the endpoints that spend your API credit, so treat it as a real credential.',
      ),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Username'),
            description: null,
            value: uiUsername,
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: i18n('Password'),
            description: null,
            value: password,
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
