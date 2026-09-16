import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  // Cleartext: the OS reverse proxy needs it to configure HTTP Basic auth.
  uiPassword: z.string().catch(''),
})

export const store = FileHelper.json(
  { base: sdk.volumes.main, subpath: './store.json' },
  shape,
)
