import { envFile } from './fileModels/env'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { appDir, cacheDir, serveHost, uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n("Starting God's Eye View!"))

  await envFile.read().const(effects)

  const sub = sdk.SubContainer.of(
    effects,
    { imageId: 'gods-eye-view' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        subpath: '.env',
        mountpoint: `${appDir}/.env`,
        readonly: true,
        type: 'file',
      })
      .mountVolume({
        volumeId: 'main',
        subpath: 'cache',
        mountpoint: cacheDir,
        readonly: false,
      }),
    'gods-eye-view',
  )

  return (
    sdk.Daemons.of(effects)
      // GOOGLE_MAPS_API_KEY and CESIUM_ION_TOKEN are compiled into the browser
      // bundle, so a key change only lands on a rebuild.
      .addOneshot('build-client', {
        subcontainer: sub,
        exec: {
          command: [`${appDir}/node_modules/.bin/vite`, 'build'],
          cwd: appDir,
        },
        requires: [],
      })
      .addDaemon('ui', {
        subcontainer: sub,
        exec: {
          command: [
            `${appDir}/node_modules/.bin/vite`,
            'preview',
            '--host',
            serveHost,
            '--port',
            String(uiPort),
          ],
          cwd: appDir,
          env: { HOST: serveHost, PORT: String(uiPort) },
        },
        ready: {
          display: i18n('Web Interface'),
          gracePeriod: 30_000,
          fn: () =>
            sdk.healthCheck.checkPortListening(effects, uiPort, {
              successMessage: i18n('The web interface is ready'),
              errorMessage: i18n('The web interface is not ready'),
            }),
        },
        requires: ['build-client'],
      })
  )
})
