# Updating the upstream version

This package builds its image from the `gods-eye-view/` git submodule, pinned to a commit of [bilawalsidhu/gods-eye-view](https://github.com/bilawalsidhu/gods-eye-view). Upstream tags rarely but pushes to `main` most days, so the pin is a commit, not a tag; the package version follows upstream's `package.json` `version`, with the packaging revision after the colon.

## Determining the upstream version

- **God's Eye View** ([bilawalsidhu/gods-eye-view](https://github.com/bilawalsidhu/gods-eye-view)) — pick the commit to pin and read what changed since the current one:

  ```sh
  git -C gods-eye-view fetch origin main
  git -C gods-eye-view log --oneline HEAD..origin/main
  ```

  Upstream's `CHANGELOG.md` and `docs/KNOWN-ISSUES.md` are worth re-reading at each bump. The current pin is the submodule commit (`git submodule status`).

## Applying the bump

- Move the submodule: `git -C gods-eye-view checkout <commit>` and stage `gods-eye-view`.
- Check upstream's `package.json` `engines.node` against the base image in `Dockerfile`.
- Check upstream's `.env.example` against `startos/fileModels/env.ts`. New keys appear regularly; the model names only the keys the actions manage, so a new one is a deliberate decision to expose or ignore.
- Confirm the invariants in `AGENTS.md` § This repo still hold — the `define` injection in `build/vite.js`, `allowedHosts` under `HOST=0.0.0.0`, and every provider in `server/providers/` registering `configurePreviewServer`.
- Bump `version` in `startos/versions/current.ts` (a new upstream `package.json` version resets the revision to `0`; a new commit on the same version bumps it) and write `releaseNotes` for every locale.
