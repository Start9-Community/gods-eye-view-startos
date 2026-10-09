# Upstream patches

Applied by the `Dockerfile` with `patch -p1 --fuzz=0` after the submodule is
copied into the build. `--fuzz=0` makes a submodule bump that moves the patch
context fail the build loudly instead of applying somewhere subtly wrong.

## 0001 — trust the OS proxy's forwarded headers under `GEV_TRUSTED_PROXY`

**Problem (introduced upstream in v0.2.1).** The same-site gate in
`src/localRequestGate.mjs` refuses any request that carries a reverse-proxy
forwarding header (`x-forwarded-for`, `x-forwarded-proto`, …), and computes the
request's own origin from the socket's encryption + the `Host` header. On
StartOS both refuse the legitimate path: the OS proxy forwards `http`-bound
ports with its own `X-Forwarded-Proto: https` / `X-Forwarded-For` added, and
TLS terminates at the OS, so every same-origin browser POST to
`/api/realtime/token`, `/api/openai/hud-summary`, `/api/google/nearby-places`,
`/api/google/text-search` and `/api/realtime/debug-log` — the features that
spend the user's API credit — would 403.

**Fix.** With `GEV_TRUSTED_PROXY=1` (set by `startos/main.ts` on the ui
daemon), the gate ignores exactly the two headers the OS proxy injects and
derives the request scheme from `X-Forwarded-Proto` before the Origin check.
Unset, upstream behavior is byte-for-byte unchanged. Not a blanket bypass:
cross-site `Sec-Fetch-Site`, foreign or opaque `Origin`s, and every other
proxy signal (`via`, `forwarded`, `x-real-ip`, `cf-*`, …) are still refused.
DNS-rebinding names never reach the container either, because StartOS's
listener refuses hostnames the user has not enabled at TLS time — the
guarantee upstream's host check exists to provide is enforced one layer up.

**Retires when** upstream takes an equivalent (or a trusted-proxy mode). Filed
as <https://github.com/bilawalsidhu/gods-eye-view/issues/978> — until then
this is carried here, per the repo's rule that fixes upstream hasn't taken
live in `patches/`, not in a fork.
