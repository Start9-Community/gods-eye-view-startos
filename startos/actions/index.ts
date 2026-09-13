import { sdk } from '../sdk'
import { mapKeys } from './mapKeys'
import { dataFeedKeys } from './dataFeedKeys'
import { spendControls } from './spendControls'
import { showUiPassword } from './showUiPassword'
import { resetUiPassword } from './resetUiPassword'

export const actions = sdk.Actions.of()
  .addAction(showUiPassword)
  .addAction(resetUiPassword)
  .addAction(mapKeys)
  .addAction(dataFeedKeys)
  .addAction(spendControls)
