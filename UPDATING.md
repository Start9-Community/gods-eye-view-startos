# Updating God's Eye View

## How the upstream version is tracked

Upstream tags rarely — only `v0.1.0` and `v0.1.1` exist — but pushes to `main` most days. The image therefore pins a **commit SHA**, not a tag, in `Dockerfile`:

```
ARG GEV_SHA=<40-char commit sha>
```

The StartOS version string in `startos/versions/current.ts` follows upstream's `package.json` version (currently the `0.1.1` line), with the package revision after the colon. Two package releases built from different commits on the same upstream version differ only in that revision.

## Bumping

1. Pick the new commit and read what changed between it and the pinned one:
   ```
   git log --oneline <old-sha>..<new-sha>
   ```
   Upstream's `CHANGELOG.md` and `docs/KNOWN-ISSUES.md` are both worth re-reading at each bump.
2. Update `GEV_SHA` in `Dockerfile`.
3. Check upstream's `.env.example` against `startos/fileModels/env.ts`. New keys appear there regularly; the file model names only the keys this package manages, so a new one is a deliberate decision to expose or ignore, not an automatic addition.
4. Check `package.json` `engines`. The runtime image pins a Node version that must satisfy it — upstream currently requires `>=24.14.0 <25 || >=26 <27`, which is why this package does not use the Node 22 base most of the fleet uses.
5. Bump `version` in `startos/versions/current.ts` and write release notes.
6. `make` then `make install`, and re-run the verification in `README.md`.

## Things that break on a bump

- **The build-time key injection.** `build/vite.js` injects `GOOGLE_MAPS_API_KEY` and `CESIUM_ION_TOKEN` through Vite's `define`. If upstream moves to runtime key delivery, the `build-client` oneshot in `startos/main.ts` becomes unnecessary.
- **`allowedHosts`.** The daemon depends on `build/vite.js` setting `allowedHosts: true` when `HOST=0.0.0.0`. If that logic changes, every non-`.local` address stops working and the fix is a patch under `assets/patches/`.
- **The preview-server assumption.** Every provider in `server/providers/*` registers both `configureServer` and `configurePreviewServer`. A new provider that registers only `configureServer` will work in upstream's dev server and 404 here.
