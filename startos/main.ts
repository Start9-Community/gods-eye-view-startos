import { envFile } from './fileModels/env'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  appDir,
  cacheDir,
  mainHostId,
  serveHost,
  uiInterfaceId,
  uiPort,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n("Starting God's Eye View!"))

  await envFile.read().const(effects)

  // Upstream's host check (build/allowedHosts.js) admits any IP address and
  // only the exact names listed in GEV_ALLOWED_HOSTS; wildcards are refused
  // by design. The OS's gated listener forwards the browser's Host untouched
  // after refusing names the user has not enabled, so the interface's own
  // hostnames are exactly the set that can arrive.
  const allowedHosts = await sdk.host
    .getOwn(effects, mainHostId, (host) => {
      const iface = host?.bindings[uiPort]?.interfaces[uiInterfaceId]
      if (!iface) return ''
      return [
        ...new Set(iface.addressInfo.hostnames.map((h) => h.hostname)),
      ].join(',')
    })
    .const()

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
          env: {
            HOST: serveHost,
            PORT: String(uiPort),
            ...(allowedHosts ? { GEV_ALLOWED_HOSTS: allowedHosts } : {}),
            // This port is reachable only through the OS's gated TLS proxy,
            // which strips client-supplied X-Forwarded-* headers and adds its
            // own. patches/ makes the cost-bearing endpoints' same-site gate
            // trust those headers; without it every browser POST to /api/*
            // that spends API credit is refused as "proxied".
            GEV_TRUSTED_PROXY: '1',
          },
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
