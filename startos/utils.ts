// `vite preview` binds it; interfaces.ts exports it and main.ts health-checks it.
export const uiPort = 4173

// Upstream resolves its caches against process.cwd(), so the daemon runs here.
export const appDir = '/app'
export const cacheDir = `${appDir}/.gev-cache`

// The wildcard bind chooses interfaces; which Host headers are answered is
// the allowlist in build/allowedHosts.js — see GEV_ALLOWED_HOSTS in main.ts.
export const serveHost = '0.0.0.0'

export const uiUsername = 'admin'
export const mainHostId = 'main'
export const uiInterfaceId = 'ui'

// The env serializer writes `null` as the literal `KEY=null`, which upstream's
// truthiness guards read as set.
export const envValue = (v: string | null | undefined) => (v ?? '').trim()
