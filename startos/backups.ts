import { sdk } from './sdk'

/**
 * The volume holds `.env` (the user's API keys), `store.json` (the UI gate
 * password) and `.gev-cache/` (upstream's provider caches). The caches are
 * disposable but small and rebuilt on demand; backing up the whole volume keeps
 * this simple and means a restore comes back with the keys and the same UI
 * password already in place.
 */
export const { createBackup, restoreInit } = sdk.setupBackups(
  async ({ effects }) => sdk.Backups.ofVolumes('main'),
)
