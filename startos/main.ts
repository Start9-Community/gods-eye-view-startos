import { i18n } from './i18n'
import { sdk } from './sdk'
import { appDir, cacheDir, serveHost, uiPort } from './utils'
import { envFile } from './fileModels/env'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n("Starting God's Eye View!"))

  /**
   * Read the env file into the reactive context. Editing an API key through an
   * action rewrites `.env`, which re-runs setupMain — so the client is rebuilt
   * and the server restarted with the new keys, with no extra plumbing.
   */
  await envFile.read().const(effects)

  const sub = sdk.SubContainer.of(
    effects,
    { imageId: 'gods-eye-view' },
    sdk.Mounts.of()
      // Upstream's Vite config loads this with `loadEnv` at config time; the
      // service never writes it, so it is mounted readonly.
      .mountVolume({
        volumeId: 'main',
        subpath: '.env',
        mountpoint: `${appDir}/.env`,
        readonly: true,
        type: 'file',
      })
      // Provider caches (TomTom tiles, FIRMS, terrain heights, ADS-B lookups).
      // Upstream resolves these against process.cwd(), which is why both the
      // oneshot and the daemon run with cwd: appDir.
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
      /**
       * GOOGLE_MAPS_API_KEY and CESIUM_ION_TOKEN are not runtime values:
       * `build/vite.js` injects them into the browser bundle through Vite's
       * `define`, so they only change on a rebuild. Rebuilding here is what
       * makes configuring them through an action work.
       *
       * Unconditional rather than guarded by a hash of the keys: the build is
       * ~2s (measured on the upstream tree at v0.1.1), so state to skip it
       * would cost more than it saves. The image already ships a keyless build,
       * so a failure here leaves a servable dist behind.
       */
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
          env: {
            // Drives `allowedHosts: true` in build/vite.js. Without it Vite
            // rejects any Host header that is not localhost/127.0.0.1/*.local,
            // which would break the LAN-IP and .onion addresses StartOS serves.
            HOST: serveHost,
            PORT: String(uiPort),
          },
        },
        ready: {
          display: i18n('Web Interface'),
          // Cesium is large and the preview server reads it off disk on first
          // request; give it room before the first check counts against it.
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
