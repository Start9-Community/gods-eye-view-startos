# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Freshly scaffolded? Work the
[New Package Checklist](../start-technologies/projects/start-sdk/docs/src/new-package-checklist.md)
(or <https://docs.start9.com/packaging/new-package-checklist.html>) from top to bottom. It is a
guide page, not a file in this repo — read it, don't copy it in.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes.

**Fix a defect you spot rather than reporting it** — you have the package open and the
context to be sure. File **a GitHub issue on this repo** only when the call isn't yours to
make: you can't pin the cause down, two defensible fixes exist, or it's too large to ride on
the work in hand. An open issue is a report, not a queue — implement one when you're asked
to or when it's labelled `Approved`, then close it with `Closes #<n>`.

Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **The application is the `gods-eye-view/` submodule and is never edited here.** Fixes go to <https://github.com/bilawalsidhu/gods-eye-view>; this repo moves the pin. A fix upstream hasn't taken goes in a `patches/` directory applied by the `Dockerfile`, never by copying source in.
- **`GOOGLE_MAPS_API_KEY` and `CESIUM_ION_TOKEN` are build-time values.** Upstream's `build/vite.js` injects them into the browser bundle through Vite's `define`, which is why `main.ts` runs `vite build` as a oneshot before the daemon. Don't replace the rebuild with a plain restart.
- **The daemon depends on `HOST=0.0.0.0`.** `build/vite.js` sets `allowedHosts: true` only for that value; anything else makes Vite reject every non-`localhost` `Host` header, which is every address StartOS serves.
- **A provider must register `configurePreviewServer`, not just `configureServer`.** The package serves with `vite preview`; a provider registered for the dev server alone works upstream and 404s here. Check `server/providers/` at every bump.
- **`scripts/` is a runtime dependency, not tooling.** `server/` imports `scripts/pinokio-environment.mjs` and `scripts/google-server-key.mjs`, so `.dockerignore` must not prune it.
- **The OS reverse-proxy gate is the only authentication.** Upstream ships none, and the same origin serves `/api/openai/*`, `/api/google/*` and `/api/tomtom`, which spend the user's own API credit. Don't make the gate optional.
