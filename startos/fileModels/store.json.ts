import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  /**
   * Password for the StartOS reverse-proxy auth gate (see interfaces.ts).
   *
   * Stored in cleartext because the OS proxy needs the cleartext to configure
   * HTTP Basic auth — the same trade-off searxng-startos makes. This is an
   * access gate in front of an app that has no login of its own, not an
   * app-native credential, so nothing here should be reused as one.
   */
  uiPassword: z.string().catch(''),
})

export const store = FileHelper.json(
  {
    base: sdk.volumes.main,
    subpath: '/store.json',
  },
  shape,
)
