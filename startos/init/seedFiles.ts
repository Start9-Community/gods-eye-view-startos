import { utils } from '@start9labs/start-sdk'
import { envFile } from '../fileModels/env'
import { store } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const seedFiles = sdk.setupOnInit(async (effects) => {
  await envFile.merge(effects, {})
  await store.merge(effects, {})

  /**
   * Seed the reverse-proxy password whenever it is missing, not only on a fresh
   * install. An empty value here would configure the OS gate with an empty
   * password, which is worse than no gate at all — it looks protected while
   * accepting "admin" with nothing. A restore brings its own password in
   * store.json, so this only fires when there genuinely isn't one.
   */
  const current = await store.read((s) => s.uiPassword).once()
  if (!current) {
    await store.merge(effects, {
      uiPassword: utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 22 }),
    })
  }
})
