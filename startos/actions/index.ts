import { sdk } from '../sdk'
import { setPassword } from './setPassword'
import { mapKeys } from './mapKeys'
import { dataFeedKeys } from './dataFeedKeys'
import { spendControls } from './spendControls'

export const actions = sdk.Actions.of()
  .addAction(setPassword)
  .addAction(mapKeys)
  .addAction(dataFeedKeys)
  .addAction(spendControls)
