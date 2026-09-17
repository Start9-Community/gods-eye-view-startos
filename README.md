<p align="center">
  <img src="icon.svg" alt="God's Eye View Logo" width="21%">
</p>

# God's Eye View on StartOS

> Everything not listed in this document should behave the same as upstream
> God's Eye View. If a feature, setting, or behavior is not mentioned here,
> the upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[God's Eye View](https://github.com/bilawalsidhu/gods-eye-view) renders live public data — aircraft transponders, ship beacons, satellite orbits, earthquakes, wildfires, traffic and public webcams — on a photorealistic 3D globe in the browser. This package builds it from source, serves it behind a StartOS-managed login, and manages its API keys through actions.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

Upstream publishes no container image, so the package builds one with its own `Dockerfile` from the `gods-eye-view/` git submodule: `npm ci`, a keyless `vite build`, and the upstream test tooling stripped from `node_modules`.

| What          | Value                                                                 |
| ------------- | --------------------------------------------------------------------- |
| Image source  | Custom `Dockerfile` over the pinned upstream submodule                |
| Architectures | x86_64, aarch64                                                       |
| Entrypoint    | None — the daemon runs `vite preview` from `/app/node_modules/.bin`    |

One subcontainer, `gods-eye-view`, shared by the `build-client` oneshot and the `ui` daemon; attach with `start-cli package attach gods-eye-view -n gods-eye-view -- <cmd>`.

Upstream's server is not a standalone HTTP server: every API proxy in `server/providers/*` is a Vite plugin registering both `configureServer` and `configurePreviewServer`, so `vite preview` serves the built client and the proxies from one process. Its working directory is `/app` because upstream resolves its caches against `process.cwd()`.

## Volume and Data Layout

One volume, `main`, holding everything the service persists.

| Path on volume | Mounted at                  | Purpose                                                                  |
| -------------- | --------------------------- | ------------------------------------------------------------------------ |
| `.env`         | `/app/.env` (read-only)     | API keys and throttles, written only by actions                          |
| `store.json`   | not mounted                 | The reverse-proxy gate password, read by the package on the host side    |
| `cache/`       | `/app/.gev-cache`           | Upstream's provider caches — TomTom tiles, FIRMS, terrain, TLEs, launches |

## File Models

Two, both on the `main` volume and both created empty at init.

| Model     | File         | Contents                                                         |
| --------- | ------------ | ---------------------------------------------------------------- |
| `envFile` | `.env`       | The keys and throttles the three key actions manage              |
| `store`   | `store.json` | `uiPassword`, set by the Set Web UI Password action              |

`envFile` names only the keys the actions manage, and the actions are its only writers; a value set by hand on the volume for one of upstream's other tunables (the `CCTV_*` source-pack options, `AISSTREAM_BOUNDING_BOXES`, the `OPENAI_REALTIME_*` model overrides) survives every write. A cleared field is written as an empty string rather than removed, which upstream reads as unset.

Upstream loads `.env` when Vite evaluates its config, so every key is a launch-time value; the service restarts whenever the file changes. Two of them — `GOOGLE_MAPS_API_KEY` and `CESIUM_ION_TOKEN` — are compiled into the browser bundle rather than read at runtime, which is why the restart rebuilds the client (see [Installation and First-Run Flow](#installation-and-first-run-flow)).

## Dependencies

None.

## Network Access and Interfaces

One HTTP interface, gated at the OS reverse proxy, and heavy outbound traffic to third parties.

| Interface | Id   | Type | Internal port | Serves                                          |
| --------- | ---- | ---- | ------------- | ----------------------------------------------- |
| Web UI    | `ui` | ui   | 4173          | The globe, and the `/api/*` provider proxies    |

The binding sets `addSsl.auth` to HTTP Basic (username `admin`), so the OS proxy challenges every request before it reaches the container. Upstream ships no login of its own, and the same origin serves `/api/openai/*`, `/api/google/*` and `/api/tomtom`, which spend the user's own metered API credit — the gate covers those along with the page. The daemon runs with `HOST=0.0.0.0`, which is what makes upstream's Vite config accept the `Host` headers of the addresses StartOS serves.

**Outbound**: the server is a client for roughly a dozen third-party APIs — OpenSky, adsb.lol, CelesTrak, USGS, Launch Library, Overpass, Radio Browser, GBFS, municipal camera feeds, and with keys NASA FIRMS, AISStream, TomTom, Google and OpenAI. Those requests leave from the server's own connection, and the browser fetches map tiles and fonts from Esri, Google and Cesium directly.

## Installation and First-Run Flow

Install seeds an empty `.env` and `store.json`, then holds the service on a critical task until a web-UI password exists. Once it is set, the service is usable with no further configuration: flights, satellites, earthquakes, cameras, radio, bikeshare and launches all run on keyless sources, and the globe renders Esri satellite imagery over a keyless terrain source.

On every start the `build-client` oneshot runs `vite build` (about five seconds) before the `ui` daemon, because the two browser-side keys are injected into the bundle at build time. The image ships a keyless build, so a failed rebuild still leaves something servable behind. `main.ts` reads `.env` reactively, so saving any key action restarts the service through this path.

## Actions

Four, all user-facing.

| Action           | When to run it                                              | Cost / repeat safety                                                                              | State changed |
| ---------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------- |
| `set-password`   | First setup (raised as a task), a lost password, or rotation | Instant, no restart; each run invalidates the previous password; safe to repeat                 | `store.json`  |
| `map-keys`       | Photorealistic 3D or Google place search wanted             | Restarts the service and rebuilds the client (~10 s); safe to repeat                             | `.env`        |
| `data-feed-keys` | A keyed layer (fires, vessels, traffic) is missing, or OpenSky rate limits bite | Restarts the service; safe to repeat                                              | `.env`        |
| `spend-controls` | Voice control wanted, or metered spend needs throttling     | Restarts the service; safe to repeat                                                              | `.env`        |

`set-password` returns the username and password once; `setInterfaces` reads `uiPassword` with `.const()`, so the proxy picks up the new credential on write. A user who still gets in with the old password is seeing their browser's cached Basic credentials, not a failed reset. `data-feed-keys` also derives `OPENSKY_AUTH_MODE`: `oauth` when both the OpenSky client id and secret are present, `anon` otherwise — upstream defaults it to `oauth`, which fails without a full credential.

## Tasks

One.

| Task           | Severity   | Raised when                                                                        | Cleared by                                     |
| -------------- | ---------- | ---------------------------------------------------------------------------------- | ---------------------------------------------- |
| `set-password` | `critical` | `store.json` holds no `uiPassword` — on install, or after restoring a backup taken before one was set | Running the action; it does not return once a password is stored |

While it is raised the service cannot be started and its ordinary controls are hidden.

## Health Checks

One, the `ready` check on the `ui` daemon.

| Check | Displayed as  | Probes                                         | A failure means                                                                                                                    |
| ----- | ------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `ui`  | Web Interface | Port 4173 listening, with a 30-second grace period | Past the grace period, a service still starting is almost always a failed `build-client` oneshot; its Vite output is in the service logs |

## Backups and Restore

`sdk.Backups.ofVolumes('main')` — the whole volume, copied wholesale. That includes the provider caches, which are disposable but small and bounded; keeping them means a restored install comes back with its API keys, its web-UI password and its caches and needs nothing re-entered.

## Limitations and Differences

1. **Upstream's in-app key panel ("POWER UP") is absent.** Upstream registers its `/api/setup/*` endpoints only under `vite dev` and only for loopback clients; under `vite preview` the page's status probe 404s and the panel removes itself. Keys come from this package's actions instead.
2. **The browser-side Google key is readable by anyone who can sign in.** Upstream compiles it into the page by design. Restrict it by HTTP referrer at Google and set a billing cap; StartOS serves the same page on several addresses, so scope the referrer rule accordingly.
3. **This is a dev-grade server.** Upstream describes itself as "a fast, hackable foundation, not a hardened production service", and `vite preview` is Vite's preview server. The OS gate is what stands in front of it.
4. **Not a private service.** Every tile request tells the imagery provider where the user is looking, provider requests leave from the server's own connection, and voice control streams microphone audio to OpenAI.
5. **Bundled data carries non-MIT terms.** Upstream's code is MIT, but its bundled datasets are not: the TeleGeography submarine-cable map is CC BY-NC-SA 3.0, the datacenter and dam sets are ODbL 1.0, and `public/models/` is excluded from the MIT grant. See upstream's `LICENSE` and `DATA_SOURCES.md`.
6. **Upstream moves fast and tags rarely.** The submodule pins a commit, not a release; see `UPDATING.md`.

---

## Quick Reference for AI Consumers

```yaml
package_id: gods-eye-view
image: built from the gods-eye-view submodule via Dockerfile
architectures: [x86_64, aarch64]
subcontainers: [gods-eye-view]
volumes:
  main: /app/.env, /app/.gev-cache
file_models:
  - .env
  - store.json
startos_managed_env_vars:
  - HOST
  - PORT
  - GOOGLE_MAPS_API_KEY
  - CESIUM_ION_TOKEN
  - GOOGLE_MAPS_SERVER_API_KEY
  - OPENAI_API_KEY
  - FIRMS_MAP_KEY
  - AISSTREAM_API_KEY
  - TOMTOM_API_KEY
  - LL2_API_TOKEN
  - OPENSKY_AUTH_MODE
  - OPENSKY_CLIENT_ID
  - OPENSKY_CLIENT_SECRET
  - GEV_RATELIMIT_GOOGLE_PER_MIN
  - GEV_RATELIMIT_OPENAI_PER_MIN
  - TOMTOM_DAILY_TILE_BUDGET
dependencies: none
interfaces:
  ui: { type: ui, port: 4173 }
actions:
  - set-password
  - map-keys
  - data-feed-keys
  - spend-controls
tasks:
  - { action: set-password, severity: critical }
health_checks:
  - ui
```
