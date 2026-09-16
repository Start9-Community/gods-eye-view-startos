// `vite preview` binds it; interfaces.ts exports it and main.ts health-checks it.
export const uiPort = 4173

// Upstream resolves its caches against process.cwd(), so the daemon runs here.
export const appDir = '/app'
export const cacheDir = `${appDir}/.gev-cache`

// `build/vite.js` opens Vite's `allowedHosts` only for HOST 0.0.0.0 or ::.
export const serveHost = '0.0.0.0'

export const uiUsername = 'admin'
export const mainHostId = 'main'
export const uiInterfaceId = 'ui'

// `merge` writes an undefined field as `KEY=undefined`, which upstream's
// truthiness guards read as set.
export const envValue = (v: string | null | undefined) => (v ?? '').trim()
