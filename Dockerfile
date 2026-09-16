# Upstream's engines field requires Node 24 (>=24.14.0 <25 || >=26 <27).
FROM node:24.21.0-bookworm-slim AS build

# puppeteer is an upstream devDependency whose postinstall downloads Chrome.
ENV PUPPETEER_SKIP_DOWNLOAD=true

WORKDIR /app
COPY gods-eye-view/ ./
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
