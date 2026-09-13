/**
 * Constants shared across this package's startos/ code.
 */

// Upstream's default port. `vite preview` binds it; interfaces.ts exports it and
// main.ts health-checks it.
export const uiPort = 4173

// Where the Dockerfile installs the upstream checkout. The app resolves its
// caches relative to process.cwd(), so the daemon runs with this as cwd.
export const appDir = '/app'

// Upstream writes its provider caches (TomTom tiles, FIRMS, terrain heights,
// ADS-B lookups) to `$CWD/.gev-cache`. Mounted from the volume so they survive
// a restart.
export const cacheDir = `${appDir}/.gev-cache`

// Bound into the daemon's environment. `build/vite.js` opens `allowedHosts` only
// when HOST is '0.0.0.0' or '::' — without it Vite rejects every request whose
// Host header is not localhost/127.0.0.1/*.local, which would break the LAN-IP
// and .onion addresses StartOS serves this package on.
export const serveHost = '0.0.0.0'
