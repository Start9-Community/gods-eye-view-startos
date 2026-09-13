# TODO — God's Eye View on StartOS

Scaffolded, written, and building. `make x86` produces a signed s9pk and `tsc`
passes. **Nothing below the line has been run against a StartOS box yet** — the
package compiles and packs, which is not the same as working.

## Blocking before first release

- [ ] `startos/manifest/index.ts`: `packageRepo` is still `REPLACE_ME`. Set it
      once the packaging repo exists.
- [ ] Install on the dev box (`make install`) and confirm the service starts.
- [ ] **Verify the `build-client` oneshot can write `/app/dist`.** It rebuilds
      into the image rootfs, which is assumed writable in the subcontainer
      overlay but has not been confirmed. If it turns out readonly, point both
      `vite build --outDir` and `vite preview --outDir` at a path on the volume.
      The image ships a keyless build, so the symptom would be "keys saved but
      the globe never picks them up", not a hard failure.
- [ ] Confirm the OS auth gate challenges before the globe **and** before
      `/api/*`. The gate is the only thing standing in front of endpoints that
      spend the user's API credit.
- [ ] Confirm the UI loads over `.local`, over a LAN IP, and over Tor. The
      `allowedHosts` behaviour was verified locally against `vite preview` but
      not through the StartOS reverse proxy.
- [ ] Confirm three keyless layers return live data on the box (earthquakes,
      flights, satellites) — proves outbound and DNS work from inside LXC.
- [ ] Set a free key end to end (NASA FIRMS is quickest) and confirm the
      restart-rebuild cycle makes the layer appear.
- [ ] Set `CESIUM_ION_TOKEN` and confirm it reaches `dist/assets/index-*.js`
      inside the container — this is the build-time injection path.
- [ ] `reset-ui-password`, then confirm the proxy takes the new credential
      without a restart.
- [ ] Backup, restore onto a clean install, confirm keys and UI password survive.
- [ ] `make arm` — only x86_64 has been built. The Node base image supports
      aarch64 but the build has not been run there.

## Deferred / decisions for a human

- [ ] **Registry target.** Fine for a personal box as-is. Before the Start9
      community registry, someone at Start9 needs to rule on the bundled
      non-MIT datasets (TeleGeography submarine cables is CC BY-NC-SA
      non-commercial; datacenter/dam data is ODbL; `public/models/` is outside
      the MIT grant). Stripping them in the Dockerfile is the mechanical fix and
      costs two layers.
- [ ] Consider patching out upstream's "POWER UP" key panel, which 404s under
      `vite preview` and logs a failed request on every page load. Cosmetic
      only; a patch under `assets/patches/` would be the place.
- [ ] Translations in `startos/i18n/` and `startos/manifest/i18n.ts` were
      written without a native speaker reviewing them.
- [ ] `icon.svg` is upstream's own `public/logo.svg` with the viewBox padded
      from 775x520 to square. Artwork unmodified.
