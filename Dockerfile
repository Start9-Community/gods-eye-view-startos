# Upstream's engines field requires Node 24 (>=24.14.0 <25 || >=26 <27).
FROM node:24.21.0-bookworm-slim AS build

# puppeteer is an upstream devDependency whose postinstall downloads Chrome.
ENV PUPPETEER_SKIP_DOWNLOAD=true

WORKDIR /app
# The patch tool applies our upstream deltas; --fuzz=0 makes a submodule bump
# that moves the context fail the build loudly. See patches/README.md.
RUN apt-get update && \
    apt-get install -y --no-install-recommends patch && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/*
COPY gods-eye-view/ ./
COPY patches/ ./patches/
RUN set -e; for p in ./patches/*.patch; do \
      [ -e "$p" ] || continue; echo "applying $p"; patch -p1 --fuzz=0 <"$p"; \
    done && rm -rf patches
# vite is a devDependency and the runtime rebuilds the client, so no
# NODE_ENV=production.
RUN npm ci --no-audit --no-fund && \
    npm run build && \
    rm -rf node_modules/puppeteer node_modules/puppeteer-core \
      node_modules/chromium-bidi node_modules/prettier

FROM node:24.21.0-bookworm-slim
WORKDIR /app
COPY --from=build /app /app
RUN mkdir -p /app/.gev-cache
