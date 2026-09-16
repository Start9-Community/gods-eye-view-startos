import { envFile } from '../fileModels/env'
import { store } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const seedFiles = sdk.setupOnInit(async (effects) => {
  await envFile.merge(effects, {})
  await store.merge(effects, {})
})
