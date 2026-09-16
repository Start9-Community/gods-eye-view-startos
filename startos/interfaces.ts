import { store } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { mainHostId, uiInterfaceId, uiPort, uiUsername } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  // Upstream has no login, and the same origin serves the /api/* proxies that
  // spend the user's metered API credit, so the OS proxy gates the port.
  const password = await store.read((s) => s.uiPassword).const(effects)

  const uiMulti = sdk.MultiHost.of(effects, mainHostId)
  const uiOrigin = await uiMulti.bindPort(uiPort, {
    protocol: 'http',
    addSsl: password
      ? {
          auth: {
            type: 'basic',
            credentials: [{ username: uiUsername, password }],
            realm: null,
          },
        }
      : undefined,
  })

  const ui = sdk.createInterface(effects, {
    name: i18n('Web UI'),
    id: uiInterfaceId,
    description: i18n(
      'The God\'s Eye View globe. Your browser asks for the username "admin" and the password from the Set Web UI Password action.',
    ),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  return [await uiOrigin.export([ui])]
})
