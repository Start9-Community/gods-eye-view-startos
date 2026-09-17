import { setPassword } from '../actions/setPassword'
import { store } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const watchPassword = sdk.setupOnInit(async (effects) => {
  if (!(await store.read((s) => s.uiPassword).const(effects))) {
    await sdk.action.createOwnTask(effects, setPassword, 'critical', {
      reason: i18n(
        "God's Eye View has no login of its own — set a password before starting it",
      ),
    })
  }
})
