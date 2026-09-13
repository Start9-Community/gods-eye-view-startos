import { sdk } from './sdk'
import { uiPort } from './utils'
import { store } from './fileModels/store.json'
import { i18n } from './i18n'

export const mainHostId = 'main'
export const uiInterfaceId = 'ui'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  /**
   * God's Eye View ships no login of its own, and StartOS does not authenticate
   * a bound port — binding exposes it. Leaving it open would expose more than
   * the globe: the same origin serves `/api/openai/*`, `/api/google/*` and
   * `/api/tomtom`, which spend the user's own metered API credit. So the OS
   * reverse proxy gates the binding instead, per the "fall back to the OS gate"
   * branch of recipe-web-ui.md (reference: searxng-startos).
   *
   * Read reactively: when reset-ui-password rewrites the stored value,
   * setupInterfaces re-runs and the proxy picks up the new credential.
   */
  const password = await store.read((s) => s.uiPassword).const(effects)

  const multiHost = sdk.MultiHost.of(effects, mainHostId)

  const uiMultiOrigin = await multiHost.bindPort(uiPort, {
    protocol: 'http',
    addSsl: {
      auth: {
        type: 'basic',
        credentials: [{ username: 'admin', password: password || '' }],
        realm: null,
      },
    },
  })

  const ui = sdk.createInterface(effects, {
    name: i18n('Web UI'),
    id: uiInterfaceId,
    description: i18n(
      'The God\'s Eye View globe. Sign in with username "admin" and the password from the Show UI Password action.',
    ),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  return [await uiMultiOrigin.export([ui])]
})
